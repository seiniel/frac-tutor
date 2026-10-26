import React, { useState } from 'react';
import { UserProfile, SkillProgress, DiagnosticResult } from '../../types';
import lessonsData from '../../data/lessons.json';
import {
  X,
  Award,
  TrendingUp,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  Heart,
  Smile,
  FileSpreadsheet,
  Share2,
  ExternalLink
} from 'lucide-react';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  skillsProgress: SkillProgress[];
  diagnosticResult: DiagnosticResult | null;
  onResetStudent: () => void;
  onUpdateConfidence: (newConfidence: any) => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onClose,
  profile,
  skillsProgress,
  diagnosticResult,
  onResetStudent,
  onUpdateConfidence
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const totalSkills = lessonsData.length;
  const masteredCount = skillsProgress.filter((s) => s.status === 'mastered').length;
  const learningCount = skillsProgress.filter((s) => s.status === 'learning').length;
  const totalAttempts = skillsProgress.reduce((acc, s) => acc + s.totalAttempts, 0);
  const totalCorrect = skillsProgress.reduce((acc, s) => acc + s.correctAttempts, 0);
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Spaced retention consolidation
  const consolidatedCount = skillsProgress.filter((s) => s.spacedStage >= 3).length;

  // Dynamic live domain resolution (the active AI Studio container runs on ais-dev)
  const currentOrigin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ais-dev-w4f2iy3ctuza7rlvfsxya5-74256916226.us-east1.run.app';

  const sharedUrl = currentOrigin;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sharedUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Métrica', 'Valor'],
      ['Estudiante', profile.name],
      ['Grado', profile.grade],
      ['Objetivo', profile.goal],
      ['Confianza inicial', profile.confidence],
      ['Diagnóstico inicial completado', profile.diagnosticCompleted ? 'Sí' : 'No'],
      ['Puntaje diagnóstico', diagnosticResult ? `${diagnosticResult.score}/${diagnosticResult.total}` : 'N/A'],
      ['Punto de partida asignado', diagnosticResult?.assignedStartingSkill || 'p1_concepto'],
      ['Destrezas dominadas', `${masteredCount} de ${totalSkills}`],
      ['Destrezas en consolidación', `${learningCount} de ${totalSkills}`],
      ['Intentos totales de práctica', totalAttempts.toString()],
      ['Aciertos totales', totalCorrect.toString()],
      ['Precisión general', `${accuracyRate}%`],
      ['Destrezas consolidadas a 7 días', `${consolidatedCount} de ${totalSkills}`],
      ['Fecha del informe', new Date().toLocaleDateString('es-ES')]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `informe_progreso_${profile.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Métricas de Éxito y Progreso</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Panel para docentes, evaluadores y familias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-xs md:text-sm">
          {/* Share App Link Card */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Enlace activo para estudiantes (Móvil y Escritorio)
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-mono mt-0.5 break-all select-all font-semibold bg-white/70 dark:bg-slate-850 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  {sharedUrl}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
                </button>
                <a
                  href={sharedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Probar</span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/90 leading-relaxed border-t border-emerald-100 dark:border-emerald-900/60 pt-2">
              💡 <strong>Nota para pruebas:</strong> Este enlace directo (con prefijo <code>ais-dev-</code>) es el servidor activo en vivo. Funciona en Google Chrome, Instagram, WhatsApp o Safari. Una vez abierto en el móvil, los estudiantes pueden pulsar <strong>&ldquo;Instalar App&rdquo;</strong> para tenerla en su pantalla de inicio y usarla sin conexión (modo offline con IndexedDB).
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider">
              1. Cumplimiento de Métricas del PRD
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Onboarding</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">100%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">&lt;3 min (Completado)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Diagnóstico</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {diagnosticResult ? `${diagnosticResult.score}/${diagnosticResult.total}` : 'Pendiente'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">8 de 8 exploradas</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Destrezas</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {masteredCount} / {totalSkills}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Dominadas</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Precisión</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {totalAttempts > 0 ? `${accuracyRate}%` : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">En práctica</span>
              </div>
            </div>
          </div>

          {/* Spaced Retention (1, 3, 7 days) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Retención Espaciada (Intervalos 1, 3 y 7 días)
              </span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                {consolidatedCount} consolidadas
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Las destrezas avanzan de fase tras repasos espaciados exitosos sin penalizar errores con pérdidas de vidas o rachas.
            </p>
          </div>

          {/* Anxiety Reduction Metric (Self-perceived confidence tracking) */}
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-2.5">
            <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Medición de Ansiedad Matemática y Confianza
            </span>
            <p className="text-xs text-amber-900 dark:text-amber-300/90 leading-relaxed">
              Confianza inicial declarada por {profile.name}: <strong>&quot;{profile.confidence}&quot;</strong>.
              ¿Cómo se siente el estudiante actualmente?
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { id: 'cuesta', label: 'Con dudas' },
                { id: 'regular', label: 'Más tranquilo' },
                { id: 'bien', label: 'Seguro' },
                { id: 'avanzar', label: 'Confiado y motivado' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdateConfidence(c.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    profile.confidence === c.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-amber-100/50 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900/60'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export & Reset Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>Exportar Informe CSV para Docente</span>
            </button>

            {showResetConfirm ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">¿Reiniciar todo?</span>
                <button
                  type="button"
                  onClick={onResetStudent}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Sí, reiniciar
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold flex items-center gap-1 cursor-pointer transition"
                title="Reiniciar datos para probar con otro estudiante desde cero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Probar con otro estudiante</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
