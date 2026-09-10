import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CoinDTO, WatchlistResponseDTO } from "@/types/watchlist";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    let watchlist = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!watchlist) {
      watchlist = await prisma.watchlist.create({
        data: {
          name: "My Watchlist",
          userId: session.user.id,
        },
      });
    }

    const watchlistId = watchlist.id;

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";
    const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "40", 10));

    // Fetch user's watchlist items
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { watchlistId },
    });

    const starredCoinIds = new Set(
      watchlistItems.map((item) => item.coinId)
    );

    const coins = await prisma.coin.findMany({
      include: {
        priceSnapshots: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { rank: "asc" },
    });

    let mappedItems: CoinDTO[] = coins.map((coin) => {
      const latestSnapshot = coin.priceSnapshots[0];

      let sparkline: number[] = [];

      if (latestSnapshot?.sparkline7d) {
        try {
          sparkline = JSON.parse(latestSnapshot.sparkline7d);
        } catch {
          sparkline = [];
        }
      }

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        subtext: coin.subtext,
        rank: coin.rank,
        iconUrl: coin.iconUrl,
        priceInr: latestSnapshot?.priceInr ?? 0,
        change24hPct: latestSnapshot?.change24hPct ?? 0,
        volume24h: latestSnapshot?.volume24h ?? "₹0 Cr",
        marketCap: latestSnapshot?.marketCap ?? "₹0 Cr",
        sparkline7d: sparkline,
        isStarred: starredCoinIds.has(coin.id),
      };
    });

    // Apply Tab Filtering
    if (tab === "watchlist") {
      mappedItems = mappedItems.filter((item) => item.isStarred);
    } else if (tab === "gainers") {
      mappedItems = mappedItems
        .filter((item) => item.change24hPct > 0)
        .sort((a, b) => b.change24hPct - a.change24hPct);
    } else if (tab === "losers") {
      mappedItems = mappedItems
        .filter((item) => item.change24hPct < 0)
        .sort((a, b) => a.change24hPct - b.change24hPct);
    }

    // Apply Search Filtering
    if (searchQuery) {
      mappedItems = mappedItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.symbol.toLowerCase().includes(searchQuery) ||
          item.subtext.toLowerCase().includes(searchQuery)
      );
    }

    const totalCount = mappedItems.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    // Apply Pagination
    const startIndex = (page - 1) * limit;
    const paginatedItems = mappedItems.slice(
      startIndex,
      startIndex + limit
    );

    const response: WatchlistResponseDTO & {
      page: number;
      totalPages: number;
      totalCount: number;
      allMarketsCount: number;
    } = {
      id: watchlistId,
      name: watchlist.name,
      totalTracked: starredCoinIds.size,
      totalVolume: "₹6,45,230 Cr",
      btcDominance: "52.4%",
      items: paginatedItems,
      page,
      totalPages,
      totalCount,
      allMarketsCount: coins.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching watchlist:", error);

    return NextResponse.json(
      { error: "Failed to fetch watchlist data" },
      { status: 500 }
    );
  }
}