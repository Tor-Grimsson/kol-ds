# @kolkrabbi/kol-chess

The KOL **chess system** — lifted out of `@kolkrabbi/kol-component` into its own package because it's a shared capability with multiple consumers and versions on its own cadence.

Board, pieces, the play/analysis apparatus, a PGN engine, and a game-data adapter.

## What's in the box

One entry point: **`@kolkrabbi/kol-chess`** — the React components + engine.

**Presentation only.** This package ships no data and never fetches. Until 0.6.0 it also exported a `./data` adapter carrying a Backblaze CDN host; that belonged to the app, not the design system, and moved to `kol-chess`.

### Components (`.`)

| Group | Exports |
| --- | --- |
| **Board + variants** | `ChessBoard`, `ChessBoardWithControls`, `ChessBoardWithSidebar`, `ChessBoardFullscreen` |
| **Apparatus** | `ChessAnalysisLayout`, `ChessSidebar`, `GameSelector`, `NotationPanel`, `PlaybackControls`, `VariationTree`, `AlternativeControlsMock` |
| **Pieces** | `ChessPiece` + 3 bundled SVG sets (`chess-vector-set`, `chess-extra-set/set-1,2,3`) |
| **Hero** | `ChessHero` |
| **State** | `ChessControlsProvider`, `useChessControls`, `createSnapshotsFromPgn` |
| **PGN engine** | `buildMoveTree` |

### The `chessData` adapter (yours, not ours)

The apparatus takes a **`chessData` prop** and never fetches on its own. You supply it:

```jsx
import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
import * as chessData from './data/sample-games.js'   // your app's module

<ChessAnalysisLayout chessData={chessData} />
```

Required shape: `getSampleGames`, `getManifest`, `getMonthlySummary`, `getRandomMonth`, `loadMonthGames`, `getGamePgnByIdAsync`, `loadFullDataset`, `findGameById`.

Reference implementation — `kol-chess/src/data/sample-games.js`: bundles a demo set (`manifest` + `monthlySummary` + samples, ~136 KB) and fetches the full 27,200-game archive on demand from `b2.kolkrabbi.io`. Copy it and repoint `CDN_BASE` to serve different data.

## Consumer requirements

- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-chess.css`, in the theme aggregate) — this package ships JS + SVG assets only.
- **Vite** consumer — `ChessPiece` loads its SVG sets via `import.meta.glob`, and the CDN adapter uses `fetch`.
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-chess/src"` — Tailwind skips `node_modules` when scanning, so without this line the board/controls layout utilities never generate.
