import React, { useState } from 'react';
import { FadedExampleData } from '../../types';
import { ChevronRight, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface FadedExampleProps {
  example: FadedExampleData;
}

export const FadedExample: React.FC<FadedExampleProps> = ({ example }) => {
  const [revealedSteps, setRevealedSteps] = useState<number[]>([1]); // Step 1 is always visible
  const [showHintForStep, setShowHintForStep] = useState<number | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  const toggleStep = (stepNumber: number) => {
    if (revealedSteps.includes(stepNumber)) {
      setRevealedSteps(revealedSteps.filter((s) => s !== stepNumber));
    } else {
      setRevealedSteps([...revealedSteps, stepNumber]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{example.title}</h4>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700 mb-4 text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium">
        {example.problemStatement}
      </div>

      <div className="space-y-3">
        {example.steps.map((step) => {
          const isRevealed = revealedSteps.includes(step.stepNumber);
          const isFaded = step.fadedRatio > 0.4;

          return (
            <div
              key={step.stepNumber}
              className={`rounded-xl border transition-all ${
                isRevealed
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className="flex items-center justify-between p-3.5 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isRevealed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {step.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isFaded && !isRevealed && (
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                      Intenta pensar el paso
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isRevealed ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {isRevealed && (
                <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2.5 border-t border-emerald-100 dark:border-emerald-900/40">
                  <p className="leading-relaxed">{step.explanation}</p>

                  {step.promptOrAction && (
                    <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      {step.promptOrAction}
                    </p>
                  )}

                  {step.hint && (
                    <div>
                      {showHintForStep === step.stepNumber ? (
                        <div className="text-xs p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>{step.hint}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowHintForStep(step.stepNumber)}
                          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          ¿Necesitas una pista para este paso?
                        </button>
                      )}
                    </div>
                  )}

                  {step.solutionPart && (
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs md:text-sm text-emerald-900 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{step.solutionPart}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reflection at bottom */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowReflection(!showReflection)}
          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-between w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          <span>Pregunta de reflexión formativa</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{showReflection ? 'Ocultar' : 'Ver'}</span>
        </button>
        {showReflection && (
          <p className="mt-2 text-xs md:text-sm text-slate-700 dark:text-slate-200 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 leading-relaxed">
            {example.reflectionPrompt}
          </p>
        )}
      </div>
    </div>
  );
};
