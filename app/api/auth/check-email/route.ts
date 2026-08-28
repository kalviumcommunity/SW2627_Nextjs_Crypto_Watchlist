import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim();

  if (!email) {
    return NextResponse.json(
      { available: false, error: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    const available = !user;
    return NextResponse.json({ available, exists: !!user });
  } catch (error) {
    return NextResponse.json(
      { available: false, error: "Failed to check email" },
      { status: 500 }
    );
  }
}
