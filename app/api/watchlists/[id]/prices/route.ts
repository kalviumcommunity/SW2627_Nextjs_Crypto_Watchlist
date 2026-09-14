import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CoinGeckoError, fetchCoinMarketData } from "@/lib/coingecko";
import { resolveCoinGeckoId } from "@/lib/coingeckoIds";
import { prisma } from "@/lib/prisma";

const refreshes = new Map<string, Promise<RefreshResult>>();

interface RefreshResult {
  refreshedAt: string;
  items: Array<{
    coinId: string;
    coinGeckoId: string;
    priceInr: number;
    recordedAt: string;
  }>;
}

async function refreshWatchlistPrices(watchlistId: string): Promise<RefreshResult> {
  const existingRefresh = refreshes.get(watchlistId);
  if (existingRefresh) return existingRefresh;

  const refresh = (async () => {
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { watchlistId },
      select: {
        coinId: true,
        coin: {
          select: { coinGeckoId: true, name: true },
        },
      },
    });

    if (watchlistItems.length === 0) {
      return { refreshedAt: new Date().toISOString(), items: [] };
    }

    const resolvedItems = watchlistItems.map((item) => ({
      ...item,
      coinGeckoId: resolveCoinGeckoId(item.coin),
    }));
    const missingItems = resolvedItems.filter((item) => !item.coinGeckoId);
    if (missingItems.length > 0) {
      throw new CoinGeckoError(
        `Watchlist coins missing CoinGecko identifiers: ${missingItems
          .map((item) => item.coin.name)
          .join(", ")}`,
        409
      );
    }

    const repairs = resolvedItems.filter(
      (item) => item.coinGeckoId && item.coinGeckoId !== item.coin.coinGeckoId
    );
    if (repairs.length > 0) {
      await prisma.$transaction(
        repairs.map((item) =>
          prisma.coin.update({
            where: { id: item.coinId },
            data: { coinGeckoId: item.coinGeckoId },
          })
        )
      );
    }

    const coinGeckoIds = resolvedItems.map((item) => item.coinGeckoId!);
    const marketData = await fetchCoinMarketData(coinGeckoIds);
    const marketById = new Map(marketData.map((coin) => [coin.id, coin]));
    const recordedAt = new Date();
    const snapshots = resolvedItems.flatMap((item) => {
      const coin = marketById.get(item.coinGeckoId!);
      if (!coin) return [];

      return [{
        coinId: item.coinId,
        priceInr: coin.current_price,
        change24hPct: coin.price_change_percentage_24h ?? 0,
        low24h: null,
        high24h: null,
        volume24h: String(coin.total_volume ?? 0),
        marketCap: String(coin.market_cap ?? 0),
        marketCapInrCr: coin.market_cap ? coin.market_cap / 10_000_000 : null,
        sparkline7d: JSON.stringify(coin.sparkline_in_7d?.price ?? []),
        recordedAt,
      }];
    });

    if (snapshots.length > 0) {
      await prisma.priceSnapshot.createMany({ data: snapshots });
    }

    return {
      refreshedAt: recordedAt.toISOString(),
      items: snapshots.map((snapshot) => ({
        coinId: snapshot.coinId,
        coinGeckoId: resolvedItems.find((item) => item.coinId === snapshot.coinId)!.coinGeckoId!,
        priceInr: snapshot.priceInr,
        recordedAt: recordedAt.toISOString(),
      })),
    };
  })();

  refreshes.set(watchlistId, refresh);
  try {
    return await refresh;
  } finally {
    refreshes.delete(watchlistId);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const watchlist = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
        ...(id && id !== "default-watchlist" ? { id } : {}),
      },
      select: { id: true },
    });
    if (!watchlist) {
      return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
    }

    const result = await refreshWatchlistPrices(watchlist.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error refreshing watchlist prices:", error);
    const status = error instanceof CoinGeckoError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unable to refresh watchlist prices";
    return NextResponse.json({ error: message }, { status });
  }
}