# Brief: package CHESS for monorepo consumption (finish the migration)

> **For the kol-ds agent.** Written 2026-07-09 by the monorepo agent. Goal: chess becomes
> importable from published packages, exactly like dashboards. One publish at the end covers both.
> Owner (Tor) publishes — never publish or run git yourself.

## Context — what is ALREADY staged in this repo (uncommitted, do not redo)

Dashboard packaging landed 2026-07-09, sitting uncommitted in the working tree:

- `packages/component/src/dashboards/` — lifted from `showcase/src/workshop/dashboards`
  (index.js minus its `import './dashboard.css'` line; components byte-identical).
- `packages/component/package.json` — exports gained `"./dashboards": "./src/dashboards/index.js"`,
  version bumped **0.6.0 → 0.7.0**.
- `packages/theme/kol-components-dashboards.css` — copy of showcase `dashboard.css`.
- `packages/theme/kol-theme.css` — aggregate gained the dashboards import (layer components).
- `packages/theme/package.json` — version bumped **0.6.0 → 0.7.0**.

Verify these exist; keep them. Chess rides the SAME 0.7.0 (unpublished) so one publish ships both.

## The job — chess into the packages

**Source of truth: `showcase/src/workshop/chess/`** — it is a SUPERSET of the monorepo copy:
has `chess.css`, `ChessPiece.jsx`, `index.js` co-located, plus `assets/chess-extra-set/` and
`assets/chess-vector-set/` (the extra piece sets the monorepo never had).

### 1. Reconcile drift first

11 of 15 shared component files drift vs the monorepo copy
(`~/dev/projects/kol-monorepo/apps/web/src/components/workshop/chess/`), mostly 4–8 lines
(likely import paths). Rules:

- **DS (this repo) is canonical** — its versions win style/structure conflicts.
- **EXCEPT carry over the monorepo's 2026-07-09 fix:** `ChessBoardWithControls.jsx` no longer
  carries `lg:max-w-[1232px]` (the clamp moved up to `ChessAnalysisLayout.jsx`'s wrapper:
  `space-y-8 md:space-y-12 lg:max-w-[1232px]`). Mirror that in the packaged versions.
- `ChessBoard.jsx` drifts by ~32 lines — the one file needing a real read. Diff both, judge,
  prefer DS unless the monorepo side is a bug fix.

### 2. Package layout (mirror the dashboards precedent)

- Components → `packages/component/src/chess/` with an `index.js` exporting the full set
  (apparatus components, ChessPiece, context, tables, utils — whatever showcase's chess
  `index.js` exports today, minus any css import).
- `chess.css` → `packages/theme/kol-components-chess.css` + add
  `@import "./kol-components-chess.css" layer(components);` to `kol-theme.css`'s aggregate,
  next to the dashboards line.
- Export map: add `"./chess": "./src/chess/index.js"` to `packages/component/package.json`.
- **Piece-set assets** (`assets/chess-extra-set`, `chess-vector-set` SVGs): ship them inside
  `packages/component/src/chess/assets/` and make sure component references are RELATIVE imports
  (Vite consumers inline/bundle SVG imports fine). No absolute/public-path references.

### 3. ⚠️ Data dependency — must be severed

Three showcase/monorepo chess files import **`@kol/chess-data`** (a monorepo-local data package
that STAYS in the monorepo — decided 2026-07-09):

- `context/ChessControlsContext.jsx`
- `apparatus/GameArchiveTable.jsx`
- `dashboards/ChessHero.jsx`

The packaged versions must NOT import `@kol/chess-data`. Lift those calls to props/callbacks
(e.g. the context/table take `getMonthlySummary`/`getManifest`/`loadFullDataset`-style functions
or the loaded data as props; the monorepo passes its `@kol/chess-data` functions at the call
site). Keep the prop surface minimal — exactly what the components consume today. Document the
new required props at the top of each changed file in one comment line.

### 4. Verify (no publish, no git)

- Parse every packaged file (esbuild or the repo's lint) — zero failures.
- `grep -rn "@kol/chess-data\|from '\.\./\.\./\.\." packages/component/src/chess` → empty
  (self-contained, no data dep, no reach-outs).
- Showcase keeps compiling (it still uses its local copy — untouched).
- Versions: component + theme still 0.7.0 (do NOT bump past it; chess joins the same release).

## After you're done (owner + monorepo side — not your job)

1. Tor publishes component + theme 0.7.0.
2. Monorepo repoints `components/workshop/chess` imports → `@kolkrabbi/kol-component/chess`,
   swaps `@kol/ui/css/chess.css` → theme css, deletes local copies
   (`apps/web/src/components/workshop/chess/`, `packages/ui/src/chess/`,
   `packages/ui/css/chess.css`), wires `@kol/chess-data` in via the new props, builds, verifies
   `/workshop/chess/*`.

Monorepo chess consumers, for reference: `ChessAnalysis.jsx`, `ChessMetrics.jsx`,
`chessHelpers.js`/`chessMetrics.js` utils, plus the workshop chess component tree itself.
