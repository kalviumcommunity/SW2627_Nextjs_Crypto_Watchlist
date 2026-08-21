"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FilterTab, WatchlistResponseDTO } from "@/types/watchlist";
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("watchlist");
  const [searchQuery, setSearchQuery] = useState("");

  const queryKey = ["watchlist", watchlistId, activeTab, searchQuery];

  // Fetch data using React Query with initialData fallback
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
  });

  const displayData = data || initialData;

  // Star Toggle Mutation with Optimistic UI Update
  const starMutation = useMutation({
    mutationFn: async ({ coinId, isStarred }: { coinId: string; isStarred: boolean }) => {
      if (isStarred) {
        // DELETE
        const res = await fetch(`/api/watchlists/${watchlistId}/items?coinId=${coinId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to remove item");
      } else {
        // POST
        const res = await fetch(`/api/watchlists/${watchlistId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coinId }),
        });
        if (!res.ok) throw new Error("Failed to add item");
      }
    },
    onMutate: async ({ coinId, isStarred }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });

      // Optimistically update current query data
      queryClient.setQueriesData<WatchlistResponseDTO>({ queryKey: ["watchlist"] }, (old) => {
        if (!old) return old;
        const newStarredState = !isStarred;
        const updatedItems = old.items.map((coin) =>
          coin.id === coinId ? { ...coin, isStarred: newStarredState } : coin
        );

        // If on "watchlist" tab and unstarring, filter out item
        const filteredItems =
          activeTab === "watchlist"
            ? updatedItems.filter((coin) => coin.isStarred)
            : updatedItems;

        const delta = newStarredState ? 1 : -1;

        return {
          ...old,
          totalTracked: Math.max(0, old.totalTracked + delta),
          items: filteredItems,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const handleStarToggle = useCallback(
    (coinId: string, currentStarred: boolean) => {
      starMutation.mutate({ coinId, isStarred: currentStarred });
    },
    [starMutation]
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050810]">
      {/* Ticker Strip */}
      <TickerStrip
        trackedCount={displayData.totalTracked}
        totalVolume={displayData.totalVolume}
        btcDominance={displayData.btcDominance}
        onRefresh={refetch}
      />

      {/* Main Content Container */}
      <main className="max-w-[1280px] w-full mx-auto px-6 py-8 flex-1 flex flex-col">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            Crypto Watchlist
          </h1>
          <p className="text-sm text-[#9AA4B2] mt-1">
            Real-time market data and performance metrics for your tracked assets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <FilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            watchlistCount={displayData.totalTracked}
            allMarketsCount={10}
          />
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Watchlist Table */}
        <WatchlistTable
          coins={displayData.items}
          onStarToggle={handleStarToggle}
        />
      </main>
    </div>
  );
}
