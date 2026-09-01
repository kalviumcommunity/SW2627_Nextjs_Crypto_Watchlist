"use client";

import { CoinDTO } from "@/types/watchlist";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import TableSkeleton from "./states/TableSkeleton";
import EmptyState from "./states/EmptyState";
import { FilterX } from "lucide-react";

interface WatchlistTableProps {
  coins: CoinDTO[];
  onStarToggle: (coinId: string, currentStarred: boolean) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onClearFilters?: () => void;
  isLoading?: boolean;
}

export default function WatchlistTable({
  coins,
  onStarToggle,
  currentPage = 1,
  totalPages = 1,
  totalCount = coins.length,
  pageSize = 40,
  onPageChange,
  onClearFilters,
  isLoading = false,
}: WatchlistTableProps) {
  if (isLoading) {
    return <TableSkeleton rowCount={8} />;
  }

  const isEmpty = coins.length === 0;

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
            <th className="px-4 text-right font-medium">24h Volume</th>
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
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-0">
                <EmptyState
                  icon={FilterX}
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
                  minHeight="min-h-[340px]"
                />
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
            />
          ))
        ) : (
          <EmptyState
            icon={FilterX}
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
            minHeight="min-h-[280px]"
          />
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

