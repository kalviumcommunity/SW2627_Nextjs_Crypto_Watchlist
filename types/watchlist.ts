export interface CoinDTO {
  id: string;
  symbol: string;
  name: string;
  subtext: string;
  rank: number;
  iconUrl?: string | null;
  priceInr: number;
  change24hPct: number;
  volume24h: string;
  marketCap: string;
  sparkline7d: number[];
  isStarred: boolean;
}

export interface WatchlistResponseDTO {
  id: string;
  name: string;
  totalTracked: number;
  totalVolume: string;
  btcDominance: string;
  items: CoinDTO[];
  page?: number;
  totalPages?: number;
  totalCount?: number;
  allMarketsCount?: number;
}

export type FilterTab = "watchlist" | "all" | "gainers" | "losers";
