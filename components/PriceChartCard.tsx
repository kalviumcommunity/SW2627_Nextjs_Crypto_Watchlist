"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { formatINR } from "@/lib/formatters";
import ChangeBadge from "./ChangeBadge";
import RangeSelector, { TimeRange } from "./RangeSelector";
import PriceChart from "./PriceChart";

interface ChartHistoryDTO {
  symbol: string;
  range: string;
  currentPrice: number;
  changePct: number;
  isPositive: boolean;
  minPrice: number;
  maxPrice: number;
  data: Array<{ time: string; label: string; price: number }>;
}

interface PriceChartCardProps {
  symbol: string;
  initialPrice: number;
  initialChange24hPct: number;
  initialHistory: ChartHistoryDTO;
}

export default function PriceChartCard({
  symbol,
  initialPrice,
  initialChange24hPct,
  initialHistory,
}: PriceChartCardProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1W");
  const [hoveredPoint, setHoveredPoint] = useState<{
    price: number;
    label: string;
  } | null>(null);

  const { data: historyData, isLoading, isError, refetch } = useQuery<ChartHistoryDTO>({
    queryKey: ["coinHistory", symbol, selectedRange],
    queryFn: async () => {
      const res = await fetch(`/api/coins/${symbol}/history?range=${selectedRange}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    initialData: selectedRange === "1W" ? initialHistory : undefined,
    staleTime: 1000 * 30,
  });

  const chartData = historyData?.data ?? initialHistory.data ?? [];
  const isPositive = historyData?.isPositive ?? initialChange24hPct >= 0;
  const currentPriceDisplay = hoveredPoint
    ? hoveredPoint.price
    : historyData?.currentPrice ?? initialPrice;
  const changePctDisplay = historyData?.changePct ?? initialChange24hPct;

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full">
      {/* Top row: Price + Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-2xl md:text-[32px] font-bold text-white tabular-nums tracking-tight leading-none">
            {formatINR(currentPriceDisplay)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <ChangeBadge changePct={changePctDisplay} />
            <span className="text-xs md:text-sm text-[#9AA4B2]">Today</span>
          </div>
        </div>

        {/* Range Segmented Control */}
        <div className="self-start sm:self-auto overflow-x-auto">
          <RangeSelector
            selectedRange={selectedRange}
            onChange={(r) => {
              setSelectedRange(r);
              setHoveredPoint(null);
            }}
          />
        </div>
      </div>

      {/* Price Chart */}
      <div className="w-full relative min-h-[220px]">
        {isError ? (
          <div className="w-full h-[220px] rounded-lg bg-[#10131C]/60 border border-[#232B3A]/40 flex flex-col items-center justify-center p-6 text-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-[#E5484D]" />
            <div className="text-xs font-semibold text-white">
              Failed to load chart data
            </div>
            <div className="text-[11px] text-[#9AA4B2] max-w-xs">
              Unable to retrieve historical prices for this timeframe.
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-1 px-3.5 py-1.5 bg-[#1B2536] hover:bg-[#232B3A] text-white text-xs font-medium rounded-md border border-[#232B3A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="w-full h-[220px] rounded-lg bg-[#10131C]/60 border border-[#232B3A]/30 flex flex-col justify-end p-4 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1B2536]/20 to-transparent animate-pulse" />
            <div className="w-full h-1/2 flex items-end justify-between gap-2 opacity-30">
              <div className="w-full h-1/3 bg-[#1B2536] rounded-t" />
              <div className="w-full h-2/3 bg-[#1B2536] rounded-t" />
              <div className="w-full h-1/2 bg-[#1B2536] rounded-t" />
              <div className="w-full h-3/4 bg-[#1B2536] rounded-t" />
              <div className="w-full h-2/5 bg-[#1B2536] rounded-t" />
              <div className="w-full h-4/5 bg-[#1B2536] rounded-t" />
              <div className="w-full h-full bg-[#1B2536] rounded-t" />
            </div>
            <div className="flex justify-between mt-3 pt-2 border-t border-[#232B3A]/40 text-[10px] text-[#5B6472]">
              <div className="w-8 h-2.5 bg-[#1B2536] rounded" />
              <div className="w-8 h-2.5 bg-[#1B2536] rounded" />
              <div className="w-8 h-2.5 bg-[#1B2536] rounded" />
              <div className="w-8 h-2.5 bg-[#1B2536] rounded" />
            </div>
          </div>
        ) : (
          <PriceChart
            data={chartData}
            isPositive={isPositive}
            onHoverPoint={(pt) => setHoveredPoint(pt)}
          />
        )}
      </div>
    </div>
  );
}
