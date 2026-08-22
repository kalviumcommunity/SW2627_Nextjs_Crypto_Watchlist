"use client";

import { useEffect, useState } from "react";
import { Eye, BarChart2, PlusCircle, RefreshCw } from "lucide-react";

interface TickerStripProps {
  trackedCount: number;
  totalVolume: string;
  btcDominance: string;
  onRefresh?: () => void;
}

export default function TickerStrip({
  trackedCount = 5,
  totalVolume = "₹12,480.6 Cr",
  btcDominance = "58.4%",
  onRefresh,
}: TickerStripProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onRefresh) {
            onRefresh();
          }
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefresh]);

  return (
    <div className="h-[36px] bg-[#050810] border-b border-[#232B3A] px-6 flex items-center justify-between text-[13px] text-[#9AA4B2]">
      {/* 1. Tracked Coins */}
      <div className="flex items-center gap-2 pr-6 border-r border-[#232B3A] h-full flex-1 max-w-xs">
        <Eye className="w-4 h-4 text-[#9AA4B2]" />
        <span>Tracked: {trackedCount} Coins</span>
      </div>

      {/* 2. Total Volume */}
      <div className="flex items-center gap-2 px-6 border-r border-[#232B3A] h-full flex-1 max-w-xs justify-center">
        <BarChart2 className="w-4 h-4 text-[#9AA4B2]" />
        <span>Vol: {totalVolume}</span>
      </div>

      {/* 3. BTC Dominance */}
      <div className="flex items-center gap-2 px-6 border-r border-[#232B3A] h-full flex-1 max-w-xs justify-center">
        <PlusCircle className="w-4 h-4 text-[#9AA4B2]" />
        <span>BTC Dom: {btcDominance}</span>
      </div>

      {/* 4. Refresh Counter */}
      <div className="flex items-center gap-2 pl-6 justify-end flex-1">
        <RefreshCw className="w-3.5 h-3.5 text-[#FF5446] animate-spin-slow" />
        <span>
          Price Engine: Refresh in <span className="tabular-nums text-white font-medium">{countdown}s...</span>
        </span>
      </div>
    </div>
  );
}
