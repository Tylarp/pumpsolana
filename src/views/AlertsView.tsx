import { useState } from 'react';
import { Bell, Plus, Trash2, AlertCircle, CheckCircle2, Volume2, Users, Droplets, MessageSquare } from 'lucide-react';
import type { Token, AlertRule } from '@/lib/types';
import { formatUsd, formatNumber, timeAgo } from '@/lib/utils';

interface AlertsViewProps {
  tokens: Token[];
  alerts: AlertRule[];
  onCreateAlert: (tokenAddress: string, tokenSymbol: string, tokenName: string, alertType: AlertRule['alert_type'], threshold: string) => Promise<boolean>;
  onDeleteAlert: (id: string) => Promise<void>;
  onSelectToken: (address: string) => void;
}

export function AlertsView({ tokens, alerts, onCreateAlert, onDeleteAlert, onSelectToken }: AlertsViewProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState('');
  const [alertType, setAlertType] = useState<AlertRule['alert_type']>('volume');
  const [threshold, setThreshold] = useState('');

  const triggeredAlerts = alerts.filter(a => a.triggered);
  const activeAlerts = alerts.filter(a => !a.triggered);

  const handleSubmit = async () => {
    if (!selectedTokenAddress || !threshold) return;
    const token = tokens.find(t => t.address === selectedTokenAddress);
    if (!token) return;
    const success = await onCreateAlert(token.address, token.symbol, token.name, alertType, threshold);
    if (success) {
      setShowCreate(false);
      setSelectedTokenAddress('');
      setThreshold('');
    }
  };

  const alertTypeIcon = (type: AlertRule['alert_type']) => {
    switch (type) {
      case 'volume': return <Volume2 size={14} className="text-sky-400" />;
      case 'holders': return <Users size={14} className="text-emerald-400" />;
      case 'liquidity': return <Droplets size={14} className="text-amber-400" />;
      case 'social': return <MessageSquare size={14} className="text-pink-400" />;
    }
  };

  const alertTypeLabel = (type: AlertRule['alert_type']) => {
    switch (type) {
      case 'volume': return 'Volume Spike';
      case 'holders': return 'Holder Growth';
      case 'liquidity': return 'Liquidity Change';
      case 'social': return 'Social Traction';
    }
  };

  const quickAlerts = [
    { label: 'Volume > $100K', type: 'volume' as const, threshold: '$100K' },
    { label: 'Holders +50%', type: 'holders' as const, threshold: '+50%' },
    { label: 'Liquidity > $50K', type: 'liquidity' as const, threshold: '$50K' },
    { label: 'Social > 500 mentions', type: 'social' as const, threshold: '500 mentions' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Bell size={16} className="text-amber-400" />
          <span>{activeAlerts.length} active · {triggeredAlerts.length} triggered</span>
        </div>
        <button
          onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-all"
        >
          <Plus size={14} /> New Alert
        </button>
      </div>

      {/* Create Alert Form */}
      {showCreate && (
        <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Create Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Token</label>
              <select
                value={selectedTokenAddress}
                onChange={(e) => setSelectedTokenAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0e17] border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-white/15"
              >
                <option value="">Select a token...</option>
                {tokens.slice(0, 20).map(t => (
                  <option key={t.id} value={t.address}>{t.symbol} — {t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Alert Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertRule['alert_type'])}
                className="w-full px-3 py-2 bg-[#0a0e17] border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-white/15"
              >
                <option value="volume">Volume Spike</option>
                <option value="holders">Holder Growth</option>
                <option value="liquidity">Liquidity Change</option>
                <option value="social">Social Traction</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Threshold</label>
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="e.g. > $100K or +50%"
                className="w-full px-3 py-2 bg-[#0a0e17] border border-white/5 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/15"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600">Quick presets:</span>
            {quickAlerts.map(qa => (
              <button
                key={qa.label}
                onClick={() => { setAlertType(qa.type); setThreshold(qa.threshold); }}
                className="px-2 py-1 rounded-md text-[10px] bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-all"
              >
                {qa.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!selectedTokenAddress || !threshold}
              className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-300 text-xs font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider">Triggered</h3>
          {triggeredAlerts.map(alert => (
            <div key={alert.id} className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{alert.token_symbol}</span>
                  <span className="text-xs text-gray-500">{alertTypeLabel(alert.alert_type)}</span>
                  <span className="text-xs text-amber-400">{alert.threshold}</span>
                </div>
                {alert.message && <p className="text-xs text-gray-400 mt-0.5">{alert.message}</p>}
                {alert.triggered_at && <p className="text-[10px] text-gray-600 mt-0.5">Triggered {timeAgo(new Date(alert.triggered_at).getTime())}</p>}
              </div>
              <button
                onClick={() => onDeleteAlert(alert.id)}
                className="text-gray-600 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-2">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider">Active Alerts</h3>
        {activeAlerts.length === 0 ? (
          <div className="bg-[#0d1220] border border-white/5 rounded-xl p-8 text-center">
            <Bell size={24} className="text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active alerts yet</p>
            <p className="text-xs text-gray-600 mt-1">Create an alert to get notified when a token gains volume, holders, liquidity, or social traction.</p>
          </div>
        ) : (
          activeAlerts.map(alert => (
            <div key={alert.id} className="bg-[#0d1220] border border-white/5 rounded-xl p-4 flex items-center gap-3">
              {alertTypeIcon(alert.alert_type)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectToken(alert.token_address)}
                    className="text-sm font-semibold text-white hover:text-sky-400 transition-colors"
                  >
                    {alert.token_symbol}
                  </button>
                  <span className="text-xs text-gray-500">{alertTypeLabel(alert.alert_type)}</span>
                  <span className="text-xs text-gray-400">{alert.threshold}</span>
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5">Created {timeAgo(new Date(alert.created_at).getTime())}</p>
              </div>
              <button
                onClick={() => onDeleteAlert(alert.id)}
                className="text-gray-600 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Suggested Alerts */}
      <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Suggested Alerts from Top Tokens</h3>
        <div className="space-y-2">
          {[...tokens].sort((a, b) => b.volume1h - a.volume1h).slice(0, 3).map(token => (
            <div key={token.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Volume2 size={14} className="text-sky-400" />
                <span className="text-sm text-white font-medium">{token.symbol}</span>
                <span className="text-xs text-gray-500">Volume alert at {formatUsd(token.volume1h * 2)}</span>
              </div>
              <button
                onClick={() => onCreateAlert(token.address, token.symbol, token.name, 'volume', `> ${formatUsd(token.volume1h * 2)}`)}
                className="px-2 py-1 rounded-md text-[10px] bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all font-medium"
              >
                Set Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
