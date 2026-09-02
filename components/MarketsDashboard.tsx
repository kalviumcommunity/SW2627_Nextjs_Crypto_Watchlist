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

interface MarketsDashboardProps {
  initialData: WatchlistResponseDTO;
  watchlistId?: string;
}

export default function MarketsDashboard({
  initialData,
  watchlistId = "default-watchlist",
}: MarketsDashboardProps) {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as FilterTab) || "all";

  // Custom hook managing shared star state across the app
  const { starredCoinIds, totalTracked, toggleStar } = useWatchlist(watchlistId);

  // Custom hook managing search, multi-category, range filter & sort state via URL
  const {
    filters,
    activeFiltersCount,
    updateFilters,
    clearAllFilters,
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCoinSearch({
    watchlistId,
    tab: activeTab,
    initialData,
  });

  const displayData = data || initialData;

  // Sync each item's starred status with the global React Query watchlist state
  const itemsWithStarState = (displayData.items || []).map((coin) => ({
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

        {/* Filter Bar: Left Pills, Right Search Filter Bar */}
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
              onClick: () => handleTabChange("all"),
              variant: "primary",
            }}
            minHeight="min-h-[380px]"
          />
        ) : (
          <WatchlistTable
            coins={itemsWithStarState}
            onStarToggle={toggleStar}
            searchQuery={filters.q}
            isWatchlistTab={activeTab === "watchlist"}
            totalTracked={totalTracked}
            currentPage={displayData.page ?? filters.page}
            totalPages={displayData.totalPages ?? 1}
            totalCount={displayData.totalCount ?? 0}
            pageSize={40}
            onPageChange={handlePageChange}
            onClearFilters={clearAllFilters}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            onRetry={refetch}
          />
        )}
      </main>
    </div>
  );
}

