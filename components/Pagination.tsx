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
    <div className="h-[52px] bg-[#111827] border-t border-[#232B3A] px-4 md:px-6 flex items-center justify-between text-[13px] rounded-b-[10px]">
      {/* Left: Showing X-Y of N assets */}
      <div className="text-[#5B6472]">
        Showing{" "}
        <span className="text-white font-medium tabular-nums">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="text-white font-medium tabular-nums">
          {totalCount >= 100 ? `${totalCount}+` : totalCount}
        </span>{" "}
        assets
      </div>

      {/* Right: Prev Arrow, Numbered Pills, Next Arrow */}
      <div className="flex items-center gap-1.5">
        {/* Prev Arrow */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Pills */}
        {getPageNumbers().map((p, idx) => {
          if (typeof p === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-7 text-center text-[#5B6472] font-bold select-none"
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
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all tabular-nums ${
                isActive
                  ? "bg-[#FF5446] text-white shadow-sm"
                  : "bg-transparent text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] border border-transparent"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Arrow */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
