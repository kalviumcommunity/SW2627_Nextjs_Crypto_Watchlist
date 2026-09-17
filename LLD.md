# CryptoCore — LLD

## Database

User
|
└── Watchlist
    ├── id
    ├── userId
    ├── coinId
    └── createdAt

`userId + coinId` is unique to prevent duplicates.

## APIs

GET /api/watchlist
- Get user's watchlist

POST /api/watchlist
- Add cryptocurrency

DELETE /api/watchlist/:coinId
- Remove cryptocurrency

## Price Updates

Load Watchlist
→ Fetch Prices
→ Update UI
→ Wait 5 seconds
→ Fetch Again

Polling stops when the user leaves the page.

## UI States

- Loading
- Empty
- Error
- Populated

## Security

- Authentication required
- Users can only access their own watchlist
- Duplicate entries are prevented
