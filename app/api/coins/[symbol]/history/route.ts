import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "1W";

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
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    const latest = coin.priceSnapshots[0];
    const currentPrice = latest?.priceInr ?? 284500;
    const change24hPct = latest?.change24hPct ?? 3.85;

    let sparkline: number[] = [];
    if (latest?.sparkline7d) {
      try {
        sparkline = JSON.parse(latest.sparkline7d);
      } catch {
        sparkline = [];
      }
    }

    // Determine count, labels, and price variations based on range
    let pointsCount = 7;
    let labelFormat: (idx: number, total: number) => string = (idx) => `Day ${idx + 1}`;
    let rangePctMultiplier = 1;

    switch (range) {
      case "1D":
        pointsCount = 24;
        labelFormat = (i) => `${String(i).padStart(2, "0")}:00`;
        rangePctMultiplier = 1;
        break;
      case "1W":
        pointsCount = 7;
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        labelFormat = (i) => days[i % 7];
        rangePctMultiplier = 1.2;
        break;
      case "1M":
        pointsCount = 15;
        labelFormat = (i) => `Day ${i * 2 + 1}`;
        rangePctMultiplier = 2.5;
        break;
      case "1Y":
        pointsCount = 12;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        labelFormat = (i) => months[i % 12];
        rangePctMultiplier = 5;
        break;
      case "ALL":
        pointsCount = 10;
        labelFormat = (i) => `20${17 + i}`;
        rangePctMultiplier = 12;
        break;
    }

    // Generate price curve
    const changePct = parseFloat((change24hPct * rangePctMultiplier).toFixed(2));
    const startPrice = currentPrice / (1 + changePct / 100);
    const step = (currentPrice - startPrice) / (pointsCount - 1);

    const historyPoints: Array<{ time: string; label: string; price: number }> = [];

    // Use seed sparkline if available for 1W range
    if (range === "1W" && sparkline.length === 7) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      sparkline.forEach((price, idx) => {
        historyPoints.push({
          time: days[idx],
          label: days[idx],
          price,
        });
      });
      // Ensure last point is current exact price
      if (historyPoints.length > 0) {
        historyPoints[historyPoints.length - 1].price = currentPrice;
      }
    } else {
      let curr = startPrice;
      for (let i = 0; i < pointsCount; i++) {
        // Add wave fluctuation
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

    const prices = historyPoints.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const isPositive = changePct >= 0;

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
    console.error("Error fetching price history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
