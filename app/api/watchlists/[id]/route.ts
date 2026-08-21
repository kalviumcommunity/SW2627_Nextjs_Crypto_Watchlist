import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CoinDTO, WatchlistResponseDTO } from "@/types/watchlist";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const watchlistId = id || "default-watchlist";

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "watchlist";
    const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

    // Fetch default watchlist items
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { watchlistId },
    });
    const starredCoinIds = new Set(watchlistItems.map((item) => item.coinId));

    // Fetch all coins with their latest price snapshot
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
        marketCap: latestSnapshot?.marketCap ?? "₹0T",
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

    const response: WatchlistResponseDTO = {
      id: watchlistId,
      name: "My Watchlist",
      totalTracked: starredCoinIds.size,
      totalVolume: "₹12,480.6 Cr",
      btcDominance: "58.4%",
      items: mappedItems,
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
