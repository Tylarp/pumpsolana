import { useMemo, useState, useEffect } from 'react';
import {
  Bot, TrendingUp, TrendingDown, Minus, Heart, Repeat2, MessageCircle,
  Eye, BadgeCheck, Flame, Users, Search, ExternalLink
} from 'lucide-react';
import type { Tweet, TwitterTrend, NotableAccount } from '@/lib/types';
import { getTweets, getTwitterTrends, getNotableAccounts } from '@/lib/mockData';
import { formatNumber, timeAgo } from '@/lib/utils';

export function TwitterView() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [trends, setTrends] = useState<TwitterTrend[]>([]);
  const [accounts, setAccounts] = useState<NotableAccount[]>([]);
  const [tab, setTab] = useState<'feed' | 'trends' | 'accounts'>('feed');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTweets(getTweets(25));
    setTrends(getTwitterTrends());
    setAccounts(getNotableAccounts());

    const interval = setInterval(() => {
      setTweets(getTweets(25));
      setTrends(getTwitterTrends());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredTweets = useMemo(() => {
    let result = tweets;
    if (sentimentFilter !== 'all') result = result.filter(t => t.sentiment === sentimentFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.content.toLowerCase().includes(q) || t.tokensMentioned.some(tk => tk.toLowerCase().includes(q)));
    }
    return result;
  }, [tweets, sentimentFilter, search]);

  const sentimentStats = useMemo(() => {
    const bullish = tweets.filter(t => t.sentiment === 'bullish').length;
    const bearish = tweets.filter(t => t.sentiment === 'bearish').length;
    const neutral = tweets.filter(t => t.sentiment === 'neutral').length;
    const total = tweets.length || 1;
    return {
      bullish: (bullish / total) * 100,
      bearish: (bearish / total) * 100,
      neutral: (neutral / total) * 100,
      bullishCount: bullish,
      bearishCount: bearish,
    };
  }, [tweets]);

  const sentimentIcon = (s: Tweet['sentiment']) => {
    if (s === 'bullish') return <TrendingUp size={12} className="text-emerald-400" />;
    if (s === 'bearish') return <TrendingDown size={12} className="text-red-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  const sentimentColor = (s: Tweet['sentiment']) => {
    if (s === 'bullish') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s === 'bearish') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <Bot size={14} className="text-sky-400 flex-shrink-0" />
        <p className="text-xs text-gray-500">
          Read-only monitoring of public X/Twitter discussions from real Solana memecoin accounts. No account is created or operated. Post engagement metrics are simulated; profiles and content are modeled on real accounts.
        </p>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-500">Bullish</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">{sentimentStats.bullish.toFixed(0)}%</div>
          <div className="text-[10px] text-gray-600">{sentimentStats.bullishCount} posts</div>
        </div>
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-xs text-gray-500">Bearish</span>
          </div>
          <div className="text-xl font-bold text-red-400 tabular-nums">{sentimentStats.bearish.toFixed(0)}%</div>
          <div className="text-[10px] text-gray-600">{sentimentStats.bearishCount} posts</div>
        </div>
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-amber-400" />
            <span className="text-xs text-gray-500">Trending Tokens</span>
          </div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">{trends.length}</div>
          <div className="text-[10px] text-gray-600">discussed now</div>
        </div>
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-sky-400" />
            <span className="text-xs text-gray-500">Notable Accounts</span>
          </div>
          <div className="text-xl font-bold text-sky-400 tabular-nums">{accounts.length}</div>
          <div className="text-[10px] text-gray-600">being tracked</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg w-fit">
        {([
          { key: 'feed' as const, label: 'Live Feed' },
          { key: 'trends' as const, label: 'Trending Tokens' },
          { key: 'accounts' as const, label: 'Notable Accounts' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t.key ? 'bg-sky-500/10 text-sky-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feed Tab */}
      {tab === 'feed' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg">
              {(['all', 'bullish', 'bearish', 'neutral'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                    sentimentFilter === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts or tokens..."
                className="w-56 pl-9 pr-3 py-2 bg-[#0d1220] border border-white/5 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredTweets.map(tweet => (
              <div key={tweet.id} className="bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <a href={tweet.profileUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0 hover:from-sky-500/30 hover:to-blue-600/30 transition-all">
                    {tweet.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </a>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <a href={tweet.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-sky-400 transition-colors">
                        {tweet.author}
                      </a>
                      {tweet.verified && <BadgeCheck size={14} className="text-sky-400" />}
                      <a href={tweet.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                        @{tweet.handle}
                      </a>
                      <span className="text-xs text-gray-600">· {timeAgo(tweet.timestamp)}</span>
                    </div>
                    <a href={tweet.postUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <p className="text-sm text-gray-300 mt-1 leading-relaxed hover:text-gray-200 transition-colors">{tweet.content}</p>
                    </a>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${sentimentColor(tweet.sentiment)}`}>
                        {sentimentIcon(tweet.sentiment)}
                        <span className="capitalize">{tweet.sentiment}</span>
                      </span>
                      {tweet.tokensMentioned.map(tk => (
                        <span key={tk} className="text-[10px] text-sky-400 font-medium">${tk}</span>
                      ))}
                      <span className="text-[10px] text-gray-600 ml-auto">Influence: {tweet.influenceScore}/100</span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Heart size={12} /> {formatNumber(tweet.likes)}</span>
                      <span className="flex items-center gap-1"><Repeat2 size={12} /> {formatNumber(tweet.retweets)}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {formatNumber(tweet.replies)}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(tweet.views)}</span>
                      <a href={tweet.postUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-gray-700 hover:text-sky-400 transition-colors flex items-center gap-1">
                        <ExternalLink size={11} /> View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {tab === 'trends' && (
        <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold">#</th>
                <th className="py-2 px-2 text-left font-semibold">Token</th>
                <th className="py-2 px-2 text-right font-semibold">Mentions</th>
                <th className="py-2 px-2 text-right font-semibold">Change</th>
                <th className="py-2 px-2 text-right font-semibold">Unique Accounts</th>
                <th className="py-2 px-2 text-center font-semibold">Sentiment</th>
                <th className="py-2 px-2 text-left font-semibold">Top Post</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, idx) => (
                <tr key={trend.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-4 pr-2">
                    <span className="text-gray-500 text-sm tabular-nums">{idx + 1}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sky-400 text-sm font-semibold">{trend.term}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-white text-sm font-semibold tabular-nums">{formatNumber(trend.mentions)}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${trend.mentionsChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trend.mentionsChange > 0 ? '+' : ''}{trend.mentionsChange.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-gray-300 text-sm tabular-nums">{trend.uniqueAccounts}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${sentimentColor(trend.sentiment)}`}>
                      {sentimentIcon(trend.sentiment)}
                      <span className="capitalize">{trend.sentiment}</span>
                    </span>
                  </td>
                  <td className="py-3 px-2 max-w-md">
                    <p className="text-xs text-gray-400 truncate">{trend.topPost.content}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accounts Tab */}
      {tab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map(account => (
            <div key={account.id} className="bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
              <div className="flex items-start gap-3">
                <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center text-base font-bold text-sky-300 flex-shrink-0 hover:from-sky-500/30 hover:to-blue-600/30 transition-all">
                  {account.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-sky-400 transition-colors">
                      {account.name}
                    </a>
                    {account.verified && <BadgeCheck size={14} className="text-sky-400" />}
                  </div>
                  <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                    @{account.handle} · {formatNumber(account.followers)} followers
                  </a>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{account.bio}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      account.category === 'alpha-caller' ? 'bg-amber-500/10 text-amber-400' :
                      account.category === 'whale' ? 'bg-sky-500/10 text-sky-400' :
                      account.category === 'influencer' ? 'bg-pink-500/10 text-pink-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {account.category.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{account.recentCall}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">Call Accuracy: <span className="text-white font-semibold tabular-nums">{account.callAccuracy.toFixed(0)}%</span></span>
                      <span className="text-gray-500">Avg Engagement: <span className="text-white font-semibold tabular-nums">{formatNumber(account.avgEngagement)}</span></span>
                    </div>
                    <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-sky-400 transition-colors flex items-center gap-1">
                      <ExternalLink size={11} /> Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
