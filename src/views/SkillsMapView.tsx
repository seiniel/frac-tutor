import React from 'react';
import lessonsData from '../data/lessons.json';
import { Lesson, SkillProgress, SkillId, UserProfile } from '../types';
import { isDueForReview } from '../utils/spacedRepetition';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCw,
  Play,
  Calendar,
  ExternalLink,
  Brain
} from 'lucide-react';

interface SkillsMapViewProps {
  profile: UserProfile;
  skillsProgress: SkillProgress[];
  onSelectLesson: (skillId: SkillId) => void;
  onSelectPractice: (skillId: SkillId) => void;
  onOpenTutor: (initialTopic?: string) => void;
  onRetakeDiagnostic?: () => void;
}

export const SkillsMapView: React.FC<SkillsMapViewProps> = ({
  profile,
  skillsProgress,
  onSelectLesson,
  onSelectPractice,
  onOpenTutor,
  onRetakeDiagnostic
}) => {
  const lessons: Lesson[] = lessonsData as Lesson[];

  // Find skills due for spaced retrieval review
  const dueSkills = skillsProgress.filter((s) => isDueForReview(s.nextReviewDate));

  const getSkillProgress = (id: SkillId): SkillProgress => {
    return (
      skillsProgress.find((s) => s.skillId === id) || {
        skillId: id,
        status: 'todo',
        correctAttempts: 0,
        totalAttempts: 0,
        lastPracticed: null,
        nextReviewDate: null,
        spacedStage: 0,
        retrievalSuccessStreak: 0
      }
    );
  };

  const categorizedSkills = {
    todo: lessons.filter((l) => getSkillProgress(l.id).status === 'todo'),
    learning: lessons.filter((l) => getSkillProgress(l.id).status === 'learning'),
    mastered: lessons.filter((l) => getSkillProgress(l.id).status === 'mastered')
  };

  const totalMastered = categorizedSkills.mastered.length;
  const totalLearning = categorizedSkills.learning.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome & Mindset Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Aprendizaje a tu ritmo · {profile.grade}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            ¡Hola, {profile.name}! Tu mapa personal de fracciones
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-emerald-100 leading-relaxed">
            Aquí no hay vidas perdidas ni cronómetros. El progreso se consolida mediante práctica
            espaciada (a 1, 3 y 7 días) y representaciones visuales.
          </p>

          <div className="mt-5 flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{totalMastered} dominadas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{totalLearning} en consolidación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Retrieval Reminder Card (High priority if due) */}
      {dueSkills.length > 0 && (
        <div className="p-4 md:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <RotateCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Repaso espaciado sugerido para hoy ({dueSkills.length} destreza{dueSkills.length > 1 ? 's' : ''})
              </h2>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                La evidencia demuestra que recordar hoy consolida tu memoria por semanas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectPractice(dueSkills[0].skillId)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Iniciar repaso ({dueSkills[0].skillId.replace('p', '').replace('_', ' ')})</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Action: Ask AI Tutor */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tutor de IA Socrático</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">¿Tienes dudas o bloqueos? Tu tutor te guía paso a paso con pistas.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenTutor()}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shrink-0"
        >
          Consultar
        </button>
      </div>

      {/* Quick Action: Retake or Review Diagnostic */}
      {onRetakeDiagnostic && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <RotateCw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Diagnóstico Inicial de 8 Preguntas</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">¿Quieres volver a explorar o cambiar tus respuestas del diagnóstico?</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetakeDiagnostic}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition cursor-pointer shrink-0"
          >
            Volver al diagnóstico
          </button>
        </div>
      )}

      {/* Skills Grouping: Dominado, En práctica, Por aprender */}
      <div className="space-y-6">
        {/* En práctica */}
        {categorizedSkills.learning.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                En Práctica y Consolidación ({categorizedSkills.learning.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorizedSkills.learning.map((lesson) => {
                const prog = getSkillProgress(lesson.id);
                return renderSkillCard(lesson, prog);
              })}
            </div>
          </div>
        )}

        {/* Por aprender */}
        {categorizedSkills.todo.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Por Aprender ({categorizedSkills.todo.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorizedSkills.todo.map((lesson) => {
                const prog = getSkillProgress(lesson.id);
                return renderSkillCard(lesson, prog);
              })}
            </div>
          </div>
        )}

        {/* Dominadas */}
        {categorizedSkills.mastered.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Dominadas ({categorizedSkills.mastered.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorizedSkills.mastered.map((lesson) => {
                const prog = getSkillProgress(lesson.id);
                return renderSkillCard(lesson, prog);
              })}
            </div>
          </div>
        )}
      </div>

      {/* Evidence & Credits Footer (with official WWC link) */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>
          Basado en ciencias del aprendizaje (práctica de recuperación, repetición espaciada y ejemplos desvanecidos).
        </p>
        <p>
          Investigación respaldada por{' '}
          <a
            href="https://ies.ed.gov/ncee/wwc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            <span>What Works Clearinghouse (IES)</span>
            <ExternalLink className="w-3 h-3" />
          </a>{' '}
          y el EEF Teaching & Learning Toolkit.
        </p>
      </div>
    </div>
  );

  function renderSkillCard(lesson: Lesson, progress: SkillProgress) {
    const isDue = isDueForReview(progress.nextReviewDate);

    return (
      <div
        key={lesson.id}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs flex flex-col justify-between gap-3"
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Lección {lesson.order}
            </span>
            {progress.status === 'mastered' ? (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Dominado
              </span>
            ) : progress.status === 'learning' ? (
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                En práctica
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Por iniciar</span>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{lesson.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        {/* Progress or Next Review Info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            {progress.totalAttempts > 0 ? (
              <span>{progress.correctAttempts} aciertos de {progress.totalAttempts}</span>
            ) : (
              <span>~{lesson.estimatedMinutes} min lectura</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectLesson(lesson.id)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
              title="Leer lección con interactivos"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lección</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPractice(lesson.id)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                isDue
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
              title="Practicar con recuperación"
            >
              <Play className="w-3 h-3" />
              <span>Practicar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};
