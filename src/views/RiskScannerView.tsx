import { useMemo, useState } from 'react';
import {
  Shield, AlertTriangle, ShieldAlert, ShieldCheck, Search
} from 'lucide-react';
import type { Token } from '@/lib/types';
import { TokenRow } from '@/components/TokenRow';
import { formatUsd, formatNumber } from '@/lib/utils';

interface RiskScannerViewProps {
  tokens: Token[];
  onSelectToken: (address: string) => void;
  isWatched: (address: string) => boolean;
  onToggleWatch: (token: Token) => void;
}

type RiskFilter = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'clean';

export function RiskScannerView({ tokens, onSelectToken, isWatched, onToggleWatch }: RiskScannerViewProps) {
  const [filter, setFilter] = useState<RiskFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...tokens];
    if (filter === 'critical') result = result.filter(t => t.riskFlags.some(f => f.severity === 'critical'));
    else if (filter === 'high') result = result.filter(t => t.riskFlags.some(f => f.severity === 'high'));
    else if (filter === 'medium') result = result.filter(t => t.riskFlags.some(f => f.severity === 'medium'));
    else if (filter === 'low') result = result.filter(t => t.riskFlags.some(f => f.severity === 'low'));
    else if (filter === 'clean') result = result.filter(t => t.riskFlags.length === 0);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
    }

    return result.sort((a, b) => b.riskScore - a.riskScore);
  }, [tokens, filter, search]);

  const riskStats = useMemo(() => {
    const critical = tokens.filter(t => t.riskFlags.some(f => f.severity === 'critical')).length;
    const high = tokens.filter(t => t.riskFlags.some(f => f.severity === 'high')).length;
    const flagged = tokens.filter(t => t.riskFlags.length > 0).length;
    const clean = tokens.filter(t => t.riskFlags.length === 0).length;
    return { critical, high, flagged, clean };
  }, [tokens]);

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert size={14} className="text-red-400" />;
      case 'high': return <AlertTriangle size={14} className="text-orange-400" />;
      case 'medium': return <AlertTriangle size={14} className="text-amber-400" />;
      case 'low': return <Shield size={14} className="text-sky-400" />;
      default: return <Shield size={14} className="text-gray-500" />;
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Risk Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0d1220] border border-red-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-red-400" />
            <span className="text-xs text-gray-500">Critical Risk</span>
          </div>
          <div className="text-xl font-bold text-red-400 tabular-nums">{riskStats.critical}</div>
        </div>
        <div className="bg-[#0d1220] border border-orange-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs text-gray-500">High Risk</span>
          </div>
          <div className="text-xl font-bold text-orange-400 tabular-nums">{riskStats.high}</div>
        </div>
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-amber-400" />
            <span className="text-xs text-gray-500">Total Flagged</span>
          </div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">{riskStats.flagged}</div>
        </div>
        <div className="bg-[#0d1220] border border-emerald-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-500">Clean</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">{riskStats.clean}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#0d1220] border border-white/5 rounded-lg flex-wrap">
          {(['all', 'critical', 'high', 'medium', 'low', 'clean'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
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

      {/* Risk Flags Table */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                <th className="py-2 pl-4 pr-2 text-left font-semibold sticky left-0 bg-[#0d1220]">Token</th>
                <th className="py-2 px-2 text-center font-semibold">Risk Score</th>
                <th className="py-2 px-2 text-center font-semibold">Level</th>
                <th className="py-2 px-2 text-right font-semibold">Liquidity</th>
                <th className="py-2 px-2 text-right font-semibold">MCap</th>
                <th className="py-2 px-2 text-right font-semibold">Holders</th>
                <th className="py-2 px-2 text-right font-semibold">Top Holder %</th>
                <th className="py-2 px-2 text-left font-semibold">Risk Flags</th>
                <th className="py-2 px-2 text-center font-semibold">AI Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(token => {
                const topHolderPct = token.topHolders[0]?.percentage ?? 0;
                return (
                  <tr
                    key={token.id}
                    onClick={() => onSelectToken(token.address)}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 pl-4 pr-2 sticky left-0 bg-[#0d1220] group-hover:bg-white/[0.03]">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-semibold">{token.symbol}</span>
                        <span className="text-gray-500 text-xs">{token.platform}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-sm font-bold tabular-nums ${
                        token.riskScore >= 70 ? 'text-red-400' :
                        token.riskScore >= 50 ? 'text-orange-400' :
                        token.riskScore >= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {token.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        token.riskLevel === 'high-risk' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        token.riskLevel === 'extended' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        token.riskLevel === 'developing' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {token.riskLevel === 'high-risk' ? 'High Risk' :
                         token.riskLevel === 'extended' ? 'Extended' :
                         token.riskLevel === 'developing' ? 'Developing' : 'Early'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.liquidity)}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-gray-200 text-sm tabular-nums">{formatUsd(token.marketCap)}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-gray-200 text-sm tabular-nums">{formatNumber(token.holders)}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`text-sm font-semibold tabular-nums ${topHolderPct > 15 ? 'text-red-400' : topHolderPct > 10 ? 'text-amber-400' : 'text-gray-300'}`}>
                        {topHolderPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {token.riskFlags.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                            <ShieldCheck size={12} /> No flags
                          </span>
                        ) : (
                          token.riskFlags.slice(0, 3).map((flag, i) => (
                            <span key={i} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${severityColor(flag.severity)}`}>
                              {severityIcon(flag.severity)}
                              <span className="truncate max-w-[100px]">{flag.type.replace(/_/g, ' ')}</span>
                            </span>
                          ))
                        )}
                        {token.riskFlags.length > 3 && (
                          <span className="text-[10px] text-gray-500">+{token.riskFlags.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-sm font-bold tabular-nums ${token.aiScore >= 75 ? 'text-emerald-400' : token.aiScore >= 50 ? 'text-sky-400' : token.aiScore >= 30 ? 'text-amber-400' : 'text-red-400'}`}>
                        {token.aiScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-600 text-sm">No tokens match this filter</div>
        )}
      </div>
    </div>
  );
}
