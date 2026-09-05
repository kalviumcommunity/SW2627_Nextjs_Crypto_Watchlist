"use client";

import { useState, useRef, useId, useCallback } from "react";
import { formatINR } from "@/lib/formatters";

export interface ChartPoint {
  time: string;
  label: string;
  price: number;
}

interface PriceChartProps {
  data: ChartPoint[];
  isPositive: boolean;
  onHoverPoint?: (point: ChartPoint | null) => void;
}

export default function PriceChart({
  data,
  isPositive,
  onHoverPoint,
}: PriceChartProps) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const updateHover = useCallback(
    (clientX: number) => {
      if (!containerRef.current || !data || data.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const relativeX = Math.max(0, Math.min(mouseX / rect.width, 1));
      const closestIdx = Math.round(relativeX * (data.length - 1));
      setHoverIndex(closestIdx);
      if (onHoverPoint && data[closestIdx]) {
        onHoverPoint(data[closestIdx]);
      }
    },
    [data, onHoverPoint]
  );

  const clearHover = useCallback(() => {
    setHoverIndex(null);
    if (onHoverPoint) {
      onHoverPoint(null);
    }
  }, [onHoverPoint]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[240px] flex items-center justify-center text-[#5B6472] text-sm">
        No chart data available
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const startPrice = prices[0] || minPrice;

  // Chart dimensions in viewBox SVG coordinate system
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingY = 24;

  // Calculate coordinates for points
  const points = data.map((d, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * svgWidth : svgWidth / 2;
    const normalizedY = (d.price - minPrice) / priceRange;
    // Invert Y for SVG space
    const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
    return { x, y, data: d };
  });

  // Build SVG smooth path using Bezier curves
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }

  // Gradient closed area path
  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  const strokeColor = isPositive ? "#1FB878" : "#E5484D";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateHover(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updateHover(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!data || data.length === 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = hoverIndex === null ? 0 : Math.min(hoverIndex + 1, data.length - 1);
      setHoverIndex(nextIdx);
      if (onHoverPoint && data[nextIdx]) onHoverPoint(data[nextIdx]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = hoverIndex === null ? data.length - 1 : Math.max(hoverIndex - 1, 0);
      setHoverIndex(prevIdx);
      if (onHoverPoint && data[prevIdx]) onHoverPoint(data[prevIdx]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHoverIndex(0);
      if (onHoverPoint && data[0]) onHoverPoint(data[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      const lastIdx = data.length - 1;
      setHoverIndex(lastIdx);
      if (onHoverPoint && data[lastIdx]) onHoverPoint(data[lastIdx]);
    } else if (e.key === "Escape") {
      clearHover();
    }
  };

  const hoveredPt = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  // Percentage difference from start of period for hovered point
  let hoverPctChange = 0;
  if (hoveredPt) {
    hoverPctChange = ((hoveredPt.data.price - startPrice) / startPrice) * 100;
  }

  // Calculate horizontal tooltip alignment based on X position to avoid screen clipping
  const xRatio = hoveredPt ? hoveredPt.x / svgWidth : 0.5;
  const tooltipTransform =
    xRatio < 0.15
      ? "translateX(0%)"
      : xRatio > 0.85
      ? "translateX(-100%)"
      : "translateX(-50%)";

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseLeave={clearHover}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={clearHover}
      onKeyDown={handleKeyDown}
      className="relative w-full h-[240px] cursor-crosshair select-none touch-pan-x focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6CB0] rounded-lg"
      role="region"
      aria-label="Interactive price trend chart. Use left and right arrow keys to inspect data points across time."
    >
      {/* Background horizontal grid guides */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-6" aria-hidden="true">
        <div className="border-b border-[#232B3A] w-full" />
        <div className="border-b border-[#232B3A] w-full" />
        <div className="border-b border-[#232B3A] w-full" />
      </div>

      {/* SVG Chart Graphic */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.28} />
            <stop offset="75%" stopColor={strokeColor} stopOpacity={0.05} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Gradient fill under curve */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Crosshair Vertical Guide & Indicator */}
        {hoveredPt && (
          <g>
            <line
              x1={hoveredPt.x}
              y1={0}
              x2={hoveredPt.x}
              y2={svgHeight}
              stroke="#232B3A"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Subtle horizontal baseline guide */}
            <line
              x1={0}
              y1={hoveredPt.y}
              x2={svgWidth}
              y2={hoveredPt.y}
              stroke="#232B3A"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.6"
            />
            {/* Outer halo ring */}
            <circle
              cx={hoveredPt.x}
              cy={hoveredPt.y}
              r="8"
              fill={strokeColor}
              fillOpacity="0.3"
            />
            {/* Active Data Point Dot */}
            <circle
              cx={hoveredPt.x}
              cy={hoveredPt.y}
              r="4.5"
              fill={strokeColor}
              stroke="#0B0F17"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Floating Interactive Tooltip */}
      {hoveredPt && (
        <div
          className="absolute pointer-events-none bg-[#10131C]/95 backdrop-blur-sm border border-[#232B3A] text-white px-3 py-2 rounded-lg shadow-[0_12px_28px_rgba(0,0,0,0.75)] z-20 transition-transform duration-75 min-w-[120px]"
          style={{
            left: `${(hoveredPt.x / svgWidth) * 100}%`,
            top: `${Math.max(6, Math.min(hoveredPt.y - 62, svgHeight - 68))}px`,
            transform: tooltipTransform,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold tabular-nums text-white text-xs md:text-sm">
              {formatINR(hoveredPt.data.price)}
            </span>
            <span
              className={`text-[10px] font-bold tabular-nums px-1 py-0.5 rounded ${
                hoverPctChange >= 0
                  ? "text-[#1FB878] bg-[#0F3D30]"
                  : "text-[#E5484D] bg-[#3A1B22]"
              }`}
            >
              {hoverPctChange >= 0 ? "+" : ""}
              {hoverPctChange.toFixed(2)}%
            </span>
          </div>
          <div className="text-[10px] text-[#9AA4B2] font-medium mt-0.5 flex items-center justify-between gap-2">
            <span>{hoveredPt.data.label}</span>
            <span className="text-[#5B6472] uppercase text-[9px] font-semibold">Period</span>
          </div>
        </div>
      )}
    </div>
  );
}

