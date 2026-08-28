# CoinDCX Crypto Watchlist

A full-stack cryptocurrency market tracking and watchlist application inspired by the CoinDCX interface.

The application allows users to explore cryptocurrency markets, view detailed coin information, search and filter assets, and manage their watchlists.

## Features

- View cryptocurrency market data
- Search and filter coins
- Sort market data
- View gainers and losers
- View detailed information for individual coins
- Track 24-hour price changes
- View market cap and trading volume
- View 7-day price trends
- Add and remove coins from watchlists
- View tracked/watchlisted coins
- Automatic market data refresh
- Responsive dark-themed interface
- PostgreSQL database with Prisma ORM
- REST API through Next.js Route Handlers

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Lucide React

### Backend

- Next.js App Router
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- Node.js

### Data

- Cryptocurrency market data from CoinGecko
- PostgreSQL for application data
- Prisma for database access and migrations

### DevOps

- Docker
- Dockerfile
- `.dockerignore`

## Project Structure

```text
SW2627_Nextjs_Crypto_Watchlist/
│
├── app/
│   ├── api/
│   │   ├── coins/
│   │   ├── markets/
│   │   └── watchlists/
│   │
│   ├── (dashboard)/
│   │   ├── coins/
│   │   ├── markets/
│   │   └── watchlist/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── MarketsDashboard.tsx
│   ├── WatchlistTable.tsx
│   ├── TickerStrip.tsx
│   ├── FilterTabs.tsx
│   └── ...
│
├── hooks/
│   └── useMarketData.ts
│
├── lib/
│   ├── prisma.ts
│   ├── useCoinSearch.ts
│   └── useWatchlist.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
├── types/
│
├── Dockerfile
├── .dockerignore
├── next.config.ts
├── package.json
└── README.md
