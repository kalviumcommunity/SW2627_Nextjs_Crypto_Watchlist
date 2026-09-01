"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { FilterTab, WatchlistResponseDTO } from "@/types/watchlist";
import { useWatchlist } from "@/lib/useWatchlist";
import { useCoinSearch } from "@/lib/useCoinSearch";
import TickerStrip from "./TickerStrip";
import FilterTabs from "./FilterTabs";
import WatchlistTable from "./WatchlistTable";
import SearchFilterBar from "./search/SearchFilterBar";
import ActiveFilterChips from "./search/ActiveFilterChips";

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
          <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-8 md:p-14 flex flex-col items-center justify-center text-center my-auto min-h-[380px] shadow-lg relative overflow-hidden">
            {/* Subtle background ambient radial gradient */}
            <div className="absolute inset-0 bg-radial from-[#F5B94D]/5 via-transparent to-transparent pointer-events-none" />

            {/* Star Icon Tile */}
            <div className="w-16 h-16 rounded-2xl bg-[#1B2536] border border-[#232B3A] flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(245,185,77,0.15)] relative">
              <Star className="w-8 h-8 text-[#F5B94D] fill-[#F5B94D]/20 animate-pulse" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
              Your watchlist is empty
            </h3>
            <p className="text-xs md:text-sm text-[#9AA4B2] max-w-sm mb-6 leading-relaxed">
              You haven&apos;t added any cryptocurrency assets to your watchlist yet. Explore markets and star coins to track them here.
            </p>

            <Link
              href="/markets"
              className="h-10 px-6 bg-[#FF5446] hover:bg-[#D63A2F] active:scale-95 text-white font-bold text-sm rounded-lg transition-all inline-flex items-center gap-2 shadow-md cursor-pointer group"
            >
              <span>Explore all Coins</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
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

