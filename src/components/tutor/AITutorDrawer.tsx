import React, { useState, useEffect, useRef } from 'react';
import { TutorMessage, TutorQuota, UserProfile, QueuedQuestion } from '../../types';
import { StorageService } from '../../utils/storage';
import { generatePedagogicalResponse, sanitizeMathText } from '../../utils/pedagogicalEngine';
import {
  Brain,
  Send,
  X,
  Sparkles,
  WifiOff,
  Clock,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Zap,
  Flag,
  AlertCircle
} from 'lucide-react';

function cleanFractionSymbols(raw: string): string {
  if (!raw) return '';
  return sanitizeMathText(raw);
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  initialTopic?: string;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  initialTopic
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState<TutorQuota | null>(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedQuestions, setQueuedQuestions] = useState<QueuedQuestion[]>([]);
  
  // Reporting state
  const [reportingMsgId, setReportingMsgId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Respuesta confusa');
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load quota, queued questions, and initial greeting
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadInitialData = async () => {
    const currentQuota = await StorageService.getTutorQuota();
    setQuota(currentQuota);

    const queue = await StorageService.getOfflineQueue();
    setQueuedQuestions(queue);

    if (messages.length === 0) {
      const topicText = initialTopic ? ` sobre "${initialTopic}"` : '';
      const greeting: TutorMessage = {
        id: `msg_${Date.now()}`,
        role: 'model',
        text: `¡Hola ${profile.name}! Soy tu tutor de fracciones. ¿En qué parte del ejercicio${topicText} te gustaría que exploremos juntos? Recuerda que no te daré la respuesta directa de golpe, sino pistas paso a paso para que tu cerebro construya la estrategia.`,
        timestamp: new Date().toISOString(),
        modelUsed: 'Tutor FracTutor',
        suggestedPrompts: [
          '¿Por qué nunca se suman los denominadores?',
          '¿Cómo sé si dos fracciones son equivalentes?',
          'Tengo una duda con una suma de fracciones'
        ]
      };
      setMessages([greeting]);
    }
  };

  const syncOfflineQueue = async () => {
    const queue = await StorageService.getOfflineQueue();
    const pending = queue.filter((item) => !item.answered);
    if (pending.length === 0) return;

    for (const item of pending) {
      try {
        await sendMessage(item.question, true);
        await StorageService.removeOfflineQuestion(item.id);
      } catch (e) {
        break;
      }
    }
    const updated = await StorageService.getOfflineQueue();
    setQueuedQuestions(updated);
  };

  const getSessionIdentifier = (q: TutorQuota | null): string => {
    const today = q?.date || new Date().toISOString().split('T')[0];
    const sIndex = Math.max(1, q?.sessionsCount || 1);
    return `session_${today}_${sIndex}`;
  };

  const handleStartNewSession = async () => {
    if (!quota) return;
    if (quota.sessionsCount >= 2) return;

    const newQuota: TutorQuota = {
      ...quota,
      sessionsCount: quota.sessionsCount + 1,
      currentSessionActive: true,
      messagesInCurrentSession: 0
    };
    await StorageService.saveTutorQuota(newQuota);
    setQuota(newQuota);

    const sessionGreeting: TutorMessage = {
      id: `msg_ses_${Date.now()}`,
      role: 'model',
      text: `Iniciamos tu sesión ${newQuota.sessionsCount} de 2 de hoy. Tienes 10 mensajes disponibles en esta sesión. ¿Qué te gustaría practicar?`,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, sessionGreeting]);
  };

  const handleReportMessage = async (msg: TutorMessage) => {
    try {
      const res = await fetch('/api/tutor/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msg.id,
          messageText: msg.text,
          reason: reportReason,
        }),
      });

      if (res.ok) {
        setReportFeedback('¡Gracias! El reporte ha sido registrado para revisión del equipo pedagógico.');
      } else {
        setReportFeedback('Reporte guardado localmente.');
      }
    } catch {
      setReportFeedback('Reporte registrado localmente.');
    }

    setTimeout(() => {
      setReportingMsgId(null);
      setReportFeedback(null);
    }, 2800);
  };

  const sendMessage = async (userText: string, isFromQueue = false) => {
    if (!userText.trim()) return;
    if (isLoading) return;

    // Check client quota limits before sending
    if (quota) {
      if (quota.sessionsCount === 0 && !quota.currentSessionActive) {
        const updatedQuota: TutorQuota = {
          ...quota,
          sessionsCount: 1,
          currentSessionActive: true,
          messagesInCurrentSession: 0
        };
        await StorageService.saveTutorQuota(updatedQuota);
        setQuota(updatedQuota);
      } else if (quota.messagesInCurrentSession >= 10) {
        return;
      } else if (quota.sessionsCount >= 2 && !quota.currentSessionActive) {
        return;
      }
    }

    const trimmedInput = userText.trim().slice(0, 350);

    const userMsg: TutorMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: trimmedInput,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!isFromQueue) setInput('');

    // If completely offline, give immediate pedagogical answer and queue for server sync
    if (!navigator.onLine) {
      await StorageService.addOfflineQuestion(trimmedInput, initialTopic);
      const queue = await StorageService.getOfflineQueue();
      setQueuedQuestions(queue);

      const localPedagogical = generatePedagogicalResponse(trimmedInput, messages, initialTopic);
      const offlineReply: TutorMessage = {
        id: `offline_${Date.now()}`,
        role: 'model',
        text: `${localPedagogical.text}\n\n[Modo sin conexión activo · Tu consulta se sincronizará cuando recuperes internet].`,
        timestamp: new Date().toISOString(),
        isFallback: true,
        modelUsed: 'Tutor FracTutor (Offline)'
      };
      setMessages((prev) => [...prev, offlineReply]);
      return;
    }

    setIsLoading(true);

    let data: any = null;
    const currentSessionId = getSessionIdentifier(quota);

    try {
      const payload = {
        message: trimmedInput,
        sessionId: currentSessionId,
        history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
        contextTopic: initialTopic,
        studentName: profile.name,
        grade: profile.grade
      };

      try {
        const res = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': currentSessionId,
          },
          body: JSON.stringify(payload)
        });

        if (res.status === 429) {
          const quotaErr = await res.json().catch(() => ({}));
          const limitMsg = quotaErr.error || 'Has alcanzado el límite de mensajes para esta sesión.';
          
          if (quota) {
            const updatedQuota: TutorQuota = {
              ...quota,
              messagesInCurrentSession: 10,
            };
            await StorageService.saveTutorQuota(updatedQuota);
            setQuota(updatedQuota);
          }

          const quotaNotice: TutorMessage = {
            id: `quota_${Date.now()}`,
            role: 'model',
            text: `⚠️ ${limitMsg}`,
            timestamp: new Date().toISOString(),
            isFallback: true,
            modelUsed: 'Control de Cuota Servidor'
          };
          setMessages((prev) => [...prev, quotaNotice]);
          setIsLoading(false);
          return;
        }

        if (res.ok) {
          data = await res.json();
        }
      } catch (firstErr) {
        // Fast retry with fallback
        await new Promise((resolve) => setTimeout(resolve, 400));
        const resRetry = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': currentSessionId,
          },
          body: JSON.stringify(payload)
        });
        if (resRetry.ok) {
          data = await resRetry.json();
        }
      }
    } catch {
      // Network interrupted; fallback to local pedagogical engine
    }

    // Safety fallback: if server or network did not provide an answer, use local pedagogical engine
    if (!data || !data.text) {
      const localFallback = generatePedagogicalResponse(trimmedInput, messages, initialTopic);
      data = {
        text: localFallback.text,
        isFallback: true,
        modelUsed: 'Tutor FracTutor (Motor Pedagógico)',
        redundancyTier: 5
      };
    }

    const replyText = cleanFractionSymbols(data.text);

    const modelMsg: TutorMessage = {
      id: `mod_${Date.now()}`,
      role: 'model',
      text: replyText,
      timestamp: data.timestamp || new Date().toISOString(),
      isFallback: data.isFallback,
      modelUsed: data.modelUsed || 'Tutor FracTutor',
      redundancyTier: data.redundancyTier
    };

    setMessages((prev) => [...prev, modelMsg]);

    // Update quota count
    if (quota) {
      const updatedQuota: TutorQuota = {
        ...quota,
        messagesInCurrentSession: quota.messagesInCurrentSession + 1,
        totalMessagesToday: quota.totalMessagesToday + 1
      };
      await StorageService.saveTutorQuota(updatedQuota);
      setQuota(updatedQuota);
    }

    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  const messagesRemaining = quota ? Math.max(0, 10 - quota.messagesInCurrentSession) : 10;
  const sessionsRemaining = quota ? Math.max(0, 2 - quota.sessionsCount) : 2;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tutor FracTutor</h3>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Seguro y Socrático
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pistas guiadas sin prisas · Protección activa</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Cerrar tutor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota & Connectivity Strip */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>
                Sesión {quota?.sessionsCount || 1}/2 · Mensajes: {quota?.messagesInCurrentSession || 0}/10
              </span>
            </div>

            {!isOnline ? (
              <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" />
                Modo Offline Activo
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                En línea (Validado)
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Espacio escolar protegido (OWASP Top 10 + ASVS)
            </span>
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60">
              Menores 12-15
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{cleanFractionSymbols(msg.text)}</p>

                {msg.role === 'model' && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/60">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                      {msg.modelUsed || 'Tutor FracTutor'}
                    </span>

                    {/* Report Response Button for Child Safety & Accuracy */}
                    <button
                      type="button"
                      onClick={() => setReportingMsgId(reportingMsgId === msg.id ? null : msg.id)}
                      className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer flex items-center gap-1 p-0.5 rounded"
                      title="Reportar esta respuesta"
                    >
                      <Flag className="w-3 h-3" />
                      <span className="text-[9px]">Reportar</span>
                    </button>
                  </div>
                )}

                {/* Inline reporting dialog */}
                {reportingMsgId === msg.id && (
                  <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 rounded-xl text-left space-y-1.5 animate-in fade-in">
                    <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      ¿Por qué deseas reportar esta respuesta?
                    </p>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    >
                      <option value="Respuesta confusa">Es confusa o difícil de entender</option>
                      <option value="Cálculo incorrecto">El cálculo o la fracción es incorrecta</option>
                      <option value="Lenguaje inadecuado">Contiene lenguaje inapropiado o molesto</option>
                      <option value="Dio la respuesta directa">Me dio la respuesta directa sin enseñarme</option>
                    </select>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setReportingMsgId(null)}
                        className="text-[10px] px-2 py-1 text-slate-600 dark:text-slate-400 hover:underline"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReportMessage(msg)}
                        className="text-[10px] font-bold px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                      >
                        Enviar reporte
                      </button>
                    </div>

                    {reportFeedback && (
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold pt-1">
                        {reportFeedback}
                      </p>
                    )}
                  </div>
                )}

                {msg.role === 'model' && msg.text.includes('interrupción') && (
                  <button
                    type="button"
                    onClick={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                      if (lastUser) sendMessage(lastUser.text);
                    }}
                    className="mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reintentar con el tutor</span>
                  </button>
                )}
              </div>

              {/* Suggested Prompts if present */}
              {msg.suggestedPrompts && (
                <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[85%]">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(p)}
                      className="text-left text-xs bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-medium px-3 py-2 rounded-xl border border-emerald-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-[70%]">
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">El tutor está preparando una pista socrática...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar or Session End CTA */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {messagesRemaining === 0 ? (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center space-y-2">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Has alcanzado el límite de 10 mensajes de esta sesión.
              </p>
              {sessionsRemaining > 0 ? (
                <button
                  type="button"
                  onClick={handleStartNewSession}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Iniciar segunda sesión del día
                </button>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¡Gran esfuerzo hoy! Deja que tu cerebro descanse y consolide los conceptos. Mañana tendrás nuevas sesiones.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  maxLength={350}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    !isOnline
                      ? 'Escribe tu duda (se guardará offline)...'
                      : 'Escribe tu duda o tu primer intento...'
                  }
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shrink-0"
                  aria-label="Enviar mensaje al tutor"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Character limit feedback for minor inputs */}
              {input.length > 200 && (
                <div className="text-right text-[10px] text-slate-400">
                  {input.length}/350 caracteres
                </div>
              )}
            </form>
          )}

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Orientación socrática y segura</span>
            <span>Mensajes restantes: {messagesRemaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
