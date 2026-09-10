"use client";

import SearchInput from "@/components/SearchInput";
import FilterPanel from "./FilterPanel";
import SortDropdown from "./SortDropdown";
import { CoinFilterState } from "@/types/watchlist";

interface SearchFilterBarProps {
  filters: CoinFilterState;
  activeFiltersCount: number;
  minDatasetPrice?: number;
  maxDatasetPrice?: number;
  onUpdateFilters: (updated: Partial<CoinFilterState>) => void;
  onClearFilters: () => void;
}

export default function SearchFilterBar({
  filters,
  activeFiltersCount,
  minDatasetPrice,
  maxDatasetPrice,
  onUpdateFilters,
  onClearFilters,
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
      {/* Search Input (Flex-grow on mobile) */}
      <div className="flex-1 min-w-[160px] sm:flex-initial">
        <SearchInput
          value={filters.q}
          onChange={(query) => onUpdateFilters({ q: query })}
          placeholder="Search coin or pair..."
        />
      </div>

      {/* Action buttons wrapper for mobile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Filters Button & Popover/Bottom Sheet Panel */}
        <FilterPanel
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          minDatasetPrice={minDatasetPrice}
          maxDatasetPrice={maxDatasetPrice}
          onApplyFilters={onUpdateFilters}
          onClearFilters={onClearFilters}
        />

        {/* Sort Dropdown */}
        <SortDropdown
          activeSort={filters.sort}
          activeDir={filters.dir}
          onSortChange={(sort, dir) => onUpdateFilters({ sort, dir })}
        />
      </div>
    </div>
  );
}
