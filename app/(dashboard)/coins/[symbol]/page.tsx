import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/formatters";
import ChangeBadge from "@/components/ChangeBadge";
import Sparkline from "@/components/Sparkline";

export const revalidate = 0;

export default async function CoinDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const coin = await prisma.coin.findUnique({
    where: { symbol: upperSymbol },
    include: {
      priceSnapshots: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!coin) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Coin Not Found</h1>
        <p className="text-[#9AA4B2] mb-6">
          Could not find market data for symbol &quot;{upperSymbol}&quot;.
        </p>
        <Link
          href="/watchlist"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5446] text-white rounded-md font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Watchlist
        </Link>
      </div>
    );
  }

  const latestSnapshot = coin.priceSnapshots[0];
  let sparkline: number[] = [];
  if (latestSnapshot?.sparkline7d) {
    try {
      sparkline = JSON.parse(latestSnapshot.sparkline7d);
    } catch {
      sparkline = [];
    }
  }

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8">
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-2 text-sm text-[#9AA4B2] hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Watchlist
      </Link>

      <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#232B3A]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center font-bold text-base text-white">
              {coin.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
                <span className="text-xs bg-[#1B2536] text-[#9AA4B2] px-2 py-0.5 rounded font-mono">
                  #{coin.rank}
                </span>
              </div>
              <p className="text-sm text-[#5B6472] mt-0.5">{coin.subtext}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="text-3xl font-bold text-white tabular-nums">
              {formatINR(latestSnapshot?.priceInr ?? 0)}
            </div>
            <div className="mt-1">
              <ChangeBadge changePct={latestSnapshot?.change24hPct ?? 0} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
          <div>
            <div className="text-xs text-[#5B6472] font-semibold uppercase tracking-wider mb-1">
              24H VOLUME
            </div>
            <div className="text-lg font-medium text-white tabular-nums">
              {latestSnapshot?.volume24h}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#5B6472] font-semibold uppercase tracking-wider mb-1">
              MARKET CAP
            </div>
            <div className="text-lg font-medium text-white tabular-nums">
              {latestSnapshot?.marketCap}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#5B6472] font-semibold uppercase tracking-wider mb-1">
              7D TREND
            </div>
            <div className="mt-1">
              <Sparkline
                data={sparkline}
                isPositive={(latestSnapshot?.change24hPct ?? 0) >= 0}
                width={120}
                height={36}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button className="h-10 px-6 bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-sm rounded-md transition-colors w-full md:w-auto">
              Trade {coin.symbol}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
