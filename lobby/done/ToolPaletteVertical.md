# `ToolPalette` — `orientation="vertical"`: a tools strip, whose folds open to the side

**Staged:** 2026-10-13 · from a kol-fxr session (plan 31 § 2, the user walking the editor's head against Affinity)
**Change:** `organisms/ToolPalette.jsx` (`flex items-center gap-1 … overflow-x-auto`, `Divider variant="vertical"`) and `molecules/SplitToolButton.jsx` (`placement: 'bottom-start'`); kol-component 0.255.0

---

## The problem, in two screenshots

Affinity's head: a full-width **toolbar** for the actions (boolean · align · snapping · export), and the
**tools** in a one-icon-wide **vertical strip** at the far left, full height — each fold with a corner
triangle, a divider before the navigation tools (hand · zoom), the fill/stroke pair at the foot.
kol-fxr has one horizontal row inside the canvas column, tools and actions mixed, at the pane-header
line (*"we are conflating things"* · *"look at how they place 'tools' v.s. how we do it"*).

The DS `ToolPalette` renders a row only. Forcing `flex-col` through `className` gives a column of
buttons with **vertical** 20px dividers (short ticks) and folds that open **downward** onto the next
tool.

## Ask

- `ToolPalette` takes **`orientation`** — `'horizontal'` (default, as today) | `'vertical'`. Vertical:
  `flex-col items-center`, `overflow-y-auto`, dividers `variant="horizontal"` at the row's width,
  and every fold opens to the **right** (`right-start`).
- `SplitToolButton` takes **`placement`** (default `'bottom-start'`), handed to its `usePopover`, so
  the vertical palette can pass `'right-start'`. The corner fold stays bottom-right of the button.

## Verify

Showcase `ToolPalette` with both orientations. Vertical: the strip is one button wide, the divider is
a horizontal hairline, each fold's panel opens beside the strip and never covers a tool.

For fxr on the return: bump; `ToolStrip` passes `orientation="vertical"`.

## ✅ RESOLUTION — 2026-10-13 · kol-component@0.256.0

New `ToolPalette orientation="vertical"`: flex-col, overflow-y-auto, horizontal hairline dividers across the strip, every fold opens `right-start`. New `SplitToolButton placement` (default bottom-start) carries it. Verified on the showcase (`/components/tool-palette`, vertical variant): strip 32 × 282, dividers 32 wide, the Shape fold's panel opens at x 512 beside the strip's right edge 507.5, covering no tool.

**Remainder here:** none — kol-fxr bump kol-component ^0.256.0; `ToolStrip` passes orientation="vertical".

