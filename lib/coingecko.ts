const COINGECKO_BASE_URL =
  "https://api.coingecko.com/api/v3";

export async function fetchCoinMarketData(
  coinIds: string[]
) {
  const ids = coinIds.join(",");

  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/markets?vs_currency=inr&ids=${ids}&sparkline=true`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 429) {
    throw new Error("CoinGecko rate limit reached");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch CoinGecko market data");
  }

  return response.json();
}