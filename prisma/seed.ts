import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding Crypto Watchlist and All Markets database...");

  // Clean existing data in dependency order
  await prisma.watchlistItem.deleteMany();
  await prisma.priceSnapshot.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.coin.deleteMany();

  // Create default watchlist
  const watchlist = await prisma.watchlist.create({
    data: {
      id: "default-watchlist",
      name: "My Watchlist",
    },
  });

  // Top 10 coins
  const top10Coins = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      subtext: "BTC/INR • Layer 1",
      rank: 1,
      priceInr: 5840230.0,
      change24hPct: 2.45,
      volume24h: "₹2,340 Cr",
      marketCap: "₹1,34,230 Cr",
      sparkline: [
        5650000,
        5680000,
        5720000,
        5700000,
        5780000,
        5810000,
        5840230,
      ],
      isStarred: true,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      subtext: "ETH/INR • Smart Contract",
      network: "Layer 1 Network",
      rank: 2,
      priceInr: 284500.00,
      change24hPct: 3.85,
      low24h: 275400.00,
      high24h: 290120.00,
      volume24h: "₹6,430.2 Cr",
      marketCap: "₹34.2 L Cr",
      circulatingSupply: "120.4M",
      maxSupply: "Infinite",
      description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Among cryptocurrencies, Ether is second only to Bitcoin in market capitalization. Ethereum was conceived in 2013 by programmer Vitalik Buterin.\n\nThe network enables developers to build and deploy decentralized applications (dApps) and issue new crypto assets, known as Ethereum tokens. It has transitioned to a proof-of-stake consensus mechanism, significantly reducing its energy consumption and laying the groundwork for future scalability upgrades.",
      websiteUrl: "https://ethereum.org",
      whitepaperUrl: "https://ethereum.org/en/whitepaper/",
      sparkline: [275400, 278000, 281000, 279500, 282500, 280000, 284500],
      isStarred: true,
    },
    {
      symbol: "USDT",
      name: "Tether",
      subtext: "USDT/INR • Stablecoin",
      rank: 3,
      priceInr: 83.45,
      change24hPct: -0.01,
      volume24h: "₹4,200 Cr",
      marketCap: "₹9,100 Cr",
      sparkline: [83.46, 83.45, 83.46, 83.45, 83.45, 83.46, 83.45],
      isStarred: true,
    },
    {
      symbol: "BNB",
      name: "BNB",
      subtext: "BNB/INR • Exchange",
      rank: 4,
      priceInr: 48920.0,
      change24hPct: -1.15,
      volume24h: "₹450 Cr",
      marketCap: "₹7,200 Cr",
      sparkline: [49500, 49400, 49200, 49100, 49000, 48950, 48920],
      isStarred: true,
    },
    {
      symbol: "SOL",
      name: "Solana",
      subtext: "SOL/INR • Layer 1",
      rank: 5,
      priceInr: 12140.71,
      change24hPct: -4.99,
      volume24h: "₹509 Cr",
      marketCap: "₹24,574 Cr",
      sparkline: [12800, 12700, 12500, 12400, 12300, 12200, 12140.71],
      isStarred: true,
    },
    {
      symbol: "XRP",
      name: "XRP",
      subtext: "XRP/INR • Payment",
      rank: 6,
      priceInr: 1752.26,
      change24hPct: -3.26,
      volume24h: "₹167 Cr",
      marketCap: "₹8,045 Cr",
      sparkline: [1810, 1800, 1790, 1780, 1770, 1760, 1752.26],
      isStarred: false,
    },
    {
      symbol: "ADA",
      name: "Cardano",
      subtext: "ADA/INR • Layer 1",
      rank: 7,
      priceInr: 3182.52,
      change24hPct: -4.92,
      volume24h: "₹142 Cr",
      marketCap: "₹2,938 Cr",
      sparkline: [3350, 3320, 3290, 3260, 3240, 3200, 3182.52],
      isStarred: false,
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      subtext: "DOGE/INR • Meme",
      rank: 8,
      priceInr: 1954.55,
      change24hPct: 2.46,
      volume24h: "₹1,057 Cr",
      marketCap: "₹6,072 Cr",
      sparkline: [1900, 1910, 1920, 1915, 1930, 1945, 1954.55],
      isStarred: false,
    },
    {
      symbol: "TRX",
      name: "Tron",
      subtext: "TRX/INR • Layer 1",
      rank: 9,
      priceInr: 3670.24,
      change24hPct: 0.93,
      volume24h: "₹596 Cr",
      marketCap: "₹3,384 Cr",
      sparkline: [3630, 3640, 3645, 3650, 3660, 3665, 3670.24],
      isStarred: false,
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      subtext: "DOT/INR • Interoperability",
      rank: 10,
      priceInr: 4106.79,
      change24hPct: -3.1,
      volume24h: "₹482 Cr",
      marketCap: "₹1,511 Cr",
      sparkline: [4240, 4220, 4200, 4180, 4150, 4120, 4106.79],
      isStarred: false,
    },
  ];

  // Additional coins for ranks 11–100
  const additionalCoins = [
    { name: "Chainlink", symbol: "LINK", cat: "Oracle" },
    { name: "Avalanche", symbol: "AVAX", cat: "Layer 1" },
    { name: "Shiba Inu", symbol: "SHIB", cat: "Meme" },
    { name: "Uniswap", symbol: "UNI", cat: "DEX" },
    { name: "Near Protocol", symbol: "NEAR", cat: "Layer 1" },
    { name: "Polygon", symbol: "POL", cat: "Layer 2" },
    { name: "Litecoin", symbol: "LTC", cat: "Payment" },
    { name: "Pepe", symbol: "PEPE", cat: "Meme" },
    { name: "Aave", symbol: "AAVE", cat: "DeFi" },
    { name: "Sui", symbol: "SUI", cat: "Layer 1" },
    { name: "Aptos", symbol: "APT", cat: "Layer 1" },
    { name: "Hedera", symbol: "HBAR", cat: "Enterprise" },
    { name: "Monero", symbol: "XMR", cat: "Privacy" },
    { name: "Stellar", symbol: "XLM", cat: "Payment" },
    { name: "Cosmos", symbol: "ATOM", cat: "Layer 1" },
    { name: "Render", symbol: "RENDER", cat: "AI & Computing" },
    { name: "Bittensor", symbol: "TAO", cat: "AI & Computing" },
    { name: "Optimism", symbol: "OP", cat: "Layer 2" },
    { name: "Arbitrum", symbol: "ARB", cat: "Layer 2" },
    { name: "Injective", symbol: "INJ", cat: "DeFi" },
    { name: "Kaspa", symbol: "KAS", cat: "Layer 1" },
    { name: "Stacks", symbol: "STX", cat: "Bitcoin L2" },
    { name: "Filecoin", symbol: "FIL", cat: "Storage" },
    { name: "Immutable", symbol: "IMX", cat: "Gaming" },
    { name: "Fantom", symbol: "FTM", cat: "Layer 1" },
    { name: "Thorchain", symbol: "RUNE", cat: "DEX" },
    { name: "Sei", symbol: "SEI", cat: "Layer 1" },
    { name: "Celestia", symbol: "TIA", cat: "Modular" },
    { name: "VeChain", symbol: "VET", cat: "Supply Chain" },
    { name: "Worldcoin", symbol: "WLD", cat: "Identity" },
    { name: "Maker", symbol: "MKR", cat: "DeFi" },
    { name: "The Graph", symbol: "GRT", cat: "Indexing" },
    { name: "Algorand", symbol: "ALGO", cat: "Layer 1" },
    { name: "Bonk", symbol: "BONK", cat: "Meme" },
    { name: "FLOKI", symbol: "FLOKI", cat: "Meme" },
    { name: "Starknet", symbol: "STRK", cat: "Layer 2" },
    { name: "Ethena", symbol: "ENA", cat: "DeFi" },
    { name: "Jupiter", symbol: "JUP", cat: "DEX" },
    { name: "Pyth Network", symbol: "PYTH", cat: "Oracle" },
    { name: "Oasis Network", symbol: "ROSE", cat: "Privacy" },
    { name: "Quant", symbol: "QNT", cat: "Interoperability" },
    { name: "Theta", symbol: "THETA", cat: "Media" },
    { name: "Mina", symbol: "MINA", cat: "ZK Rollup" },
    { name: "Tezos", symbol: "XTZ", cat: "Layer 1" },
    { name: "Flow", symbol: "FLOW", cat: "NFT & Gaming" },
    { name: "Chiliz", symbol: "CHZ", cat: "Sports" },
    { name: "Curve DAO", symbol: "CRV", cat: "DeFi" },
    { name: "PancakeSwap", symbol: "CAKE", cat: "DEX" },
    { name: "Gala", symbol: "GALA", cat: "Gaming" },
    { name: "Sandbox", symbol: "SAND", cat: "Metaverse" },
    { name: "Decentraland", symbol: "MANA", cat: "Metaverse" },
    { name: "Axie Infinity", symbol: "AXS", cat: "Gaming" },
    { name: "EOS", symbol: "EOS", cat: "Layer 1" },
    { name: "Neo", symbol: "NEO", cat: "Layer 1" },
    { name: "Kava", symbol: "KAVA", cat: "DeFi" },
    { name: "Zcash", symbol: "ZEC", cat: "Privacy" },
    { name: "IOTA", symbol: "IOTA", cat: "IoT" },
    { name: "Conflux", symbol: "CFX", cat: "Layer 1" },
    { name: "Synthetix", symbol: "SNX", cat: "DeFi" },
    { name: "Stepn", symbol: "GMT", cat: "Move-to-Earn" },
    { name: "Helium", symbol: "HNT", cat: "DePIN" },
    { name: "JasmyCoin", symbol: "JASMY", cat: "IoT" },
    { name: "Notcoin", symbol: "NOT", cat: "Gaming" },
    { name: "dogwifhat", symbol: "WIF", cat: "Meme" },
    { name: "Popcat", symbol: "POPCAT", cat: "Meme" },
    { name: "Brett", symbol: "BRETT", cat: "Meme" },
    { name: "BOOK OF MEME", symbol: "BOME", cat: "Meme" },
    { name: "Ether.fi", symbol: "ETHFI", cat: "Restaking" },
    { name: "Pendle", symbol: "PENDLE", cat: "DeFi" },
    { name: "Aevo", symbol: "AEVO", cat: "DEX" },
    { name: "Wormhole", symbol: "W", cat: "Bridge" },
    { name: "LayerZero", symbol: "ZRO", cat: "Bridge" },
    { name: "Blast", symbol: "BLAST", cat: "Layer 2" },
    { name: "Manta Network", symbol: "MANTA", cat: "Layer 2" },
    { name: "AltLayer", symbol: "ALT", cat: "Rollup" },
    { name: "Dymension", symbol: "DYM", cat: "Modular" },
    { name: "Ronin", symbol: "RON", cat: "Gaming" },
    { name: "Beam", symbol: "BEAM", cat: "Gaming" },
    { name: "Illuvium", symbol: "ILV", cat: "Gaming" },
    { name: "Blur", symbol: "BLUR", cat: "NFT Marketplace" },
    { name: "LooksRare", symbol: "LOOKS", cat: "NFT Marketplace" },
    { name: "Enjin Coin", symbol: "ENJ", cat: "Gaming" },
    { name: "Loopring", symbol: "LRC", cat: "Layer 2" },
    { name: "Compound", symbol: "COMP", cat: "DeFi" },
    { name: "1inch Network", symbol: "1INCH", cat: "DEX Aggregator" },
    { name: "Basic Attention", symbol: "BAT", cat: "Browser" },
    { name: "Nexo", symbol: "NEXO", cat: "CeFi" },
    { name: "0x", symbol: "ZRX", cat: "DEX" },
    { name: "Ankr", symbol: "ANKR", cat: "Infrastructure" },
    { name: "Siacoin", symbol: "SC", cat: "Storage" },
  ];

  const allCoins = [...top10Coins];

  // Generate ranks 11–100
  for (let i = 11; i <= 100; i++) {
    const coinMeta = additionalCoins[(i - 11) % additionalCoins.length];

    const change24hPct = parseFloat(
      (
        Math.sin(i * 1.7) * 8.5 +
        (i % 3 === 0 ? 3 : -2)
      ).toFixed(2)
    );

    let basePrice = 10 + (Math.sin(i * 2.3) + 1) * 1200;

    if (i % 7 === 0) {
      basePrice = 0.85 + (i % 5) * 0.4;
    }

    if (i % 11 === 0) {
      basePrice = 15000 + i * 250;
    }

    const priceInr = parseFloat(
      basePrice.toFixed(basePrice < 10 ? 4 : 2)
    );

    const volNum = Math.floor(
      10 + Math.abs(Math.sin(i * 3.1)) * 890
    );

    const mcapNum = Math.floor(
      volNum * 5 + Math.abs(Math.cos(i * 1.9)) * 4500
    );

    const volume24h = `₹${volNum.toLocaleString("en-IN")} Cr`;
    const marketCap = `₹${mcapNum.toLocaleString("en-IN")} Cr`;

    const sparkline: number[] = [];

    let currentVal = priceInr * (1 - change24hPct / 100);
    const step = (priceInr - currentVal) / 6;

    for (let j = 0; j < 6; j++) {
      currentVal +=
        step + Math.sin(j * 1.5 + i) * (priceInr * 0.01);

      sparkline.push(
        parseFloat(
          currentVal.toFixed(priceInr < 10 ? 4 : 2)
        )
      );
    }

    sparkline.push(priceInr);

    const symbol =
      i > 10 && allCoins.some((coin) => coin.symbol === coinMeta.symbol)
        ? `${coinMeta.symbol}${i}`
        : coinMeta.symbol;

    allCoins.push({
      symbol,
      name: coinMeta.name,
      subtext: `${symbol}/INR • ${coinMeta.cat}`,
      rank: i,
      priceInr,
      change24hPct,
      volume24h,
      marketCap,
      sparkline,
      isStarred: false,
    });
  }

  function mapCategory(subtext: string, symbol: string): "LAYER_1" | "DEFI" | "STABLECOIN" | "EXCHANGE_TOKEN" | "MEME" | "SMART_CONTRACT" {
    const sym = symbol.toUpperCase();
    const sub = subtext.toLowerCase();

    if (sym === "BTC") return "LAYER_1";
    if (sym === "ETH" || sub.includes("smart contract")) return "SMART_CONTRACT";
    if (sym === "USDT" || sym === "USDC" || sym === "DAI" || sub.includes("stablecoin")) return "STABLECOIN";
    if (sym === "BNB" || sub.includes("exchange")) return "EXCHANGE_TOKEN";
    if (sym === "DOGE" || sym === "SHIB" || sym === "PEPE" || sym === "BONK" || sym === "FLOKI" || sym === "WIF" || sym === "POPCAT" || sym === "BRETT" || sym === "BOME" || sub.includes("meme")) return "MEME";
    if (sub.includes("defi") || sub.includes("dex") || sub.includes("oracle") || sub.includes("yield") || sub.includes("lending") || sub.includes("indexing") || sub.includes("restaking") || sub.includes("bridge") || sub.includes("aggregator")) return "DEFI";
    return "LAYER_1";
  }

  function parseMarketCapCr(mcapStr: string): number {
    if (!mcapStr) return 0;
    if (mcapStr.includes("L Cr")) {
      const num = parseFloat(mcapStr.replace(/[^0-9.]/g, ""));
      return num * 100000;
    }
    const cleaned = mcapStr.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  }

  // Create coins and price snapshots
  for (const data of allCoins as any[]) {
    const category = mapCategory(data.subtext || "", data.symbol);
    const mcapCr = parseMarketCapCr(data.marketCap);

    const coin = await prisma.coin.create({
      data: {
        symbol: data.symbol,
        name: data.name,
        subtext: data.subtext,
        category: category,
        rank: data.rank,
        network: data.network || "Layer 1 Network",
        description: data.description || `${data.name} is a leading digital asset operating on a decentralized peer-to-peer network.`,
        websiteUrl: data.websiteUrl || `https://${data.name.toLowerCase().replace(/\s+/g, '')}.org`,
        whitepaperUrl: data.whitepaperUrl || `https://${data.name.toLowerCase().replace(/\s+/g, '')}.org/whitepaper`,
        circulatingSupply: data.circulatingSupply || "100.0M",
        maxSupply: data.maxSupply || "Infinite",
      },
    });

    const low24h = data.low24h ?? parseFloat((data.priceInr * 0.96).toFixed(2));
    const high24h = data.high24h ?? parseFloat((data.priceInr * 1.04).toFixed(2));

    await prisma.priceSnapshot.create({
      data: {
        coinId: coin.id,
        priceInr: data.priceInr,
        change24hPct: data.change24hPct,
        low24h,
        high24h,
        volume24h: data.volume24h,
        marketCap: data.marketCap,
        marketCapInrCr: mcapCr,
        sparkline7d: JSON.stringify(data.sparkline),
      },
    });

    // Add starred coins to default watchlist
    if (data.isStarred) {
      await prisma.watchlistItem.create({
        data: {
          watchlistId: watchlist.id,
          coinId: coin.id,
        },
      });
    }
  }

  console.log(
    `Seeding complete! ${allCoins.length} coins seeded, 5 added to default watchlist.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });