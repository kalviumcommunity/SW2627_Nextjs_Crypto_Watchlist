"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { FilterTab } from "@/types/watchlist";

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  watchlistCount?: number;
  allMarketsCount?: number;
}

export default function FilterTabs({
  activeTab,
  onTabChange,
  watchlistCount = 0,
  allMarketsCount = 100,
}: FilterTabsProps) {
  const tabs: { id: FilterTab; label: string; count?: number; icon?: boolean; href?: string }[] = [
    { id: "watchlist", label: "My Watchlist", count: watchlistCount, icon: true, href: "/watchlist" },
    { id: "all", label: "All Markets", count: allMarketsCount, href: "/markets" },
    { id: "gainers", label: "Gainers" },
    { id: "losers", label: "Losers" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap" role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        const buttonContent = (
          <>
            {tab.icon && (
              <Star
                className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? "fill-[#F5B94D] text-[#F5B94D] scale-110" : "text-[#9AA4B2]"
                }`}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums transition-colors ${
                  isActive
                    ? "bg-[#FF5446]/20 text-white"
                    : "bg-[#1B2536] text-[#9AA4B2] group-hover:text-white"
                }`}
              >
                {tab.count}
              </span>
            )}
          </>
        );

        const className = `h-9 px-3.5 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40 ${
          isActive
            ? "bg-[#111827] border border-[#FF5446] text-white shadow-[0_0_12px_rgba(255,84,70,0.2)] font-semibold"
            : "bg-[#111827]/60 hover:bg-[#111827] text-[#9AA4B2] hover:text-white border border-[#232B3A] hover:border-[#374151]"
        }`;

        if (tab.href && !isActive) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => onTabChange(tab.id)}
              className={className}
              role="tab"
              aria-selected={isActive}
            >
              {buttonContent}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={className}
            role="tab"
            aria-selected={isActive}
          >
            {buttonContent}
          </button>
        );
      })}
    </div>
  );
}

