import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const requestedWatchlistId = id?.trim();

    let watchlist = requestedWatchlistId
      ? await prisma.watchlist.findFirst({
          where: {
            id: requestedWatchlistId,
            userId: session.user.id,
          },
        })
      : null;

    if (!watchlist) {
      watchlist = await prisma.watchlist.findFirst({
        where: {
          userId: session.user.id,
        },
      });
    }

    if (!watchlist) {
      watchlist = await prisma.watchlist.create({
        data: {
          name: "My Watchlist",
          userId: session.user.id,
        },
      });
    }

    const body = await request.json();
    const { coinId } = body;

    if (!coinId || typeof coinId !== "string" || !coinId.trim()) {
      return NextResponse.json(
        { error: "coinId is required" },
        { status: 400 }
      );
    }

    const coin = await prisma.coin.findUnique({
      where: { id: coinId },
    });

    if (!coin) {
      return NextResponse.json(
        { error: "Coin not found" },
        { status: 404 }
      );
    }

    const item = await prisma.watchlistItem.upsert({
      where: {
        watchlistId_coinId: {
          watchlistId: watchlist.id,
          coinId,
        },
      },
      create: {
        watchlistId: watchlist.id,
        coinId,
      },
      update: {},
    });

    const count = await prisma.watchlistItem.count({
      where: {
        watchlistId: watchlist.id,
      },
    });

    return NextResponse.json({
      success: true,
      isWatchlisted: true,
      item,
      totalTracked: count,
      coinId,
    });
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const requestedWatchlistId = id?.trim();

    const watchlist = requestedWatchlistId
      ? await prisma.watchlist.findFirst({
          where: {
            id: requestedWatchlistId,
            userId: session.user.id,
          },
        })
      : await prisma.watchlist.findFirst({
          where: {
            userId: session.user.id,
          },
        });

    if (!watchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    let coinId = searchParams.get("coinId");

    if (!coinId) {
      try {
        const body = await request.json();
        coinId = body.coinId;
      } catch {
        // Body might be empty.
      }
    }

    if (!coinId || typeof coinId !== "string" || !coinId.trim()) {
      return NextResponse.json(
        { error: "coinId is required" },
        { status: 400 }
      );
    }

    await prisma.watchlistItem.deleteMany({
      where: {
        watchlistId: watchlist.id,
        coinId,
      },
    });

    const count = await prisma.watchlistItem.count({
      where: {
        watchlistId: watchlist.id,
      },
    });

    return NextResponse.json({
      success: true,
      isWatchlisted: false,
      totalTracked: count,
      coinId,
    });
  } catch (error) {
    console.error("Error removing watchlist item:", error);

    return NextResponse.json(
      { error: "Failed to remove item from watchlist" },
      { status: 500 }
    );
  }
}