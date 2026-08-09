---
component: Dropdown (viewport-aware panel)
source: kol-ds-fxr/src/editor/labs/LabsParams.jsx#L360-L370
staged: 2026-08-09
status: draft
deps: [Dropdown, Popover]
---

# DropdownViewportClamp

## Purpose
A Dropdown with a long option list (the design editor's labs "Add FX…" picker: ~30 filters) renders its panel past the viewport bottom — no height clamp, no scroll, no flip — visually breaking the page. The panel must be context-layout aware.

## Current behaviour
- `Dropdown.jsx` opens its popover with `flip: false` (deliberate — the fused trigger/panel edge) and `placement: 'bottom-start'`.
- `Popover.jsx`'s `size` middleware `apply` sets **width only** (`rects.reference.width`); floating-ui's `availableHeight` is ignored, and `.kol-dd-list` has no `max-height`/`overflow`.
- Net: panel height = content height, regardless of space below the trigger.

## Ask
Clamp the panel to the available viewport space:
- In the `size` middleware `apply`, also set `maxHeight: availableHeight − padding` on the floating element, and give `.kol-dd-list` `overflow-y: auto` so long lists scroll inside the panel.
- Optional (your call): when space below is under some minimum, allow flip-above as an opt-in (`flip` prop) — the fused-edge law may veto this; the height clamp alone already fixes the breakage.

## States & interactions
Scrolling list keeps the selected row reachable; keyboard navigation should scroll the active option into view.

## Dependencies
floating-ui `size` middleware (already imported in Popover.jsx).

## Recreation notes
Consumer repos are barred from patching `.kol-dd-*` in their own CSS (the 2026-08-09 no-shims ruling), so there is no interim workaround downstream — the fix ships or long dropdowns break.

---

## Resolution (2026-08-09) — 🟢 closed

Shipped in **`@kolkrabbi/kol-component@0.32.3`** + **`@kolkrabbi/kol-theme@0.32.4`**
(published, verified on the registry; all 19 gates clean). Exactly the ask:

- **Popover** — the `matchReferenceWidth` `size` middleware `apply` now also
  sets `maxHeight` from floating-ui's `availableHeight` (`padding: 8`),
  beside the exact fused width. No height prop — the panel measures the free
  space below the trigger itself at every open; consumers pass nothing.
- **Theme** — `.kol-dd-panel` became a flex column so the clamp reaches the
  list; `.kol-dd-list` gained `overflow-y: auto; min-height: 0` — the hairline
  keeps its 1px, the list scrolls inside.
- **Dropdown** — opens scrolled to the checked row (`scrollIntoView`
  `block:'nearest'` on open); keyboard focus scrolls natively from there.

Flip-above was **not** taken — the fused-edge law stands, and the clamp alone
closes the breakage, as the ticket itself read it.
