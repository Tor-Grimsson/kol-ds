---
status: parked
staged: 2026-07-28
---

# ChessApparatusDemotion — kol-chess consumer now owns its layout

**Staged:** 2026-07-28 · **Source:** kol-chess consumer app (user ruling, structure-vs-elements)
**Type:** architecture note, not a component spec — the DS-side follow-up for a consumer restructure that already shipped.

## What happened consumer-side

The kol-chess app stopped consuming `ChessAnalysisLayout` / `ChessBoardWithControls` (the apparatus tier) and now composes **elements** directly: `ChessBoard`, `GameArchiveTable`, `AlternativeControlsMock`, `ChessControlsProvider`/`useChessControls`, plus kol-component `FullscreenOverlay`. The page skeleton — toolbar row (Games · engine controls), stage geometry (married board/rail heights, the `--chess-stage-reserve` dvh math), archive overlay wrapper — lives app-side now (`src/App.jsx`, `src/board/Stage.jsx`).

**Why (user ruling):** structure is consumer taste and churns daily; every structural itch was an npm publish + push + bump round-trip. The DS ships parts; consumers own arrangement. Elements-not-groups.

## To deal with here, later

1. **Decide `ChessAnalysisLayout`'s fate.** Its remaining consumers are the showcase mirrors (`/demo`, `chess-apparatus` set). Options: keep as the "batteries-included" tier for quick consumers + showcase, or deprecate toward an elements-composition example. If kept, its hardcoded Games row is still the flaw the consumer left over — a `toolbar` slot would fix it for whoever remains.
2. **`AlternativeControlsMock`** — the consumer now imports the rail directly and the name is mock-era; a rename (e.g. `ChessRail`/`AnalysisSidebar`) with an alias export would read honestly. Low priority.
3. **Showcase mirrors** — `/demo` + the chess set mirror the apparatus, no longer the real consumer. Either accept the drift (they document the package) or re-point them at an elements composition mirroring the app.
4. **Stage geometry duplication** — the dvh cap math now exists upstream (ChessBoardWithControls) AND app-side. If another chess consumer appears, consider exporting the geometry as a headless helper instead of a layout component.

## Status

- consumer restructure: **shipped 2026-07-28** (verified 1920×1200: board 904, rail flush, overlay + paste + archive intact, console clean)
- DS-side items above: **queued, none urgent** — nothing blocks; apparatus still published and working at 0.5.1

---
## 📌 ARCHIVED 2026-07-30 — ownership note recorded
The kol-chess repo OWNS the apparatus layout (user ruling, restated 2026-07-30: "the ACTIVE version lives NOT HERE but in CHESS REPO"). Recorded in `docs/operations/SHIPPED-PACKAGES.md` (chess row ⚠ note). Future imports pull from kol-chess. The four queued DS-side items stay parked with this note.
