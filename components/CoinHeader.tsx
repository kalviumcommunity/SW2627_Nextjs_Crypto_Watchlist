"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WatchlistToggleButton from "./WatchlistToggleButton";

interface CoinHeaderProps {
  coin: {
    id: string;
    symbol: string;
    name: string;
    rank: number;
    subtext?: string | null;
    network?: string | null;
  };
  lastUpdated?: Date | string | null;
}

export default function CoinHeader({ coin, lastUpdated }: CoinHeaderProps) {
  const displaySubtext = coin.network || coin.subtext || "Layer 1 Network";

  // Format last updated label
  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Just now";

  return (
    <div className="w-full mb-6">
      {/* A. Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/markets"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm text-[#9AA4B2] hover:text-white transition-colors font-medium group"
          aria-label="Back to Markets & Watchlist"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          <span>Back to Markets & Watchlist</span>
        </Link>

        {/* Live Market Pulse Indicator */}
        <div
          role="status"
          aria-label={`Live market feed active, last updated ${formattedLastUpdated}`}
          className="flex items-center gap-2 text-[11px] text-[#9AA4B2] font-medium bg-[#10131C] px-2.5 py-1 rounded-full border border-[#232B3A]"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1FB878] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1FB878]"></span>
          </span>
          <span>Live feed &middot; {formattedLastUpdated}</span>
        </div>
      </div>

      {/* B. Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        {/* Left: Coin logo + details */}
        <div className="flex items-center gap-3.5 md:gap-4 min-w-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#161F2E] to-[#10131C] border border-[#232B3A] flex items-center justify-center text-[#F5B94D] font-bold text-lg md:text-xl flex-shrink-0 shadow-md ring-1 ring-white/5" aria-hidden="true">
            {coin.symbol.slice(0, 3)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-white tracking-tight leading-tight truncate">
                {coin.name}
              </h1>
              <span className="border border-[#232B3A] bg-[#10131C] text-[#9AA4B2] text-xs font-mono font-semibold px-2 py-0.5 rounded-md uppercase">
                {coin.symbol}/INR
              </span>
              <span className="border border-[#F5B94D]/30 bg-[#F5B94D]/10 text-[#F5B94D] text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums">
                Rank #{coin.rank}
              </span>
            </div>
            <p className="text-[#9AA4B2] text-[13px] font-medium mt-1">
              {displaySubtext}
            </p>
          </div>
        </div>

        {/* Right: Watchlist toggle + Trade button */}
        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto">
          <WatchlistToggleButton
            coinId={coin.id}
            variant="button"
            className="flex-1 sm:flex-initial justify-center shadow-xs"
          />
          <button
            type="button"
            aria-label={`Trade ${coin.name} (${coin.symbol})`}
            className="flex-1 sm:flex-initial h-[40px] px-6 bg-[#FF5446] hover:bg-[#D63A2F] active:scale-95 text-white font-bold text-sm rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-[#FF5446]/20 cursor-pointer"
          >
            <span>Trade</span>
            <span className="font-mono">{coin.symbol}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

