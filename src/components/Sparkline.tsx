import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}

export function Sparkline({ data, width = 120, height = 36, color, fill = true, strokeWidth = 1.5 }: SparklineProps) {
  const { path, areaPath, isPositive } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '', isPositive: true };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);

    const points = data.map((d, i) => ({
      x: i * step,
      y: height - ((d - min) / range) * (height - 4) - 2,
    }));

    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
    const isPositive = data[data.length - 1] >= data[0];

    return { path, areaPath, isPositive };
  }, [data, width, height]);

  const lineColor = color ?? (isPositive ? '#10b981' : '#ef4444');
  const gradientId = useMemo(() => `sparkline-grad-${Math.random().toString(36).slice(2)}`, []);

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
        </>
      )}
      <path d={path} fill="none" stroke={lineColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
