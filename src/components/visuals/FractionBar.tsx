import React from 'react';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  interactive?: boolean;
  onNumeratorChange?: (newNumerator: number) => void;
  comparisonNumerator?: number;
  comparisonDenominator?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FractionBar: React.FC<FractionBarProps> = ({
  numerator,
  denominator,
  interactive = false,
  onNumeratorChange,
  comparisonNumerator,
  comparisonDenominator,
  label,
  size = 'md'
}) => {
  const safeDenominator = Math.max(1, Math.min(20, denominator));
  const safeNumerator = Math.max(0, Math.min(safeDenominator, numerator));

  const heightClass = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-16' : 'h-12';

  const handleSegmentClick = (index: number) => {
    if (!interactive || !onNumeratorChange) return;
    const clickedNum = index + 1;
    // If clicking current numerator, toggle back by 1 or toggle to 0
    if (clickedNum === safeNumerator) {
      onNumeratorChange(clickedNum - 1);
    } else {
      onNumeratorChange(clickedNum);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {label && <p className="text-xs font-medium text-slate-500 text-center">{label}</p>}

      {/* Main Bar */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span>0</span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {safeNumerator} / {safeDenominator}
          </span>
          <span>1 entero</span>
        </div>

        <div
          className={`w-full ${heightClass} flex rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner`}
          role={interactive ? 'slider' : 'img'}
          aria-label={`Barra de fracción mostrando ${safeNumerator} de ${safeDenominator}`}
          aria-valuenow={safeNumerator}
          aria-valuemin={0}
          aria-valuemax={safeDenominator}
        >
          {Array.from({ length: safeDenominator }).map((_, index) => {
            const isFilled = index < safeNumerator;
            return (
              <button
                key={index}
                type="button"
                disabled={!interactive}
                onClick={() => handleSegmentClick(index)}
                className={`flex-1 border-r last:border-r-0 border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center font-bold text-xs select-none ${
                  isFilled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'
                } ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                title={interactive ? `Seleccionar ${index + 1}/${safeDenominator}` : undefined}
              >
                {size !== 'sm' && <span>{isFilled ? '✓' : ''}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Comparison Bar */}
      {comparisonDenominator && (
        <div className="w-full max-w-md pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span>0</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {comparisonNumerator ?? 0} / {comparisonDenominator}
            </span>
            <span>1 entero</span>
          </div>

          <div
            className={`w-full ${heightClass} flex rounded-xl overflow-hidden border-2 border-orange-200 dark:border-orange-800/80 bg-orange-50/50 dark:bg-orange-950/30 shadow-inner`}
          >
            {Array.from({ length: comparisonDenominator }).map((_, index) => {
              const isFilled = index < (comparisonNumerator ?? 0);
              return (
                <div
                  key={index}
                  className={`flex-1 border-r last:border-r-0 border-orange-200 dark:border-orange-800/80 transition-colors flex items-center justify-center font-bold text-xs ${
                    isFilled ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {size !== 'sm' && <span>{isFilled ? '✓' : ''}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
