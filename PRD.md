# CryptoCore — PRD

## Overview
CryptoCore is a cryptocurrency watchlist application that allows users to track selected cryptocurrencies with live price updates.

## Goals
- Add and remove cryptocurrencies from a watchlist.
- Persist watchlist across sessions.
- Refresh prices every 5 seconds while viewing.
- Provide detail pages for the top 100 cryptocurrencies.

## Scope
### In Scope
- Watchlist management
- Live cryptocurrency prices
- 5-second price refresh
- Top 100 coin detail pages
- Loading, empty and error states

### Out of Scope
- Trading
- Buying/selling
- Deposits/withdrawals
- Price alerts
- Portfolio management

## Success Metrics
- Successful add/remove operations
- Watchlist persistence
- Successful price refresh
- Successful navigation to coin details

## Tech Stack
- Next.js
- PostgreSQL
- Prisma
- External Crypto API
- GCP
- GitHub Actions
