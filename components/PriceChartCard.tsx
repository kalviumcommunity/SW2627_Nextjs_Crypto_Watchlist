"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { formatINR } from "@/lib/formatters";
import ChangeBadge from "./ChangeBadge";
import RangeSelector, { TimeRange } from "./RangeSelector";
import PriceChart, { ChartPoint } from "./PriceChart";

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

const rangeLabels: Record<TimeRange, string> = {
  "1H": "Past 1 Hour",
  "1D": "Past 24 Hours",
  "1W": "Past 7 Days",
  "1M": "Past 30 Days",
  "1Y": "Past 1 Year",
  "ALL": "All Time",
};

export default function PriceChartCard({
  symbol,
  initialPrice,
  initialChange24hPct,
  initialHistory,
}: PriceChartCardProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1W");
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

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
  const minPrice = historyData?.minPrice ?? initialHistory.minPrice;
  const maxPrice = historyData?.maxPrice ?? initialHistory.maxPrice;

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full shadow-sm">
      {/* Top row: Price + Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white tabular-nums tracking-tight leading-none">
              {formatINR(currentPriceDisplay)}
            </div>
            {hoveredPoint && (
              <span className="text-xs text-[#9AA4B2] font-mono bg-[#10131C] px-2 py-0.5 rounded border border-[#232B3A]">
                {hoveredPoint.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-2.5">
            <ChangeBadge changePct={changePctDisplay} />
            <span className="text-xs md:text-[13px] text-[#9AA4B2] font-medium">
              {hoveredPoint ? "Selected Point" : rangeLabels[selectedRange]}
            </span>
          </div>
        </div>

        {/* Range Segmented Control */}
        <div className="self-start sm:self-auto overflow-x-auto max-w-full">
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
      <div className="w-full relative min-h-[240px]">
        {isError ? (
          <div role="alert" className="w-full h-[240px] rounded-lg bg-[#10131C]/60 border border-[#232B3A]/40 flex flex-col items-center justify-center p-6 text-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-[#E5484D]" aria-hidden="true" />
            <div className="text-xs font-semibold text-white">
              Failed to load chart data
            </div>
            <div className="text-[11px] text-[#9AA4B2] max-w-xs">
              Unable to retrieve historical prices for this timeframe.
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              aria-label="Retry loading chart data"
              className="mt-1 px-3.5 py-1.5 bg-[#1B2536] hover:bg-[#232B3A] text-white text-xs font-medium rounded-md border border-[#232B3A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        ) : isLoading ? (
          <div role="status" aria-label="Loading price chart" className="w-full h-[240px] rounded-lg bg-[#10131C]/60 border border-[#232B3A]/30 flex flex-col justify-end p-4 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1B2536]/20 to-transparent animate-pulse" />
            <div className="w-full h-1/2 flex items-end justify-between gap-2 opacity-30">
              <div className="w-full h-1/3 bg-[#1B2536] rounded" />
              <div className="w-full h-2/3 bg-[#1B2536] rounded" />
              <div className="w-full h-1/2 bg-[#1B2536] rounded" />
              <div className="w-full h-3/4 bg-[#1B2536] rounded" />
              <div className="w-full h-2/5 bg-[#1B2536] rounded" />
              <div className="w-full h-4/5 bg-[#1B2536] rounded" />
              <div className="w-full h-full bg-[#1B2536] rounded" />
            </div>
            <div className="flex justify-between mt-3 pt-2 border-t border-[#232B3A]/40 text-[10px] text-[#9AA4B2]">
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

      {/* Period High / Low Footer Quick-Stats */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#232B3A]/60 text-xs text-[#9AA4B2]">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-[#E5484D]" aria-hidden="true" />
          <span className="text-[#9AA4B2] uppercase text-[10px] font-bold tracking-wider">
            {selectedRange} Low:
          </span>
          <span className="font-semibold text-white tabular-nums">
            {formatINR(minPrice)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#1FB878]" aria-hidden="true" />
          <span className="text-[#9AA4B2] uppercase text-[10px] font-bold tracking-wider">
            {selectedRange} High:
          </span>
          <span className="font-semibold text-white tabular-nums">
            {formatINR(maxPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
