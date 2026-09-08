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
      const response = await fetch("/api/markets", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }

      const data: MarketCoin[] = await response.json();

      setCoins(data);
      setError(null);
    } catch {
      setError("Unable to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/markets", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }
        const data: MarketCoin[] = await response.json();
        if (!cancelled) {
          setCoins(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load market data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    const interval = setInterval(() => {
      void fetchMarketData();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [fetchMarketData]);

  return {
    coins,
    loading,
    error,
  };
}