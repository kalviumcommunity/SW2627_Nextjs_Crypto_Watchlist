import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const watchlistId = id?.trim() || "default-watchlist";
    const body = await request.json();
    const { coinId } = body;

   if (!coinId || typeof coinId !== "string" || !coinId.trim()) {
  return NextResponse.json(
    { error: "coinId is required" },
    { status: 400 }
  );
}

    const item = await prisma.watchlistItem.upsert({
      where: {
        watchlistId_coinId: {
          watchlistId,
          coinId,
        },
      },
      create: {
        watchlistId,
        coinId,
      },
      update: {},
    });

    const count = await prisma.watchlistItem.count({
      where: { watchlistId },
    });

    return NextResponse.json({ success: true, item, totalTracked: count, coinId });
  } catch (error) {
    console.error("Error adding watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to add item to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const watchlistId = id?.trim() || "default-watchlist";
    const { searchParams } = new URL(request.url);
    let coinId = searchParams.get("coinId");

    if (!coinId) {
      try {
        const body = await request.json();
        coinId = body.coinId;
      } catch {
        // body might be empty
      }
    }

    if (!coinId) {
      return NextResponse.json({ error: "coinId is required" }, { status: 400 });
    }

    await prisma.watchlistItem.deleteMany({
      where: {
        watchlistId,
        coinId,
      },
    });

    const count = await prisma.watchlistItem.count({
      where: { watchlistId },
    });

    return NextResponse.json({ success: true, totalTracked: count, coinId });
  } catch (error) {
    console.error("Error removing watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from watchlist" },
      { status: 500 }
    );
  }
}
