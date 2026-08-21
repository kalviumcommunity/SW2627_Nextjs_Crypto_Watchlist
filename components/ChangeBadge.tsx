"use client";

import { formatPct } from "@/lib/formatters";

interface ChangeBadgeProps {
  changePct: number;
}

export default function ChangeBadge({ changePct }: ChangeBadgeProps) {
  const isPositive = changePct >= 0;

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-bold tabular-nums ${
        isPositive
          ? "bg-[#0F3D30] text-[#1FB878]"
          : "bg-[#3A1B22] text-[#E5484D]"
      }`}
    >
      {formatPct(changePct)}
    </span>
  );
}
