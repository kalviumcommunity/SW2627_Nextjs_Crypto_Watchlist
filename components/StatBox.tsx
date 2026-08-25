import { BarChart3, Globe, Coins } from "lucide-react";

interface MiniStatCardProps {
  label: string;
  value: string;
  type: "volume" | "mcap";
}

export function MiniStatCard({ label, value, type }: MiniStatCardProps) {
  const Icon = type === "volume" ? BarChart3 : Globe;

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 w-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#9AA4B2]" />
        <span className="text-[#5B6472] text-[11px] font-semibold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <div className="text-xl md:text-2xl font-bold text-white tabular-nums tracking-tight">
        {value}
      </div>
    </div>
  );
}

interface CirculatingSupplyCardProps {
  supply: string;
  symbol: string;
  maxSupply?: string | null;
}

export function CirculatingSupplyCard({
  supply,
  symbol,
  maxSupply = "Infinite",
}: CirculatingSupplyCardProps) {
  const displayMax = maxSupply || "Infinite";

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#9AA4B2]" />
          <span className="text-[#5B6472] text-[11px] font-semibold tracking-wider uppercase">
            CIRCULATING SUPPLY
          </span>
        </div>
        <span className="bg-[#10131C] text-[#9AA4B2] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#232B3A]">
          Max: {displayMax}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight tabular-nums">
          {supply}
        </span>
        <span className="text-[#9AA4B2] text-sm md:text-base font-semibold uppercase">
          {symbol}
        </span>
      </div>
    </div>
  );
}
