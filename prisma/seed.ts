import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Crypto Watchlist database...");

  // Clean existing data
  await prisma.watchlistItem.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.priceSnapshot.deleteMany();
  await prisma.coin.deleteMany();

  // Create default watchlist
  const watchlist = await prisma.watchlist.create({
    data: {
      id: "default-watchlist",
      name: "My Watchlist",
    },
  });

  const coinsData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      subtext: "BTC/INR • Layer 1",
      rank: 1,
      priceInr: 5842109.00,
      change24hPct: 2.45,
      volume24h: "₹3,450 Cr",
      marketCap: "₹114T",
      sparkline: [56000, 56500, 57000, 56800, 57500, 58000, 5842109],
      isStarred: true,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      subtext: "ETH/INR • Smart Contract",
      rank: 2,
      priceInr: 312450.50,
      change24hPct: -1.12,
      volume24h: "₹1,820 Cr",
      marketCap: "₹38T",
      sparkline: [320000, 318000, 316000, 317000, 315000, 313000, 312450.5],
      isStarred: true,
    },
    {
      symbol: "USDT",
      name: "Tether",
      subtext: "USDT/INR • Stablecoin",
      rank: 3,
      priceInr: 84.12,
      change24hPct: 0.01,
      volume24h: "₹2,100 Cr",
      marketCap: "₹7T",
      sparkline: [84.10, 84.11, 84.12, 84.11, 84.12, 84.12, 84.12],
      isStarred: true,
    },
    {
      symbol: "BNB",
      name: "BNB",
      subtext: "BNB/INR • Exchange",
      rank: 4,
      priceInr: 48920.00,
      change24hPct: 5.67,
      volume24h: "₹890 Cr",
      marketCap: "₹7.2T",
      sparkline: [46000, 46500, 47000, 47800, 48200, 48500, 48920],
      isStarred: true,
    },
    {
      symbol: "SOL",
      name: "Solana",
      subtext: "SOL/INR • Layer 1",
      rank: 5,
      priceInr: 12150.75,
      change24hPct: -3.21,
      volume24h: "₹1,200 Cr",
      marketCap: "₹5.5T",
      sparkline: [12700, 12600, 12400, 12500, 12300, 12200, 12150.75],
      isStarred: true,
    },
    {
      symbol: "ADA",
      name: "Cardano",
      subtext: "ADA/INR • Layer 1",
      rank: 6,
      priceInr: 38.50,
      change24hPct: 1.85,
      volume24h: "₹450 Cr",
      marketCap: "₹1.3T",
      sparkline: [37.5, 37.8, 38.0, 38.2, 38.4, 38.5],
      isStarred: false,
    },
    {
      symbol: "XRP",
      name: "Ripple",
      subtext: "XRP/INR • Payment",
      rank: 7,
      priceInr: 46.20,
      change24hPct: -0.85,
      volume24h: "₹780 Cr",
      marketCap: "₹2.6T",
      sparkline: [47.0, 46.8, 46.5, 46.4, 46.2],
      isStarred: false,
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      subtext: "DOGE/INR • Meme",
      rank: 8,
      priceInr: 9.80,
      change24hPct: 12.40,
      volume24h: "₹620 Cr",
      marketCap: "₹1.4T",
      sparkline: [8.7, 8.9, 9.1, 9.4, 9.6, 9.8],
      isStarred: false,
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      subtext: "AVAX/INR • Layer 1",
      rank: 9,
      priceInr: 2150.00,
      change24hPct: -4.15,
      volume24h: "₹310 Cr",
      marketCap: "₹8,500 Cr",
      sparkline: [2280, 2240, 2200, 2180, 2150],
      isStarred: false,
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      subtext: "DOT/INR • Interoperability",
      rank: 10,
      priceInr: 540.00,
      change24hPct: 3.10,
      volume24h: "₹290 Cr",
      marketCap: "₹7,200 Cr",
      sparkline: [520, 525, 530, 535, 540],
      isStarred: false,
    },
  ];

  for (const data of coinsData) {
    const coin = await prisma.coin.create({
      data: {
        symbol: data.symbol,
        name: data.name,
        subtext: data.subtext,
        rank: data.rank,
      },
    });

    await prisma.priceSnapshot.create({
      data: {
        coinId: coin.id,
        priceInr: data.priceInr,
        change24hPct: data.change24hPct,
        volume24h: data.volume24h,
        marketCap: data.marketCap,
        sparkline7d: JSON.stringify(data.sparkline),
      },
    });

    if (data.isStarred) {
      await prisma.watchlistItem.create({
        data: {
          watchlistId: watchlist.id,
          coinId: coin.id,
        },
      });
    }
  }

  console.log("Seeding complete! 10 coins seeded, 5 added to default watchlist.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
