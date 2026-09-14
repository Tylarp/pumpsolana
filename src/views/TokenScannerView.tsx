import { useMemo, useState } from 'react';
import {
  ArrowLeft, Star, Bell, ExternalLink, Copy, Globe, MessageCircle, Send,
  TrendingUp, TrendingDown, Users, Droplets, Volume2, Activity,
  Wallet, MessageSquare, Shield, ShieldAlert, Radar, Zap,
  CheckCircle2, AlertTriangle, Brain
} from 'lucide-react';
import type { Token, AlertRule } from '@/lib/types';
import { PriceChart } from '@/components/PriceChart';
import { Sparkline } from '@/components/Sparkline';
import { ScoreRing } from '@/components/ScoreRing';
import { RiskBadge, ChangeBadge } from '@/components/Badges';
import {
  formatPrice, formatUsd, formatNumber, formatPercent, formatAge,
  shortAddress, timeAgo, scoreColor
} from '@/lib/utils';

interface TokenScannerViewProps {
  token: Token;
  onBack: () => void;
  isWatched: boolean;
  onToggleWatch: () => void;
  onCreateAlert: (tokenAddress: string, tokenSymbol: string, tokenName: string, alertType: AlertRule['alert_type'], threshold: string) => Promise<boolean>;
}

type Tab = 'overview' | 'holders' | 'txns' | 'wallets' | 'social' | 'risk' | 'ai';

export function TokenScannerView({ token, onBack, isWatched, onToggleWatch, onCreateAlert }: TokenScannerViewProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [copied, setCopied] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Price', value: formatPrice(token.price), icon: Activity, color: 'text-white', change: token.priceChange1h },
    { label: 'Market Cap', value: formatUsd(token.marketCap), icon: Zap, color: 'text-sky-400' },
    { label: 'Liquidity', value: formatUsd(token.liquidity), icon: Droplets, color: 'text-amber-400' },
    { label: '24h Volume', value: formatUsd(token.volume24h), icon: Volume2, color: 'text-emerald-400' },
    { label: 'Holders', value: formatNumber(token.holders), icon: Users, color: 'text-violet-400', change: token.holderGrowth1h },
    { label: 'Age', value: formatAge(token.ageMinutes), icon: TrendingUp, color: 'text-gray-300' },
    { label: 'Txns (1h)', value: formatNumber(token.txns1h), icon: Activity, color: 'text-pink-400', sub: `${token.buyers1h}B / ${token.sellers1h}S` },
    { label: 'Social', value: formatNumber(token.socialMentions), icon: MessageSquare, color: 'text-sky-400', change: token.socialMentionsChange },
  ];

  const timeframes = [
    { label: '1m', value: token.priceChange1m },
    { label: '5m', value: token.priceChange5m },
    { label: '15m', value: token.priceChange15m },
    { label: '1h', value: token.priceChange1h },
    { label: '24h', value: token.priceChange24h },
  ];

  const tabs: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'holders', label: 'Holders', icon: Users },
    { key: 'txns', label: 'Transactions', icon: TrendingUp },
    { key: 'wallets', label: 'Wallet Activity', icon: Wallet },
    { key: 'social', label: 'Social', icon: MessageSquare },
    { key: 'risk', label: 'Risk', icon: Shield },
    { key: 'ai', label: 'AI Analysis', icon: Brain },
  ];

  const walletTypeColor = (type: string) => {
    switch (type) {
      case 'smart': return 'text-emerald-400 bg-emerald-500/10';
      case 'whale': return 'text-sky-400 bg-sky-500/10';
      case 'sniper': return 'text-amber-400 bg-amber-500/10';
      case 'dump': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleWatch}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isWatched
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'text-gray-400 border-white/10 hover:bg-white/5'
            }`}
          >
            <Star size={14} className={isWatched ? 'fill-amber-400' : ''} /> {isWatched ? 'Watched' : 'Watch'}
          </button>
          <button
            onClick={() => setShowAlertForm(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-medium hover:bg-sky-500/20 transition-all"
          >
            <Bell size={14} /> Alert
          </button>
        </div>
      </div>

      {/* Alert Form */}
      {showAlertForm && (
        <div className="bg-[#0d1220] border border-sky-500/15 rounded-xl p-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Quick alert:</span>
          {[
            { label: 'Volume +100%', type: 'volume' as const, threshold: '+100%' },
            { label: 'Holders +50', type: 'holders' as const, threshold: '+50 holders' },
            { label: 'Liquidity > $100K', type: 'liquidity' as const, threshold: '>$100K' },
            { label: 'Social > 1000', type: 'social' as const, threshold: '>1000 mentions' },
          ].map(a => (
            <button
              key={a.label}
              onClick={async () => {
                await onCreateAlert(token.address, token.symbol, token.name, a.type, a.threshold);
                setShowAlertForm(false);
              }}
              className="px-2 py-1 rounded-md text-[11px] bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all font-medium"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Token Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center text-lg font-bold text-emerald-300">
          {token.symbol.slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{token.symbol}</h2>
            <span className="text-sm text-gray-500">{token.name}</span>
            {token.graduated && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Graduated
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={copyAddress} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {shortAddress(token.address)} {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{token.platform}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <a href={`https://solscan.io/token/${token.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-sky-400 transition-colors">
              <ExternalLink size={11} /> Solscan
            </a>
            <a href={`https://dexscreener.com/solana/${token.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-emerald-400 transition-colors">
              <ExternalLink size={11} /> DexScreener
            </a>
            <a href={`https://birdeye.so/token/${token.address}?chain=solana`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-amber-400 transition-colors">
              <ExternalLink size={11} /> Birdeye
            </a>
            <a href={`https://jup.ag/swap/SOL-${token.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-400 transition-colors">
              <ExternalLink size={11} /> Jupiter
            </a>
            {token.website && (
              <a href={token.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
                <Globe size={11} /> Website
              </a>
            )}
            {token.twitter && (
              <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-sky-400 transition-colors">
                <MessageCircle size={11} /> X
              </a>
            )}
            {token.telegram && (
              <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-sky-400 transition-colors">
                <Send size={11} /> Telegram
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing score={token.aiScore} size={56} strokeWidth={4} label="AI" />
          <RiskBadge level={token.riskLevel} />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#0d1220] border border-white/5 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} className={card.color} />
                <span className="text-[10px] text-gray-500">{card.label}</span>
              </div>
              <div className={`text-sm font-bold ${card.color} tabular-nums`}>{card.value}</div>
              {card.change !== undefined && (
                <div className="text-[10px] mt-0.5">
                  <ChangeBadge value={card.change} />
                </div>
              )}
              {card.sub && <div className="text-[10px] text-gray-600 mt-0.5">{card.sub}</div>}
            </div>
          );
        })}
      </div>

      {/* Price Chart + Timeframes */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 p-1 bg-[#0a0e17] rounded-lg">
            {timeframes.map(tf => (
              <button
                key={tf.label}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-500 hover:text-gray-300"
              >
                {tf.label} <span className={tf.value > 0 ? 'text-emerald-400' : 'text-red-400'}>{formatPercent(tf.value)}</span>
              </button>
            ))}
          </div>
        </div>
        <PriceChart data={token.priceHistory} height={220} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg w-fit flex-wrap">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t.key ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Volume History</h3>
            <Sparkline data={token.volumeHistory} width={400} height={80} color="#0ea5e9" />
          </div>
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Holder Growth</h3>
            <Sparkline data={token.holderHistory} width={400} height={80} color="#10b981" />
          </div>
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Recent Transactions</h3>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {token.recentTxns.slice(0, 8).map(tx => (
                <div key={tx.hash} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${tx.type === 'buy' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      {tx.type === 'buy' ? <TrendingUp size={10} className="text-emerald-400" /> : <TrendingDown size={10} className="text-red-400" />}
                    </span>
                    <span className="text-gray-400">{shortAddress(tx.wallet)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="tabular-nums">{formatUsd(tx.amountUsd)}</span>
                    <span className="text-gray-600">{timeAgo(tx.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Top Holders</h3>
            <div className="space-y-1.5">
              {token.topHolders.slice(0, 5).map((holder, i) => (
                <div key={holder.address} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 w-4">{i + 1}</span>
                    <span className="text-gray-400">{shortAddress(holder.address)}</span>
                    {holder.isInsider && <span className="text-[9px] text-amber-400 px-1 py-0.5 bg-amber-500/10 rounded">Insider</span>}
                    {holder.isContract && <span className="text-[9px] text-red-400 px-1 py-0.5 bg-red-500/10 rounded">Contract</span>}
                  </div>
                  <span className={`font-semibold tabular-nums ${holder.percentage > 15 ? 'text-red-400' : 'text-gray-300'}`}>
                    {holder.percentage.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'holders' && (
        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold">#</th>
                <th className="py-2 px-2 text-left font-semibold">Address</th>
                <th className="py-2 px-2 text-right font-semibold">Balance</th>
                <th className="py-2 px-2 text-right font-semibold">% of Supply</th>
                <th className="py-2 px-2 text-center font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody>
              {token.topHolders.map((holder, i) => (
                <tr key={holder.address} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pl-4 pr-2 text-gray-500 text-sm">{i + 1}</td>
                  <td className="py-3 px-2 text-gray-300 text-sm font-mono">{shortAddress(holder.address, 6)}</td>
                  <td className="py-3 px-2 text-right text-gray-300 text-sm tabular-nums">{formatNumber(holder.balance)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${holder.percentage > 15 ? 'text-red-400' : holder.percentage > 10 ? 'text-amber-400' : 'text-gray-300'}`}>
                      {holder.percentage.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {holder.isInsider && <span className="text-[9px] text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded">Insider</span>}
                      {holder.isContract && <span className="text-[9px] text-red-400 px-1.5 py-0.5 bg-red-500/10 rounded">Contract</span>}
                      {!holder.isInsider && !holder.isContract && <span className="text-[10px] text-gray-600">—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'txns' && (
        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold">Type</th>
                <th className="py-2 px-2 text-left font-semibold">Tx Hash</th>
                <th className="py-2 px-2 text-left font-semibold">Wallet</th>
                <th className="py-2 px-2 text-right font-semibold">Amount (USD)</th>
                <th className="py-2 px-2 text-right font-semibold">Token Amount</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {token.recentTxns.map(tx => (
                <tr key={tx.hash} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pl-4 pr-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      tx.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.type === 'buy' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-xs font-mono">{shortAddress(tx.hash, 6)}</td>
                  <td className="py-3 px-2 text-gray-400 text-xs font-mono">{shortAddress(tx.wallet, 6)}</td>
                  <td className="py-3 px-2 text-right text-gray-200 text-sm tabular-nums">{formatUsd(tx.amountUsd)}</td>
                  <td className="py-3 px-2 text-right text-gray-400 text-sm tabular-nums">{formatNumber(tx.tokenAmount)}</td>
                  <td className="py-3 px-2 text-right text-gray-400 text-sm tabular-nums">{formatPrice(tx.price)}</td>
                  <td className="py-3 px-2 text-right text-gray-600 text-xs">{timeAgo(tx.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'wallets' && (
        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold">Type</th>
                <th className="py-2 px-2 text-left font-semibold">Address</th>
                <th className="py-2 px-2 text-left font-semibold">Label</th>
                <th className="py-2 px-2 text-right font-semibold">PnL %</th>
                <th className="py-2 px-2 text-right font-semibold">Buy Amount</th>
                <th className="py-2 px-2 text-right font-semibold">Sell Amount</th>
                <th className="py-2 px-2 text-right font-semibold">Txns</th>
                <th className="py-2 px-2 text-right font-semibold">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {token.walletActivity.map(w => (
                <tr key={w.address} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pl-4 pr-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${walletTypeColor(w.type)}`}>
                      {w.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-400 text-xs font-mono">{shortAddress(w.address, 6)}</td>
                  <td className="py-3 px-2 text-gray-300 text-sm">{w.label}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${w.pnlPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {w.pnlPercent > 0 ? '+' : ''}{w.pnlPercent.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right text-gray-200 text-sm tabular-nums">{formatUsd(w.buyAmount)}</td>
                  <td className="py-3 px-2 text-right text-gray-200 text-sm tabular-nums">{formatUsd(w.sellAmount)}</td>
                  <td className="py-3 px-2 text-right text-gray-300 text-sm tabular-nums">{w.txns}</td>
                  <td className="py-3 px-2 text-right text-gray-600 text-xs">{timeAgo(w.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Social Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mentions</span>
                <span className="text-white font-semibold tabular-nums">{formatNumber(token.socialMentions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mention Change</span>
                <ChangeBadge value={token.socialMentionsChange} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sentiment</span>
                <span className={`font-semibold ${token.socialSentiment > 0.2 ? 'text-emerald-400' : token.socialSentiment < -0.2 ? 'text-red-400' : 'text-gray-400'}`}>
                  {token.socialSentiment > 0.2 ? 'Bullish' : token.socialSentiment < -0.2 ? 'Bearish' : 'Neutral'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sentiment Score</span>
                <span className="text-white font-semibold tabular-nums">{token.socialSentiment.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Recent Social Posts</h3>
            <div className="space-y-2">
              {token.socialPosts.map(post => (
                <div key={post.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{post.author}</span>
                    <span className="text-xs text-gray-600">{timeAgo(post.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                    <span>{post.likes} likes</span>
                    <span>{post.retweets} retweets</span>
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'risk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4 text-center">
              <ShieldAlert size={28} className={`mx-auto mb-2 ${token.riskScore >= 70 ? 'text-red-400' : token.riskScore >= 50 ? 'text-orange-400' : token.riskScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`} />
              <div className={`text-2xl font-bold tabular-nums ${token.riskScore >= 70 ? 'text-red-400' : token.riskScore >= 50 ? 'text-orange-400' : token.riskScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {token.riskScore}
              </div>
              <div className="text-xs text-gray-500 mt-1">Risk Score</div>
            </div>
            <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4 text-center">
              <Users size={28} className="text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white tabular-nums">{token.topHolders[0]?.percentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Top Holder Concentration</div>
            </div>
            <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4 text-center">
              <Droplets size={28} className="text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white tabular-nums">{((token.liquidity / token.marketCap) * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Liquidity / MCap Ratio</div>
            </div>
          </div>

          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Risk Flags</h3>
            {token.riskFlags.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400 py-4">
                <CheckCircle2 size={16} /> No risk flags detected
              </div>
            ) : (
              <div className="space-y-2">
                {token.riskFlags.map((flag, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    flag.severity === 'critical' ? 'bg-red-500/5 border-red-500/15' :
                    flag.severity === 'high' ? 'bg-orange-500/5 border-orange-500/15' :
                    flag.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/15' :
                    'bg-sky-500/5 border-sky-500/15'
                  }`}>
                    {flag.severity === 'critical' ? <ShieldAlert size={16} className="text-red-400" /> :
                     flag.severity === 'high' ? <AlertTriangle size={16} className="text-orange-400" /> :
                     flag.severity === 'medium' ? <AlertTriangle size={16} className="text-amber-400" /> :
                     <Shield size={16} className="text-sky-400" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{flag.type.replace(/_/g, ' ')}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase ${
                          flag.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                          flag.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          flag.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-sky-500/10 text-sky-400'
                        }`}>
                          {flag.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{flag.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#0d1220] to-[#101725] border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-teal-400" />
              <h3 className="text-sm font-bold text-white">AI Analysis — {token.symbol}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">AI Generated</span>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <ScoreRing score={token.aiScore} size={80} strokeWidth={6} label="Signal" />
              <div className="flex-1 space-y-1.5">
                {[
                  { label: 'Price Momentum', score: Math.min(100, Math.max(0, 50 + token.priceChange1h * 2)), weight: 25 },
                  { label: 'Volume Acceleration', score: Math.min(100, Math.max(0, (token.volume1h / token.marketCap) * 100)), weight: 20 },
                  { label: 'Liquidity Depth', score: Math.min(100, Math.max(0, (token.liquidity / token.marketCap) * 200)), weight: 15 },
                  { label: 'Holder Growth', score: Math.min(100, Math.max(0, token.holderGrowth1h * 3 + 40)), weight: 15 },
                  { label: 'Wallet Activity', score: Math.min(100, Math.max(0, token.txns1h / 20)), weight: 10 },
                  { label: 'Social Activity', score: Math.min(100, Math.max(0, token.socialMentions / 5)), weight: 15 },
                ].map(factor => (
                  <div key={factor.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-32 flex-shrink-0">{factor.label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${factor.score >= 75 ? 'bg-emerald-500' : factor.score >= 50 ? 'bg-sky-500' : factor.score >= 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{factor.score.toFixed(0)}</span>
                    <span className="text-[10px] text-gray-600 w-8 text-right">{factor.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-teal-400 font-semibold">Summary: </span>
                {token.symbol} has an AI Signal Score of <span className={scoreColor(token.aiScore)}>{token.aiScore}</span>, indicating a <span className="text-white font-medium">{token.riskLevel}</span> profile.
                {' '}Price momentum is {token.priceChange1h > 0 ? 'positive' : 'negative'} ({formatPercent(token.priceChange1h)} in 1h).
                {' '}Holder count is {token.holderGrowth1h > 0 ? 'growing' : 'declining'} at {formatPercent(token.holderGrowth1h)}/h.
                {' '}Social sentiment is {token.socialSentiment > 0.2 ? 'bullish' : token.socialSentiment < -0.2 ? 'bearish' : 'neutral'}.
                {token.riskFlags.length > 0 && ` ${token.riskFlags.length} risk flag${token.riskFlags.length > 1 ? 's' : ''} detected — exercise caution.`}
                {' '}This score is a heuristic estimate and does not guarantee future price movement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
