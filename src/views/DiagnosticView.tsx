import React, { useState } from 'react';
import exercisesData from '../data/exercises.json';
import { Exercise, DiagnosticResult, SkillId } from '../types';
import { FractionBar } from '../components/visuals/FractionBar';
import { FractionCircle } from '../components/visuals/FractionCircle';
import { NumberLine } from '../components/visuals/NumberLine';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Compass,
  Award,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticViewProps {
  onComplete: (result: DiagnosticResult) => void;
  studentName: string;
  onBackToOnboarding?: () => void;
}

interface SavedAnswer {
  optionId: string;
  isCorrect: boolean;
  skillId: SkillId;
  isVerified: boolean;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  onComplete,
  studentName,
  onBackToOnboarding
}) => {
  const diagnosticQuestions: Exercise[] = (exercisesData as Exercise[]).filter(
    (ex) => ex.isDiagnostic === true
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, SavedAnswer>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<DiagnosticResult | null>(null);

  const currentQuestion = diagnosticQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    // If user changes option after verification, reset feedback so they can verify new choice
    if (showFeedback) {
      setShowFeedback(false);
    }
  };

  const handleVerify = () => {
    if (!selectedOptionId || !currentQuestion) return;
    const chosenOption = currentQuestion.options.find((opt) => opt.id === selectedOptionId);
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        optionId: selectedOptionId,
        isCorrect,
        skillId: currentQuestion.skillId,
        isVerified: true
      }
    }));
    setShowFeedback(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevQuestion = diagnosticQuestions[prevIndex];
      const prevSaved = answers[prevQuestion.id];

      setCurrentIndex(prevIndex);
      setSelectedOptionId(prevSaved ? prevSaved.optionId : null);
      setShowFeedback(prevSaved ? prevSaved.isVerified : false);
      setShowHint(false);
    } else if (currentIndex === 0 && onBackToOnboarding) {
      onBackToOnboarding();
    }
  };

  const handleNext = () => {
    if (currentIndex < diagnosticQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = diagnosticQuestions[nextIndex];
      const nextSaved = answers[nextQuestion.id];

      setCurrentIndex(nextIndex);
      setSelectedOptionId(nextSaved ? nextSaved.optionId : null);
      setShowFeedback(nextSaved ? nextSaved.isVerified : false);
      setShowHint(false);
    } else {
      // Calculate results
      const total = diagnosticQuestions.length;
      let score = 0;
      const breakdown: Record<string, boolean> = {};

      diagnosticQuestions.forEach((q) => {
        const ans = answers[q.id];
        const correct = ans ? ans.isCorrect : false;
        if (correct) score += 1;
        breakdown[q.skillId] = correct;
      });

      // Find the first skill where student made an error or needs reinforcement
      let startingSkill: SkillId = 'p1_concepto';
      if (!breakdown['p1_concepto'] || !breakdown['p2_terminos']) {
        startingSkill = 'p1_concepto';
      } else if (!breakdown['p3_equivalencia']) {
        startingSkill = 'p3_equivalencia';
      } else if (!breakdown['p4_simplificacion']) {
        startingSkill = 'p4_simplificacion';
      } else if (!breakdown['p5_comparacion']) {
        startingSkill = 'p5_comparacion';
      } else if (!breakdown['p6_recta']) {
        startingSkill = 'p6_recta';
      } else if (!breakdown['p7_suma_igual_den']) {
        startingSkill = 'p7_suma_igual_den';
      } else if (!breakdown['p8_resta_igual_den']) {
        startingSkill = 'p8_resta_igual_den';
      } else {
        startingSkill = 'p9_contexto';
      }

      let summaryMessage = `¡Excelente trabajo de diagnóstico, ${studentName}!`;
      if (score >= 7) {
        summaryMessage = `¡Extraordinario dominio inicial, ${studentName}! Tienes bases muy firmes. Te sugerimos profundizar en problemas combinados y afianzar tu velocidad con el mapa.`;
      } else if (score >= 4) {
        summaryMessage = `¡Muy buen punto de partida, ${studentName}! Tienes clara la noción de fracción. Nos enfocaremos en fortalecer las operaciones paso a paso.`;
      } else {
        summaryMessage = `¡Diagnóstico completado con éxito, ${studentName}! No te preocupes por los aciertos: las fracciones son visuales e intuitivas una vez que las vemos en barras y sectores.`;
      }

      const result: DiagnosticResult = {
        completedAt: new Date().toISOString(),
        score,
        total,
        assignedStartingSkill: startingSkill,
        summaryMessage,
        skillBreakdown: breakdown
      };

      setFinalResult(result);
      setIsFinished(true);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  if (isFinished && finalResult) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7" />
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Diagnóstico completado
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {finalResult.summaryMessage}
          </h2>

          <div className="my-6 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Preguntas exploradas:</span>
              <span className="text-slate-900 dark:text-white font-bold">8 de 8</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Respuestas firmes:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{finalResult.score} / {finalResult.total}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Punto de partida recomendado:</span>
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="capitalize">{finalResult.assignedStartingSkill.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Hemos configurado tu mapa de aprendizaje personal con las 10 micro-lecciones y los ciclos de repaso espaciado.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onComplete(finalResult)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 active:scale-95 transition cursor-pointer shadow-sm"
            >
              <span>Ir a mi Mapa de Destrezas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back button to review questions */}
            <button
              type="button"
              onClick={() => {
                setIsFinished(false);
                setCurrentIndex(diagnosticQuestions.length - 1);
                const lastQ = diagnosticQuestions[diagnosticQuestions.length - 1];
                setSelectedOptionId(answers[lastQ.id]?.optionId || null);
                setShowFeedback(answers[lastQ.id]?.isVerified || false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a revisar mis respuestas del diagnóstico</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = currentQuestion.options.find((opt) => opt.id === selectedOptionId);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {/* Top Header with Back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition cursor-pointer shadow-2xs"
          title={currentIndex === 0 ? 'Volver a mis datos (Onboarding)' : 'Volver a la pregunta anterior'}
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{currentIndex === 0 ? 'Volver a mis datos' : 'Pregunta anterior'}</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Pregunta {currentIndex + 1} de {diagnosticQuestions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / diagnosticQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQuestion.prompt}
        </h3>

        {/* Visual Component if present */}
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

        {/* Progressive Hint Button */}
        {currentQuestion.hints.length > 0 && (
          <div className="my-3">
            {showHint ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{currentQuestion.hints[0]}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>¿Dudas? Ver una pista guiada</span>
              </button>
            )}
          </div>
        )}

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

        {/* Feedback Message */}
        {showFeedback && selectedOption && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs md:text-sm animate-in fade-in duration-200 border ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            <p className="font-semibold">{selectedOption.feedback}</p>
            {!selectedOption.isCorrect && (
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-xs">{currentQuestion.explanation}</p>
            )}
          </div>
        )}

        {/* Bottom Actions: Both Back and Next/Verify */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{currentIndex === 0 ? 'Mis datos' : 'Anterior'}</span>
          </button>

          {!showFeedback ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleVerify}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs md:text-sm hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              Comprobar respuesta
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs md:text-sm active:scale-95 transition cursor-pointer shadow-xs"
            >
              <span>{currentIndex === diagnosticQuestions.length - 1 ? 'Ver resultados' : 'Siguiente pregunta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
