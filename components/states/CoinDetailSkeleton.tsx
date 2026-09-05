export default function CoinDetailSkeleton() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Loading coin details"
      className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 animate-pulse"
    >
      {/* Top Header Row & Breadcrumb Skeleton */}
      <div className="w-full mb-6">
        {/* Breadcrumb skeleton */}
        <div className="w-44 h-4 bg-[#1B2536] rounded mb-6" />

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          {/* Left: Coin logo + details */}
          <div className="flex items-center gap-3.5 md:gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1B2536] shrink-0" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
                <div className="w-32 md:w-40 h-7 bg-[#1B2536] rounded" />
                <div className="w-16 h-5 bg-[#1B2536] rounded-md" />
                <div className="w-16 h-5 bg-[#1B2536] rounded-md" />
              </div>
              <div className="w-24 h-3.5 bg-[#1B2536] rounded" />
            </div>
          </div>

          {/* Right: Watchlist toggle + Trade button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-32 h-10 bg-[#1B2536] rounded-lg" />
            <div className="w-full md:w-28 h-10 bg-[#1B2536] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#232B3A] pt-6 md:pt-8">
        {/* Two-Column Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65% width) - Price + Chart Card Skeleton */}
          <div className="lg:col-span-8 w-full">
            <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full">
              {/* Top row: Price + Range Selector */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="w-48 h-8 md:h-9 bg-[#1B2536] rounded" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-16 h-5 bg-[#1B2536] rounded-md" />
                    <div className="w-10 h-4 bg-[#1B2536] rounded" />
                  </div>
                </div>
                <div className="w-52 h-8 bg-[#1B2536] rounded-lg" />
              </div>

              {/* Chart Shimmer Placeholder */}
              <div className="w-full h-[240px] bg-[#10131C] rounded-lg border border-[#232B3A]/40 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1B2536]/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column (~35% width) - Stacked Stats Cards Skeleton */}
          <div className="lg:col-span-4 w-full flex flex-col gap-4">
            {/* 1. 24H Range Card Skeleton */}
            <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-20 h-3.5 bg-[#1B2536] rounded" />
                <div className="w-14 h-3.5 bg-[#1B2536] rounded" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-24 h-4 bg-[#1B2536] rounded" />
                <div className="w-24 h-4 bg-[#1B2536] rounded" />
              </div>
              <div className="w-full h-2 rounded-full bg-[#1B2536] mt-2 mb-1" />
            </div>

            {/* 2. Two-up Mini Stats Row Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 w-full">
                <div className="w-20 h-3 bg-[#1B2536] rounded mb-3" />
                <div className="w-24 h-6 bg-[#1B2536] rounded" />
              </div>
              <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 w-full">
                <div className="w-20 h-3 bg-[#1B2536] rounded mb-3" />
                <div className="w-24 h-6 bg-[#1B2536] rounded" />
              </div>
            </div>

            {/* 3. Circulating Supply Card Skeleton */}
            <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-28 h-3.5 bg-[#1B2536] rounded" />
                <div className="w-20 h-4 bg-[#1B2536] rounded-full" />
              </div>
              <div className="w-36 h-7 bg-[#1B2536] rounded mt-2" />
            </div>
          </div>
        </div>

        {/* About Card Skeleton (Full Width) */}
        <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full mt-6">
          <div className="w-48 h-5 bg-[#1B2536] rounded pb-3 mb-4" />
          <div className="space-y-3 mb-6">
            <div className="w-full h-3.5 bg-[#1B2536] rounded" />
            <div className="w-11/12 h-3.5 bg-[#1B2536] rounded" />
            <div className="w-4/5 h-3.5 bg-[#1B2536] rounded" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-32 h-8 bg-[#1B2536] rounded-lg" />
            <div className="w-28 h-8 bg-[#1B2536] rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
