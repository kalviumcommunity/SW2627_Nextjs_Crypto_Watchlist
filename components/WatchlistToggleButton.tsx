"use client";

import { Star } from "lucide-react";
import { useWatchlist } from "@/lib/useWatchlist";

interface WatchlistToggleButtonProps {
  coinId: string;
  variant?: "button" | "star";
  className?: string;
}

export default function WatchlistToggleButton({
  coinId,
  variant = "button",
  className = "",
}: WatchlistToggleButtonProps) {
  const { starredCoinIds, toggleStar, isPending } = useWatchlist();
  const isStarred = starredCoinIds.has(coinId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(coinId, isStarred);
  };

  if (variant === "star") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        title={isStarred ? "Remove from watchlist" : "Add to watchlist"}
        className={`p-1.5 rounded hover:bg-[#1B2536] transition-colors ${className}`}
      >
        <Star
          className={`w-4 h-4 transition-colors ${
            isStarred
              ? "fill-[#F5B94D] text-[#F5B94D]"
              : "text-[#5B6472] hover:text-[#9AA4B2]"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`h-[40px] px-4 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
        isStarred
          ? "bg-[#F5B94D]/10 border border-[#F5B94D]/40 text-[#F5B94D] hover:bg-[#F5B94D]/20 shadow-sm"
          : "bg-[#111827] border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:border-[#5B6472]"
      } ${className}`}
    >
      <Star
        className={`w-4 h-4 ${
          isStarred ? "fill-[#F5B94D] text-[#F5B94D]" : "text-[#9AA4B2]"
        }`}
      />
      <span>{isStarred ? "Watchlisted" : "Add to Watchlist"}</span>
    </button>
  );
}
