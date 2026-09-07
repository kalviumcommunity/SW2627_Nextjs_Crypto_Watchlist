"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortOption, SortDirection } from "@/types/watchlist";

interface SortDropdownProps {
  activeSort: SortOption;
  activeDir: SortDirection;
  onSortChange: (sort: SortOption, dir: SortDirection) => void;
}

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "rank", label: "Rank" },
  { key: "price", label: "Price" },
  { key: "change", label: "24h Change" },
  { key: "marketCap", label: "Market Cap" },
  { key: "volume", label: "24h Volume" },
  { key: "name", label: "Name (A–Z)" },
];

export default function SortDropdown({
  activeSort,
  activeDir,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentOptionLabel =
    SORT_OPTIONS.find((o) => o.key === activeSort)?.label || "Rank";

  const handleOptionClick = (optionKey: SortOption) => {
    if (activeSort === optionKey) {
      // Flip direction
      const nextDir = activeDir === "asc" ? "desc" : "asc";
      onSortChange(optionKey, nextDir);
    } else {
      // Default directions: for rank & name default asc, for price/change/marketCap/volume default desc
      const defaultDir: SortDirection =
        optionKey === "rank" || optionKey === "name" ? "asc" : "desc";
      onSortChange(optionKey, defaultDir);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-9 px-3 bg-[#10131C] border border-[#232B3A] hover:border-[#374151] text-[#9AA4B2] hover:text-white rounded-lg flex items-center gap-2 text-xs font-medium transition-all cursor-pointer outline-none focus:border-[#FF5446] focus:ring-1 focus:ring-[#FF5446]/30 shadow-xs"
        title={`Sort: ${currentOptionLabel} ${activeDir === "asc" ? "↑" : "↓"}`}
        aria-label={`Sort by ${currentOptionLabel}, ${activeDir === "asc" ? "ascending" : "descending"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-[#FF5446] shrink-0" aria-hidden="true" />
        
        {/* Label visible on desktop & mobile */}
        <span className="hidden sm:inline md:hidden lg:inline whitespace-nowrap">
          Sort: {currentOptionLabel}
        </span>
        <span className="inline sm:hidden whitespace-nowrap">
          {currentOptionLabel}
        </span>

        {/* Direction Indicator */}
        <span className="text-[11px] font-bold text-white shrink-0">
          {activeDir === "asc" ? "↑" : "↓"}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9AA4B2] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Sort options"
          className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-[#111827] border border-[#232B3A] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9AA4B2] border-b border-[#232B3A]/60 mb-1" aria-hidden="true">
            Sort By
          </div>
          {SORT_OPTIONS.map((option) => {
            const isActive = activeSort === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleOptionClick(option.key)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#1B2536] text-white font-semibold"
                    : "text-[#9AA4B2] hover:bg-[#1B2536]/60 hover:text-white"
                }`}
              >
                <span>{option.label}</span>
                {isActive && (
                  <span className="flex items-center gap-0.5 text-[#FF5446] font-bold text-xs">
                    {activeDir === "asc" ? (
                      <ArrowUp className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <ArrowDown className="w-3 h-3" aria-hidden="true" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

