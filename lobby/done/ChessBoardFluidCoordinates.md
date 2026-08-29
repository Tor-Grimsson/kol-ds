---
component: ChessBoardFluidCoordinates
source: kol-chess ChessBoard (apparatus) · coordinate labels
staged: 2026-08-26
status: draft
deps: [ChessBoard]
---

# ChessBoardFluidCoordinates — fluid boards keep desktop-sized coordinate labels

## The defect (kol-chess mobile scan 2026-08-26)

`ChessBoard size="fluid"` — the only size a fluid stage can use, the board fills its
column — picks its coordinate chrome from the `size` prop, not from the rendered
square. `ChessBoard.jsx:99-100`: `coordinatePaddingClass` is `p-1` for `mobile`,
`!p-1.5` for `tablet`, else `p-2`; typography is `kol-helper-8` for `mobile`, else
`kol-helper-12`. `fluid` falls through to the desktop pair, so at 390px a 45px square
carries 8px padding + 12px labels, absolutely positioned over the piece (the
"overlay on pieces" block) — the rank digit sits on the rook. Measured in kol-chess
at 390 and 768 (`_tmp/2026-08-26-mobile-scan/390-analysis-fixed.png`); the
fixed sizes are unaffected.

## Ask

When fluid, size the coordinates from the square, not the prop: `.chess-board--fluid`
becomes a container (`container-type: inline-size`) and the label font + padding ride
`cqw` (a square is 12.5cqw) — e.g. font `clamp(7px, 2.2cqw, 12px)`, padding
`max(2px, 0.8cqw)`. The prop-driven classes stay for the fixed sizes.

## ✅ RESOLUTION — 2026-08-26 · kol-chess@0.7.1 · kol-theme@0.58.1

`ChessBoard size="fluid"` sizes its coordinates from the square: `.chess-board--fluid` is a container (`container-type: inline-size`) and the coordinate wrappers wear `.chess-coord--fluid` — the helper voice at `clamp(7px, 2.2cqw, 12px)` with `max(2px, 0.8cqw)` inset — instead of the desktop `p-2` + `kol-helper-12` the prop fell through to. Measured on the showcase board: 390 → 35px squares, 7px labels, 2.2px inset; 1200 → 56px squares, 9.9px, 3.6px. Fixed sizes untouched.

**Remainder here:** none — kol-chess bump kol-chess 0.7.1 + kol-theme 0.58.1; re-shoot 390-analysis-fixed.png.

