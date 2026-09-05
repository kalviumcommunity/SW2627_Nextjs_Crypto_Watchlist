import { formatINR } from "@/lib/formatters";
import { Gauge } from "lucide-react";

interface RangeStatCardProps {
  currentPrice: number;
  low24h: number;
  high24h: number;
}

export default function RangeStatCard({
  currentPrice,
  low24h,
  high24h,
}: RangeStatCardProps) {
  const range = high24h - low24h || 1;
  const pct = Math.max(0, Math.min(100, ((currentPrice - low24h) / range) * 100));

  return (
    <div className="bg-[#111827] border border-[#232B3A] hover:border-[#374151] transition-colors rounded-[10px] p-5 md:p-6 w-full shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#10131C] border border-[#232B3A] flex items-center justify-center text-[#9AA4B2]">
            <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-[#9AA4B2] text-[11px] font-bold tracking-wider uppercase">
            24H RANGE
          </span>
        </div>
        <span className="bg-[#10131C] text-[#9AA4B2] text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded border border-[#232B3A]">
          {pct.toFixed(0)}% of range
        </span>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm mb-3 font-medium">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#9AA4B2] uppercase font-semibold">24h Low</span>
          <span className="text-white font-bold tabular-nums text-sm md:text-base">{formatINR(low24h)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-[#9AA4B2] uppercase font-semibold">24h High</span>
          <span className="text-white font-bold tabular-nums text-sm md:text-base">{formatINR(high24h)}</span>
        </div>
      </div>

      {/* Horizontal Gradient Slider Bar */}
      <div
        role="meter"
        aria-label="24 hour price range position"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${pct.toFixed(0)}% between 24 hour low ${formatINR(low24h)} and high ${formatINR(high24h)}`}
        className="relative w-full h-2 rounded-full bg-gradient-to-r from-[#E5484D] via-[#F5B94D] to-[#1FB878] mt-2 mb-1 shadow-inner"
      >
        <div
          className="w-3.5 h-3.5 bg-white border-2 border-[#111827] rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-300 ring-2 ring-white/20"
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

