---
title: Chess system — the analysis/play package
type: reference
status: canonical
updated: 2026-07-15
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-chess — the board + variants, pieces (3 SVG sets), the play/analysis apparatus (notation, playback, variation tree, game-archive table), a PGN engine, and a bundled ./data adapter (demo set + B2 CDN fetch for the 27k-game archive), lifted out of kol-component on 2026-07-09. Presentation takes an injected chessData adapter; a ready one ships at ./data.
aliases:
  - chess
  - kol-chess
  - pgn
  - chessboard
sources:
  - packages/chess/src/index.js
  - packages/chess/README.md
  - showcase/src/sets/chess-apparatus.jsx
tags:
  - domain/design-system
  - domain/chess
related:
  - "[[01-package-topology|package topology]]"
  - "[[09-dashboards-system|dashboards system]]"
---

# Chess system — `@kolkrabbi/kol-chess`

The chess board / play / analysis apparatus, lifted out of `kol-component` on 2026-07-09 because it's a shared capability with multiple consumers and versions on its own cadence. Two entry points: the components (`.`) and a bundled game-data adapter (`./data`).

```js
import { ChessAnalysisLayout, ChessBoard } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'
```

## Component index (`.`)

| Group | Exports | What it is |
|-------|---------|-----------|
| **Board + variants** | `ChessBoard`, `ChessBoardWithControls`, `ChessBoardWithSidebar`, `ChessBoardFullscreen` | the board and its four framings (bare / +controls / +sidebar / fullscreen) |
| **Apparatus** | `ChessAnalysisLayout`, `ChessSidebar`, `NotationPanel`, `PlaybackControls`, `VariationTree`, `GameArchiveTable`, `AlternativeControlsMock` | the full analysis layout — move notation, playback transport, variation tree, and the archive table (the game picker is a DS `Dropdown` inside the controls since 0.2.0; the dead `GameSelector` export was deleted 2026-07-15) |
| **Pieces** | `ChessPiece` | piece renderer + 3 bundled SVG sets (`chess-vector-set`, `chess-extra-set/set-1,2,3`) |
| **Hero** | `ChessHero` | landing / specimen hero |
| **State** | `ChessControlsProvider`, `useChessControls`, `createSnapshotsFromPgn` | context that drives board ⇄ notation ⇄ playback sync |
| **PGN engine** | `buildMoveTree` | parses PGN into a move tree (variations included) |

## The data adapter — `./data`

The apparatus takes a **`chessData` prop** and never fetches on its own. This package ships a ready adapter at `@kolkrabbi/kol-chess/data` — pass it straight in:

```jsx
<ChessAnalysisLayout chessData={chessData} />
```

The adapter exposes `getSampleGames`, `getManifest`, `getMonthlySummary`, `getRandomMonth`, `loadMonthGames`, `getGamePgnByIdAsync`, and more. **Demo data** (manifest + monthly summary + a sample set, ~136 KB) is **bundled**; the full **27,200-game archive** is fetched on demand from the **Backblaze-B2 CDN** (`CDN_BASE` in `src/data/sample-games.js` — a single constant, swap it to repoint). This is the opposite of `kol-content` (per-repo CMS): chess is one canonical public dataset, so it ships bundled. Bring your own adapter of the same shape to serve different data.

## Consumer notes

- **Data is adapter-injected** via the `chessData` prop — components never fetch directly.
- **Shared primitives stay in `kol-component`** — this package depends on `kol-component` + `kol-icons` + `kol-theme`.
- **`chess.js` is a dependency** (move legality / FEN); `react` / `react-dom` are peers.
- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-chess.css`) — this package ships JS + SVG assets only. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-chess/src"` — Tailwind skips `node_modules`, or the utilities never generate).
- Live apparatus: `showcase/src/sets/chess-apparatus.jsx`.
