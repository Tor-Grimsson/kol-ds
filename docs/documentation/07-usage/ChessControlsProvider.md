# ChessControlsProvider

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** context
- **Real-world usages found:** 10 across 6 files in 3 apps
- **Weighted inbound:** 20★ across 6 edges — 2×4★ · 4×3★
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 3 | `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx` |
| 4 | 3 | `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithControls.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithSidebar.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithControls.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithSidebar.jsx` |

## Import

```jsx
import { ChessControlsProvider } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithControls.jsx`:

```jsx
<ChessControlsProvider externalGame={externalGame}>
      <ChessBoardWithControlsContent />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithSidebar.jsx`:

```jsx
<ChessControlsProvider externalGame={externalGame}>
      <ChessBoardWithSidebarContent
        className={className}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
```

From `kol-website/_tmp/workshop-museum-elder/routes/workshop/ChessComponents.jsx`:

```jsx
<ChessControlsProvider chessData={chessData}>
            <div className="flex flex-row gap-8">
              <ChessBoard size="desktop" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx`:

```jsx
<ChessControlsProvider>
                <div className="flex flex-row gap-8">
                  <ChessBoard size="desktop" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx`:

```jsx
<ChessControlsProvider>
                <GameArchiveTable onGameLoad={(game) => console.log('Game loaded:', game)} />
```
