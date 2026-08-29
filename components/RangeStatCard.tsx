import { formatINR } from "@/lib/formatters";

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
        <span className="text-[#5B6472] text-[11px] font-bold tracking-wider uppercase">
          24H RANGE
        </span>
        <span className="text-[#9AA4B2] text-[11px] font-semibold tabular-nums">
          {pct.toFixed(0)}% of range
        </span>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm mb-3 font-medium">
        <span className="text-[#9AA4B2]">
          Low: <span className="text-white font-semibold tabular-nums">{formatINR(low24h)}</span>
        </span>
        <span className="text-[#9AA4B2]">
          High: <span className="text-white font-semibold tabular-nums">{formatINR(high24h)}</span>
        </span>
      </div>

      {/* Horizontal Gradient Slider Bar */}
      <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-[#E5484D] via-[#F5B94D] to-[#1FB878] mt-2 mb-1 shadow-inner">
        <div
          className="w-3.5 h-3.5 bg-white border-2 border-[#111827] rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-300 ring-2 ring-white/20"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

