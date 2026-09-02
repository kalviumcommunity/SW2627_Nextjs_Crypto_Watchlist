import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import MarketsDashboard from "@/components/MarketsDashboard";
import DashboardSkeleton from "@/components/states/DashboardSkeleton";
import { CoinDTO, WatchlistResponseDTO } from "@/types/watchlist";

export const revalidate = 0; // Server render on demand

export default async function MarketsPage() {
  const watchlistId = "default-watchlist";

  // Fetch watchlist items
  const watchlistItems = await prisma.watchlistItem.findMany({
    where: { watchlistId },
  });
  const starredCoinIds = new Set(watchlistItems.map((item) => item.coinId));

  // Fetch total count of all coins
  const totalCoinsCount = await prisma.coin.count();

  // Fetch first 40 coins with latest price snapshot
  const coins = await prisma.coin.findMany({
    include: {
      priceSnapshots: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { rank: "asc" },
    take: 40,
  });

  const mappedItems: CoinDTO[] = coins.map((coin) => {
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

  const initialData: WatchlistResponseDTO & {
    page: number;
    totalPages: number;
    totalCount: number;
    allMarketsCount: number;
  } = {
    id: watchlistId,
    name: "My Watchlist",
    totalTracked: starredCoinIds.size,
    totalVolume: "₹6,45,230 Cr",
    btcDominance: "52.4%",
    items: mappedItems,
    page: 1,
    totalPages: Math.ceil(totalCoinsCount / 40) || 1,
    totalCount: totalCoinsCount,
    allMarketsCount: totalCoinsCount,
  };

  return (
    <Suspense fallback={<DashboardSkeleton title="All Crypto Markets" />}>
      <MarketsDashboard
        initialData={initialData}
        watchlistId={watchlistId}
      />
    </Suspense>
  );
}

