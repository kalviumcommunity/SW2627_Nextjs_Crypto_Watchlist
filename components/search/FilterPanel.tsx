"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  CategoryFilter,
  ChangeQuickFilter,
  CoinFilterState,
  MarketCapTier,
} from "@/types/watchlist";

interface FilterPanelProps {
  filters: CoinFilterState;
  activeFiltersCount: number;
  minDatasetPrice?: number;
  maxDatasetPrice?: number;
  onApplyFilters: (updated: Partial<CoinFilterState>) => void;
  onClearFilters: () => void;
}

const CATEGORY_ITEMS: { key: CategoryFilter; label: string }[] = [
  { key: "LAYER_1", label: "Layer 1" },
  { key: "DEFI", label: "DeFi" },
  { key: "STABLECOIN", label: "Stablecoin" },
  { key: "EXCHANGE_TOKEN", label: "Exchange Token" },
  { key: "MEME", label: "Meme" },
  { key: "SMART_CONTRACT", label: "Smart Contract" },
];

const MARKET_CAP_TIERS: { key: MarketCapTier; label: string }[] = [
  { key: "all", label: "All" },
  { key: "large", label: "Large Cap (>₹50k Cr)" },
  { key: "mid", label: "Mid Cap (₹5k–50k Cr)" },
  { key: "small", label: "Small Cap (<₹5k Cr)" },
];

export default function FilterPanel({
  filters,
  activeFiltersCount,
  minDatasetPrice = 0,
  maxDatasetPrice = 6000000,
  onApplyFilters,
  onClearFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Local staged state
  const [stagedCategories, setStagedCategories] = useState<CategoryFilter[]>(
    filters.categories
  );
  const [stagedPriceMin, setStagedPriceMin] = useState<string>(
    filters.priceMin !== null ? filters.priceMin.toString() : ""
  );
  const [stagedPriceMax, setStagedPriceMax] = useState<string>(
    filters.priceMax !== null ? filters.priceMax.toString() : ""
  );
  const [stagedChange, setStagedChange] = useState<ChangeQuickFilter>(
    filters.change
  );
  const [stagedChangeMin, setStagedChangeMin] = useState<number>(
    filters.changeMin !== null ? filters.changeMin : -100
  );
  const [stagedChangeMax, setStagedChangeMax] = useState<number>(
    filters.changeMax !== null ? filters.changeMax : 100
  );
  const [stagedCap, setStagedCap] = useState<MarketCapTier>(filters.cap);

  // Sync staged state whenever filters prop or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setStagedCategories(filters.categories);
      setStagedPriceMin(
        filters.priceMin !== null ? filters.priceMin.toString() : ""
      );
      setStagedPriceMax(
        filters.priceMax !== null ? filters.priceMax.toString() : ""
      );
      setStagedChange(filters.change);
      setStagedChangeMin(filters.changeMin !== null ? filters.changeMin : -100);
      setStagedChangeMax(filters.changeMax !== null ? filters.changeMax : 100);
      setStagedCap(filters.cap);
    }
  }, [isOpen, filters]);

  // Click outside listener for desktop popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleCategory = (cat: CategoryFilter) => {
    setStagedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleQuickChange = (val: ChangeQuickFilter) => {
    setStagedChange(val);
    if (val === "gainers") {
      setStagedChangeMin(0);
      setStagedChangeMax(100);
    } else if (val === "losers") {
      setStagedChangeMin(-100);
      setStagedChangeMax(0);
    } else {
      setStagedChangeMin(-100);
      setStagedChangeMax(100);
    }
  };

  const handleApply = () => {
    const pMin = stagedPriceMin.trim() !== "" ? parseFloat(stagedPriceMin) : null;
    const pMax = stagedPriceMax.trim() !== "" ? parseFloat(stagedPriceMax) : null;

    onApplyFilters({
      categories: stagedCategories,
      priceMin: pMin !== null && !isNaN(pMin) ? pMin : null,
      priceMax: pMax !== null && !isNaN(pMax) ? pMax : null,
      change: stagedChange,
      changeMin:
        stagedChangeMin > -100 || stagedChangeMax < 100 ? stagedChangeMin : null,
      changeMax:
        stagedChangeMin > -100 || stagedChangeMax < 100 ? stagedChangeMax : null,
      cap: stagedCap,
    });
    setIsOpen(false);
  };

  const handleClearStaged = () => {
    setStagedCategories([]);
    setStagedPriceMin("");
    setStagedPriceMax("");
    setStagedChange("any");
    setStagedChangeMin(-100);
    setStagedChangeMax(100);
    setStagedCap("all");
    onClearFilters();
    setIsOpen(false);
  };

  const isFilterActive = activeFiltersCount > 0;

  return (
    <div ref={popoverRef} className="relative shrink-0">
      {/* Filters Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-9 px-3.5 rounded-lg flex items-center gap-2 text-xs font-semibold border transition-all cursor-pointer outline-none relative ${
          isFilterActive
            ? "bg-[#111827] border-[#FF5446] text-white shadow-[0_0_12px_rgba(255,84,70,0.25)]"
            : "bg-[#10131C] border-[#232B3A] text-[#9AA4B2] hover:text-white hover:border-[#374151]"
        }`}
      >
        <SlidersHorizontal
          className={`w-4 h-4 ${
            isFilterActive ? "text-[#FF5446]" : "text-[#9AA4B2]"
          }`}
        />
        <span>Filters</span>

        {/* Red Dot Badge */}
        {isFilterActive && (
          <span className="w-2 h-2 rounded-full bg-[#FF5446] shadow-[0_0_6px_#FF5446]" />
        )}
      </button>

      {/* Filter Panel (Desktop Popover & Mobile Bottom Sheet) */}
      {isOpen && (
        <>
          {/* Mobile Backdrop Dim Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Container */}
          <div
            className="
              fixed inset-x-0 bottom-0 z-50 rounded-t-[20px] max-h-[85vh] overflow-y-auto
              md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-[360px] md:max-h-none md:rounded-xl md:shadow-[0_8px_24px_rgba(0,0,0,0.45)]
              bg-[#111827] border border-[#232B3A] p-5 text-xs text-white transition-all
            "
          >
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-[#232B3A] rounded-full mx-auto mb-4 md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#232B3A] mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF5446]" />
                <span>Filter Crypto Markets</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#9AA4B2] hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* 1. Category Multi-select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA4B2] mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_ITEMS.map((cat) => {
                    const isSelected = stagedCategories.includes(cat.key);
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => toggleCategory(cat.key)}
                        className={`px-2.5 py-1.5 rounded-md border text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#FF5446] bg-[#FF5446]/10 text-white font-semibold shadow-xs"
                            : "border-[#232B3A] bg-[#10131C] text-[#9AA4B2] hover:border-[#374151] hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Range (INR) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#9AA4B2]">
                    Price Range (INR)
                  </label>
                  <span className="text-[10px] text-[#9AA4B2]">
                    Default: ₹{minDatasetPrice.toLocaleString()} – ₹
                    {maxDatasetPrice.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#9AA4B2] block mb-1">
                      Min Price (₹)
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={stagedPriceMin}
                      onChange={(e) => setStagedPriceMin(e.target.value)}
                      className="w-full bg-[#10131C] border border-[#232B3A] focus:border-[#FF5446] rounded-md px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9AA4B2] block mb-1">
                      Max Price (₹)
                    </span>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={stagedPriceMax}
                      onChange={(e) => setStagedPriceMax(e.target.value)}
                      className="w-full bg-[#10131C] border border-[#232B3A] focus:border-[#FF5446] rounded-md px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 24h Change */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA4B2] mb-2">
                  24h Price Change
                </label>
                {/* Quick Select Radio Pills */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {(
                    [
                      { key: "any", label: "Any" },
                      { key: "gainers", label: "Gainers (≥0%)" },
                      { key: "losers", label: "Losers (<0%)" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleQuickChange(item.key)}
                      className={`py-1.5 px-2 rounded-md border text-[11px] font-medium text-center transition-all cursor-pointer ${
                        stagedChange === item.key
                          ? "border-[#FF5446] bg-[#FF5446]/10 text-white font-bold"
                          : "border-[#232B3A] bg-[#10131C] text-[#9AA4B2] hover:border-[#374151]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Fine-grained Range Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#9AA4B2]">
                    <span>Exact % Band</span>
                    <span className="font-mono text-white">
                      {stagedChangeMin}% to {stagedChangeMax}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="5"
                      value={stagedChangeMin}
                      onChange={(e) =>
                        setStagedChangeMin(
                          Math.min(
                            parseInt(e.target.value, 10),
                            stagedChangeMax
                          )
                        )
                      }
                      className="w-full accent-[#FF5446] bg-[#10131C] h-1.5 rounded-lg cursor-pointer"
                    />
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="5"
                      value={stagedChangeMax}
                      onChange={(e) =>
                        setStagedChangeMax(
                          Math.max(
                            parseInt(e.target.value, 10),
                            stagedChangeMin
                          )
                        )
                      }
                      className="w-full accent-[#FF5446] bg-[#10131C] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Market Cap Tier */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA4B2] mb-2">
                  Market Cap Tier
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MARKET_CAP_TIERS.map((tier) => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setStagedCap(tier.key)}
                      className={`py-1.5 px-2 rounded-md border text-[11px] font-medium text-left truncate transition-all cursor-pointer ${
                        stagedCap === tier.key
                          ? "border-[#FF5446] bg-[#FF5446]/10 text-white font-bold"
                          : "border-[#232B3A] bg-[#10131C] text-[#9AA4B2] hover:border-[#374151]"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="pt-4 mt-5 border-t border-[#232B3A] flex items-center justify-between sticky bottom-0 bg-[#111827]">
              <button
                type="button"
                onClick={handleClearStaged}
                className="text-[#9AA4B2] hover:text-white text-xs font-medium underline-offset-2 hover:underline cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
