"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { CoinDTO } from "@/types/watchlist";
import { formatINR } from "@/lib/formatters";
import ChangeBadge from "./ChangeBadge";
import Sparkline from "./Sparkline";

interface TableRowProps {
  coin: CoinDTO;
  index: number;
  onStarToggle: (coinId: string, currentStarred: boolean) => void;
  displayRank?: number;
}

export default function TableRow({
  coin,
  index,
  onStarToggle,
  displayRank,
}: TableRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/coins/${coin.symbol}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick();
    }
  };

  const rankNumber = displayRank ?? coin.rank ?? (index + 1);

  return (
    <>
      {/* Desktop & Tablet Table Row (>= 768px) */}
      <tr
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        className="hidden md:table-row h-[56px] border-b border-[#232B3A] hover:bg-[#1B2536] transition-colors cursor-pointer focus:outline-none focus:bg-[#1B2536]"
      >
        {/* Rank Number (#) */}
        <td className="w-12 px-3 text-center text-xs text-[#5B6472] tabular-nums font-medium">
          {rankNumber}
        </td>

        {/* Asset */}
        <td className="px-4">
          <div className="flex items-center gap-3">
            {/* 32px Circular Avatar Icon */}
            <div className="w-8 h-8 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              {coin.symbol.slice(0, 3)}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-white leading-tight">
                {coin.name}
              </span>
              <span className="text-[12px] text-[#5B6472] leading-tight font-medium">
                {coin.symbol}
              </span>
            </div>
          </div>
        </td>

        {/* Price (INR) */}
        <td className="px-4 text-right">
          <span className="text-[15px] font-medium text-white tabular-nums">
            {formatINR(coin.priceInr)}
          </span>
        </td>

        {/* 24h Change */}
        <td className="px-4 text-center">
          <ChangeBadge changePct={coin.change24hPct} />
        </td>

        {/* 7D Trend */}
        <td className="px-4 text-center w-[100px]">
          <Sparkline
            data={coin.sparkline7d}
            isPositive={coin.change24hPct >= 0}
          />
        </td>

        {/* 24h Volume */}
        <td className="px-4 text-right text-[14px] text-[#9AA4B2] tabular-nums">
          {coin.volume24h}
        </td>

        {/* Market Cap (Hidden on <1280px screens) */}
        <td className="hidden xl:table-cell px-4 text-right text-[14px] text-[#9AA4B2] tabular-nums">
          {coin.marketCap}
        </td>

        {/* Action Column: Star Icon + Trade Button */}
        <td className="px-4 text-right min-w-[120px]">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label={coin.isStarred ? "Unstar coin" : "Star coin"}
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(coin.id, coin.isStarred);
              }}
              className="p-1.5 rounded-md hover:bg-[#232B3A] text-[#9AA4B2] hover:scale-110 transition-all cursor-pointer"
            >
              <Star
                className={`w-4 h-4 ${
                  coin.isStarred
                    ? "fill-[#F5B94D] text-[#F5B94D]"
                    : "text-[#5B6472] hover:text-[#F5B94D]"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/coins/${coin.symbol}`);
              }}
              className="h-8 px-3 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-md transition-colors cursor-pointer"
            >
              Trade
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card View (< 768px) */}
      <div
        onClick={handleRowClick}
        className="md:hidden p-4 border-b border-[#232B3A] bg-[#111827] hover:bg-[#1B2536] transition-colors flex flex-col gap-3 cursor-pointer"
      >
        {/* Line 1: Icon, Name, Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center font-bold text-xs text-white">
              {coin.symbol.slice(0, 3)}
            </div>

            <div>
              <div className="text-sm font-semibold text-white">{coin.name}</div>
              <div className="text-xs text-[#5B6472] font-medium">{coin.symbol}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-white tabular-nums">
              {formatINR(coin.priceInr)}
            </div>
          </div>
        </div>

        {/* Line 2: Star Icon, Change Badge, Sparkline, Trade Button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#232B3A]/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={coin.isStarred ? "Unstar coin" : "Star coin"}
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(coin.id, coin.isStarred);
              }}
              className="p-1 rounded-md hover:bg-[#232B3A]"
            >
              <Star
                className={`w-4 h-4 ${
                  coin.isStarred ? "fill-[#F5B94D] text-[#F5B94D]" : "text-[#5B6472]"
                }`}
              />
            </button>
            <ChangeBadge changePct={coin.change24hPct} />
          </div>

          <Sparkline
            data={coin.sparkline7d}
            isPositive={coin.change24hPct >= 0}
            width={70}
            height={24}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/coins/${coin.symbol}`);
            }}
            className="h-8 px-4 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-md transition-colors"
          >
            Trade
          </button>
        </div>
      </div>
    </>
  );
}
