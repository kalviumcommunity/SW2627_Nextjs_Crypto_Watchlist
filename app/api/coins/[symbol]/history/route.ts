// Import NextResponse utility for sending JSON HTTP responses in Next.js App Router
import { NextResponse } from "next/server";
// Import singleton Prisma ORM database client
import { prisma } from "@/lib/prisma";

// Disable route response caching to ensure fresh price history computation
export const revalidate = 0;

// Export async GET route handler for /api/coins/[symbol]/history
export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    // Await async route params resolution to extract cryptocurrency symbol path parameter
    const { symbol } = await params;
    // Normalize symbol parameter to uppercase (e.g. 'btc' -> 'BTC')
    const upperSymbol = symbol.toUpperCase();
    // Parse URL search query parameters
    const { searchParams } = new URL(request.url);
    // Extract selected chart time range
    const range = searchParams.get("range") || "1W";

    // Query database for coin details along with price snapshots
    const coin = await prisma.coin.findUnique({
      where: { symbol: upperSymbol },
      include: {
        priceSnapshots: {
          orderBy: { recordedAt: "asc" },
        },
      },
    });

    // If coin is not found in database, return 404 Not Found response
    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    // Extract latest price snapshot record
    const latest = coin.priceSnapshots[coin.priceSnapshots.length - 1];

    // Extract current price in INR
    const currentPrice = latest?.priceInr ?? 0;
    // Extract 24-hour percentage price change
    const change24hPct = latest?.change24hPct ?? 0;

    // Use actual database price snapshots as historical data
    const historyPoints = coin.priceSnapshots.map((snapshot) => ({
      time: snapshot.recordedAt.toISOString(),
      label: snapshot.recordedAt.toLocaleDateString(),
      price: snapshot.priceInr,
    }));

    // Extract price array to determine min/max bounds
    const prices = historyPoints.map((p) => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : currentPrice;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : currentPrice;
    const isPositive = change24hPct >= 0;

    // Return JSON response object containing historical series data and metadata
    return NextResponse.json({
      symbol: upperSymbol,
      range,
      currentPrice,
      changePct: change24hPct,
      isPositive,
      minPrice,
      maxPrice,
      data: historyPoints,
    });
  } catch (error) {
    // Log unexpected API route exceptions
    console.error("Error fetching price history:", error);

    // Return 500 Internal Server Error status JSON response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}