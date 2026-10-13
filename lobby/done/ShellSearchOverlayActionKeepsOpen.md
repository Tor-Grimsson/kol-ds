# `ShellSearchOverlay` closes after every pick — the documented `action` row never keeps it open

**Staged:** 2026-10-13 · from a kol-fxr session (the Morph step picker's categories)
**Change:** `select()` in `organisms/ShellSearchOverlay.jsx`, kol-component 0.251.0

---

## The problem, in one case

The row contract in the file says (`ShellSearchOverlay.jsx:251`):
`action  a closure; runs and KEEPS the search modal open (tag rows)`.
The code doesn't: `select()` (`:151-154`) is `onSelect?.(item); onClose?.()` for every row.

kol-fxr's Morph step picker (on this overlay) shows **categories** first — click one, the list becomes
that category's presets, a "← All categories" row goes back (the shadcn ⌘K drill-in). Every drill
fires `onClose`. To stay open, `src/editor/morph/StepPicker.jsx` sets a `drilled` ref in `onSelect`
and swallows the next `onClose`, then remounts the overlay with `key={cat}` so the highlight returns
to the top row.

## Ask

Honour the contract: a row whose `action` is set runs it and **does not** call `onClose` (or a
`keepOpen` flag on the row, if `action` is reserved for tag rows). Reset the active row to 0 when
`suggestions` change identity, as it already does on a `query` change.

kol-fxr then drops the swallow and the remount (plan 17 #18 there).

## Verify

A row with `action` runs it and the overlay stays open, focus still in the input; a plain row still
selects and closes.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.252.0`.** A row with `keepOpen`, or an `action`, reaches `onSelect`
and `onClose` is not called. The overlay does NOT run `action` itself: the workshop shell already runs
it in its own `onSelect`, and running it here too would fire it twice. So for a drill-in use
**`keepOpen: true`** on the category rows and the back row, and swap `suggestions` in `onSelect`.
The active row returns to 0 when the rows change — keyed on the row ids, not the array's identity, so a
fresh array every render does not snap the highlight.

Verified on the showcase (`/components/shell-search-overlay`, variant Drill-in): ↓ Enter on Atoms →
the modal stayed open, rows became `← All categories · Button · Input · SearchInput`, highlight on row
0, focus in the input; ↓ Enter on Button → selected and closed. 0 console errors.

For fxr: drop the `drilled` ref swallow and the `key={cat}` remount in `StepPicker.jsx`; mark the drill
rows `keepOpen`.
