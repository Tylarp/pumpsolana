import { useMemo } from 'react';
import {
  Flame, GraduationCap, Users, TrendingUp, Radar, AlertTriangle,
  ArrowUpRight, Activity, Zap, Eye
} from 'lucide-react';
import type { Token, AIInsight } from '@/lib/types';
import { formatUsd, formatNumber, formatPercent, formatPrice, formatAge } from '@/lib/utils';
import { Sparkline } from '@/components/Sparkline';
import { ScoreRing } from '@/components/ScoreRing';
import { RiskBadge, ChangeBadge } from '@/components/Badges';
import { PriceChart } from '@/components/PriceChart';
import { getAIInsights } from '@/lib/mockData';
import type { ViewKey } from '@/components/AppShell';

interface OverviewViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  onNavigate: (view: ViewKey) => void;
  lastUpdate: number;
}

export function OverviewView({ tokens, onSelectToken, onNavigate, lastUpdate }: OverviewViewProps) {
  const insights = useMemo(() => getAIInsights(tokens), [tokens]);

  const stats = useMemo(() => {
    const totalMcap = tokens.reduce((acc, t) => acc + t.marketCap, 0);
    const totalVolume = tokens.reduce((acc, t) => acc + t.volume24h, 0);
    const totalLiquidity = tokens.reduce((acc, t) => acc + t.liquidity, 0);
    const newPairs = tokens.filter(t => t.ageMinutes < 60).length;
    const graduated = tokens.filter(t => t.graduated).length;
    const highRisk = tokens.filter(t => t.riskLevel === 'high-risk').length;
    const early = tokens.filter(t => t.riskLevel === 'early').length;
    const avgSentiment = tokens.reduce((acc, t) => acc + t.socialSentiment, 0) / tokens.length;

    return { totalMcap, totalVolume, totalLiquidity, newPairs, graduated, highRisk, early, avgSentiment };
  }, [tokens]);

  const topOpportunities = useMemo(() =>
    [...tokens]
      .filter(t => t.riskLevel !== 'high-risk')
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5),
    [tokens]
  );

  const topMovers = useMemo(() =>
    [...tokens]
      .sort((a, b) => b.priceChange1h - a.priceChange1h)
      .slice(0, 5),
    [tokens]
  );

  const summaryInsight = insights.find(i => i.type === 'summary');
  const opportunityInsights = insights.filter(i => i.type === 'opportunity');
  const riskInsights = insights.filter(i => i.type === 'risk');

  const statCards = [
    { label: 'Total Market Cap', value: formatUsd(stats.totalMcap), icon: Activity, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: '24h Volume', value: formatUsd(stats.totalVolume), icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Liquidity', value: formatUsd(stats.totalLiquidity), icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'New Pairs (1h)', value: stats.newPairs.toString(), icon: Flame, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const quickNavCards = [
    { label: 'Trending / New Pairs', count: stats.newPairs, icon: Flame, color: 'text-pink-400', view: 'trending' as ViewKey },
    { label: 'Graduated', count: stats.graduated, icon: GraduationCap, color: 'text-emerald-400', view: 'graduated' as ViewKey },
    { label: 'Most Held', count: tokens.length, icon: Users, color: 'text-sky-400', view: 'mostheld' as ViewKey },
    { label: 'Top Movers', count: topMovers.length, icon: TrendingUp, color: 'text-amber-400', view: 'movers' as ViewKey },
    { label: 'AI Signal Score', count: topOpportunities.length, icon: Radar, color: 'text-teal-400', view: 'aisignal' as ViewKey },
    { label: 'High Risk Tokens', count: stats.highRisk, icon: AlertTriangle, color: 'text-red-400', view: 'risk' as ViewKey },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">{card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* AI Market Overview */}
      <div className="bg-gradient-to-br from-[#0d1220] to-[#101725] border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Radar size={18} className="text-teal-400" />
          <h2 className="text-sm font-bold text-white">AI Market Overview</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">AI Generated</span>
        </div>

        {summaryInsight && (
          <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-sm text-gray-300 leading-relaxed">{summaryInsight.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {opportunityInsights.map((insight) => (
            <div key={insight.id} className="p-3 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">Opportunity</span>
                </div>
                <span className="text-[10px] text-gray-500">{insight.confidence}% conf.</span>
              </div>
              <p className="text-xs font-semibold text-white mb-1">{insight.title}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{insight.description}</p>
              {insight.tokens.length > 0 && (
                <button
                  onClick={() => {
                    const token = tokens.find(t => t.symbol === insight.tokens[0]);
                    if (token) onSelectToken(token.address);
                  }}
                  className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  View {insight.tokens[0]} →
                </button>
              )}
            </div>
          ))}

          {riskInsights.slice(0, 1).map((insight) => (
            <div key={insight.id} className="p-3 rounded-lg bg-red-500/[0.03] border border-red-500/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-xs font-semibold text-red-400">Risk Alert</span>
                </div>
                <span className="text-[10px] text-gray-500">{insight.confidence}% risk</span>
              </div>
              <p className="text-xs font-semibold text-white mb-1">{insight.title}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickNavCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.view)}
              className="bg-[#0d1220] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all group text-left"
            >
              <Icon size={18} className={`${card.color} mb-2`} />
              <div className="text-lg font-bold text-white tabular-nums">{card.count}</div>
              <div className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">{card.label}</div>
            </button>
          );
        })}
      </div>

      {/* Top Movers + Top Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Top Movers (1h)</h3>
            </div>
            <button onClick={() => onNavigate('movers')} className="text-xs text-gray-500 hover:text-gray-300">View all →</button>
          </div>
          <div className="divide-y divide-white/5">
            {topMovers.map((token) => (
              <button
                key={token.id}
                onClick={() => onSelectToken(token.address)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{token.symbol}</div>
                    <div className="text-[10px] text-gray-500">{formatAge(token.ageMinutes)} · {formatPrice(token.price)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline data={token.priceHistory.slice(-20)} width={60} height={24} />
                  <ChangeBadge value={token.priceChange1h} size="md" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Radar size={16} className="text-teal-400" />
              <h3 className="text-sm font-semibold text-white">Top AI Signal Scores</h3>
            </div>
            <button onClick={() => onNavigate('aisignal')} className="text-xs text-gray-500 hover:text-gray-300">View all →</button>
          </div>
          <div className="divide-y divide-white/5">
            {topOpportunities.map((token) => (
              <button
                key={token.id}
                onClick={() => onSelectToken(token.address)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <ScoreRing score={token.aiScore} size={36} strokeWidth={3} />
                  <div>
                    <div className="text-sm font-semibold text-white">{token.symbol}</div>
                    <div className="text-[10px] text-gray-500">{formatUsd(token.volume1h)}/h · {formatNumber(token.holders)} holders</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={token.riskLevel} size="sm" />
                  <ChangeBadge value={token.priceChange1h} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Chart */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Market Price Index — Top 5 by Market Cap</h3>
          <span className="text-[10px] text-gray-500">Composite index (normalized)</span>
        </div>
        <PriceChart data={normalizeIndex(tokens.slice(0, 5))} height={180} />
      </div>
    </div>
  );
}

function normalizeIndex(tokens: Token[]): number[] {
  if (tokens.length === 0) return [];
  const len = tokens[0].priceHistory.length;
  const index: number[] = [];
  for (let i = 0; i < len; i++) {
    let sum = 0;
    for (const t of tokens) {
      const base = t.priceHistory[0] || 1;
      sum += (t.priceHistory[i] / base) * 100;
    }
    index.push(sum / tokens.length);
  }
  return index;
}
