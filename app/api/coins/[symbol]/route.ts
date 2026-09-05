import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      {
        next: {
          revalidate: 30,
        },
      }
    );
if (response.status === 404) {
  return NextResponse.json(
    { error: "Coin not found" },
    { status: 404 }
  );
}

if (response.status === 429) {
  return NextResponse.json(
    { error: "CoinGecko rate limit reached" },
    { status: 429 }
  );
}

if (!response.ok) {
  return NextResponse.json(
    { error: "Unable to fetch coin details" },
    { status: response.status }
  );
}

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch coin details" },
      { status: 500 }
    );
  }
}
