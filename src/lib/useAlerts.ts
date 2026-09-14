import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AlertRule } from '@/lib/types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    } else {
      setAlerts(data as AlertRule[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = useCallback(async (
    tokenAddress: string,
    tokenSymbol: string,
    tokenName: string,
    alertType: AlertRule['alert_type'],
    threshold: string
  ) => {
    const { error } = await supabase
      .from('alerts')
      .insert({
        token_address: tokenAddress,
        token_symbol: tokenSymbol,
        token_name: tokenName,
        alert_type: alertType,
        threshold,
        triggered: false,
      });
    if (!error) fetchAlerts();
    return !error;
  }, [fetchAlerts]);

  const deleteAlert = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);
    if (!error) fetchAlerts();
  }, [fetchAlerts]);

  const dismissAlert = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);
    if (!error) fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, createAlert, deleteAlert, dismissAlert, refresh: fetchAlerts };
}
