"use client";

import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { FilterTab, WatchlistResponseDTO } from "@/types/watchlist";
import { useWatchlist } from "@/lib/useWatchlist";
import { useCoinSearch } from "@/lib/useCoinSearch";
import TickerStrip from "./TickerStrip";
import FilterTabs from "./FilterTabs";
import WatchlistTable from "./WatchlistTable";
import SearchFilterBar from "./search/SearchFilterBar";
import ActiveFilterChips from "./search/ActiveFilterChips";
import EmptyState from "./states/EmptyState";

interface WatchlistDashboardProps {
  initialData: WatchlistResponseDTO;
  watchlistId?: string;
}

export default function WatchlistDashboard({
  initialData,
  watchlistId = "default-watchlist",
}: WatchlistDashboardProps) {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as FilterTab) || "watchlist";

  // Shared hook for star state synchronization across views
  const { starredCoinIds, totalTracked, toggleStar } = useWatchlist(watchlistId);

  // Search & filter hook scoped to watchlist
  const {
    filters,
    activeFiltersCount,
    updateFilters,
    clearAllFilters,
    data,
    isLoading,
    refetch,
  } = useCoinSearch({
    watchlistId,
    tab: activeTab,
    initialData,
  });

  const displayData = data || initialData;

  // Filter items and keep star state in sync with shared hook
  const items = (displayData.items || [])
    .filter((coin) => (activeTab === "watchlist" ? starredCoinIds.has(coin.id) : true))
    .map((coin) => ({
      ...coin,
      isStarred: starredCoinIds.has(coin.id),
    }));

  const isEmptyWatchlist =
    activeTab === "watchlist" && totalTracked === 0 && activeFiltersCount === 0;

  const handleTabChange = (tab: FilterTab) => {
    updateFilters({ tab, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <FilterTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              watchlistCount={totalTracked}
              allMarketsCount={displayData.allMarketsCount ?? 100}
            />
            <SearchFilterBar
              filters={filters}
              activeFiltersCount={activeFiltersCount}
              minDatasetPrice={displayData.minPrice}
              maxDatasetPrice={displayData.maxPrice}
              onUpdateFilters={updateFilters}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onUpdateFilters={updateFilters}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Empty Watchlist State Fallback */}
        {isEmptyWatchlist ? (
          <EmptyState
            icon={Star}
            iconClassName="text-[#F5B94D] fill-[#F5B94D]/20 animate-pulse"
            iconTileClassName="bg-[#1B2536] border-[#232B3A] shadow-[0_0_24px_rgba(245,185,77,0.15)]"
            title="Your watchlist is empty"
            description="Star coins from the market overview to add them here and monitor their performance closely."
            action={{
              label: "Explore all Coins",
              href: "/markets",
              variant: "primary",
            }}
            minHeight="min-h-[380px]"
          />
        ) : (
          <WatchlistTable
            coins={items}
            onStarToggle={toggleStar}
            currentPage={displayData.page ?? filters.page}
            totalPages={displayData.totalPages ?? 1}
            totalCount={displayData.totalCount ?? 0}
            pageSize={40}
            onPageChange={handlePageChange}
            onClearFilters={clearAllFilters}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

