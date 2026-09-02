# FullscreenOverlayCloseIdiom — two close X designs in one app, and the overlay's aligns with nothing

**Staged:** 2026-09-01 · from **kol-chess**
**Nature:** one defect (alignment) + one ruling (the estate has two close-button treatments; the user has picked).

## Reported — live site, iPhone, 390

User, verbatim: *"we have 2 close buttons but they are not the same? personally
i like the menu close better and the location is wrong … you can clearly see
that it doesnt align with the right edge of the dropdown"* and *"if its a
button then it should use primary variant not outline"*.

Screenshot: `_assets/2026-09-01-chess-mobile-round-2/newgame-sheet-close-misaligned-390.png`
(the new-game sheet; the drawer's X is in `drawer-open-trigger-midscreen-390.png` for
comparison).

## The two treatments

| where | control | look |
|---|---|---|
| drawer trigger (kol-shell `AppShell`) | `Button variant="nav" iconOnly="x"` | bare glyph |
| `FullscreenOverlay` (kol-component, `FullscreenOverlay.jsx:74-82`) | `Button variant="outline" quiet size="sm" iconOnly="x"` | boxed outline |

Same gesture, same glyph, two idioms one screen apart — the /play lobby's
drawer X and the new-game sheet's X are both on screen within one tap of each
other.

## The alignment

`.kol-overlay-close` (`kol-components-atoms.css:178-183`) is inset
`--kol-spacing-3` from the sheet's corner. The sheet hugs the consumer's
panel, so at 390 the panel is the content column (342 wide inside the
overlay's 24px padding) and the X floats 12px INSIDE the column's right edge —
lined up with nothing, visibly off the grid the fields below it establish.

## The ask

1. One close idiom for the estate. The user prefers the drawer's bare `nav`
   treatment; his second ruling is that IF it stays a boxed button it wears
   `primary`, never `outline`. Which of the two wins is yours — but one wins.
2. Align the overlay close to the sheet's content edge (`right: 0` against the
   panel, or whatever rung puts the glyph's edge on the column edge) so it
   sits on the same vertical as the controls under it.

Consumer change expected: none — kol-chess passes `closeButton` defaults.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.152.0

One idiom, the user's pick: FullscreenOverlay's X is the drawer trigger's bare nav glyph (variant nav, default square) — outline/quiet/sm dropped. Alignment: .kol-overlay-close right: 0 (kol-theme 0.120.0) — the sheet hugs your panel, so the spacing-3 inset was what floated the X 12px inside the content edge; the button's box now sits on the same vertical as the controls under it.

**Remainder here:** none — kol-chess bump kol-component@0.152.0 + kol-theme@0.120.0; re-check the new-game sheet — X matches the drawer's, box edge on the column edge.

