"use client";

import { X } from "lucide-react";
import {
  CategoryFilter,
  CoinFilterState,
} from "@/types/watchlist";

interface ActiveFilterChipsProps {
  filters: CoinFilterState;
  onUpdateFilters: (updated: Partial<CoinFilterState>) => void;
  onClearAll: () => void;
}

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  LAYER_1: "Layer 1",
  DEFI: "DeFi",
  STABLECOIN: "Stablecoin",
  EXCHANGE_TOKEN: "Exchange Token",
  MEME: "Meme",
  SMART_CONTRACT: "Smart Contract",
};

export default function ActiveFilterChips({
  filters,
  onUpdateFilters,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chipItems: { id: string; label: string; onRemove: () => void }[] = [];

  // Search query chip
  if (filters.q) {
    chipItems.push({
      id: "q",
      label: `Search: "${filters.q}"`,
      onRemove: () => onUpdateFilters({ q: "" }),
    });
  }

  // Category chips
  filters.categories.forEach((cat) => {
    chipItems.push({
      id: `cat-${cat}`,
      label: `Category: ${CATEGORY_LABELS[cat] || cat}`,
      onRemove: () =>
        onUpdateFilters({
          categories: filters.categories.filter((c) => c !== cat),
        }),
    });
  });

  // Price range chip
  if (filters.priceMin !== null || filters.priceMax !== null) {
    const minText =
      filters.priceMin !== null ? `₹${filters.priceMin.toLocaleString()}` : "₹0";
    const maxText =
      filters.priceMax !== null
        ? `₹${filters.priceMax.toLocaleString()}`
        : "Any";
    chipItems.push({
      id: "price",
      label: `Price: ${minText} – ${maxText}`,
      onRemove: () => onUpdateFilters({ priceMin: null, priceMax: null }),
    });
  }

  // 24h Change chip
  if (filters.change !== "any") {
    chipItems.push({
      id: "change-quick",
      label:
        filters.change === "gainers" ? "Gainers (≥0%)" : "Losers (<0%)",
      onRemove: () => onUpdateFilters({ change: "any" }),
    });
  } else if (filters.changeMin !== null || filters.changeMax !== null) {
    const minStr = filters.changeMin !== null ? `${filters.changeMin}%` : "-100%";
    const maxStr = filters.changeMax !== null ? `${filters.changeMax}%` : "100%";
    chipItems.push({
      id: "change-range",
      label: `Change: ${minStr} to ${maxStr}`,
      onRemove: () => onUpdateFilters({ changeMin: null, changeMax: null }),
    });
  }

  // Market Cap chip
  if (filters.cap !== "all") {
    const capLabels: Record<string, string> = {
      large: "Large Cap (>₹50k Cr)",
      mid: "Mid Cap (₹5k–50k Cr)",
      small: "Small Cap (<₹5k Cr)",
    };
    chipItems.push({
      id: "cap",
      label: `Market Cap: ${capLabels[filters.cap] || filters.cap}`,
      onRemove: () => onUpdateFilters({ cap: "all" }),
    });
  }

  if (chipItems.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-3 scrollbar-none text-xs">
      <span className="text-[11px] text-[#9AA4B2] font-semibold shrink-0 uppercase tracking-wider">
        Active Filters:
      </span>
      {chipItems.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B2536] border border-[#232B3A] text-white text-[11px] font-medium shrink-0 shadow-xs"
        >
          <span>{item.label}</span>
          <button
            type="button"
            onClick={item.onRemove}
            className="hover:bg-[#232B3A] p-0.5 rounded-full text-[#9AA4B2] hover:text-white transition-colors cursor-pointer"
            title="Remove filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {chipItems.length >= 2 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-[#FF5446] hover:text-[#D63A2F] text-[11px] font-bold underline-offset-2 hover:underline ml-1 shrink-0 cursor-pointer"
        >
          Clear all ×
        </button>
      )}
    </div>
  );
}
