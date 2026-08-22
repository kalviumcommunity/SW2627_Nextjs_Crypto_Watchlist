"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { FilterTab, WatchlistResponseDTO } from "@/types/watchlist";
import { useWatchlist } from "@/lib/useWatchlist";
import TickerStrip from "./TickerStrip";
import FilterTabs from "./FilterTabs";
import SearchInput from "./SearchInput";
import WatchlistTable from "./WatchlistTable";

interface WatchlistDashboardProps {
  initialData: WatchlistResponseDTO;
  watchlistId?: string;
}

export default function WatchlistDashboard({
  initialData,
  watchlistId = "default-watchlist",
}: WatchlistDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("watchlist");
  const [searchQuery, setSearchQuery] = useState("");

  // Use shared hook for star state synchronization across views
  const { starredCoinIds, totalTracked, toggleStar } = useWatchlist(watchlistId);

  const queryKey = ["watchlistData", watchlistId, activeTab, searchQuery];

  // Fetch watchlist tab data
  const { data, refetch } = useQuery<WatchlistResponseDTO>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("tab", activeTab);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/watchlists/${watchlistId}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      return res.json();
    },
    initialData: activeTab === "watchlist" && !searchQuery ? initialData : undefined,
    staleTime: 1000 * 4,
    refetchOnWindowFocus: true,
  });

  const displayData = data || initialData;

  // Filter items and keep star state in sync with shared hook
  const items = (displayData.items || [])
    .filter((coin) => (activeTab === "watchlist" ? starredCoinIds.has(coin.id) : true))
    .map((coin) => ({
      ...coin,
      isStarred: starredCoinIds.has(coin.id),
    }));

  const isEmptyWatchlist = activeTab === "watchlist" && items.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#050810]">
      {/* Ticker Strip */}
      <TickerStrip onRefresh={refetch} />

      {/* Main Content Container */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 flex flex-col">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight">
            Crypto Watchlist
          </h1>
          <p className="text-xs md:text-sm text-[#9AA4B2] mt-1">
            Real-time market data and performance metrics for your tracked assets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <FilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            watchlistCount={totalTracked}
            allMarketsCount={displayData.allMarketsCount ?? 100}
          />
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search coin or pair..."
          />
        </div>

        {/* Empty Watchlist State Fallback */}
        {isEmptyWatchlist ? (
          <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-12 flex flex-col items-center justify-center text-center my-auto min-h-[360px] shadow-lg">
            {/* Star Icon Tile */}
            <div className="w-16 h-16 rounded-2xl bg-[#1B2536] border border-[#232B3A] flex items-center justify-center mb-5 shadow-inner">
              <Star className="w-8 h-8 text-[#F5B94D] fill-[#F5B94D]/20" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-sm text-[#9AA4B2] max-w-sm mb-6">
              You haven&apos;t added any cryptocurrency assets to your watchlist yet. Explore markets and star coins to track them here.
            </p>

            <Link
              href="/markets"
              className="h-10 px-6 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-sm rounded-lg transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Explore all Coins</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <WatchlistTable
            coins={items}
            onStarToggle={toggleStar}
          />
        )}
      </main>
    </div>
  );
}
