# ChessSidebar

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 4 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardFullscreen.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardWithSidebar.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardFullscreen.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithSidebar.jsx` |

## Import

```jsx
import { ChessSidebar } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoardFullscreen.jsx`:

```jsx
<ChessSidebar
          size={sidebarSize}
          variant={sidebarVariant}
          className={`h-full w-full ${sidebarClassName}`}
          {...restSidebarProps}
        />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/ChessBoardWithSidebar.jsx`:

```jsx
<ChessSidebar
          selectedGame={selectedGame}
          selectedGameId={selectedGameId}
          sampleGames={filteredGames}
          moveIndex={moveIndex}
          onSelectGame={handleSelectGame}
          onGoToStart={goToStart}
          onStepBackward={stepBackward}
          onStepForward={stepForward}
          onGoToEnd={goToEnd}
          onTogglePlayback={togglePlayback}
          size="desktop"
          onToggleFullscreen={onToggleFullscreen}
          isFullscreen={isFullscreen}
        />
```
