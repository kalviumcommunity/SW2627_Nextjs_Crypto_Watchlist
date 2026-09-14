const COINGECKO_BASE_URL =
  "https://api.coingecko.com/api/v3";

export class CoinGeckoError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "CoinGeckoError";
  }
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export async function fetchCoinMarketData(
  coinIds: string[]
): Promise<CoinMarketData[]> {
  if (coinIds.length === 0) {
    throw new Error("At least one CoinGecko ID is required");
  }

  const ids = coinIds.join(",");

  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/markets?vs_currency=inr&ids=${ids}&sparkline=true`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 429) {
    throw new CoinGeckoError("CoinGecko rate limit reached", 429);
  }

  if (!response.ok) {
    throw new CoinGeckoError("Failed to fetch CoinGecko market data", 502);
  }

  return response.json();
}