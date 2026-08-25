"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const { data: historyData, isLoading } = useQuery<ChartHistoryDTO>({
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
        {isLoading ? (
          <div className="w-full h-[220px] flex items-center justify-center text-[#5B6472] text-sm animate-pulse">
            Loading chart data...
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
