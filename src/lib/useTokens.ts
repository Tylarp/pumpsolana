import { useState, useEffect, useCallback } from 'react';
import { getTokens, refreshTokens } from './mockData';
import type { Token } from './types';

export function useTokens(refreshInterval = 5000): { tokens: Token[]; lastUpdate: number } {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    setTokens(getTokens());
    const interval = setInterval(() => {
      const updated = refreshTokens();
      setTokens([...updated]);
      setLastUpdate(Date.now());
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { tokens, lastUpdate };
}
