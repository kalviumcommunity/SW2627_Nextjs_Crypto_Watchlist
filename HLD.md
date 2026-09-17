# CryptoCore — HLD

## Architecture

```text
User
 |
 v
Next.js Frontend
 |
 +------> Watchlist API ------> Prisma ------> PostgreSQL
 |
 +------> Price Service ------> Crypto API
 |
 v
Coin Detail Pages
