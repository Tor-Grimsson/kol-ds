# ChessBoard

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 16 across 8 files in 3 apps
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

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

From `kol-website/apps/web/src/routes/workshop/ChessComponents.jsx`:

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
