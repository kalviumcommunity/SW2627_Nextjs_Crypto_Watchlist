"use client";

export type TimeRange = "1D" | "1W" | "1M" | "1Y" | "ALL";

interface RangeSelectorProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

const ranges: TimeRange[] = ["1D", "1W", "1M", "1Y", "ALL"];

export default function RangeSelector({
  selectedRange,
  onChange,
}: RangeSelectorProps) {
  return (
    <div className="bg-[#10131C] p-1 rounded-lg border border-[#232B3A] inline-flex items-center gap-0.5 select-none">
      {ranges.map((range) => {
        const isActive = selectedRange === range;
        return (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={`px-2.5 md:px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-[#1B2536] text-white shadow-sm"
                : "text-[#9AA4B2] hover:text-white hover:bg-[#1B2536]/50"
            }`}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}
