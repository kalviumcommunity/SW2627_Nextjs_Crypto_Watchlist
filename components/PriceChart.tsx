"use client";

import { useState, useRef, useId } from "react";
import { formatINR } from "@/lib/formatters";

interface ChartPoint {
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

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center text-[#5B6472] text-sm">
        No chart data available
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions in viewBox SVG coordinate system
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingY = 20;

  // Calculate coordinates for points
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * svgWidth;
    const normalizedY = (d.price - minPrice) / priceRange;
    // Invert Y for SVG space
    const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
    return { x, y, data: d };
  });

  // Build SVG smooth path or polyline
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

  // Gradient path
  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const strokeColor = isPositive ? "#1FB878" : "#E5484D";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = Math.max(0, Math.min(mouseX / rect.width, 1));
    const closestIdx = Math.round(relativeX * (data.length - 1));
    setHoverIndex(closestIdx);
    if (onHoverPoint && data[closestIdx]) {
      onHoverPoint(data[closestIdx]);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    if (onHoverPoint) {
      onHoverPoint(null);
    }
  };

  const hoveredPt = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[220px] cursor-crosshair select-none overflow-hidden"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Gradient fill under area */}
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

        {/* Hover Crosshair Vertical Guide */}
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
            {/* Outer halo ring */}
            <circle
              cx={hoveredPt.x}
              cy={hoveredPt.y}
              r="8"
              fill={strokeColor}
              fillOpacity="0.25"
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

      {/* Tooltip on Hover */}
      {hoveredPt && (
        <div
          className="absolute pointer-events-none bg-[#10131C] border border-[#232B3A] text-white text-xs px-3 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-20 transition-all duration-75 flex flex-col items-center"
          style={{
            left: `${(hoveredPt.x / svgWidth) * 100}%`,
            top: `${Math.max(8, Math.min(hoveredPt.y - 48, svgHeight - 48))}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-bold tabular-nums text-white text-[13px]">
            {formatINR(hoveredPt.data.price)}
          </div>
          <div className="text-[10px] text-[#9AA4B2] font-medium text-center">
            {hoveredPt.data.label}
          </div>
        </div>
      )}
    </div>
  );
}

