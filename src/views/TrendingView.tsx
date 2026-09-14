import { useMemo, useState } from 'react';
import { Flame, Search, ArrowUpDown } from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { formatAge } from '@/lib/utils';

interface TrendingViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

type SortKey = 'ageMinutes' | 'volume24h' | 'volume1h' | 'liquidity' | 'marketCap' | 'holders' | 'aiScore' | 'priceChange1h' | 'socialMentions';
type Tab = 'new' | 'trending';

export function TrendingView({ tokens, onSelectToken, isWatched, onToggleWatch }: TrendingViewProps) {
  const [tab, setTab] = useState<Tab>('new');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('volume24h');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [ageFilter, setAgeFilter] = useState<'all' | '1h' | '6h' | '24h'>('all');

  const filtered = useMemo(() => {
    let result = [...tokens];

    if (tab === 'new') {
      if (ageFilter === '1h') result = result.filter(t => t.ageMinutes <= 60);
      else if (ageFilter === '6h') result = result.filter(t => t.ageMinutes <= 360);
      else if (ageFilter === '24h') result = result.filter(t => t.ageMinutes <= 1440);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let av = a[sortKey] as number;
      let bv = b[sortKey] as number;
      if (tab === 'trending' && sortKey === 'volume24h') {
        av = a.volume1h;
        bv = b.volume1h;
      }
      return sortDir === 'desc' ? bv - av : av - bv;
    });

    return result;
  }, [tokens, tab, search, sortKey, sortDir, ageFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const columns = tab === 'new'
    ? ['price', 'change', 'chart', 'volume', 'liquidity', 'mcap', 'holders', 'age', 'score', 'risk']
    : ['price', 'change', 'chart', 'volume', 'liquidity', 'mcap', 'holders', 'social', 'score', 'risk'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
          <button
            onClick={() => setTab('new')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === 'new' ? 'bg-pink-500/10 text-pink-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Flame size={14} /> New Pairs
          </button>
          <button
            onClick={() => setTab('trending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === 'trending' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <ArrowUpDown size={14} /> Trending
          </button>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'new' && (
            <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
              {(['all', '1h', '6h', '24h'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAgeFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    ageFilter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {f === 'all' ? 'All' : `<${f}`}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token..."
              className="w-44 pl-9 pr-3 py-2 bg-[#0d1220] border border-white/5 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/15"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('priceChange1h')}>Price</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('priceChange1h')}>1h %</th>
                <th className="py-2 px-2 text-center font-semibold">Chart</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('volume24h')}>Volume</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('liquidity')}>Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('marketCap')}>MCap</th>
                <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('holders')}>Holders</th>
                {tab === 'new' && <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('ageMinutes')}>Age</th>}
                {tab === 'trending' && <th className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('socialMentions')}>Social</th>}
                <th className="py-2 px-2 text-center font-semibold cursor-pointer hover:text-gray-300" onClick={() => toggleSort('aiScore')}>AI</th>
                <th className="py-2 px-2 text-center font-semibold">Risk</th>
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
                  columns={columns}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-600 text-sm">No tokens match your filters</div>
        )}
      </div>

      <div className="text-xs text-gray-600">
        Showing {filtered.length} tokens · Data updates every 5 seconds · {tab === 'new' ? 'Sorted by newest launches' : 'Sorted by recent volume'}
      </div>
    </div>
  );
}
