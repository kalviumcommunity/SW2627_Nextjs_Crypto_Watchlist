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

export interface UseMarketDataOptions {
  refreshInterval?: number;
}

export function useMarketData(options?: UseMarketDataOptions) {
  const refreshInterval = options?.refreshInterval ?? 5000;
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const fetchMarketData = useCallback(async () => {
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeControllerRef.current = controller;

    try {
      const response = await fetch("/api/markets", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }

      const data: MarketCoin[] = await response.json();
      if (isMountedRef.current) {
        setCoins(data);
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      if (isMountedRef.current) {
        setError("Unable to load market data");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const controller = new AbortController();
    activeControllerRef.current = controller;

    const loadInitial = async () => {
      try {
        const response = await fetch("/api/markets", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }
        const data: MarketCoin[] = await response.json();
        if (isMountedRef.current) {
          setCoins(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMountedRef.current) {
          setError("Unable to load market data");
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    void loadInitial();

    let interval: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      interval = setInterval(() => {
        void fetchMarketData();
      }, refreshInterval);
    }

    return () => {
      isMountedRef.current = false;
      controller.abort();
      if (interval) clearInterval(interval);
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, [fetchMarketData, refreshInterval]);

  return {
    coins,
    loading,
    error,
    refetch: fetchMarketData,
  };
}


