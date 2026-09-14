import { useMemo, useState } from 'react';
import { Users, ArrowUpDown } from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { formatNumber, formatPercent } from '@/lib/utils';

interface MostHeldViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

type SortKey = 'holders' | 'holderGrowth1h' | 'holderGrowth24h' | 'marketCap' | 'volume24h' | 'aiScore';

export function MostHeldView({ tokens, onSelectToken, isWatched, onToggleWatch }: MostHeldViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('holders');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [growthFilter, setGrowthFilter] = useState<'all' | 'growing' | 'declining'>('all');

  const filtered = useMemo(() => {
    let result = [...tokens];
    if (growthFilter === 'growing') result = result.filter(t => t.holderGrowth1h > 0);
    else if (growthFilter === 'declining') result = result.filter(t => t.holderGrowth1h < 0);

    return result.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [tokens, sortKey, sortDir, growthFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users size={16} className="text-sky-400" />
          <span>Ranked by holder count and growth</span>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
          {(['all', 'growing', 'declining'] as const).map(f => (
            <button
              key={f}
              onClick={() => setGrowthFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                growthFilter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'growing' ? 'Growing' : 'Declining'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-right font-semibold">#</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('holders')}>Holders</th>
                <th className="py-2 px-2 text-center font-semibold">Growth Chart</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('holderGrowth1h')}>1h Growth</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('holderGrowth24h')}>24h Growth</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('marketCap')}>MCap</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('volume24h')}>Volume</th>
                <th className="py-2 px-2 text-center font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('aiScore')}>AI</th>
                <th className="py-2 px-2 text-center font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((token, idx) => (
                <tr
                  key={token.id}
                  onClick={() => onSelectToken(token.address)}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3 pl-4 pr-2 sticky left-0 bg-[#0d1220] group-hover:bg-white/[0.03]">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">{token.symbol}</span>
                      <span className="text-gray-500 text-xs truncate max-w-[120px]">{token.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-500 text-sm tabular-nums">{idx + 1}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-white text-sm font-semibold tabular-nums">{formatNumber(token.holders)}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <svg width="80" height="28" className="overflow-visible">
                        <path
                          d={(() => {
                            const data = token.holderHistory;
                            if (data.length < 2) return '';
                            const min = Math.min(...data);
                            const max = Math.max(...data);
                            const range = max - min || 1;
                            const step = 80 / (data.length - 1);
                            return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(2)} ${(28 - ((d - min) / range) * 24 - 2).toFixed(2)}`).join(' ');
                          })()}
                          fill="none"
                          stroke={token.holderGrowth1h > 0 ? '#10b981' : '#ef4444'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${token.holderGrowth1h > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercent(token.holderGrowth1h)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${token.holderGrowth24h > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercent(token.holderGrowth24h)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{token.price < 1 ? `$${token.price.toFixed(6)}` : `$${token.price.toFixed(4)}`}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{`$${token.marketCap >= 1e6 ? `${(token.marketCap / 1e6).toFixed(2)}M` : `${(token.marketCap / 1e3).toFixed(1)}K`}`}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{`$${token.volume24h >= 1e6 ? `${(token.volume24h / 1e6).toFixed(2)}M` : `${(token.volume24h / 1e3).toFixed(1)}K`}`}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`text-sm font-bold tabular-nums ${token.aiScore >= 75 ? 'text-emerald-400' : token.aiScore >= 50 ? 'text-sky-400' : token.aiScore >= 30 ? 'text-amber-400' : 'text-red-400'}`}>
                      {token.aiScore}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      token.riskLevel === 'early' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      token.riskLevel === 'developing' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                      token.riskLevel === 'extended' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {token.riskLevel === 'early' ? 'Early' : token.riskLevel === 'developing' ? 'Dev' : token.riskLevel === 'extended' ? 'Ext' : 'Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
