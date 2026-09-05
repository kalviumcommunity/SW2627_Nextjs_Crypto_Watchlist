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
  variant?: "row" | "card";
}

export default function TableRow({
  coin,
  index,
  onStarToggle,
  displayRank,
  variant,
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

  const renderRow = () => (
    <tr
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${coin.name} (${coin.symbol})`}
      className={`${
        variant === "row" ? "" : "hidden md:table-row"
      } h-[56px] border-b border-[#232B3A] hover:bg-[#1B2536]/80 transition-colors cursor-pointer focus:outline-none focus:bg-[#1B2536] group`}
    >
      {/* Rank Number (#) */}
      <td className="w-12 px-3 text-center text-xs text-[#9AA4B2] tabular-nums font-semibold">
        {rankNumber}
      </td>

      {/* Asset */}
      <td className="px-4">
        <div className="flex items-center gap-3">
          {/* 32px Circular Avatar Icon */}
          <div className="w-8 h-8 rounded-full bg-[#10131C] border border-[#232B3A] flex items-center justify-center font-bold text-xs text-[#F5B94D] flex-shrink-0 group-hover:border-[#374151] transition-colors shadow-xs" aria-hidden="true">
            {coin.symbol.slice(0, 3)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-white leading-tight truncate">
              {coin.name}
            </span>
            <span className="text-[11px] text-[#9AA4B2] leading-tight font-medium uppercase font-mono">
              {coin.symbol}
            </span>
          </div>
        </div>
      </td>

      {/* Price (INR) */}
      <td className="px-4 text-right">
        <span className="text-[14px] md:text-[15px] font-bold text-white tabular-nums">
          {formatINR(coin.priceInr)}
        </span>
      </td>

      {/* 24h Change */}
      <td className="px-4 text-center">
        <ChangeBadge changePct={coin.change24hPct} />
      </td>

      {/* 7D Trend */}
      <td className="px-4 text-center w-[100px]">
        <div className="flex justify-center">
          <Sparkline
            data={coin.sparkline7d}
            isPositive={coin.change24hPct >= 0}
          />
        </div>
      </td>

      {/* 24h Volume (Hidden on Tablet <1280px, shown on Desktop >=1280px) */}
      <td className="hidden xl:table-cell px-4 text-right text-[13px] text-[#9AA4B2] tabular-nums font-medium">
        {coin.volume24h}
      </td>

      {/* Market Cap (Hidden on Tablet <1280px, shown on Desktop >=1280px) */}
      <td className="hidden xl:table-cell px-4 text-right text-[13px] text-[#9AA4B2] tabular-nums font-medium">
        {coin.marketCap}
      </td>

      {/* Action Column: Star Icon + Trade Button */}
      <td className="px-4 text-right min-w-[120px]">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={coin.isStarred ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
            aria-pressed={coin.isStarred}
            onClick={(e) => {
              e.stopPropagation();
              onStarToggle(coin.id, coin.isStarred);
            }}
            className="p-2 rounded-md hover:bg-[#232B3A] text-[#9AA4B2] hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
          >
            <Star
              aria-hidden="true"
              className={`w-4 h-4 transition-colors ${
                coin.isStarred
                  ? "fill-[#F5B94D] text-[#F5B94D]"
                  : "text-[#9AA4B2] hover:text-[#F5B94D]"
              }`}
            />
          </button>

          <button
            type="button"
            aria-label={`Trade ${coin.name}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/coins/${coin.symbol}`);
            }}
            className="h-8 px-3.5 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            Trade
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = () => (
    <div
      tabIndex={0}
      role="button"
      aria-label={`View details for ${coin.name} (${coin.symbol})`}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      className={`${
        variant === "card" ? "" : "md:hidden"
      } p-3.5 sm:p-4 border-b border-[#232B3A] bg-[#111827] hover:bg-[#1B2536]/80 transition-colors flex flex-col gap-3 cursor-pointer active:bg-[#1B2536] focus:outline-none focus:bg-[#1B2536]`}
    >
      {/* Row 1: Coin icon + coin name + symbol + price */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Rank badge */}
          <span className="text-[11px] font-bold text-[#9AA4B2] tabular-nums min-w-[20px] text-center">
            #{rankNumber}
          </span>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#10131C] border border-[#232B3A] flex items-center justify-center font-bold text-xs text-[#F5B94D] shrink-0" aria-hidden="true">
            {coin.symbol.slice(0, 3)}
          </div>

          {/* Name + Symbol */}
          <div className="min-w-0 flex flex-col">
            <span className="text-[14px] font-semibold text-white truncate leading-tight">
              {coin.name}
            </span>
            <span className="text-[11px] text-[#9AA4B2] font-mono uppercase leading-tight mt-0.5">
              {coin.symbol}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <span className="text-[15px] font-bold text-white tabular-nums leading-tight">
            {formatINR(coin.priceInr)}
          </span>
        </div>
      </div>

      {/* Row 2: 24h change badge + 7d sparkline (left) & Star toggle + Trade button (right) */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#232B3A]/50">
        <div className="flex items-center gap-3">
          <ChangeBadge changePct={coin.change24hPct} />
          <Sparkline
            data={coin.sparkline7d}
            isPositive={coin.change24hPct >= 0}
            width={64}
            height={22}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={coin.isStarred ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
            aria-pressed={coin.isStarred}
            onClick={(e) => {
              e.stopPropagation();
              onStarToggle(coin.id, coin.isStarred);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#232B3A] active:scale-95 text-[#9AA4B2] transition-colors cursor-pointer border border-transparent hover:border-[#232B3A]"
          >
            <Star
              aria-hidden="true"
              className={`w-4 h-4 ${
                coin.isStarred
                  ? "fill-[#F5B94D] text-[#F5B94D]"
                  : "text-[#9AA4B2]"
              }`}
            />
          </button>

          <button
            type="button"
            aria-label={`Trade ${coin.name}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/coins/${coin.symbol}`);
            }}
            className="h-9 px-4 bg-[#FF5446] hover:bg-[#D63A2F] active:scale-95 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center"
          >
            Trade
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === "row") {
    return renderRow();
  }

  if (variant === "card") {
    return renderCard();
  }

  return (
    <>
      {renderRow()}
      {renderCard()}
    </>
  );
}

