import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CategoryFilter, CoinDTO } from "@/types/watchlist";

const VALID_CATEGORIES: Set<CategoryFilter> = new Set([
  "LAYER_1",
  "DEFI",
  "STABLECOIN",
  "EXCHANGE_TOKEN",
  "MEME",
  "SMART_CONTRACT",
]);

function normalizeCategory(raw: string): CategoryFilter | null {
  const upper = raw.trim().toUpperCase().replace(/[-\s]/g, "_");
  if (VALID_CATEGORIES.has(upper as CategoryFilter)) {
    return upper as CategoryFilter;
  }
  // Alias mapping
  if (upper === "LAYER1") return "LAYER_1";
  if (upper === "EXCHANGE") return "EXCHANGE_TOKEN";
  if (upper === "SMARTCONTRACT") return "SMART_CONTRACT";
  return null;
}

function parseVolCr(volStr: string): number {
  if (!volStr) return 0;
  const num = parseFloat(volStr.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = (searchParams.get("q") || "").trim();
    const categoryParam = searchParams.get("category") || "";
    const priceMinParam = searchParams.get("priceMin");
    const priceMaxParam = searchParams.get("priceMax");
    const changeParam = searchParams.get("change") || "any";
    const changeMinParam = searchParams.get("changeMin");
    const changeMaxParam = searchParams.get("changeMax");
    const capParam = searchParams.get("cap") || "all";
    const sortParam = searchParams.get("sort") || "rank";
    const dirParam = (searchParams.get("dir") || "asc").toLowerCase() === "desc" ? "desc" : "asc";
    const watchlistId = searchParams.get("watchlistId");
    const tab = searchParams.get("tab") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "40", 10));

    // Categories array
    const categories: CategoryFilter[] = categoryParam
      .split(",")
      .map(normalizeCategory)
      .filter((c): c is CategoryFilter => c !== null);

    // Numeric bounds
    const priceMin = priceMinParam !== null && priceMinParam !== "" ? parseFloat(priceMinParam) : null;
    const priceMax = priceMaxParam !== null && priceMaxParam !== "" ? parseFloat(priceMaxParam) : null;
    const changeMin = changeMinParam !== null && changeMinParam !== "" ? parseFloat(changeMinParam) : null;
    const changeMax = changeMaxParam !== null && changeMaxParam !== "" ? parseFloat(changeMaxParam) : null;

    // Fetch starred coin IDs if watchlistId is provided or tab is watchlist
    let starredCoinIds = new Set<string>();
    const effectiveWatchlistId = watchlistId || (tab === "watchlist" ? "default-watchlist" : null);
    
    if (effectiveWatchlistId) {
      const watchlistItems = await prisma.watchlistItem.findMany({
        where: { watchlistId: effectiveWatchlistId },
      });
      starredCoinIds = new Set(watchlistItems.map((item) => item.coinId));
    }

    // Build Prisma `where` clause
    const where: any = {};

    // Watchlist scoping (if called from /watchlist or tab === 'watchlist')
    if (tab === "watchlist" || (watchlistId && !searchParams.has("tab"))) {
      where.id = { in: Array.from(starredCoinIds) };
    }

    // Search query: name or symbol ILIKE / contains
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { symbol: { contains: q } },
      ];
    }

    // Multi-select Category
    if (categories.length > 0) {
      where.category = { in: categories };
    }

    // Query all matching coins with latest price snapshot
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

    // Map coins to DTO and extract global min/max price for range slider defaults
    let globalMinPrice = Infinity;
    let globalMaxPrice = -Infinity;

    let mapped: CoinDTO[] = coins.map((coin) => {
      const latest = coin.priceSnapshots[0];
      const priceInr = latest?.priceInr ?? 0;
      const change24hPct = latest?.change24hPct ?? 0;
      const marketCapInrCr = latest?.marketCapInrCr ?? 0;

      if (priceInr < globalMinPrice) globalMinPrice = priceInr;
      if (priceInr > globalMaxPrice) globalMaxPrice = priceInr;

      let sparkline: number[] = [];
      if (latest?.sparkline7d) {
        try {
          sparkline = JSON.parse(latest.sparkline7d);
        } catch {
          sparkline = [];
        }
      }

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

    if (globalMinPrice === Infinity) globalMinPrice = 0;
    if (globalMaxPrice === -Infinity) globalMaxPrice = 1000000;

    // Apply Tab Filters ('gainers' / 'losers')
    if (tab === "gainers") {
      mapped = mapped.filter((c) => c.change24hPct > 0);
    } else if (tab === "losers") {
      mapped = mapped.filter((c) => c.change24hPct < 0);
    }

    // Apply Price Range Filters
    if (priceMin !== null && !isNaN(priceMin)) {
      mapped = mapped.filter((c) => c.priceInr >= priceMin);
    }
    if (priceMax !== null && !isNaN(priceMax)) {
      mapped = mapped.filter((c) => c.priceInr <= priceMax);
    }

    // Apply 24h Change Filters
    if (changeParam === "gainers") {
      mapped = mapped.filter((c) => c.change24hPct >= 0);
    } else if (changeParam === "losers") {
      mapped = mapped.filter((c) => c.change24hPct < 0);
    }

    if (changeMin !== null && !isNaN(changeMin)) {
      mapped = mapped.filter((c) => c.change24hPct >= changeMin);
    }
    if (changeMax !== null && !isNaN(changeMax)) {
      mapped = mapped.filter((c) => c.change24hPct <= changeMax);
    }

    // Apply Market Cap Tier Filter
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

    // Apply Sorting
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

    const totalCount = mapped.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = mapped.slice(startIndex, startIndex + limit);

    // Fetch total coins count for top-level stats
    const allMarketsCount = await prisma.coin.count();

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
    console.error("Error in /api/coins route:", error);
    return NextResponse.json(
      { error: "Failed to fetch coins data" },
      { status: 500 }
    );
  }
}
