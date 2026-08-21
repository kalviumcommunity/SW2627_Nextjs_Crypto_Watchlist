"use client";

import { Star } from "lucide-react";
import { CoinDTO } from "@/types/watchlist";
import TableRow from "./TableRow";

interface WatchlistTableProps {
  coins: CoinDTO[];
  onStarToggle: (coinId: string, currentStarred: boolean) => void;
}

export default function WatchlistTable({
  coins,
  onStarToggle,
}: WatchlistTableProps) {
  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden">
      {/* Desktop Table View */}
      <table className="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr className="h-[44px] bg-[#111827] border-b border-[#232B3A] text-[12px] font-medium text-[#5B6472]">
            <th className="w-10 px-3 text-center">
              <Star className="w-3.5 h-3.5 mx-auto text-[#5B6472]" />
            </th>
            <th className="w-10 text-center font-medium">#</th>
            <th className="px-4 font-medium">Asset</th>
            <th className="px-4 text-right font-medium">Price (INR)</th>
            <th className="px-4 text-center font-medium">24h Change</th>
            <th className="px-4 text-center font-medium w-[100px]">7D Trend</th>
            <th className="px-4 text-right font-medium">24h Volume</th>
            <th className="hidden xl:table-cell px-4 text-right font-medium">
              Market Cap
            </th>
            <th className="px-4 text-right font-medium w-[90px]">Action</th>
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
                colSpan={9}
                className="h-32 text-center text-sm text-[#9AA4B2]"
              >
                No assets found matching criteria.
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
            No assets found matching criteria.
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="h-[44px] bg-[#111827] border-t border-[#232B3A] px-4 flex items-center justify-between text-[13px]">
        <div className="text-[#5B6472]">
          Showing {coins.length > 0 ? `1-${coins.length}` : 0} of {coins.length} assets
        </div>
        <div className="flex items-center gap-4 text-[#9AA4B2]">
          <button
            disabled
            className="opacity-40 cursor-not-allowed text-xs font-medium"
          >
            Prev
          </button>
          <button
            disabled
            className="opacity-40 cursor-not-allowed text-xs font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
