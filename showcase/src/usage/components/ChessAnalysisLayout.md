# ChessAnalysisLayout

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 4 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessAnalysis.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessAnalysis.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx` |

## Import

```jsx
import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessAnalysis.jsx`:

```jsx
<ChessAnalysisLayout chessData={chessData} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessAnalysis.jsx`:

```jsx
<ChessAnalysisLayout />
```
