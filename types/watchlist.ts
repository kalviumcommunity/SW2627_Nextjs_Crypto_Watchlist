export type CategoryFilter =
  | "LAYER_1"
  | "DEFI"
  | "STABLECOIN"
  | "EXCHANGE_TOKEN"
  | "MEME"
  | "SMART_CONTRACT";

export type MarketCapTier = "all" | "large" | "mid" | "small";
export type ChangeQuickFilter = "any" | "gainers" | "losers";
export type SortOption = "rank" | "price" | "change" | "marketCap" | "volume" | "name";
export type SortDirection = "asc" | "desc";

export interface CoinDTO {
  id: string;
  symbol: string;
  name: string;
  subtext: string;
  category?: CategoryFilter;
  rank: number;
  iconUrl?: string | null;
  priceInr: number;
  change24hPct: number;
  volume24h: string;
  marketCap: string;
  marketCapInrCr?: number;
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
  minPrice?: number;
  maxPrice?: number;
}

export type FilterTab = "watchlist" | "all" | "gainers" | "losers";

export interface CoinFilterState {
  q: string;
  categories: CategoryFilter[];
  priceMin: number | null;
  priceMax: number | null;
  change: ChangeQuickFilter;
  changeMin: number | null;
  changeMax: number | null;
  cap: MarketCapTier;
  sort: SortOption;
  dir: SortDirection;
  page: number;
}
