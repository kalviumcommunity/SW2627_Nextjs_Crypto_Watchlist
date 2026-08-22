"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterTab, WatchlistResponseDTO } from "@/types/watchlist";
import { useWatchlist } from "@/lib/useWatchlist";
import TickerStrip from "./TickerStrip";
import FilterTabs from "./FilterTabs";
import SearchInput from "./SearchInput";
import WatchlistTable from "./WatchlistTable";

interface MarketsDashboardProps {
  initialData: WatchlistResponseDTO;
  watchlistId?: string;
}

export default function MarketsDashboard({
  initialData,
  watchlistId = "default-watchlist",
}: MarketsDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Custom hook managing shared star state across the app
  const { starredCoinIds, totalTracked, toggleStar } = useWatchlist(watchlistId);

  // Fetch market data for current tab, search query & page
  const { data, refetch } = useQuery<
    WatchlistResponseDTO & {
      page?: number;
      totalPages?: number;
      totalCount?: number;
      allMarketsCount?: number;
    }
  >({
    queryKey: ["marketsData", watchlistId, activeTab, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("tab", activeTab);
      if (searchQuery) params.set("q", searchQuery);
      params.set("page", currentPage.toString());
      params.set("limit", "40");

      const res = await fetch(`/api/watchlists/${watchlistId}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch markets data");
      return res.json();
    },
    initialData:
      activeTab === "all" && !searchQuery && currentPage === 1
        ? initialData
        : undefined,
    staleTime: 1000 * 4,
    refetchOnWindowFocus: true,
  });

  const displayData = data || initialData;

  // Sync each item's starred status with the global React Query watchlist state
  const itemsWithStarState = (displayData.items || []).map((coin) => ({
    ...coin,
    isStarred: starredCoinIds.has(coin.id),
  }));

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050810]">
      {/* Top Ticker Strip */}
      <TickerStrip onRefresh={refetch} />

      {/* Main Content Container */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 flex flex-col">
        {/* Page Title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight">
            All Crypto Markets
          </h1>
        </div>

        {/* Filter Bar: Left Pills, Right Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <FilterTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            watchlistCount={totalTracked}
            allMarketsCount={displayData.allMarketsCount ?? 100}
          />
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search coin or pair..."
          />
        </div>

        {/* Markets Table */}
        <WatchlistTable
          coins={itemsWithStarState}
          onStarToggle={toggleStar}
          currentPage={currentPage}
          totalPages={displayData.totalPages ?? 3}
          totalCount={displayData.totalCount ?? 100}
          pageSize={40}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
