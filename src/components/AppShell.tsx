import { useState, useMemo } from 'react';
import {
  LayoutDashboard, Flame, GraduationCap, Users, TrendingUp, Bot,
  Shield, Bell, Star, ScanSearch, Radar, Activity
} from 'lucide-react';
import { OverviewView } from '@/views/OverviewView';
import { TrendingView } from '@/views/TrendingView';
import { GraduatedView } from '@/views/GraduatedView';
import { MostHeldView } from '@/views/MostHeldView';
import { TopMoversView } from '@/views/TopMoversView';
import { AISignalView } from '@/views/AISignalView';
import TwitterView from '@/views/TwitterView';
import { RiskScannerView } from '@/views/RiskScannerView';
import { AlertsView } from '@/views/AlertsView';
import { WatchlistView } from '@/views/WatchlistView';
import { TokenScannerView } from '@/views/TokenScannerView';
import { useTokens } from '@/lib/useTokens';
import { useWatchlist } from '@/lib/useWatchlist';
import { useAlerts } from '@/lib/useAlerts';

export type ViewKey =
  | 'overview' | 'trending' | 'graduated' | 'mostheld' | 'movers'
  | 'aisignal' | 'twitter' | 'risk' | 'alerts' | 'watchlist'
  | 'scanner';

interface AppShellProps {
  selectedTokenAddress: string | null;
  onSelectToken: (address: string | null) => void;
}

const NAV_GROUPS: { label: string; items: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    label: 'Intelligence',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutDashboard },
      { key: 'trending', label: 'Trending / New Pairs', icon: Flame },
      { key: 'graduated', label: 'Graduated', icon: GraduationCap },
      { key: 'mostheld', label: 'Most Held', icon: Users },
      { key: 'movers', label: 'Top Movers', icon: TrendingUp },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { key: 'aisignal', label: 'AI Signal Score', icon: Radar },
      { key: 'twitter', label: 'X / Twitter Monitor', icon: Bot },
      { key: 'risk', label: 'Risk Scanner', icon: Shield },
    ],
  },
  {
    label: 'Tracking',
    items: [
      { key: 'alerts', label: 'Alerts', icon: Bell },
      { key: 'watchlist', label: 'Watchlist', icon: Star },
    ],
  },
];

export function AppShell({ selectedTokenAddress, onSelectToken }: AppShellProps) {
  const [view, setView] = useState<ViewKey>('overview');
  const { tokens, lastUpdate } = useTokens(5000);
  const { watchlist, isWatched, toggleWatch } = useWatchlist();
  const { alerts, createAlert, deleteAlert } = useAlerts();

  const selectedToken = useMemo(() => {
    if (!selectedTokenAddress) return null;
    return tokens.find(t => t.address === selectedTokenAddress) ?? null;
  }, [tokens, selectedTokenAddress]);

  const handleNavigate = (key: ViewKey) => {
    onSelectToken(null);
    setView(key);
  };

  const handleSelectToken = (address: string) => {
    onSelectToken(address);
  };

  const alertCount = alerts.filter(a => !a.triggered).length + alerts.filter(a => a.triggered).length;
  const watchCount = watchlist.length;

  const renderView = () => {
    if (selectedToken) {
      return (
        <TokenScannerView
          token={selectedToken}
          onBack={() => handleNavigate('overview')}
          isWatched={isWatched(selectedToken.address)}
          onToggleWatch={() => toggleWatch(selectedToken)}
          onCreateAlert={createAlert}
        />
      );
    }

    switch (view) {
      case 'overview':
        return <OverviewView tokens={tokens} onSelectToken={handleSelectToken} onNavigate={handleNavigate} lastUpdate={lastUpdate} />;
      case 'trending':
        return <TrendingView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'graduated':
        return <GraduatedView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'mostheld':
        return <MostHeldView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'movers':
        return <TopMoversView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'aisignal':
        return <AISignalView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'twitter':
        return <TwitterView />;
      case 'risk':
        return <RiskScannerView tokens={tokens} onSelectToken={handleSelectToken} isWatched={isWatched} onToggleWatch={toggleWatch} />;
      case 'alerts':
        return <AlertsView tokens={tokens} alerts={alerts} onCreateAlert={createAlert} onDeleteAlert={deleteAlert} onSelectToken={handleSelectToken} />;
      case 'watchlist':
        return <WatchlistView watchlist={watchlist} tokens={tokens} onSelectToken={handleSelectToken} onRemove={toggleWatch} />;
      default:
        return <OverviewView tokens={tokens} onSelectToken={handleSelectToken} onNavigate={handleNavigate} lastUpdate={lastUpdate} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0e17] text-gray-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0d1220]">
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white">PumpR</span>
            <span className="text-[10px] text-gray-500">Solana Memecoin Intel</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = view === item.key && !selectedToken;
                  const badge = item.key === 'alerts' ? alertCount : item.key === 'watchlist' ? watchCount : 0;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavigate(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-gray-500'} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-400'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-gray-500">Live data streaming</span>
          </div>
          <p className="mt-2 px-2 text-[9px] text-gray-700 leading-tight">
            AI scores are heuristic estimates, not financial advice. No score guarantees price appreciation.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0a0e17]/95 backdrop-blur-sm z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ScanSearch size={18} className="text-emerald-400" />
            <h1 className="text-sm font-semibold text-white">
              {selectedToken ? `${selectedToken.symbol} Scanner` : NAV_GROUPS.flatMap(g => g.items).find(i => i.key === view)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {tokens.length} tokens tracked
            </span>
            <span>Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
