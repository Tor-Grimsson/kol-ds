# @kolkrabbi/kol-chess

The KOL **chess system** — lifted out of `@kolkrabbi/kol-component` into its own package because it's a shared capability with multiple consumers and versions on its own cadence.

Board, pieces, the play/analysis apparatus, a PGN engine, and a game-data adapter.

## What's in the box

Two entry points:

- **`@kolkrabbi/kol-chess`** — the React components + engine.
- **`@kolkrabbi/kol-chess/data`** — the game-data adapter (bundled demo set + CDN fetch for the full archive).

### Components (`.`)

| Group | Exports |
| --- | --- |
| **Board + variants** | `ChessBoard`, `ChessBoardWithControls`, `ChessBoardWithSidebar`, `ChessBoardFullscreen` |
| **Apparatus** | `ChessAnalysisLayout`, `ChessSidebar`, `GameSelector`, `NotationPanel`, `PlaybackControls`, `VariationTree`, `AlternativeControlsMock` |
| **Pieces** | `ChessPiece` + 3 bundled SVG sets (`chess-vector-set`, `chess-extra-set/set-1,2,3`) |
| **Hero** | `ChessHero` |
| **State** | `ChessControlsProvider`, `useChessControls`, `createSnapshotsFromPgn` |
| **PGN engine** | `buildMoveTree` |

### Data adapter (`./data`)

The apparatus takes a **`chessData` prop** — it never fetches on its own. This package ships a ready adapter you can pass straight in:

```jsx
import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

<ChessAnalysisLayout chessData={chessData} />
```

The adapter provides `getSampleGames`, `getManifest`, `getMonthlySummary`, `getRandomMonth`, `loadMonthGames`, `getGamePgnByIdAsync`, and more. **Demo data** (`manifest` + `monthlySummary` + a sample set, ~136 KB) is bundled; the **full 27,200-game archive** is fetched on demand from the Backblaze-B2 CDN (`CDN_BASE` in `data/sample-games.js` — a single constant, swap it to repoint). Bring your own adapter of the same shape to serve different data.

## Consumer requirements

- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-chess.css`, in the theme aggregate) — this package ships JS + SVG assets only.
- **Vite** consumer — `ChessPiece` loads its SVG sets via `import.meta.glob`, and the CDN adapter uses `fetch`.
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-chess/src"` — Tailwind skips `node_modules` when scanning, so without this line the board/controls layout utilities never generate.
