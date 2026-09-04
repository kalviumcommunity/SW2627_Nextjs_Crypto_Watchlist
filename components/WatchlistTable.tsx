"use client";

import { CoinDTO } from "@/types/watchlist";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import TableSkeleton from "./states/TableSkeleton";
import EmptyState from "./states/EmptyState";
import { FilterX, SearchX, Star, AlertCircle, RefreshCw } from "lucide-react";

interface WatchlistTableProps {
  coins: CoinDTO[];
  onStarToggle: (coinId: string, currentStarred: boolean) => void;
  searchQuery?: string;
  isWatchlistTab?: boolean;
  totalTracked?: number;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onClearFilters?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function WatchlistTable({
  coins,
  onStarToggle,
  searchQuery,
  isWatchlistTab = false,
  totalTracked,
  currentPage = 1,
  totalPages = 1,
  totalCount = coins.length,
  pageSize = 40,
  onPageChange,
  onClearFilters,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: WatchlistTableProps) {
  if (isError) {
    return (
      <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden shadow-lg">
        <EmptyState
          icon={AlertCircle}
          iconClassName="text-[#E5484D]"
          iconTileClassName="bg-[#3A1B22] border-[#E5484D]/30 shadow-[0_0_24px_rgba(229,72,77,0.15)]"
          title="Failed to load market data"
          description={
            errorMessage ||
            "Something went wrong while retrieving live market prices. Please check your connection and try again."
          }
          action={
            onRetry
              ? {
                  label: "Retry",
                  onClick: onRetry,
                  icon: RefreshCw,
                  variant: "primary",
                }
              : undefined
          }
          minHeight="min-h-[360px]"
        />
      </div>
    );
  }

  if (isLoading) {
    return <TableSkeleton rowCount={8} />;
  }

  const isEmpty = coins.length === 0;

  const renderEmptyContent = (minHeight: string) => {
    // 1. Empty Watchlist state (when on watchlist tab and 0 coins tracked, no search query)
    if (isWatchlistTab && totalTracked === 0 && !searchQuery?.trim()) {
      return (
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
          isBorderless
          minHeight={minHeight}
        />
      );
    }

    // 2. Search No-Results state (when a search query was entered)
    if (searchQuery && searchQuery.trim().length > 0) {
      return (
        <EmptyState
          icon={SearchX}
          iconClassName="text-[#9AA4B2]"
          iconTileClassName="bg-[#1B2536] border-[#232B3A]"
          title={`No results found for "${searchQuery.trim()}"`}
          description="We couldn't find any cryptocurrency matching your search. Check for typos or search by symbol or name."
          action={
            onClearFilters
              ? {
                  label: "Clear search query",
                  onClick: onClearFilters,
                  variant: "primary",
                }
              : undefined
          }
          isBorderless
          minHeight={minHeight}
        />
      );
    }

    // 3. Filter No-Results state (filters applied, e.g. price range / category / gainers / losers)
    return (
      <EmptyState
        icon={FilterX}
        iconClassName="text-[#FF5446]"
        iconTileClassName="bg-[#1B2536] border-[#232B3A]"
        title="No coins match your filters"
        description="Try adjusting your search query or clearing some active filters to see more results."
        action={
          onClearFilters
            ? {
                label: "Clear all filters",
                onClick: onClearFilters,
                variant: "primary",
              }
            : undefined
        }
        isBorderless
        minHeight={minHeight}
      />
    );
  };

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden shadow-lg transition-all">
      {/* Desktop Table View */}
      <table className="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr className="h-[44px] bg-[#10131C]/60 border-b border-[#232B3A] text-[12px] font-semibold text-[#5B6472] uppercase tracking-wider">
            <th className="w-12 px-3 text-center font-medium">#</th>
            <th className="px-4 font-medium">Asset</th>
            <th className="px-4 text-right font-medium">Price (INR)</th>
            <th className="px-4 text-center font-medium">24h Change</th>
            <th className="px-4 text-center font-medium w-[100px]">7D Trend</th>
            <th className="hidden xl:table-cell px-4 text-right font-medium">
              24h Volume
            </th>
            <th className="hidden xl:table-cell px-4 text-right font-medium">
              Market Cap
            </th>
            <th className="px-4 text-right font-medium min-w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {!isEmpty ? (
            coins.map((coin, idx) => (
              <TableRow
                key={coin.id}
                coin={coin}
                index={idx}
                onStarToggle={onStarToggle}
                variant="row"
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-0">
                {renderEmptyContent("min-h-[340px]")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile Card List (< 768px) */}
      <div className="md:hidden divide-y divide-[#232B3A]">
        {!isEmpty ? (
          coins.map((coin, idx) => (
            <TableRow
              key={coin.id}
              coin={coin}
              index={idx}
              onStarToggle={onStarToggle}
              variant="card"
            />
          ))
        ) : (
          renderEmptyContent("min-h-[280px]")
        )}
      </div>

      {/* Table Pagination Footer */}
      {!isEmpty && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

