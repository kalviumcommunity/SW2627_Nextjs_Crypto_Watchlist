import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; coinId: string }> }
) {
  try {
    const { id, coinId } = await params;
    const watchlistId = id || "default-watchlist";

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
    console.error("Error deleting watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from watchlist" },
      { status: 500 }
    );
  }
}
