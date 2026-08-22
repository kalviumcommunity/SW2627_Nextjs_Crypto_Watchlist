"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";

interface TickerStripProps {
  vol24h?: string;
  btcDom?: string;
  ethDom?: string;
  totalMCap?: string;
  globalMarketPct?: string;
  onRefresh?: () => void;
}

export default function TickerStrip({
  vol24h = "₹6,45,230 Cr",
  btcDom = "52.4%",
  ethDom = "17.1%",
  totalMCap = "₹196L Cr",
  globalMarketPct = "+2.1%",
  onRefresh,
}: TickerStripProps) {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onRefresh) {
            onRefresh();
          }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefresh]);

  return (
    <div className="h-[36px] bg-[#10131C] border-b border-[#232B3A] px-4 md:px-6 flex items-center justify-between text-[13px] text-[#9AA4B2] overflow-x-auto whitespace-nowrap scrollbar-none">
      {/* Metrics List */}
      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-[13px]">
        {/* 24h Vol */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#5B6472]">24h Vol:</span>
          <span className="text-white font-medium tabular-nums">{vol24h}</span>
        </div>
        <span className="text-[#232B3A]">·</span>

        {/* BTC Dom */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#5B6472]">BTC Dom:</span>
          <span className="text-white font-medium tabular-nums">{btcDom}</span>
        </div>
        <span className="text-[#232B3A]">·</span>

        {/* ETH Dom */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#5B6472]">ETH Dom:</span>
          <span className="text-white font-medium tabular-nums">{ethDom}</span>
        </div>
        <span className="text-[#232B3A]">·</span>

        {/* Total MCap */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#5B6472]">Total MCap:</span>
          <span className="text-white font-medium tabular-nums">{totalMCap}</span>
        </div>
        <span className="text-[#232B3A]">·</span>

        {/* Global Market Change */}
        <div className="flex items-center gap-1 text-[#1FB878] font-medium bg-[#0F3D30]/60 px-2 py-0.5 rounded text-xs">
          <span>Global Market {globalMarketPct}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Right-aligned Refresh Countdown */}
      <div className="flex items-center gap-2 pl-4 text-xs md:text-[13px]">
        <RefreshCw className="w-3.5 h-3.5 text-[#FF5446] animate-spin-slow" />
        <span className="text-[#9AA4B2]">
          Refresh in <span className="tabular-nums text-white font-medium">{countdown}s</span>
        </span>
      </div>
    </div>
  );
}
