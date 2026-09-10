import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
interface MarketCoin {
  symbol: string;
  name: string;
  market_cap_rank: number | null;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  low_24h: number | null;
  high_24h: number | null;
  total_volume: number | null;
  market_cap: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
}
export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=true",
      {
        cache: "no-store",
      }
    );

  if (!response.ok) {
  if (response.status === 429) {
    return NextResponse.json(
      { error: "Market data rate limit reached. Please try again later." },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: "Failed to fetch market data from CoinGecko." },
    { status: response.status }
  );
}
const data: MarketCoin[] = await response.json();
    await Promise.all(
  data.map(async (coin) => {
    const savedCoin = await prisma.coin.upsert({
      where: {
        symbol: coin.symbol.toUpperCase(),
      },
      update: {
        name: coin.name,
        rank: coin.market_cap_rank ?? 0,
        iconUrl: coin.image,
      },
      create: {
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        subtext: coin.name,
        rank: coin.market_cap_rank ?? 0,
        iconUrl: coin.image,
      },
    });

    await prisma.priceSnapshot.create({
      data: {
        coinId: savedCoin.id,
        priceInr: coin.current_price ?? 0,
        change24hPct: coin.price_change_percentage_24h ?? 0,
        low24h: coin.low_24h,
        high24h: coin.high_24h,
        volume24h: String(coin.total_volume ?? 0),
        marketCap: String(coin.market_cap ?? 0),
        marketCapInrCr: coin.market_cap
          ? coin.market_cap / 10_000_000
          : null,
        sparkline7d: JSON.stringify(
          coin.sparkline_in_7d?.price ?? []
        ),
      },
    });
  })
);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching and saving market data:", error);

    return NextResponse.json(
      { error: "Unable to fetch market data" },
      { status: 500 }
    );
  }
}

