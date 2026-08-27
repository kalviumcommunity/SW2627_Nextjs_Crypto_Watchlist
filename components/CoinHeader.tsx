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
}

export default function CoinHeader({ coin }: CoinHeaderProps) {
  const displaySubtext = coin.network || coin.subtext || "Layer 1 Network";

  return (
    <div className="w-full mb-6">
      {/* A. Breadcrumb */}
      <Link
        href="/markets"
        className="inline-flex items-center gap-1.5 text-xs md:text-sm text-[#9AA4B2] hover:text-white mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Markets & Watchlist</span>
      </Link>

      {/* B. Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        {/* Left: Coin logo + details */}
        <div className="flex items-center gap-3.5 md:gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10131C] border border-[#232B3A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
            {coin.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {coin.name}
              </h1>
              <span className="border border-[#232B3A] bg-[#10131C] text-[#9AA4B2] text-xs font-mono font-medium px-2 py-0.5 rounded-md uppercase">
                {coin.symbol}/INR
              </span>
              <span className="border border-[#232B3A] bg-[#10131C] text-[#9AA4B2] text-xs font-medium px-2 py-0.5 rounded-md">
                Rank #{coin.rank}
              </span>
            </div>
            <p className="text-[#5B6472] text-[13px] font-normal mt-0.5">
              {displaySubtext}
            </p>
          </div>
        </div>

        {/* Right: Watchlist toggle + Trade button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <WatchlistToggleButton
            coinId={coin.id}
            variant="button"
            className="flex-1 md:flex-initial justify-center"
          />
          <button className="flex-1 md:flex-initial h-[40px] px-6 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm">
            Trade {coin.symbol}
          </button>
        </div>
      </div>
    </div>
  );
}
