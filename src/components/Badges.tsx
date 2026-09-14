import type { RiskLevel } from '@/lib/types';
import { riskLevelColor, riskLevelLabel } from '@/lib/utils';

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const colors = riskLevelColor(level);
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full border ${colors.bg} ${colors.text} ${colors.border} font-semibold ${sizeClasses}`}>
      {riskLevelLabel(level)}
    </span>
  );
}

export function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const color = score >= 75 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : score >= 50 ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    : score >= 30 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-red-400 bg-red-500/10 border-red-500/30';
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full border font-bold ${color} ${sizeClasses}`}>
      {score}
    </span>
  );
}

export function ChangeBadge({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const isPositive = value > 0;
  const color = isPositive ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
  const sign = isPositive ? '+' : '';
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <span className={`font-semibold tabular-nums ${color} ${sizeClasses}`}>
      {sign}{value.toFixed(1)}%
    </span>
  );
}
