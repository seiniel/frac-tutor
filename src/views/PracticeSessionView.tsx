import React, { useState } from 'react';
import exercisesData from '../data/exercises.json';
import lessonsData from '../data/lessons.json';
import { Exercise, SkillId, SkillProgress } from '../types';
import { FractionBar } from '../components/visuals/FractionBar';
import { FractionCircle } from '../components/visuals/FractionCircle';
import { NumberLine } from '../components/visuals/NumberLine';
import { processPracticeAttempt, getMindsetFeedbackMessage } from '../utils/spacedRepetition';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Brain,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeSessionViewProps {
  skillId: SkillId;
  onBack: () => void;
  onUpdateProgress: (updated: SkillProgress) => void;
  currentSkillProgress: SkillProgress;
  onOpenTutor: (contextTopic?: string) => void;
}

export const PracticeSessionView: React.FC<PracticeSessionViewProps> = ({
  skillId,
  onBack,
  onUpdateProgress,
  currentSkillProgress,
  onOpenTutor
}) => {
  const allExercises = exercisesData as Exercise[];
  const lesson = (lessonsData as any[]).find((l) => l.id === skillId);

  // Filter exercises for this skill + optionally interleave 1 question
  const skillExercises = allExercises.filter((ex) => ex.skillId === skillId);
  // Interleaved question from other skills if available
  const otherExercises = allExercises.filter((ex) => ex.skillId !== skillId && !ex.isDiagnostic);
  const interleavedEx = otherExercises.length > 0 ? otherExercises[0] : null;

  // Build the session questions: 2-3 target skill + 1 interleaved
  const sessionQuestions = [...skillExercises];
  if (interleavedEx && sessionQuestions.length >= 2) {
    sessionQuestions.splice(1, 0, interleavedEx);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = light, 2 = strategy, 3 = almost solved
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState(0);
  const [sessionResults, setSessionResults] = useState<{ isCorrect: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<
    Record<number, { optionId: string; isVerified: boolean; isCorrect: boolean }>
  >({});

  const currentQuestion = sessionQuestions[currentIndex] || sessionQuestions[0];
  const isInterleaved = currentQuestion?.skillId !== skillId;

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    if (showFeedback) {
      setShowFeedback(false);
    }
  };

  const handleVerify = () => {
    if (!selectedOptionId || !currentQuestion) return;
    const opt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = opt ? opt.isCorrect : false;

    setAttemptsOnCurrent((prev) => prev + 1);
    setShowFeedback(true);
    setSavedAnswers((prev) => ({
      ...prev,
      [currentIndex]: { optionId: selectedOptionId, isVerified: true, isCorrect }
    }));

    if (isCorrect) {
      setSessionResults((prev) => {
        const next = [...prev];
        next[currentIndex] = { isCorrect: true };
        return next;
      });
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const saved = savedAnswers[prevIdx];
      setSelectedOptionId(saved ? saved.optionId : null);
      setShowFeedback(saved ? saved.isVerified : false);
      setHintLevel(0);
    } else {
      onBack();
    }
  };

  const handleNext = () => {
    // Record answer if verified
    const opt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = opt ? opt.isCorrect : false;

    setSavedAnswers((prev) => ({
      ...prev,
      [currentIndex]: { optionId: selectedOptionId || '', isVerified: showFeedback, isCorrect }
    }));

    setSessionResults((prev) => {
      const next = [...prev];
      next[currentIndex] = { isCorrect };
      return next;
    });

    if (currentIndex < sessionQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const saved = savedAnswers[nextIdx];
      setSelectedOptionId(saved ? saved.optionId : null);
      setShowFeedback(saved ? saved.isVerified : false);
      setHintLevel(0);
      setAttemptsOnCurrent(0);
    } else {
      // Completed session!
      const correctCount = sessionResults.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0);
      const isOverallSuccess = correctCount >= Math.ceil(sessionQuestions.length / 2);

      const updated = processPracticeAttempt(currentSkillProgress, isOverallSuccess);
      onUpdateProgress(updated);
      setIsCompleted(true);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  if (isCompleted) {
    const correctCount = sessionResults.filter((r) => r.isCorrect).length;
    const mindsetMsg = getMindsetFeedbackMessage(
      correctCount,
      sessionQuestions.length,
      lesson?.title || 'Fracciones'
    );

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Sesión de práctica finalizada
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {correctCount} de {sessionQuestions.length} aciertos logrados
          </h2>

          <div className="my-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-left">
            <p className="text-xs md:text-sm text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
              {mindsetMsg}
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Hemos actualizado tu intervalo de repetición espaciada en tu mapa personal.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-sm active:scale-95 transition cursor-pointer shadow-sm"
            >
              Volver a mi mapa de destrezas
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCompleted(false);
                setCurrentIndex(sessionQuestions.length - 1);
                const lastIdx = sessionQuestions.length - 1;
                setSelectedOptionId(savedAnswers[lastIdx]?.optionId || null);
                setShowFeedback(savedAnswers[lastIdx]?.isVerified || false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a revisar los ejercicios de esta sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = currentQuestion.options.find((opt) => opt.id === selectedOptionId);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-4">
      {/* Top Bar with clear Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-2xs active:scale-95 transition"
          title={currentIndex === 0 ? 'Salir y volver al mapa' : 'Volver al ejercicio anterior'}
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{currentIndex === 0 ? 'Salir al mapa' : 'Ejercicio anterior'}</span>
        </button>

        <div className="flex items-center gap-2">
          {isInterleaved && (
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              Intercalada
            </span>
          )}
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            Pregunta {currentIndex + 1} de {sessionQuestions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQuestion.prompt}
        </h3>

        {/* Visual Component */}
        {currentQuestion.visualConfig && (
          <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            {currentQuestion.visualConfig.type === 'circle' && (
              <FractionCircle
                numerator={currentQuestion.visualConfig.numerator}
                denominator={currentQuestion.visualConfig.denominator}
                size={160}
              />
            )}
            {currentQuestion.visualConfig.type === 'bar' && (
              <FractionBar
                numerator={currentQuestion.visualConfig.numerator}
                denominator={currentQuestion.visualConfig.denominator}
                comparisonNumerator={currentQuestion.visualConfig.comparisonNumerator}
                comparisonDenominator={currentQuestion.visualConfig.comparisonDenominator}
              />
            )}
            {currentQuestion.visualConfig.type === 'number-line' && (
              <NumberLine
                numerator={currentQuestion.visualConfig.numerator}
                denominator={currentQuestion.visualConfig.denominator}
              />
            )}
          </div>
        )}

        {/* Gradual Pistas (Level 1, 2, 3) */}
        <div className="my-3 space-y-2">
          {hintLevel > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-in fade-in">
              {currentQuestion.hints.slice(0, hintLevel).map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pista {i + 1}: </strong>
                    {h}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!showFeedback && (
            <div className="flex items-center justify-between text-xs">
              {hintLevel < currentQuestion.hints.length ? (
                <button
                  type="button"
                  onClick={() => setHintLevel((lvl) => lvl + 1)}
                  className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>
                    {hintLevel === 0
                      ? '¿Necesitas una pista suave?'
                      : 'Ver siguiente pista más clara'}
                  </span>
                </button>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">Todas las pistas mostradas</span>
              )}

              <button
                type="button"
                onClick={() => onOpenTutor(currentQuestion.prompt)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Preguntar al Tutor</span>
              </button>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mt-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100';

            if (isSelected) {
              optionStyles = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30';
            }

            if (showFeedback) {
              if (option.isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-bold';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200';
              } else {
                optionStyles = 'border-slate-200 dark:border-slate-800 opacity-50 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-3.5 md:p-4 rounded-2xl border text-left text-xs md:text-sm transition flex items-center justify-between cursor-pointer ${optionStyles}`}
              >
                <span>{option.text}</span>
                {showFeedback && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                )}
                {showFeedback && isSelected && !option.isCorrect && (
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {showFeedback && selectedOption && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs md:text-sm animate-in fade-in duration-200 border ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            <p className="font-semibold">{selectedOption.feedback}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300 text-xs">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{currentIndex === 0 ? 'Salir' : 'Anterior'}</span>
          </button>

          <div className="flex items-center gap-2">
            {showFeedback && !selectedOption?.isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            )}

            {!showFeedback ? (
              <button
                type="button"
                disabled={!selectedOptionId}
                onClick={handleVerify}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs md:text-sm hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Comprobar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs md:text-sm active:scale-95 transition cursor-pointer shadow-xs"
              >
                <span>{currentIndex === sessionQuestions.length - 1 ? 'Finalizar sesión' : 'Siguiente'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
