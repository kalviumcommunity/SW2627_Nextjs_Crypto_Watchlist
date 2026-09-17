# CryptoCore — HLD

## Architecture

User
→ Next.js Frontend
→ Backend API
→ Prisma
→ PostgreSQL

Frontend
→ Crypto API
→ Live Prices

## Components

- Frontend: Watchlist UI, search and coin details
- Backend: Watchlist CRUD and authentication
- Database: Stores user watchlists
- Prisma: Database access
- Crypto API: Provides live prices

## Price Updates

Watchlist → Crypto API → Prices → UI

Prices refresh every 5 seconds while the watchlist is open.

## Deployment

GitHub → GitHub Actions → GCP
