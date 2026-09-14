import { useMemo, useState } from 'react';
import { GraduationCap, ArrowUpDown } from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { formatAge } from '@/lib/utils';

interface GraduatedViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

type SortKey = 'volume24h' | 'liquidity' | 'marketCap' | 'holders' | 'aiScore' | 'priceChange1h' | 'ageMinutes';

export function GraduatedView({ tokens, onSelectToken, isWatched, onToggleWatch }: GraduatedViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const graduated = useMemo(() => {
    return [...tokens]
      .filter(t => t.graduated)
      .sort((a, b) => {
        const av = a[sortKey] as number;
        const bv = b[sortKey] as number;
        return sortDir === 'desc' ? bv - av : av - bv;
      });
  }, [tokens, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <GraduationCap size={16} className="text-emerald-400" />
        <span>{graduated.length} tokens have graduated from launch platforms</span>
      </div>

      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('priceChange1h')}>Price</th>
                <th className="py-2 px-2 text-right font-semibold">1h %</th>
                <th className="py-2 px-2 text-center font-semibold">Chart</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('volume24h')}>Volume</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('liquidity')}>Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('marketCap')}>MCap</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('holders')}>Holders</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('ageMinutes')}>Age</th>
                <th className="py-2 px-2 text-center font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('aiScore')}>AI</th>
                <th className="py-2 px-2 text-center font-semibold">Risk</th>
              </tr>
            </thead>
            <tbody>
              {graduated.map(token => (
                <TokenRow
                  key={token.id}
                  token={token}
                  onClick={() => onSelectToken(token.address)}
                  isWatched={isWatched(token.address)}
                  onToggleWatch={onToggleWatch}
                  columns={['price', 'change', 'chart', 'volume', 'liquidity', 'mcap', 'holders', 'age', 'score', 'risk']}
                />
              ))}
            </tbody>
          </table>
        </div>
        {graduated.length === 0 && (
          <div className="py-12 text-center text-gray-600 text-sm">No graduated tokens yet</div>
        )}
      </div>
    </div>
  );
}
