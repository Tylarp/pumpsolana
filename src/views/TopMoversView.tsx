import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { Sparkline } from '@/components/Sparkline';
import { ChangeBadge } from '@/components/Badges';
import { formatUsd, formatNumber } from '@/lib/utils';

interface TopMoversViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

type Timeframe = '1m' | '5m' | '15m' | '1h';
type Direction = 'gainers' | 'losers' | 'volume';

export function TopMoversView({ tokens, onSelectToken, isWatched, onToggleWatch }: TopMoversViewProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [direction, setDirection] = useState<Direction>('gainers');

  const getChange = (token: Token, tf: Timeframe): number => {
    switch (tf) {
      case '1m': return token.priceChange1m;
      case '5m': return token.priceChange5m;
      case '15m': return token.priceChange15m;
      case '1h': return token.priceChange1h;
    }
  };

  const sorted = useMemo(() => {
    if (direction === 'volume') {
      return [...tokens].sort((a, b) => b.volume1h - a.volume1h);
    }
    return [...tokens].sort((a, b) => {
      const diff = getChange(b, timeframe) - getChange(a, timeframe);
      return direction === 'gainers' ? diff : -diff;
    });
  }, [tokens, timeframe, direction]);

  const top5 = sorted.slice(0, 5);

  const columns = ['price', 'change', 'chart', 'volume', 'liquidity', 'mcap', 'holders', 'txns', 'score', 'risk'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
          {([
            { key: 'gainers' as const, label: 'Top Gainers', icon: TrendingUp },
            { key: 'losers' as const, label: 'Top Losers', icon: TrendingDown },
            { key: 'volume' as const, label: 'Volume Spikes', icon: Activity },
          ]).map(d => {
            const Icon = d.icon;
            return (
              <button
                key={d.key}
                onClick={() => setDirection(d.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  direction === d.key
                    ? d.key === 'gainers' ? 'bg-emerald-500/10 text-emerald-400' : d.key === 'losers' ? 'bg-red-500/10 text-red-400' : 'bg-sky-500/10 text-sky-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={14} /> {d.label}
              </button>
            );
          })}
        </div>

        {direction !== 'volume' && (
          <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
            {(['1m', '5m', '15m', '1h'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeframe === tf ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Highlight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {top5.map((token, idx) => {
          const change = direction === 'volume' ? 0 : getChange(token, timeframe);
          const isPositive = change > 0;
          return (
            <button
              key={token.id}
              onClick={() => onSelectToken(token.address)}
              className="bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 font-bold">#{idx + 1}</span>
                  <span className="text-sm font-bold text-white">{token.symbol}</span>
                </div>
                <span className="text-[10px] text-gray-600">{token.platform}</span>
              </div>
              {direction === 'volume' ? (
                <div className="text-lg font-bold text-sky-400 tabular-nums">{formatUsd(token.volume1h)}</div>
              ) : (
                <div className={`text-lg font-bold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </div>
              )}
              <div className="text-[10px] text-gray-500 mt-0.5">
                {formatUsd(token.volume24h)} vol · {formatNumber(token.holders)} holders
              </div>
              <div className="mt-2">
                <Sparkline data={token.priceHistory.slice(-20)} width={180} height={28} fill={false} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold">{timeframe} %</th>
                <th className="py-2 px-2 text-center font-semibold">Chart</th>
                <th className="py-2 px-2 text-right font-semibold">Volume</th>
                <th className="py-2 px-2 text-right font-semibold">Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold">MCap</th>
                <th className="py-2 px-2 text-right font-semibold">Holders</th>
                <th className="py-2 px-2 text-right font-semibold">Txns (1h)</th>
                <th className="py-2 px-2 text-center font-semibold">AI</th>
                <th className="py-2 px-2 text-center font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(token => (
                <TokenRow
                  key={token.id}
                  token={token}
                  onClick={() => onSelectToken(token.address)}
                  isWatched={isWatched(token.address)}
                  onToggleWatch={onToggleWatch}
                  columns={columns}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
