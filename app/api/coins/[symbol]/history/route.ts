// Import NextResponse utility for sending JSON HTTP responses in Next.js App Router
import { NextResponse } from "next/server";
// Import singleton Prisma ORM database client
import { prisma } from "@/lib/prisma";

// Disable route response caching to ensure fresh real-time price history computation
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
    // Extract selected chart time range ('1D' | '1W' | '1M' | '1Y' | 'ALL'), defaulting to '1W'
    const range = searchParams.get("range") || "1W";

    // Query database for coin details matching symbol along with latest price snapshot
    const coin = await prisma.coin.findUnique({
      where: { symbol: upperSymbol },
      include: {
        priceSnapshots: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    });

    // If coin is not found in database, return 404 Not Found response
    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    // Extract latest price snapshot record
    const latest = coin.priceSnapshots[0];
    // Extract current price in INR (fallback to 284,500)
    const currentPrice = latest?.priceInr ?? 284500;
    // Extract 24-hour percentage price change (fallback to 3.85%)
    const change24hPct = latest?.change24hPct ?? 3.85;

    // Parse 7-day sparkline array from snapshot if present
    let sparkline: number[] = [];
    if (latest?.sparkline7d) {
      try {
        sparkline = JSON.parse(latest.sparkline7d);
      } catch {
        sparkline = [];
      }
    }

    // Initialize point count, x-axis label formatting function, and range price multiplier
    let pointsCount = 7;
    let labelFormat: (idx: number, total: number) => string = (idx) => `Day ${idx + 1}`;
    let rangePctMultiplier = 1;

    // Configure curve parameters depending on requested time range
    switch (range) {
      // 1 Day range: 24 hourly data points
      case "1D":
        pointsCount = 24;
        labelFormat = (i) => `${String(i).padStart(2, "0")}:00`;
        rangePctMultiplier = 1;
        break;
      // 1 Week range: 7 daily points (Mon-Sun)
      case "1W":
        pointsCount = 7;
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        labelFormat = (i) => days[i % 7];
        rangePctMultiplier = 1.2;
        break;
      // 1 Month range: 15 bi-daily points
      case "1M":
        pointsCount = 15;
        labelFormat = (i) => `Day ${i * 2 + 1}`;
        rangePctMultiplier = 2.5;
        break;
      // 1 Year range: 12 monthly points (Jan-Dec)
      case "1Y":
        pointsCount = 12;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        labelFormat = (i) => months[i % 12];
        rangePctMultiplier = 5;
        break;
      // ALL time range: 10 yearly data points
      case "ALL":
        pointsCount = 10;
        labelFormat = (i) => `20${17 + i}`;
        rangePctMultiplier = 12;
        break;
    }

    // Calculate percentage change and starting price for simulated historical price curve
    const changePct = parseFloat((change24hPct * rangePctMultiplier).toFixed(2));
    const startPrice = currentPrice / (1 + changePct / 100);
    const step = (currentPrice - startPrice) / (pointsCount - 1);

    // Array storing calculated price data points for response
    const historyPoints: Array<{ time: string; label: string; price: number }> = [];

    // Use exact database sparkline values if range is 1W and sparkline contains 7 points
    if (range === "1W" && sparkline.length === 7) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      sparkline.forEach((price, idx) => {
        historyPoints.push({
          time: days[idx],
          label: days[idx],
          price,
        });
      });
      // Override final point with exact current price snapshot value
      if (historyPoints.length > 0) {
        historyPoints[historyPoints.length - 1].price = currentPrice;
      }
    } else {
      // Synthesize realistic sine-wave price oscillation curve between startPrice and currentPrice
      let curr = startPrice;
      for (let i = 0; i < pointsCount; i++) {
        // Calculate sine wave offset to introduce natural price volatility
        const wave = Math.sin((i / pointsCount) * Math.PI * 3) * (currentPrice * 0.025);
        if (i === pointsCount - 1) {
          curr = currentPrice;
        } else if (i === 0) {
          curr = startPrice;
        } else {
          curr = startPrice + step * i + wave;
        }

        const priceVal = parseFloat(Math.max(1, curr).toFixed(2));
        historyPoints.push({
          time: labelFormat(i, pointsCount),
          label: labelFormat(i, pointsCount),
          price: priceVal,
        });
      }
    }

    // Extract price array to determine min/max bounds and net gain/loss status
    const prices = historyPoints.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const isPositive = changePct >= 0;

    // Return JSON response object containing historical series data and metadata
    return NextResponse.json({
      symbol: upperSymbol,
      range,
      currentPrice,
      changePct,
      isPositive,
      minPrice,
      maxPrice,
      data: historyPoints,
    });
  } catch (error) {
    // Log unexpected API route exceptions
    console.error("Error fetching price history:", error);
    // Return 500 Internal Server Error status JSON response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

