import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; coinId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, coinId } = await params;
    const requestedWatchlistId = id?.trim();
    const watchlist = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
        ...(requestedWatchlistId && requestedWatchlistId !== "default-watchlist"
          ? { id: requestedWatchlistId }
          : {}),
      },
      select: { id: true },
    });

    if (!watchlist) {
      return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
    }

    if (!coinId) {
      return NextResponse.json({ error: "coinId is required" }, { status: 400 });
    }

    await prisma.watchlistItem.deleteMany({
      where: {
        watchlistId: watchlist.id,
        coinId,
      },
    });

    const count = await prisma.watchlistItem.count({
      where: { watchlistId: watchlist.id },
    });

    return NextResponse.json({
      success: true,
      isWatchlisted: false,
      totalTracked: count,
      coinId,
    });
  } catch (error) {
    console.error("Error deleting watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from watchlist" },
      { status: 500 }
    );
  }
}
