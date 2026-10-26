import React from 'react';

interface NumberLineProps {
  numerator: number;
  denominator: number;
  interactive?: boolean;
  onNumeratorChange?: (newNumerator: number) => void;
  label?: string;
}

export const NumberLine: React.FC<NumberLineProps> = ({
  numerator,
  denominator,
  interactive = false,
  onNumeratorChange,
  label
}) => {
  const safeDenominator = Math.max(1, Math.min(12, denominator));
  const safeNumerator = Math.max(0, Math.min(safeDenominator, numerator));

  const ticks = Array.from({ length: safeDenominator + 1 });

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4 py-2 select-none">
      {label && <p className="text-xs font-medium text-slate-500 text-center">{label}</p>}

      <div className="w-full relative px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Horizontal axis line */}
        <div className="h-1.5 w-full bg-slate-300 rounded-full relative">
          {/* Active progress fill */}
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-200"
            style={{ width: `${(safeNumerator / safeDenominator) * 100}%` }}
          />

          {/* Ticks and clickable step zones */}
          <div className="absolute inset-0 flex justify-between items-center -top-3">
            {ticks.map((_, index) => {
              const isActive = index === safeNumerator;
              const isPast = index <= safeNumerator;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative group"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  {/* Tick mark */}
                  <div
                    className={`w-1 h-7 rounded-full transition-colors ${
                      index === 0 || index === safeDenominator
                        ? 'bg-slate-700 h-8'
                        : isPast
                        ? 'bg-emerald-600'
                        : 'bg-slate-400'
                    }`}
                  />

                  {/* Interactive Button overlay for touch ergonomics */}
                  {interactive && (
                    <button
                      type="button"
                      onClick={() => onNumeratorChange && onNumeratorChange(index)}
                      className="absolute -top-3 w-10 h-14 cursor-pointer focus:outline-none"
                      aria-label={`Seleccionar punto ${index}/${safeDenominator}`}
                    />
                  )}

                  {/* Tick Label */}
                  <span
                    className={`text-[11px] mt-2 font-semibold ${
                      isActive
                        ? 'text-emerald-700 scale-110 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {index === 0
                      ? '0'
                      : index === safeDenominator
                      ? '1'
                      : `${index}/${safeDenominator}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* The draggable/current marker dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-600 border-4 border-white shadow-md flex items-center justify-center transition-all duration-200"
            style={{ left: `${(safeNumerator / safeDenominator) * 100}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Current Value Display Badge */}
        <div className="mt-8 text-center">
          <span className="text-xs font-medium text-slate-500 mr-2">Posición actual:</span>
          <span className="inline-flex items-center text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {safeNumerator} / {safeDenominator}
          </span>
        </div>
      </div>
    </div>
  );
};
