"use client";

import { Star } from "lucide-react";
import { FilterTab } from "@/types/watchlist";

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  watchlistCount: number;
  allMarketsCount: number;
}

export default function FilterTabs({
  activeTab,
  onTabChange,
  watchlistCount = 5,
  allMarketsCount = 10,
}: FilterTabsProps) {
  const tabs: { id: FilterTab; label: string; count?: number; icon?: boolean }[] = [
    { id: "watchlist", label: `My Watchlist (${watchlistCount})`, icon: true },
    { id: "all", label: `All Markets (${allMarketsCount})` },
    { id: "gainers", label: "Gainers" },
    { id: "losers", label: "Losers" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "bg-[#111827] border border-[#FF5446] text-white"
                : "bg-transparent text-[#9AA4B2] hover:text-white border border-transparent"
            }`}
          >
            {tab.icon && (
              <Star
                className={`w-4 h-4 ${
                  isActive ? "fill-[#F5B94D] text-[#F5B94D]" : "text-[#9AA4B2]"
                }`}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
