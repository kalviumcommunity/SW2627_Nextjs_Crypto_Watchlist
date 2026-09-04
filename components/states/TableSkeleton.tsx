interface TableSkeletonProps {
  rowCount?: number;
}

export default function TableSkeleton({ rowCount = 8 }: TableSkeletonProps) {
  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] overflow-hidden shadow-lg">
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-[44px] bg-[#10131C]/60 border-b border-[#232B3A] text-[12px] font-semibold text-[#5B6472] uppercase tracking-wider">
              <th className="w-12 px-3 text-center font-medium">#</th>
              <th className="px-4 font-medium">Asset</th>
              <th className="px-4 text-right font-medium">Price (INR)</th>
              <th className="px-4 text-center font-medium">24h Change</th>
              <th className="px-4 text-center font-medium w-[100px]">7D Trend</th>
              <th className="hidden xl:table-cell px-4 text-right font-medium">
                24h Volume
              </th>
              <th className="hidden xl:table-cell px-4 text-right font-medium">
                Market Cap
              </th>
              <th className="px-4 text-right font-medium min-w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232B3A]">
            {Array.from({ length: rowCount }).map((_, i) => (
              <tr
                key={i}
                className="h-[56px] border-b border-[#232B3A] animate-pulse"
              >
                {/* 1. Rank (#) */}
                <td className="w-12 px-3 text-center">
                  <div className="w-4 h-3.5 bg-[#1B2536] rounded mx-auto" />
                </td>

                {/* 2. Asset (Avatar + Name & Symbol) */}
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1B2536] shrink-0" />
                    <div className="space-y-1.5 min-w-0">
                      <div
                        className="h-3.5 bg-[#1B2536] rounded"
                        style={{ width: `${60 + ((i * 17) % 45)}px` }}
                      />
                      <div className="w-10 h-2.5 bg-[#1B2536] rounded" />
                    </div>
                  </div>
                </td>

                {/* 3. Price (INR) */}
                <td className="px-4 text-right">
                  <div className="w-20 h-4 bg-[#1B2536] rounded ml-auto" />
                </td>

                {/* 4. 24h Change */}
                <td className="px-4 text-center">
                  <div className="w-16 h-6 bg-[#1B2536] rounded-md mx-auto" />
                </td>

                {/* 5. 7D Trend */}
                <td className="px-4 text-center w-[100px]">
                  <div className="w-[72px] h-7 bg-[#1B2536] rounded mx-auto" />
                </td>

                {/* 6. 24h Volume */}
                <td className="hidden xl:table-cell px-4 text-right">
                  <div className="w-20 h-3.5 bg-[#1B2536] rounded ml-auto" />
                </td>

                {/* 7. Market Cap */}
                <td className="hidden xl:table-cell px-4 text-right">
                  <div className="w-24 h-3.5 bg-[#1B2536] rounded ml-auto" />
                </td>

                {/* 8. Action (Star + Trade Button) */}
                <td className="px-4 text-right min-w-[120px]">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-7 h-7 bg-[#1B2536] rounded-md shrink-0" />
                    <div className="w-14 h-8 bg-[#1B2536] rounded-lg shrink-0" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Skeleton (< 768px) */}
      <div className="md:hidden divide-y divide-[#232B3A]">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 bg-[#111827] flex flex-col gap-3 animate-pulse"
          >
            {/* Row 1: Rank + Avatar + Name/Symbol (Left) & Price (Right) */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-4 h-3 bg-[#1B2536] rounded" />
                <div className="w-8 h-8 rounded-full bg-[#1B2536] shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <div
                    className="h-3.5 bg-[#1B2536] rounded"
                    style={{ width: `${70 + ((i * 13) % 40)}px` }}
                  />
                  <div className="w-10 h-2.5 bg-[#1B2536] rounded" />
                </div>
              </div>
              <div className="w-20 h-4 bg-[#1B2536] rounded shrink-0" />
            </div>

            {/* Row 2: Badge + Sparkline (Left) & Star + Trade (Right) */}
            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#232B3A]/50">
              <div className="flex items-center gap-3">
                <div className="w-14 h-5 bg-[#1B2536] rounded-md" />
                <div className="w-16 h-5 bg-[#1B2536] rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#1B2536] rounded-lg shrink-0" />
                <div className="w-16 h-9 bg-[#1B2536] rounded-lg shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
