"use client";

import { CoinDTO } from "@/types/watchlist";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

interface WatchlistTableProps {
  coins: CoinDTO[];
  onStarToggle: (coinId: string, currentStarred: boolean) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export default function WatchlistTable({
  coins,
  onStarToggle,
  currentPage = 1,
  totalPages = 1,
  totalCount = coins.length,
  pageSize = 40,
  onPageChange,
}: WatchlistTableProps) {
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
          {coins.length > 0 ? (
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
              <td
                colSpan={8}
                className="h-32 text-center text-sm text-[#9AA4B2]"
              >
                No crypto assets found matching criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile Card List (< 768px) */}
      <div className="md:hidden divide-y divide-[#232B3A]">
        {coins.length > 0 ? (
          coins.map((coin, idx) => (
            <TableRow
              key={coin.id}
              coin={coin}
              index={idx}
              onStarToggle={onStarToggle}
            />
          ))
        ) : (
          <div className="p-8 text-center text-sm text-[#9AA4B2]">
            No crypto assets found matching criteria.
          </div>
        )}
      </div>

      {/* Table Pagination Footer */}
      {onPageChange && (
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
