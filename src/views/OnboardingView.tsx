import React, { useState } from 'react';
import { UserProfile, Grade, ConfidenceLevel, StudentGoal } from '../types';
import { BookOpen, Sparkles, Target, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('7mo');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('regular');
  const [goal, setGoal] = useState<StudentGoal>('examen');

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const profile: UserProfile = {
        name: name.trim(),
        grade,
        confidence,
        goal,
        createdAt: new Date().toISOString(),
        diagnosticCompleted: false
      };
      onComplete(profile);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Espacio seguro para aprender matemáticas</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bienvenido a <span className="text-emerald-600 dark:text-emerald-400">FracTutor</span>
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Aprende fracciones a tu ritmo: sin prisas, sin vidas que se pierden y sin comparaciones.
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === num
                ? 'w-8 bg-emerald-600'
                : step > num
                ? 'w-2 bg-emerald-400 dark:bg-emerald-500'
                : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Step Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Paso 1 de 3
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-1">
                ¿Cuál es tu apodo y qué grado cursas?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Por tu seguridad y privacidad, utiliza solo un apodo o nombre corto (sin apellidos ni datos personales).
              </p>
            </div>

            <div>
              <label htmlFor="student-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tu apodo o alias favorito:
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Alex, Sofi, MatePro (solo apodo)..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tu grado escolar:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '7mo', label: '7.º Grado', sub: '~12 años' },
                  { id: '8vo', label: '8.º Grado', sub: '~13-14 años' },
                  { id: '9no', label: '9.º Grado', sub: '~14-15 años' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGrade(item.id as Grade)}
                    className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      grade === item.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-bold">{item.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Paso 2 de 3
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-1">
                ¿Cómo te sientes hoy con las fracciones?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No hay respuestas malas; aquí el error es bienvenido porque es como aprendemos.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'cuesta',
                  title: 'Me cuesta bastante',
                  desc: 'A veces me bloqueo o no entiendo qué significan los números.'
                },
                {
                  id: 'regular',
                  title: 'Más o menos / Regular',
                  desc: 'Entiendo algunas cosas básicas, pero me confunden las operaciones.'
                },
                {
                  id: 'bien',
                  title: 'Me siento bien',
                  desc: 'Comprendo el concepto, pero quiero practicar más para ganar seguridad.'
                },
                {
                  id: 'avanzar',
                  title: 'Quiero avanzar más rápido',
                  desc: 'Busco dominar el tema a fondo y resolver problemas complejos.'
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setConfidence(item.id as ConfidenceLevel)}
                  className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3.5 ${
                    confidence === item.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      confidence === item.id
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {confidence === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Paso 3 de 3
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-1">
                ¿Cuál es tu objetivo prioritario?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Alinearemos el plan para ayudarte a cumplir esta meta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'recuperar',
                  title: 'Recuperar el tema',
                  desc: 'Ponerte al día con tranquilidad.'
                },
                {
                  id: 'tareas',
                  title: 'Hacer mis tareas',
                  desc: 'Resolver dudas sin frustración.'
                },
                {
                  id: 'examen',
                  title: 'Preparar un examen',
                  desc: 'Llegar con calma y confianza.'
                },
                {
                  id: 'avanzar',
                  title: 'Entender de verdad',
                  desc: 'Ver las matemáticas con sentido visual.'
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as StudentGoal)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    goal === item.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            disabled={step === 1 && !name.trim()}
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs md:text-sm hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <span>{step === 3 ? 'Comenzar diagnóstico (8 preguntas)' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
