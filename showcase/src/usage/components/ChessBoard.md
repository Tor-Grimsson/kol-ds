# ChessBoard

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 16 across 8 files in 3 apps
- **Weighted inbound:** 26★ across 8 edges — 2×4★ · 6×3★
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 5 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx` |
| 4 | 5 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardFullscreen.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithSidebar.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardFullscreen.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithControls.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithSidebar.jsx` |

## Import

```jsx
import { ChessBoard } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithControls.jsx`:

```jsx
<ChessBoard
      fen={snapshots[moveIndex]?.fen}
      size="fluid"
      orientation={orientation}
      lastMove={lastMove}
      pieceSet={pieceSet}
      boardTheme={boardTheme}
    />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardFullscreen.jsx`:

```jsx
<ChessBoard size={boardSize} {...restBoardProps} />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx`:

```jsx
<ChessBoard size="desktop" />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithSidebar.jsx`:

```jsx
<ChessBoard fen={snapshots[moveIndex]?.fen} size="fluid" orientation={orientation} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx`:

```jsx
<ChessBoard size="mobile" />
```
