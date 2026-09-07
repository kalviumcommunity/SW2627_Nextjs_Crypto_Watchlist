"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 3,
  totalCount = 100,
  pageSize = 40,
  onPageChange,
}: PaginationProps) {
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers array with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("…");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className="h-[52px] bg-[#10131C]/60 border-t border-[#232B3A] px-4 md:px-6 flex items-center justify-between text-[13px] rounded-b-[10px]"
    >
      {/* Left: Showing X-Y of N assets */}
      <div className="text-[#9AA4B2] text-xs">
        <span className="hidden sm:inline">Showing </span>
        <span className="text-white font-semibold tabular-nums">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="text-white font-semibold tabular-nums">
          {totalCount >= 100 ? `${totalCount}+` : totalCount}
        </span>{" "}
        <span className="hidden sm:inline">assets</span>
      </div>

      {/* Right: Prev Arrow, Numbered Pills, Next Arrow */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Prev Arrow */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#9AA4B2] disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Page Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-6 text-center text-[#9AA4B2] font-bold select-none text-xs"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={isActive ? "page" : undefined}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all tabular-nums cursor-pointer focus:outline-none ${
                  isActive
                    ? "bg-[#FF5446] text-white shadow-sm font-extrabold"
                    : "bg-transparent text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] border border-transparent"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#9AA4B2] disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

