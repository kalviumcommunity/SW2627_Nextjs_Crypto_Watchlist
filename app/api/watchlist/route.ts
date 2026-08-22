import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/watchlist?userId=test-user-1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const watchlist = await prisma.watchlistItem.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(watchlist, { status: 200 });
  } catch (error) {
    console.error("GET /api/watchlist error:", error);

    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// POST /api/watchlist
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, coinId } = body;

    if (!userId || !coinId) {
      return NextResponse.json(
        { error: "userId and coinId are required" },
        { status: 400 }
      );
    }

    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        userId,
        coinId,
      },
    });

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Coin is already in the watchlist" },
        { status: 409 }
      );
    }

    console.error("POST /api/watchlist error:", error);

    return NextResponse.json(
      { error: "Failed to add coin to watchlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/watchlist
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { userId, coinId } = body;

    if (!userId || !coinId) {
      return NextResponse.json(
        { error: "userId and coinId are required" },
        { status: 400 }
      );
    }

    const existingItem = await prisma.watchlistItem.findUnique({
      where: {
        userId_coinId: {
          userId,
          coinId,
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Coin is not in the watchlist" },
        { status: 404 }
      );
    }

    await prisma.watchlistItem.delete({
      where: {
        userId_coinId: {
          userId,
          coinId,
        },
      },
    });

    return NextResponse.json(
      { message: "Coin removed from watchlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/watchlist error:", error);

    return NextResponse.json(
      { error: "Failed to remove coin from watchlist" },
      { status: 500 }
    );
  }
}