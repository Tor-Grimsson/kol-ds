# `SplitToolButton` — the fold opens whatever the action's state, rows grey; the panel hugs its rows

**Staged:** 2026-10-13 · from a kol-fxr session (plan 30 § 12, the editor's toolbar)
**Change:** two defects in `SplitToolButton` (`molecules/SplitToolButton.jsx`), kol-component 0.252.0

---

## The problem, in two screenshots

kol-fxr's toolbar folds — Rotate (Rotate 90° left · right · Flip horizontal · vertical), Boolean (the
four ops) — are `ToolPalette` `split` items with `action: true` and `disabled: !canXform` / `!canBool`.

1. **Nothing selected → the fold cannot open.** `disabled` (`:88`) goes onto the trigger button (`:130`),
   caret included, so the fold is dead until something is selected. The user: *"even if nothing is
   applicable shouldn't it still show what's available in these dropdown tools?"* — the menus' own law
   (a row that does not apply is greyed, never hidden). `variants` (`:58` JSDoc) carry no per-row
   `disabled`, so a consumer cannot grey a row either.
2. **A layer selected → the panel is as wide as the canvas.** The panel is `w-max` (`:143`) and every row
   is `w-full … inline-flex` (`:152`) — the exact defect `MenuDropdownItemBlockRow` fixed for
   `MenuDropdownItem` on 2026-10-13 (inline rows in a content-sized panel measure as ONE line), left
   in this sibling. Four rows ≈ the whole canvas width.

## Ask

- `disabled` dims and disarms the **trigger's action** only; the caret opens the fold regardless.
- A variant takes `disabled` and renders greyed (`disabled:opacity-40 disabled:cursor-not-allowed`,
  as `MenuDropdownItem` does), never hidden. A disabled variant's click is a no-op and does not close
  the fold.
- Rows are `flex` (block), so the panel hugs its longest row — `MenuDropdownItem`'s fix, applied here.

## Verify

A fold whose trigger is `disabled`: the caret opens it, its rows are greyed. A fold with four rows,
the longest `Rotate 90° right ⇧V`: the panel is that wide, not the container's. The tool folds (Shape,
Pen, Zoom) unchanged.

For fxr on the return: `ToolPalette.jsx` passes `disabled` per variant and drops it from the Rotate /
Boolean folds.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.253.0`.** `disabled` no longer sets the button's `disabled`
attribute (that killed the click that opens the fold): the trigger is dimmed inline and its click arms
nothing, and the fold opens. `variants[].disabled` renders a greyed row (`disabled:opacity-40
disabled:cursor-not-allowed`), never hidden; its click is a no-op and the fold stays open. Rows are
`flex` — MenuDropdownItemBlockRow's fix, applied here.

Verified on the showcase (`/components/split-tool-button`, a Rotate fold `disabled` with four disabled
rows): the trigger at 0.5 opacity opened the fold; the four rows at 0.4; clicking one left the fold
open; panel 199px = its longest row (`Rotate 90° right ⇧V`). The Shape fold unchanged: arms and opens,
136px. 0 console errors.

For fxr: pass `disabled` per variant in `ToolPalette.jsx`; keep `disabled` on the Rotate / Boolean folds
if you want the trigger disarmed — it no longer stops the fold opening.
