import TableSkeleton from "./TableSkeleton";

interface DashboardSkeletonProps {
  title?: string;
  subtext?: string;
  hasSubtitle?: boolean;
}

export default function DashboardSkeleton({
  title,
  subtext,
  hasSubtitle = false,
}: DashboardSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
      className="flex flex-col min-h-screen bg-[#050810]"
    >
      {/* Top Ticker Strip Skeleton */}
      <div className="w-full bg-[#10131C] border-b border-[#232B3A] px-4 md:px-6 py-2.5 h-[41px] flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="w-36 h-3.5 bg-[#1B2536] rounded" />
          <div className="w-28 h-3.5 bg-[#1B2536] rounded hidden sm:block" />
          <div className="w-28 h-3.5 bg-[#1B2536] rounded hidden md:block" />
          <div className="w-32 h-3.5 bg-[#1B2536] rounded hidden lg:block" />
        </div>
        <div className="w-20 h-3.5 bg-[#1B2536] rounded" />
      </div>

      {/* Main Content Container */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 flex flex-col animate-pulse">
        {/* Page Title */}
        <div className="mb-6 md:mb-8">
          {title ? (
            <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight">
              {title}
            </h1>
          ) : (
            <div className="w-56 h-8 bg-[#1B2536] rounded mb-1" />
          )}
          {subtext ? (
            <p className="text-xs md:text-sm text-[#9AA4B2] mt-1">{subtext}</p>
          ) : (
            hasSubtitle && <div className="w-80 h-4 bg-[#1B2536] rounded mt-2" />
          )}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs Skeleton */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <div className="w-28 h-9 bg-[#1B2536] rounded-lg shrink-0" />
              <div className="w-28 h-9 bg-[#1B2536] rounded-lg shrink-0" />
              <div className="w-24 h-9 bg-[#1B2536] rounded-lg shrink-0" />
              <div className="w-24 h-9 bg-[#1B2536] rounded-lg shrink-0" />
            </div>

            {/* Search Filter Bar Skeleton */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-full sm:w-[260px] h-9 bg-[#1B2536] rounded-lg" />
              <div className="w-20 h-9 bg-[#1B2536] rounded-lg" />
              <div className="w-24 h-9 bg-[#1B2536] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <TableSkeleton rowCount={8} />
      </main>
    </div>
  );
}
