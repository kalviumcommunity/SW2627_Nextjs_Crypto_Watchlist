import { prisma } from "@/lib/prisma";
import CoinHeader from "@/components/CoinHeader";
import PriceChartCard from "@/components/PriceChartCard";
import RangeStatCard from "@/components/RangeStatCard";
import { MiniStatCard, CirculatingSupplyCard } from "@/components/StatBox";
import AboutCard from "@/components/AboutCard";
import EmptyState from "@/components/states/EmptyState";

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
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <EmptyState
          iconName="coins"
          title="Coin Not Found"
          description={`Could not find market data for asset symbol "${upperSymbol}".`}
          action={{
            label: "Back to Markets",
            href: "/markets",
            variant: "primary",
          }}
          minHeight="min-h-[380px]"
        />
      </main>
    );
  }

  const latestSnapshot = coin.priceSnapshots[0];
  const priceInr = latestSnapshot?.priceInr ?? 284500;
  const change24hPct = latestSnapshot?.change24hPct ?? 3.85;
  const low24h = latestSnapshot?.low24h ?? 275400;
  const high24h = latestSnapshot?.high24h ?? 290120;
  const volume24h = latestSnapshot?.volume24h ?? "₹6,430.2 Cr";
  const marketCap = latestSnapshot?.marketCap ?? "₹34.2 L Cr";
  const circulatingSupply = coin.circulatingSupply || "120.4M";
  const maxSupply = coin.maxSupply || "Infinite";

  let sparkline: number[] = [];
  if (latestSnapshot?.sparkline7d) {
    try {
      sparkline = JSON.parse(latestSnapshot.sparkline7d);
    } catch {
      sparkline = [];
    }
  }

  // Generate initial history payload for 1W range SSR
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const initialChartPoints = sparkline.length === 7
    ? sparkline.map((price, idx) => ({
        time: days[idx],
        label: days[idx],
        price,
      }))
    : [
        { time: "Mon", label: "Mon", price: 275400 },
        { time: "Tue", label: "Tue", price: 278000 },
        { time: "Wed", label: "Wed", price: 281000 },
        { time: "Thu", label: "Thu", price: 279500 },
        { time: "Fri", label: "Fri", price: 282500 },
        { time: "Sat", label: "Sat", price: 280000 },
        { time: "Sun", label: "Sun", price: priceInr },
      ];

  const initialHistory = {
    symbol: upperSymbol,
    range: "1W",
    currentPrice: priceInr,
    changePct: change24hPct,
    isPositive: change24hPct >= 0,
    minPrice: Math.min(...initialChartPoints.map((p) => p.price)),
    maxPrice: Math.max(...initialChartPoints.map((p) => p.price)),
    data: initialChartPoints,
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Top Header Row & Breadcrumb */}
      <CoinHeader coin={coin} lastUpdated={latestSnapshot?.recordedAt} />

      {/* Divider */}
      <div className="border-t border-[#232B3A] pt-6 md:pt-8">
        {/* Two-Column Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65% width) - Price + Chart Card */}
          <div className="lg:col-span-8 w-full">
            <PriceChartCard
              symbol={coin.symbol}
              initialPrice={priceInr}
              initialChange24hPct={change24hPct}
              initialHistory={initialHistory}
            />
          </div>

          {/* Right Column (~35% width) - Stacked Stats Cards */}
          <div className="lg:col-span-4 w-full flex flex-col gap-4">
            {/* 1. 24H Range Card */}
            <RangeStatCard
              currentPrice={priceInr}
              low24h={low24h}
              high24h={high24h}
            />

            {/* 2. Two-up Mini Stats Row (24H Volume + Market Cap) */}
            <div className="grid grid-cols-2 gap-4">
              <MiniStatCard
                label="24H VOLUME"
                value={volume24h}
                type="volume"
              />
              <MiniStatCard
                label="MARKET CAP"
                value={marketCap}
                type="mcap"
              />
            </div>

            {/* 3. Circulating Supply Card */}
            <CirculatingSupplyCard
              supply={circulatingSupply}
              symbol={coin.symbol}
              maxSupply={maxSupply}
            />
          </div>
        </div>

        {/* Section D: About Card (Full Width) */}
        <AboutCard
          name={coin.name}
          symbol={coin.symbol}
          description={coin.description}
          websiteUrl={coin.websiteUrl}
          whitepaperUrl={coin.whitepaperUrl}
        />
      </div>
    </main>
  );
}
