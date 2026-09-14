import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Token } from '@/lib/types';

export interface WatchlistItem {
  id: string;
  token_address: string;
  token_symbol: string;
  token_name: string;
  added_at: string;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = useCallback(async () => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .order('added_at', { ascending: false });
    if (error) {
      console.error('Failed to load watchlist:', error);
      setWatchlist([]);
    } else {
      setWatchlist(data as WatchlistItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = useCallback(async (token: Token) => {
    const { error } = await supabase
      .from('watchlist')
      .insert({
        token_address: token.address,
        token_symbol: token.symbol,
        token_name: token.name,
      });
    if (!error) fetchWatchlist();
  }, [fetchWatchlist]);

  const removeFromWatchlist = useCallback(async (tokenAddress: string) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('token_address', tokenAddress);
    if (!error) fetchWatchlist();
  }, [fetchWatchlist]);

  const isWatched = useCallback((tokenAddress: string) => {
    return watchlist.some(w => w.token_address === tokenAddress);
  }, [watchlist]);

  const toggleWatch = useCallback((token: Token) => {
    if (isWatched(token.address)) {
      removeFromWatchlist(token.address);
    } else {
      addToWatchlist(token);
    }
  }, [isWatched, addToWatchlist, removeFromWatchlist]);

  return { watchlist, loading, addToWatchlist, removeFromWatchlist, isWatched, toggleWatch, refresh: fetchWatchlist };
}
