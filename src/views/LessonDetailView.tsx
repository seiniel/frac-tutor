import React, { useState } from 'react';
import lessonsData from '../data/lessons.json';
import { Lesson, SkillId } from '../types';
import { FractionBar } from '../components/visuals/FractionBar';
import { FractionCircle } from '../components/visuals/FractionCircle';
import { NumberLine } from '../components/visuals/NumberLine';
import { FadedExample } from '../components/visuals/FadedExample';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Lightbulb,
  Brain,
  CheckCircle2
} from 'lucide-react';

interface LessonDetailViewProps {
  skillId: SkillId;
  onBack: () => void;
  onStartPractice: (skillId: SkillId) => void;
  onOpenTutor: (initialTopic?: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  skillId,
  onBack,
  onStartPractice,
  onOpenTutor
}) => {
  const lesson = (lessonsData as Lesson[]).find((l) => l.id === skillId);

  // State for interactive sandbox within lesson
  const [num, setNum] = useState(
    lesson?.sections[0]?.interactiveConfig?.initialNumerator ?? 2
  );
  const [den, setDen] = useState(
    lesson?.sections[0]?.interactiveConfig?.initialDenominator ?? 4
  );

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Lección no encontrada.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl">
          Volver al mapa
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al mapa</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Lección {lesson.order} de 10 · ~{lesson.estimatedMinutes} min
        </span>
      </div>

      {/* Lesson Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Micro-Lección Conceptual
        </span>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          {lesson.title}
        </h1>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{lesson.subtitle}</p>

        <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs md:text-sm text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Idea clave: </strong>
            <span>{lesson.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Sections and Visual Simulations */}
      {lesson.sections.map((sec, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{sec.title}</h2>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {sec.content}
          </p>

          {/* Interactive SVG sandbox */}
          {sec.interactiveConfig && (
            <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">
                {sec.interactiveConfig.label || 'Explorador interactivo'}
              </span>

              {sec.interactiveConfig.type === 'bar' && (
                <FractionBar
                  numerator={num}
                  denominator={den}
                  interactive={true}
                  onNumeratorChange={(newNum) => setNum(newNum)}
                  comparisonNumerator={sec.interactiveConfig.targetNumerator}
                  comparisonDenominator={sec.interactiveConfig.targetDenominator}
                  size="lg"
                />
              )}

              {sec.interactiveConfig.type === 'circle' && (
                <FractionCircle
                  numerator={num}
                  denominator={den}
                  interactive={true}
                  onNumeratorChange={(newNum) => setNum(newNum)}
                  comparisonNumerator={sec.interactiveConfig.targetNumerator}
                  comparisonDenominator={sec.interactiveConfig.targetDenominator}
                  size={180}
                />
              )}

              {sec.interactiveConfig.type === 'number-line' && (
                <NumberLine
                  numerator={num}
                  denominator={den}
                  interactive={true}
                  onNumeratorChange={(newNum) => setNum(newNum)}
                />
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">
                Toca las partes para cambiar la fracción activa y observa el efecto en tiempo real.
              </p>
            </div>
          )}

          {sec.strategyTip && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{sec.strategyTip}</span>
            </div>
          )}
        </div>
      ))}

      {/* Faded Scaffolding Worked Example */}
      {lesson.fadedExample && (
        <FadedExample example={lesson.fadedExample} />
      )}

      {/* Bottom Action Strip */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">¿Listo para consolidar lo aprendido?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Practica con recuperación sin límite de tiempo y reintentos infinitos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onOpenTutor(lesson.title)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            <span>Duda al Tutor</span>
          </button>
          <button
            type="button"
            onClick={() => onStartPractice(lesson.id)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Iniciar práctica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
