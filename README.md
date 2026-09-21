# SKITCHMARKETS

Shadow-book desk: watch → score → quote or take → flatten.

Screen + bot is one system. PIN is the MM. DK / MGM / FD / CZR / RIV / BOV are the squares. Poly and Kalshi are cents.

## Run (TanStack Start + React 19)

```
npm install
npm run dev
```

Preview DB is PGLite (no DATABASE_URL). Deployed, set DATABASE_URL (Neon). Schema is migrations/0001_paper.sql through 0005_screen.sql.

## Routes

- /           Book
- /screen     Odds screen (PIN + US books + Poly/Kalshi)
- /embed      Chrome-less screen for iframe
- /api/board  CORS JSON board — poll every 3s
- /tape       Paper tape / OMS
- /integrate  Copy-paste recipes
- /card /jvi /intel /settle

## Tape core (src/lib/paper/)

- doctrine.ts — take / make / flatten / skip
- ingest.ts kalshi.ts horizon.ts — books + Poly + Kalshi + 15m roll
- scanner.ts watch.ts shops.ts — join key, filters, shop grid
- engine.server.ts exec.ts oms.ts — tick + paper fills
- board.ts — public payload for /api/board

## Drop into another Grok Build chat

Publish this app first. Then iframe /embed or poll /api/board.
Or unzip this tree into a new builder and tell it the stack is already TanStack Start.
