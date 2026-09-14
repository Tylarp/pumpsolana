import { useMemo } from 'react';

interface PriceChartProps {
  data: number[];
  height?: number;
  showAxis?: boolean;
  color?: string;
}

export function PriceChart({ data, height = 200, showAxis = true }: PriceChartProps) {
  const { path, areaPath, isPositive, min, max, width } = useMemo(() => {
    const w = 800;
    if (data.length < 2) return { path: '', areaPath: '', isPositive: true, min: 0, max: 1, width: w };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1);
    const points = data.map((d, i) => ({
      x: i * step,
      y: height - ((d - min) / range) * (height - 20) - 10,
    }));
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
    const areaPath = `${path} L ${w} ${height} L 0 ${height} Z`;
    return { path, areaPath, isPositive: data[data.length - 1] >= data[0], min, max, width: w };
  }, [data, height]);

  const color = isPositive ? '#10b981' : '#ef4444';
  const gradientId = useMemo(() => `chart-grad-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showAxis && [0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1="0" y1={height * p} x2={width} y2={height * p} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showAxis && (
        <div className="absolute top-1 right-2 text-xs text-gray-500 tabular-nums">
          {max.toFixed(max < 1 ? 6 : 2)}
        </div>
      )}
      {showAxis && (
        <div className="absolute bottom-1 right-2 text-xs text-gray-500 tabular-nums">
          {min.toFixed(min < 1 ? 6 : 2)}
        </div>
      )}
    </div>
  );
}
