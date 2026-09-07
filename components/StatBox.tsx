import { BarChart3, Globe, Coins, ShieldCheck } from "lucide-react";

interface MiniStatCardProps {
  label: string;
  value: string;
  type: "volume" | "mcap";
  subtext?: string;
}

export function MiniStatCard({ label, value, type, subtext }: MiniStatCardProps) {
  const Icon = type === "volume" ? BarChart3 : Globe;

  return (
    <div className="bg-[#111827] border border-[#232B3A] hover:border-[#374151] transition-colors rounded-[10px] p-4 sm:p-5 w-full flex flex-col justify-between shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-[#10131C] border border-[#232B3A] flex items-center justify-center text-[#9AA4B2]">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[#5B6472] text-[11px] font-bold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tabular-nums tracking-tight truncate">
        {value}
      </div>
      {subtext && (
        <span className="text-[11px] text-[#5B6472] font-medium mt-1">
          {subtext}
        </span>
      )}
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
    <div className="bg-[#111827] border border-[#232B3A] hover:border-[#374151] transition-colors rounded-[10px] p-5 md:p-6 w-full shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#10131C] border border-[#232B3A] flex items-center justify-center text-[#9AA4B2]">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#5B6472] text-[11px] font-bold tracking-wider uppercase">
            CIRCULATING SUPPLY
          </span>
        </div>
        <span className="bg-[#10131C] text-[#9AA4B2] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#232B3A] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#1FB878]" />
          <span>Max: {displayMax}</span>
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight tabular-nums truncate">
          {supply}
        </span>
        <span className="text-[#9AA4B2] text-sm md:text-base font-bold uppercase">
          {symbol}
        </span>
      </div>
    </div>
  );
}

