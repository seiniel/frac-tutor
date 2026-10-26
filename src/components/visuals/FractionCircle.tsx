import React from 'react';

interface FractionCircleProps {
  numerator: number;
  denominator: number;
  interactive?: boolean;
  onNumeratorChange?: (newNumerator: number) => void;
  size?: number; // Diametro en px
  label?: string;
  comparisonNumerator?: number;
  comparisonDenominator?: number;
}

export const FractionCircle: React.FC<FractionCircleProps> = ({
  numerator,
  denominator,
  interactive = false,
  onNumeratorChange,
  size = 200,
  label,
  comparisonNumerator,
  comparisonDenominator
}) => {
  const safeDenominator = Math.max(1, Math.min(16, denominator));
  const safeNumerator = Math.max(0, Math.min(safeDenominator, numerator));

  const center = size / 2;
  const radius = size * 0.44;

  const renderSlices = (
    num: number,
    den: number,
    fillColor: string,
    isInteractive: boolean,
    keyPrefix: string
  ) => {
    // Single slice when denominator is 1
    if (den === 1) {
      return (
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={`${num >= 1 ? fillColor : 'fill-slate-100'} stroke-slate-300 stroke-2 cursor-pointer`}
          onClick={() => isInteractive && onNumeratorChange && onNumeratorChange(num >= 1 ? 0 : 1)}
        />
      );
    }

    const angleStep = (2 * Math.PI) / den;

    return Array.from({ length: den }).map((_, index) => {
      // Start from top (-PI/2)
      const startAngle = index * angleStep - Math.PI / 2;
      const endAngle = (index + 1) * angleStep - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArcFlag = angleStep > Math.PI ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = index < num;

      return (
        <path
          key={`${keyPrefix}-${index}`}
          d={pathData}
          className={`transition-colors duration-150 stroke-slate-200 stroke-[1.5] ${
            isFilled ? fillColor : 'fill-white hover:fill-slate-50'
          } ${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => {
            if (!isInteractive || !onNumeratorChange) return;
            const clicked = index + 1;
            onNumeratorChange(clicked === safeNumerator ? clicked - 1 : clicked);
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-xs font-medium text-slate-500 text-center">{label}</p>}

      <div className="flex items-center justify-center gap-6 flex-wrap">
        {/* Main Circle */}
        <div className="flex flex-col items-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="drop-shadow-sm select-none"
            role="img"
            aria-label={`Fracción circular ${safeNumerator}/${safeDenominator}`}
          >
            <circle cx={center} cy={center} r={radius} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            {renderSlices(safeNumerator, safeDenominator, 'fill-emerald-500', interactive, 'main')}
            {/* Center hub */}
            <circle cx={center} cy={center} r={size * 0.08} fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
          </svg>
          <span className="mt-2 text-sm font-bold text-emerald-800">
            {safeNumerator} / {safeDenominator}
          </span>
        </div>

        {/* Optional Comparison Circle */}
        {comparisonDenominator && (
          <div className="flex flex-col items-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="drop-shadow-sm select-none"
              role="img"
              aria-label={`Fracción circular de comparación ${comparisonNumerator ?? 0}/${comparisonDenominator}`}
            >
              <circle cx={center} cy={center} r={radius} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
              {renderSlices(
                comparisonNumerator ?? 0,
                comparisonDenominator,
                'fill-orange-500',
                false,
                'comp'
              )}
              {/* Center hub */}
              <circle cx={center} cy={center} r={size * 0.08} fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
            </svg>
            <span className="mt-2 text-sm font-bold text-orange-700">
              {comparisonNumerator ?? 0} / {comparisonDenominator}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
