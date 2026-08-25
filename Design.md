# CryptoDash — Design & Build Specification

A dark-theme crypto trading dashboard (CoinDCX-inspired) covering four core screens: **Coin Detail**, **All Crypto Markets**, **Watchlist Dashboard**, and **System States (Empty/Loading)**. This doc is written as a build-ready spec for an AI coding agent (Claude Code / Cursor) or a human dev to implement pixel-consistently.

---

## 1. Product Overview

**What it is:** A market-data and watchlist web app for tracking crypto assets — live prices, % change, mini trend sparklines, market cap/volume, and a per-coin detail view with a price chart.

**Core screens:**
1. Coin Detail (e.g. Ethereum) — price, range chart, stats, description
2. All Crypto Markets — full sortable/searchable market table
3. Watchlist Dashboard — user's starred/tracked coins with quick "Trade" actions
4. System States — sidebar-driven watchlist management, empty state, and loading skeletons

**Platform:** Responsive web app, desktop-first (min-width ~1280px canvas), degrading gracefully to tablet/mobile.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma — schema-first models for `Coin`, `PriceSnapshot`, `Watchlist`, `WatchlistItem`, `User`
- **API layer:** Next.js Route Handlers (`/app/api/*`) reading/writing via Prisma Client; consider tRPC on top if end-to-end type safety across client/server is desired
- **Styling:** Tailwind CSS with the design tokens below mapped into `tailwind.config.js`
- **Charts:** Recharts or Lightweight-Charts (TradingView) for the price line/candlestick chart + inline sparklines
- **Data fetching/caching (client):** React Query (TanStack) for polling live price data on top of the Next.js API routes; WebSocket or Server-Sent Events route for real-time ticks if available
- **Icons:** Lucide-react
- **Tables:** TanStack Table (sorting, filtering) for the All Markets grid
- **Auth (if needed for per-user watchlists):** NextAuth.js / Auth.js, session-linked to the Prisma `User` model

---

## 3. Design Tokens

### 3.1 Color Palette

| Token | Hex (approx) | Usage |
|---|---|---|
| `bg-canvas` | `#1E1E1E` | Outer page background (behind app shell) |
| `bg-app` | `#0B0F17` | App shell / navbar background |
| `bg-surface` | `#111827` | Primary card / panel background |
| `bg-surface-alt` | `#161F2E` | Table row (odd), nested panel background |
| `bg-surface-hover` | `#1B2536` | Row hover / active tab background |
| `border-subtle` | `#232B3A` | Card borders, table dividers |
| `text-primary` | `#F5F6F8` | Headings, primary values |
| `text-secondary` | `#9AA4B2` | Labels, muted body copy |
| `text-tertiary` | `#5B6472` | Placeholder text, disabled |
| `accent-primary` (brand red) | `#F0473A` | Primary CTA buttons ("Trade"), active tab underline, logo mark |
| `accent-primary-hover` | `#D63A2F` | Button hover |
| `accent-positive` (green) | `#1FB878` | Positive % change, up-trend sparkline, buy states |
| `accent-positive-bg` | `#12332A` | Positive % badge background |
| `accent-negative` (red/rose) | `#E5484D` | Negative % change, down-trend sparkline |
| `accent-negative-bg` | `#341C22` | Negative % badge background |
| `accent-warning` (gold) | `#F5B94D` | Star/watchlist icon, rank badges |
| `focus-ring` | `#3B82F6` | Input focus outline |

### 3.2 Typography

- **Font family:** `Inter` (or `Sofia Pro` / system-ui fallback) — geometric sans, tabular numerals for prices
- **Scale:**
  | Style | Size / Weight | Usage |
  |---|---|---|
  | Display | 28px / 700 | Page title ("Crypto Watchlist", "All Crypto Markets") |
  | H1 (Coin name) | 22px / 700 | Coin name on detail page |
  | H2 | 16px / 600 | Card/section titles ("About Ethereum") |
  | Body Large | 15px / 500 | Table primary values, coin price |
  | Price Display | 32px / 700, tabular-nums | Big price on detail page |
  | Body | 13px / 400 | Table cell text, descriptions |
  | Caption / Label | 11px / 600, uppercase, +0.04em tracking | Stat box labels ("MARKET CAP", "24H VOLUME") |
- Use `font-variant-numeric: tabular-nums` on all price/number cells so columns align.

### 3.3 Spacing & Radius

- Base spacing unit: **4px** (use 4/8/12/16/20/24/32 scale)
- Card padding: 20–24px
- Table row height: 52px (dashboard/watchlist), 44px (dense all-markets table)
- Radius: `--radius-sm: 6px` (badges/buttons), `--radius-md: 10px` (cards), `--radius-full` for pills/avatars
- Card border: 1px solid `border-subtle`

### 3.4 Elevation

- Cards sit flush on the dark canvas — no drop shadows; separation comes from `border-subtle` + subtle background contrast (`bg-surface` vs `bg-app`).
- Modals/dropdowns only: `box-shadow: 0 8px 24px rgba(0,0,0,0.45)`.

---

## 4. Global Layout

- **Top navbar** (persistent, 56–64px tall, `bg-app`, bottom border `border-subtle`):
  - Left: Logo (wordmark, two-tone: white + accent-primary for "DCX"/brand suffix)
  - Center-left: nav links — `Markets` (or `Coins`) · `Futures` · `Options` · `Earn` — active link gets `accent-primary` text + 2px underline
  - Right: search input (pill, `bg-surface`, icon-left) → notification bell icon → settings icon → wallet/balance pill (monospace balance) → circular profile avatar → primary red "Register/Trade ETH" button where relevant
- **Optional ticker strip** below navbar on market-heavy pages (24h Vol, BTC Dom, ETH Dom, Total Mcap, Global Market %) — 32px tall, smaller 11px text, `bg-app`, subtle bottom border.
- **Content container:** max-width ~1280–1440px, centered, 24–32px outer padding.
- **Sidebar (System States screen only):** 220px fixed-width left rail, `bg-app`, list of watchlists ("Watchlist 1", "DeFi Gems", "Layer 1s") each as a nav item with folder/star icon; active item gets `bg-surface-hover` + rounded pill.

---

## 5. Reusable Components

### 5.1 Buttons
- **Primary (CTA):** `accent-primary` fill, white text, 600 weight, `radius-sm`, height 36–40px, horizontal padding 16–20px. e.g. "Trade ETH", "Explore all Coins", "Add Coin"
- **Secondary/Ghost:** transparent bg, 1px `border-subtle`, white text — e.g. "Edit List", "1D 1W 1M 1Y All" range toggle (segmented control, active segment gets `bg-surface-hover` pill)
- **Icon button:** 32×32px, circular or `radius-sm`, `bg-surface`, centered icon, hover → `bg-surface-hover`

### 5.2 Badges / Pills
- **Ticker/rank pill:** `bg-surface-hover`, `text-secondary`, 11px, radius-full, e.g. "ETH/INR", "Rank #2"
- **% Change badge:** rounded pill, colored bg (`accent-positive-bg` / `accent-negative-bg`) with matching text color, arrow icon (↗/↘) + percentage, tabular-nums. e.g. `+2.68%`
- **Watchlist star toggle:** gold `accent-warning` filled star when active, outline gray when inactive

### 5.3 Sparkline (7D/24H trend)
- Inline mini line chart, ~80×32px, no axes/gridlines
- Stroke: `accent-positive` if net change ≥ 0, `accent-negative` if < 0
- 1.5px stroke width, no fill or a very subtle 8%-opacity gradient fill under the line

### 5.4 Price Chart (Detail Page)
- Full-width area/line chart, height ~280px
- Line stroke `accent-positive` (or negative color if coin is down), 2px
- Gradient fill under line: `accent-positive` at 25% opacity fading to transparent
- Thin vertical crosshair guide line (dashed, `border-subtle`) on hover with a tooltip showing exact price/time
- Range selector top-right: segmented control `1D · 1W · 1M · 1Y · All`

### 5.5 Table (All Markets / Watchlist)
- Header row: `text-tertiary`, 11px uppercase, sticky on scroll, columns: `# · Asset · Price (INR) · 24h Change · 7d Trend · 24h Volume · Market Cap · Action`
- Row: coin icon (24px circular) + name (600 weight) + symbol/network subtext (`text-tertiary`, 11px) stacked under name
- Alternate row striping optional — prefer hover-only highlight (`bg-surface-hover`) over zebra striping for a cleaner look
- Row border: 1px `border-subtle` bottom only (no vertical dividers)
- Action column: small red "Trade" button (32px tall) right-aligned
- Pagination footer: "Showing X–Y of Z assets" left, prev/next controls right

### 5.6 Stat Box (Detail Page sidebar cards)
- Small bordered card, label (caption style) top, value (18–20px/700) below
- Used for: 24h Range (with a min–max slider bar, green gradient track + white dot handle), 24h Volume, Market Cap, Circulating Supply (+ "Max: Infinite" pill)

### 5.7 Search Input
- Pill/rounded-md, `bg-surface`, 1px `border-subtle`, left search icon, placeholder `text-tertiary`, focus → `focus-ring` outline

---

## 6. Screen Specifications

### 6.1 Coin Detail — `/coins/[symbol]`
**Breadcrumb:** `← Back to Markets & Watchlist` (small, `text-secondary`, top-left)

**Header row:**
- Coin logo (40px circle) + Name (H1) + ticker pill (`ETH/INR`) + rank pill (`Rank #2`) + network subtext ("Layer 1 Network") below name
- Right-aligned: gold outline "★ Watchlisted" toggle button + primary red "Trade ETH" button

**Price block (left, ~65% width):**
- Big price (Price Display style, ₹ prefix) — e.g. `₹2,84,500.00`
- Below: positive/negative % badge + "Today" label
- Range toggle (1D/1W/1M/1Y/All) top-right of the chart card
- Price chart (see 5.4), full width of this column, inside a bordered card

**Stats sidebar (right, ~35% width), stacked cards:**
1. 24h Range card: "Low ₹x" ... "High ₹y" labels with a horizontal gradient slider bar and current-price dot marker
2. Two-column mini stats: "24h Volume" and "Market Cap" side by side
3. Circulating Supply card with a "Max: Infinite" pill top-right

**About section (full width, below):**
- Card titled "About Ethereum (ETH)"
- 2 short paragraphs, `text-secondary`, 13–14px, relaxed line-height
- Footer links row: "Official Website" and "Whitepaper" as icon + text links, `text-secondary`, small

---

### 6.2 All Crypto Markets — `/markets`
**Sub-nav row** under main navbar: tabs `My Watchlist (N)` / `All Markets` (active, red underline/border) / `Gainers` / `Losers` — plus right-aligned search bar
**Page title:** "All Crypto Markets" (Display style)
**Table:** full spec per §5.5, ~20+ rows visible, numbered rank column with colored coin icons (each coin gets a brand-colored dot/icon)
**Footer:** "Showing 1–20 of 250+ assets" + pagination

---

### 6.3 Watchlist Dashboard — `/watchlist`
**Page header:** "Crypto Watchlist" (Display) + subtext "Real-time market data and performance metrics for your tracked assets."
**Filter tabs:** `★ My Watchlist (N)` (active, red border) / `All Markets` / `Gainers` / `Losers` — search input right-aligned
**Table:** same column set as All Markets but every row is pre-starred (gold filled star, leftmost column) and includes the red "Trade" action button per row
**Footer:** "Showing 1–5 of 5 assets" + prev/next

---

### 6.4 System States — `/watchlist/[id]` (management + empty + loading)
**Left sidebar:** "MY WATCHLISTS" label + list (Watchlist 1 — active/selected pill, Defi Gems, Layer 1s) + "+ New Watchlist" affordance at bottom
**Content header:** Watchlist name (H2) + subtext "Track your favorite assets in real time." + right-aligned "✎ Edit List" (secondary) and "+ Add Coin" (primary red) buttons

**Empty state card** (bordered panel, centered content, ~320px min-height):
- Centered square icon tile (`bg-surface`, radius-md) with gold star icon
- Heading: "Your watchlist is empty" (H2, white)
- Subtext: "Star coins from the market overview to add them here and monitor their performance closely." (`text-secondary`, centered, max-width ~360px)
- Primary red button: "Explore all Coins"

**Loading state** (shown below/instead of table when data is fetching):
- Skeleton header bar (shimmering rounded rect, `bg-surface-hover`, ~30% opacity pulse)
- Skeleton table: header row + 3–4 row skeletons, each cell a rounded rect placeholder (`bg-surface-hover`, pulse animation `opacity 40%→70%→40%` over 1.5s loop)
- Real table header stays visible/legible while row cells shimmer

---

## 7. Interaction & State Rules

| Element | Default | Hover | Active/Selected | Disabled |
|---|---|---|---|---|
| Nav link | `text-secondary` | `text-primary` | `accent-primary` + underline | — |
| Table row | `bg-surface` | `bg-surface-hover` | — | — |
| Star icon | outline gray | scale 1.05, gold tint | filled `accent-warning` | — |
| Primary button | `accent-primary` | `accent-primary-hover`, slight lift | pressed: 96% scale | 40% opacity, no pointer |
| Range toggle segment | `text-secondary` | `bg-surface-hover` | `bg-surface-hover` + `text-primary` | — |
| % Change badge | color reflects sign live | — | — | — |

**Loading:** skeleton shimmer, never a blank white flash — always keep dark background continuity.
**Empty:** always pair empty illustration/icon + 1-line heading + 1-line supporting text + 1 primary action.
**Error/stale price:** if feed disconnects, dim the price 60% opacity and show a small "Reconnecting…" caption under it rather than hiding data.

---

## 8. Responsive Behavior

- **≥1280px:** full layout as specified (multi-column stats sidebar, full table columns)
- **768–1279px:** stats sidebar on Coin Detail stacks below chart (single column); table drops "Market Cap" column, keeps Price/24h/Action
- **<768px:** navbar collapses to hamburger + logo + avatar; tables convert to stacked cards (coin icon+name+price on top row, change badge + sparkline + trade button on second row); sidebar (System States) becomes a horizontal scrollable chip list above content

---

## 9. Data Model — Prisma Schema (PostgreSQL)

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         String      @id @default(cuid())
  email      String      @unique
  name       String?
  createdAt  DateTime    @default(now())
  watchlists Watchlist[]
}

model Coin {
  id                 String            @id @default(cuid())
  symbol             String            @unique   // "ETH"
  name               String                       // "Ethereum"
  network            String?                      // "Layer 1 Network"
  rank               Int
  iconUrl            String?
  description        String?           @db.Text
  websiteUrl         String?
  whitepaperUrl      String?
  circulatingSupply  Decimal           @db.Decimal(30, 8)
  maxSupply          Decimal?          @db.Decimal(30, 8) // null => "Infinite"
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  priceSnapshots     PriceSnapshot[]
  watchlistItems     WatchlistItem[]
}

// Latest + historical price ticks, used for current price, 24h change, and chart/sparkline series
model PriceSnapshot {
  id           String   @id @default(cuid())
  coinId       String
  coin         Coin     @relation(fields: [coinId], references: [id])
  priceInr     Decimal  @db.Decimal(20, 4)
  volume24h    Decimal  @db.Decimal(20, 2)
  marketCap    Decimal  @db.Decimal(24, 2)
  change24hPct Decimal  @db.Decimal(6, 2)
  low24h       Decimal  @db.Decimal(20, 4)
  high24h      Decimal  @db.Decimal(20, 4)
  recordedAt   DateTime @default(now())

  @@index([coinId, recordedAt])
}

model Watchlist {
  id        String          @id @default(cuid())
  name      String          // "Watchlist 1", "DeFi Gems"
  userId    String
  user      User            @relation(fields: [userId], references: [id])
  createdAt DateTime        @default(now())
  items     WatchlistItem[]
}

model WatchlistItem {
  id          String    @id @default(cuid())
  watchlistId String
  watchlist   Watchlist @relation(fields: [watchlistId], references: [id])
  coinId      String
  coin        Coin      @relation(fields: [coinId], references: [id])
  addedAt     DateTime  @default(now())

  @@unique([watchlistId, coinId])
}
```

**Derived/computed values (not stored, calculated in the API layer or a view):**
- `change7dSeries` for sparklines → derive from `PriceSnapshot` rows over the trailing 7 days (bucketed), or maintain a separate lightweight `PriceHistoryDaily` table if querying raw snapshots is too slow
- 24h Volume / Market Cap "Cr / T" compact formatting happens client-side via `formatCompactCr()`, raw Decimal values stay precise in Postgres

**Suggested indexes:** `Coin.rank`, `Coin.symbol`, `PriceSnapshot(coinId, recordedAt DESC)` for fast "latest price" and "last 7 days" lookups.

---

## 10. Suggested Project Structure (Next.js App Router)

```
/prisma
  schema.prisma
  /migrations
  seed.ts                     -> seeds Coin + PriceSnapshot mock data

/src
  /app
    /(dashboard)
      /coins/[symbol]/page.tsx      -> Coin Detail
      /markets/page.tsx             -> All Crypto Markets
      /watchlist/page.tsx           -> Watchlist Dashboard
      /watchlist/[id]/page.tsx      -> System States (manage/empty/loading)
      layout.tsx                    -> shared NavBar + TickerStrip shell
    /api
      /coins/route.ts                -> GET list, filters (gainers/losers/search)
      /coins/[symbol]/route.ts       -> GET single coin + snapshot history
      /watchlists/route.ts           -> GET/POST watchlists for current user
      /watchlists/[id]/items/route.ts -> POST/DELETE watchlist items (star toggle)

  /components
    /layout        NavBar, TickerStrip, Sidebar, PageContainer
    /ui            Button, Badge, PricePill, SearchInput, SegmentedControl, StatCard
    /charts        PriceChart, Sparkline
    /table         MarketTable, MarketRow, TableSkeleton
    /states        EmptyState, LoadingSkeleton

  /lib
    prisma.ts        -> singleton PrismaClient instance
    formatters.ts     -> INR/Cr/Lc + % formatting helpers
    useCoinFeed.ts    -> React Query hook polling /api/coins (or SSE/WebSocket)

  /types
    index.ts          -> shared DTO types (derived from Prisma types via `Prisma.CoinGetPayload<...>`)
```

**Formatting helpers to implement (`/lib/formatters.ts`):**
- `formatINR(value)` → `₹2,84,500.00`
- `formatCompactCr(value)` → `₹6,430.2 Cr` / `₹34.2L Cr` (Indian numbering: Lakh/Crore units)
- `formatPct(value)` → `+2.68%` / `-1.85%` with sign-based color

**Data flow:** Route Handlers query Postgres via Prisma Client → return typed JSON → React Query hooks in client components poll/cache it → UI components render from that cache. Keep Prisma Client server-only (never import `@prisma/client` in a `"use client"` file).