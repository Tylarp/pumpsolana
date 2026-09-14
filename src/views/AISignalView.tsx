import { useMemo, useState } from 'react';
import { Radar, Info } from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { ScoreRing } from '@/components/ScoreRing';
import { Sparkline } from '@/components/Sparkline';
import { formatUsd, formatNumber, formatPercent, formatPrice } from '@/lib/utils';

interface AISignalViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

export function AISignalView({ tokens, onSelectToken, isWatched, onToggleWatch }: AISignalViewProps) {
  const [minScore, setMinScore] = useState(0);

  const filtered = useMemo(() => {
    return [...tokens]
      .filter(t => t.aiScore >= minScore)
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [tokens, minScore]);

  const top3 = filtered.slice(0, 3);

  const scoreFactors = [
    { label: 'Price Momentum', weight: '25%', description: '1h and 5m price change velocity' },
    { label: 'Volume Acceleration', weight: '20%', description: 'Volume growth relative to market cap' },
    { label: 'Liquidity Depth', weight: '15%', description: 'Liquidity to market cap ratio' },
    { label: 'Holder Growth', weight: '15%', description: 'Rate of new holder acquisition' },
    { label: 'Wallet Activity', weight: '10%', description: 'Smart money and whale participation' },
    { label: 'Social Activity', weight: '15%', description: 'Mention volume and sentiment' },
  ];

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
        <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          AI Signal Scores are heuristic estimates based on on-chain and social metrics. They do NOT guarantee any token will increase in price. Always do your own research and never invest more than you can afford to lose.
        </p>
      </div>

      {/* Score Factor Breakdown */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Radar size={16} className="text-teal-400" />
          <h3 className="text-sm font-semibold text-white">AI Signal Score Components</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {scoreFactors.map(f => (
            <div key={f.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-300">{f.label}</span>
                <span className="text-[10px] text-teal-400 font-bold">{f.weight}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((token, idx) => (
          <button
            key={token.id}
            onClick={() => onSelectToken(token.address)}
            className="bg-gradient-to-br from-[#0d1220] to-[#101725] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 font-bold">#{idx + 1}</span>
                <span className="text-base font-bold text-white">{token.symbol}</span>
              </div>
              <span className="text-[10px] text-gray-600">{token.platform}</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <ScoreRing score={token.aiScore} size={64} strokeWidth={5} label="Score" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Price</span>
                  <span className="text-gray-200 tabular-nums">{formatPrice(token.price)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Volume (1h)</span>
                  <span className="text-gray-200 tabular-nums">{formatUsd(token.volume1h)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Holders</span>
                  <span className="text-gray-200 tabular-nums">{formatNumber(token.holders)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Social</span>
                  <span className="text-gray-200 tabular-nums">{formatNumber(token.socialMentions)} mentions</span>
                </div>
              </div>
            </div>
            <Sparkline data={token.priceHistory.slice(-30)} width={260} height={40} />
          </button>
        ))}
      </div>

      {/* Score Filter */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">Min Score:</span>
        <input
          type="range"
          min={0}
          max={100}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="w-48 accent-teal-400"
        />
        <span className="text-xs text-teal-400 font-bold tabular-nums">{minScore}</span>
        <span className="text-xs text-gray-600">· {filtered.length} tokens</span>
      </div>

      {/* Full Table */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-center font-semibold">Score</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold">1h %</th>
                <th className="py-2 px-2 text-center font-semibold">Chart</th>
                <th className="py-2 px-2 text-right font-semibold">Volume</th>
                <th className="py-2 px-2 text-right font-semibold">Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold">Holders</th>
                <th className="py-2 px-2 text-right font-semibold">Social</th>
                <th className="py-2 px-2 text-right font-semibold">Risk Score</th>
                <th className="py-2 px-2 text-center font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(token => (
                <TokenRow
                  key={token.id}
                  token={token}
                  onClick={() => onSelectToken(token.address)}
                  isWatched={isWatched(token.address)}
                  onToggleWatch={onToggleWatch}
                  columns={['price', 'change', 'chart', 'volume', 'liquidity', 'holders', 'social', 'score', 'risk']}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
