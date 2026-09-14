import { Star, Trash2, Eye } from 'lucide-react';
import type { Token } from '@/lib/types';
import type { WatchlistItem } from '@/lib/useWatchlist';
import { formatPrice, formatUsd, formatNumber, formatAge, formatPercent } from '@/lib/utils';
import { Sparkline } from '@/components/Sparkline';
import { RiskBadge, ChangeBadge, ScoreBadge } from '@/components/Badges';

interface WatchlistViewProps {
  watchlist: WatchlistItem[];
  tokens: Token[];
  onSelectToken: (address: string) => void;
  onRemove: (token: Token) => void;
}

export function WatchlistView({ watchlist, tokens, onSelectToken, onRemove }: WatchlistViewProps) {
  const watchedTokens = watchlist
    .map(w => tokens.find(t => t.address === w.token_address))
    .filter((t): t is Token => t !== undefined);

  if (watchedTokens.length === 0) {
    return (
      <div className="bg-[#0d1220] border border-white/5 rounded-xl p-12 text-center">
        <Star size={28} className="text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Your watchlist is empty</p>
        <p className="text-xs text-gray-600 mt-1">Click the star icon next to any token to add it to your watchlist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Star size={16} className="text-amber-400" />
        <span>Tracking {watchedTokens.length} tokens</span>
      </div>

      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold">Token</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold">1h %</th>
                <th className="py-2 px-2 text-center font-semibold">Chart</th>
                <th className="py-2 px-2 text-right font-semibold">Volume</th>
                <th className="py-2 px-2 text-right font-semibold">Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold">Holders</th>
                <th className="py-2 px-2 text-right font-semibold">Age</th>
                <th className="py-2 px-2 text-center font-semibold">AI</th>
                <th className="py-2 px-2 text-center font-semibold">Risk</th>
                <th className="py-2 px-2 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {watchedTokens.map(token => (
                <tr
                  key={token.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  onClick={() => onSelectToken(token.address)}
                >
                  <td className="py-3 pl-4 pr-2">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-semibold">{token.symbol}</span>
                        <span className="text-gray-500 text-xs truncate max-w-[120px]">{token.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{formatPrice(token.price)}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <ChangeBadge value={token.priceChange1h} />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <Sparkline data={token.priceHistory.slice(-30)} width={100} height={32} />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.volume24h)}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.liquidity)}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-200 text-sm tabular-nums">{formatNumber(token.holders)}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-400 text-sm tabular-nums">{formatAge(token.ageMinutes)}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <ScoreBadge score={token.aiScore} size="sm" />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <RiskBadge level={token.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemove(token); }}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
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
