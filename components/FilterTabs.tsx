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
  watchlistCount = 5,
  allMarketsCount = 100,
}: FilterTabsProps) {
  const tabs: { id: FilterTab; label: string; count?: number; icon?: boolean; href?: string }[] = [
    { id: "watchlist", label: `My Watchlist (${watchlistCount})`, icon: true, href: "/watchlist" },
    { id: "all", label: `All Markets (${allMarketsCount})`, href: "/markets" },
    { id: "gainers", label: "Gainers" },
    { id: "losers", label: "Losers" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        const buttonContent = (
          <>
            {tab.icon && (
              <Star
                className={`w-4 h-4 ${
                  isActive ? "fill-[#F5B94D] text-[#F5B94D]" : "text-[#9AA4B2]"
                }`}
              />
            )}
            {tab.label}
          </>
        );

        const className = `h-9 px-4 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
          isActive
            ? "bg-[#111827] border border-[#FF5446] text-white shadow-sm"
            : "bg-[#111827]/40 hover:bg-[#111827] text-[#9AA4B2] hover:text-white border border-[#232B3A]/60"
        }`;

        if (tab.href && !isActive) {
          return (
            <Link key={tab.id} href={tab.href} onClick={() => onTabChange(tab.id)} className={className}>
              {buttonContent}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={className}
          >
            {buttonContent}
          </button>
        );
      })}
    </div>
  );
}
