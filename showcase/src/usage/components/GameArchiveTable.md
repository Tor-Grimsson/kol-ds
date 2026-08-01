# GameArchiveTable

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 4 across 4 files in 3 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessAnalysisLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessAnalysisLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx` |

## Import

```jsx
import { GameArchiveTable } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx`:

```jsx
<GameArchiveTable onGameLoad={(game) => console.log('Game loaded:', game)} />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx`:

```jsx
<GameArchiveTable chessData={chessData} onGameLoad={(game) => console.log('Game loaded:', game)} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessAnalysisLayout.jsx`:

```jsx
<GameArchiveTable onGameLoad={handleGameLoad} />
```
