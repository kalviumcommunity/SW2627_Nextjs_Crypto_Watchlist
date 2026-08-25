"use client";

import { useCallback, useEffect, useState } from "react";

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
}

export function useMarketData() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/markets");

      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }

      const data: MarketCoin[] = await response.json();

      setCoins(data);
      setError(null);
    } catch (err) {
      setError("Unable to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();

    const interval = setInterval(() => {
      fetchMarketData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchMarketData]);

  return {
    coins,
    loading,
    error,
  };
}