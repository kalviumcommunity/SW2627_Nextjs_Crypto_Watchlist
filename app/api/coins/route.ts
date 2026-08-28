// Import NextRequest and NextResponse server utilities from Next.js framework
import { NextRequest, NextResponse } from "next/server";
// Import singleton Prisma client instance for performing database queries
import { prisma } from "@/lib/prisma";
// Import category filter enumeration and CoinDTO data transfer object interface
import { CategoryFilter, CoinDTO } from "@/types/watchlist";

// Set of valid crypto categories recognized by the application
const VALID_CATEGORIES: Set<CategoryFilter> = new Set([
  "LAYER_1",
  "DEFI",
  "STABLECOIN",
  "EXCHANGE_TOKEN",
  "MEME",
  "SMART_CONTRACT",
]);

// Helper function to normalize category query parameters to match database enum values
function normalizeCategory(raw: string): CategoryFilter | null {
  // Trim string, convert to uppercase, and replace hyphens/spaces with underscores
  const upper = raw.trim().toUpperCase().replace(/[-\s]/g, "_");
  // Return normalized category if present in VALID_CATEGORIES set
  if (VALID_CATEGORIES.has(upper as CategoryFilter)) {
    return upper as CategoryFilter;
  }
  // Map common category aliases to standard enum values
  if (upper === "LAYER1") return "LAYER_1";
  if (upper === "EXCHANGE") return "EXCHANGE_TOKEN";
  if (upper === "SMARTCONTRACT") return "SMART_CONTRACT";
  return null;
}

// Helper function to parse 24-hour volume string (e.g. '₹12,345 Cr') into a numeric value
function parseVolCr(volStr: string): number {
  if (!volStr) return 0;
  // Remove non-numeric characters except decimal points and parse float
  const num = parseFloat(volStr.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

// Export GET route handler processing cryptocurrency market listings, search, filtering, and sorting
export async function GET(request: NextRequest) {
  try {
    // Parse URL search parameters from incoming HTTP request
    const { searchParams } = new URL(request.url);

    // Extract search query string parameter ('q')
    const q = (searchParams.get("q") || "").trim();
    // Extract comma-separated category string parameter
    const categoryParam = searchParams.get("category") || "";
    // Extract minimum price filter parameter
    const priceMinParam = searchParams.get("priceMin");
    // Extract maximum price filter parameter
    const priceMaxParam = searchParams.get("priceMax");
    // Extract 24-hour price change direction parameter ('gainers' | 'losers' | 'any')
    const changeParam = searchParams.get("change") || "any";
    // Extract minimum percentage change parameter
    const changeMinParam = searchParams.get("changeMin");
    // Extract maximum percentage change parameter
    const changeMaxParam = searchParams.get("changeMax");
    // Extract market cap tier parameter ('large' | 'mid' | 'small' | 'all')
    const capParam = searchParams.get("cap") || "all";
    // Extract sort column parameter ('rank' | 'price' | 'change' | 'marketCap' | 'volume' | 'name')
    const sortParam = searchParams.get("sort") || "rank";
    // Extract sort direction parameter ('asc' | 'desc')
    const dirParam = (searchParams.get("dir") || "asc").toLowerCase() === "desc" ? "desc" : "asc";
    // Extract optional watchlist ID parameter
    const watchlistId = searchParams.get("watchlistId");
    // Extract active tab parameter ('all' | 'watchlist' | 'gainers' | 'losers')
    const tab = searchParams.get("tab") || "all";
    // Parse current pagination page number (minimum 1)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    // Parse pagination limit per page (minimum 1, default 40)
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "40", 10));

    // Parse and normalize list of selected categories from comma-separated string
    const categories: CategoryFilter[] = categoryParam
      .split(",")
      .map(normalizeCategory)
      .filter((c): c is CategoryFilter => c !== null);

    // Parse numeric min/max bounds for price and 24h percentage change
    const priceMin = priceMinParam !== null && priceMinParam !== "" ? parseFloat(priceMinParam) : null;
    const priceMax = priceMaxParam !== null && priceMaxParam !== "" ? parseFloat(priceMaxParam) : null;
    const changeMin = changeMinParam !== null && changeMinParam !== "" ? parseFloat(changeMinParam) : null;
    const changeMax = changeMaxParam !== null && changeMaxParam !== "" ? parseFloat(changeMaxParam) : null;

    // Retrieve starred coin IDs if watchlistId is provided or tab is set to watchlist
    let starredCoinIds = new Set<string>();
    const effectiveWatchlistId = watchlistId || (tab === "watchlist" ? "default-watchlist" : null);
    
    if (effectiveWatchlistId) {
      const watchlistItems = await prisma.watchlistItem.findMany({
        where: { watchlistId: effectiveWatchlistId },
      });
      starredCoinIds = new Set(watchlistItems.map((item) => item.coinId));
    }

    // Initialize Prisma query `where` filter object
    const where: any = {};

    // Filter by starred watchlist items when on watchlist tab or watchlist request
    if (tab === "watchlist" || (watchlistId && !searchParams.has("tab"))) {
      where.id = { in: Array.from(starredCoinIds) };
    }

    // Apply search query filter against coin name or symbol (case-insensitive search)
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { symbol: { contains: q } },
      ];
    }

    // Apply multi-select category filter if one or more valid categories are specified
    if (categories.length > 0) {
      where.category = { in: categories };
    }

    // Query database for all coins matching filters along with their latest price snapshot
    const coins = await prisma.coin.findMany({
      where,
      include: {
        priceSnapshots: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { rank: "asc" },
    });

    // Initialize min and max price tracking for dynamic slider bounds
    let globalMinPrice = Infinity;
    let globalMaxPrice = -Infinity;

    // Transform database coin records into clean CoinDTO objects
    let mapped: CoinDTO[] = coins.map((coin) => {
      const latest = coin.priceSnapshots[0];
      const priceInr = latest?.priceInr ?? 0;
      const change24hPct = latest?.change24hPct ?? 0;
      const marketCapInrCr = latest?.marketCapInrCr ?? 0;

      // Track minimum and maximum price across fetched dataset
      if (priceInr < globalMinPrice) globalMinPrice = priceInr;
      if (priceInr > globalMaxPrice) globalMaxPrice = priceInr;

      // Safely parse 7-day sparkline JSON array string into number array
      let sparkline: number[] = [];
      if (latest?.sparkline7d) {
        try {
          sparkline = JSON.parse(latest.sparkline7d);
        } catch {
          sparkline = [];
        }
      }

      // Return formatted CoinDTO object
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        subtext: coin.subtext,
        category: (coin.category as CategoryFilter) || "LAYER_1",
        rank: coin.rank,
        iconUrl: coin.iconUrl,
        priceInr,
        change24hPct,
        volume24h: latest?.volume24h ?? "₹0 Cr",
        marketCap: latest?.marketCap ?? "₹0 Cr",
        marketCapInrCr,
        sparkline7d: sparkline,
        isStarred: starredCoinIds.has(coin.id),
      };
    });

    // Fallback bounds for global price range if dataset is empty
    if (globalMinPrice === Infinity) globalMinPrice = 0;
    if (globalMaxPrice === -Infinity) globalMaxPrice = 1000000;

    // Filter results for Gainers (positive 24h change) or Losers (negative 24h change) tabs
    if (tab === "gainers") {
      mapped = mapped.filter((c) => c.change24hPct > 0);
    } else if (tab === "losers") {
      mapped = mapped.filter((c) => c.change24hPct < 0);
    }

    // Apply minimum and maximum price bounds filters
    if (priceMin !== null && !isNaN(priceMin)) {
      mapped = mapped.filter((c) => c.priceInr >= priceMin);
    }
    if (priceMax !== null && !isNaN(priceMax)) {
      mapped = mapped.filter((c) => c.priceInr <= priceMax);
    }

    // Apply 24h change direction filter ('gainers' vs 'losers')
    if (changeParam === "gainers") {
      mapped = mapped.filter((c) => c.change24hPct >= 0);
    } else if (changeParam === "losers") {
      mapped = mapped.filter((c) => c.change24hPct < 0);
    }

    // Apply minimum and maximum 24h change percentage bounds filters
    if (changeMin !== null && !isNaN(changeMin)) {
      mapped = mapped.filter((c) => c.change24hPct >= changeMin);
    }
    if (changeMax !== null && !isNaN(changeMax)) {
      mapped = mapped.filter((c) => c.change24hPct <= changeMax);
    }

    // Apply market cap tier filter (Large: ≥50k Cr, Mid: 5k-50k Cr, Small: <5k Cr)
    if (capParam === "large") {
      mapped = mapped.filter((c) => (c.marketCapInrCr ?? 0) >= 50000);
    } else if (capParam === "mid") {
      mapped = mapped.filter((c) => {
        const m = c.marketCapInrCr ?? 0;
        return m >= 5000 && m < 50000;
      });
    } else if (capParam === "small") {
      mapped = mapped.filter((c) => (c.marketCapInrCr ?? 0) < 5000);
    }

    // Sort coin collection according to selected sort column and direction
    mapped.sort((a, b) => {
      let result = 0;
      switch (sortParam) {
        case "price":
          result = a.priceInr - b.priceInr;
          break;
        case "change":
          result = a.change24hPct - b.change24hPct;
          break;
        case "marketCap":
          result = (a.marketCapInrCr ?? 0) - (b.marketCapInrCr ?? 0);
          break;
        case "volume":
          result = parseVolCr(a.volume24h) - parseVolCr(b.volume24h);
          break;
        case "name":
          result = a.name.localeCompare(b.name);
          break;
        case "rank":
        default:
          result = a.rank - b.rank;
          break;
      }
      return dirParam === "desc" ? -result : result;
    });

    // Calculate pagination slices based on total matching count, page index, and limit
    const totalCount = mapped.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = mapped.slice(startIndex, startIndex + limit);

    // Count total coins in database for summary header statistics
    const allMarketsCount = await prisma.coin.count();

    // Return JSON response payload containing paginated coins, metadata, and pagination stats
    return NextResponse.json({
      id: effectiveWatchlistId || "default-watchlist",
      name: "Crypto Markets",
      totalTracked: starredCoinIds.size,
      totalVolume: "₹6,45,230 Cr",
      btcDominance: "52.4%",
      items: paginatedItems,
      page,
      totalPages,
      totalCount,
      allMarketsCount,
      minPrice: globalMinPrice,
      maxPrice: globalMaxPrice,
    });
  } catch (error) {
    // Log API route exceptions to server log
    console.error("Error in /api/coins route:", error);
    // Return 500 Internal Server Error status JSON response
    return NextResponse.json(
      { error: "Failed to fetch coins data" },
      { status: 500 }
    );
  }
}

