import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import WatchlistDashboard from "@/components/WatchlistDashboard";
import { CoinDTO, WatchlistResponseDTO } from "@/types/watchlist";

export const revalidate = 0; // Server render on demand

export default async function WatchlistPage() {
  const watchlistId = "default-watchlist";

  // Fetch watchlist items
  const watchlistItems = await prisma.watchlistItem.findMany({
    where: { watchlistId },
  });
  const starredCoinIds = new Set(watchlistItems.map((item) => item.coinId));

  // Fetch all coins with latest price snapshot
  const coins = await prisma.coin.findMany({
    include: {
      priceSnapshots: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { rank: "asc" },
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
      marketCap: latestSnapshot?.marketCap ?? "₹0T",
      sparkline7d: sparkline,
      isStarred: starredCoinIds.has(coin.id),
    };
  });

  // Initial tab is "watchlist", so filter starred coins initially
  const initialStarredItems = mappedItems.filter((item) => item.isStarred);

  const initialData: WatchlistResponseDTO = {
    id: watchlistId,
    name: "My Watchlist",
    totalTracked: starredCoinIds.size,
    totalVolume: "₹12,480.6 Cr",
    btcDominance: "58.4%",
    items: initialStarredItems,
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050810]" />}>
      <WatchlistDashboard
        initialData={initialData}
        watchlistId={watchlistId}
      />
    </Suspense>
  );
}

