"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const isRefreshingRef = useRef(false);

 const fetchMarketData = useCallback(async () => {
  if (isRefreshingRef.current) return;
  isRefreshingRef.current = true;
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
    isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const initialFetch = window.setTimeout(() => void fetchMarketData(), 0);

    const interval = setInterval(() => {
      void fetchMarketData();
    }, 60000);

    return () => {
      window.clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchMarketData]);

  return {
    coins,
    loading,
    error,
  };
}