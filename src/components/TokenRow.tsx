import type { Token } from '@/lib/types';
import { formatPrice, formatUsd, formatNumber, formatAge, formatPercent, shortAddress } from '@/lib/utils';
import { Sparkline } from './Sparkline';
import { RiskBadge, ScoreBadge, ChangeBadge } from './Badges';
import { ExternalLink } from 'lucide-react';

interface TokenRowProps {
  token: Token;
  onClick?: () => void;
  onToggleWatch?: (token: Token) => void;
  isWatched?: boolean;
  columns?: string[];
}

export function TokenRow({ token, onClick, onToggleWatch, isWatched, columns = ['price', 'change', 'volume', 'liquidity', 'mcap', 'holders', 'score', 'risk'] }: TokenRowProps) {
  const show = (col: string) => columns.includes(col);

  return (
    <tr
      onClick={onClick}
      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
    >
      <td className="py-3 pl-4 pr-2 sticky left-0 bg-[#0a0e17] group-hover:bg-white/[0.03]">
        <div className="flex items-center gap-2">
          {onToggleWatch && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWatch(token); }}
              className={`text-xs transition-colors ${isWatched ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}`}
            >
              {isWatched ? '★' : '☆'}
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold">{token.symbol}</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-xs truncate max-w-[100px]">{token.name}</span>
              <a
                href={`https://dexscreener.com/solana/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-700 hover:text-emerald-400 transition-colors flex-shrink-0"
                title="View on DexScreener"
              >
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </td>
      {show('price') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatPrice(token.price)}</span>
        </td>
      )}
      {show('change') && (
        <td className="py-3 px-2 text-right">
          <ChangeBadge value={token.priceChange1h} />
        </td>
      )}
      {show('chart') && (
        <td className="py-3 px-2">
          <div className="flex justify-center">
            <Sparkline data={token.priceHistory.slice(-30)} width={100} height={32} />
          </div>
        </td>
      )}
      {show('volume') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.volume24h)}</span>
          <div className="text-[10px] text-gray-500 tabular-nums">{formatUsd(token.volume1h)}/h</div>
        </td>
      )}
      {show('liquidity') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.liquidity)}</span>
        </td>
      )}
      {show('mcap') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.marketCap)}</span>
        </td>
      )}
      {show('holders') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatNumber(token.holders)}</span>
          <div className="text-[10px] tabular-nums">
            <span className={token.holderGrowth1h > 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatPercent(token.holderGrowth1h)}/h
            </span>
          </div>
        </td>
      )}
      {show('txns') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatNumber(token.txns1h)}</span>
          <div className="text-[10px] text-gray-500 tabular-nums">{token.buyers1h}B / {token.sellers1h}S</div>
        </td>
      )}
      {show('age') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-400 text-sm tabular-nums">{formatAge(token.ageMinutes)}</span>
        </td>
      )}
      {show('social') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-200 text-sm tabular-nums">{formatNumber(token.socialMentions)}</span>
          <div className="text-[10px] tabular-nums">
            <span className={token.socialMentionsChange > 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatPercent(token.socialMentionsChange)}
            </span>
          </div>
        </td>
      )}
      {show('score') && (
        <td className="py-3 px-2 text-center">
          <ScoreBadge score={token.aiScore} />
        </td>
      )}
      {show('risk') && (
        <td className="py-3 px-2 text-center">
          <RiskBadge level={token.riskLevel} size="sm" />
        </td>
      )}
      {show('platform') && (
        <td className="py-3 px-2 text-right">
          <span className="text-gray-400 text-xs">{token.platform}</span>
        </td>
      )}
    </tr>
  );
}
