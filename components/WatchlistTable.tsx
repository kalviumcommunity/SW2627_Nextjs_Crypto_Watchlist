"use client";

import { CoinDTO } from "@/types/watchlist";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
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
    return (
      <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden shadow-lg p-6 space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-[#1B2536] rounded-lg w-full" />
        ))}
      </div>
    );
  }

  const isEmpty = coins.length === 0;

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden shadow-lg">
      {/* Desktop Table View */}
      <table className="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr className="h-[44px] bg-[#111827] border-b border-[#232B3A] text-[12px] font-medium text-[#5B6472]">
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
              <td colSpan={8} className="py-12 px-4 text-center">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-[#1B2536] border border-[#232B3A] flex items-center justify-center mb-4 text-[#FF5446]">
                    <FilterX className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    No coins match your filters
                  </h3>
                  <p className="text-xs text-[#9AA4B2] mb-5">
                    Try adjusting your search query or clearing some filters to see results.
                  </p>
                  {onClearFilters && (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="h-9 px-5 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
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
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1B2536] border border-[#232B3A] flex items-center justify-center mb-4 text-[#FF5446]">
              <FilterX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              No coins match your filters
            </h3>
            <p className="text-xs text-[#9AA4B2] mb-5 max-w-xs">
              Try adjusting your search query or clearing some filters to see results.
            </p>
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="h-9 px-5 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
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

