import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const coin = await prisma.coin.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: {
        priceSnapshots: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    const snapshot = coin.priceSnapshots[0];
    if (!snapshot) {
      return NextResponse.json(
        { error: "No market snapshot is available for this coin." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      rank: coin.rank,
      iconUrl: coin.iconUrl,
      subtext: coin.subtext,
      network: coin.network,
      description: coin.description,
      websiteUrl: coin.websiteUrl,
      whitepaperUrl: coin.whitepaperUrl,
      circulatingSupply: coin.circulatingSupply,
      maxSupply: coin.maxSupply,
      priceInr: snapshot.priceInr,
      change24hPct: snapshot.change24hPct,
      low24h: snapshot.low24h,
      high24h: snapshot.high24h,
      volume24h: snapshot.volume24h,
      marketCap: snapshot.marketCap,
      recordedAt: snapshot.recordedAt,
    });
  } catch (error) {
    console.error("Error fetching coin details:", error);
    return NextResponse.json(
      { error: "Unable to fetch coin details" },
      { status: 500 }
    );
  }
}
