---
component: NotationPanelMoveDecorations
source: kol-chess NotationPanel (apparatus) · move rows
staged: 2026-08-27
status: draft
deps: [NotationPanel, Badge]
---

# NotationPanelMoveDecorations — a per-move decoration seam on the notation rows

## The gap (kol-chess DS-compliance audit 2026-08-27)

kol-chess's Game Review pane (`src/engine/ReviewPanel.jsx`) renders its own
move list — raw `<button>` rows with a `Badge` per classified move
(brilliant → blunder) — because `NotationPanel` has no way to decorate a move.
The rows duplicate NotationPanel's anatomy (pair number · white · black ·
`selectPly` · active highlight) one component over, which is exactly the
"consumer re-authors DS chrome" pattern the audit was closing.

## Ask

A `renderMove` / `decorate` seam on `NotationPanel`: `(entry) => ReactNode`
rendered trailing inside each move cell (after the SAN), so a consumer can drop
a `Badge`, an eval delta, or nothing. Active/selected state, keyboard and
`selectPly` stay NotationPanel's. With it, kol-chess deletes `MoveCell` and the
review pane becomes `<NotationPanel decorate={…} />`.

## ✅ RESOLUTION — 2026-08-27 · kol-chess 0.8.0

NotationPanel takes decorate(entry) => node, rendered trailing inside each move cell after the SAN (Badge, eval delta, or nothing); selection, disabled state and onSelectPly stay the panel's, sidelines untouched. Measured on the showcase demo: 12 move cells, 2 decorated, badge 41px after the cell's left edge behind the SAN, click on a decorated move moves selection.

**Remainder here:** none — kol-chess bump kol-chess 0.8.0; delete MoveCell in src/engine/ReviewPanel.jsx and render <NotationPanel notationPairs activePly={moveIndex} onSelectPly={selectPly} decorate={(entry) => reviewed badge or null} />.

