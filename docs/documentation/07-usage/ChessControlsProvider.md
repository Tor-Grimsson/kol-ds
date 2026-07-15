# ChessControlsProvider

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** context
- **Real-world usages found:** 10 across 6 files in 3 apps
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

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

From `kol-website/apps/web/src/routes/workshop/ChessComponents.jsx`:

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
