# ShellSearchDisabledRow — `ShellSearchOverlay` rows take `disabled`

**Staged:** 2026-10-15 · from a kol-monitor session
**Change:** one row prop in `organisms/ShellSearchOverlay.jsx`

---

## The problem, in one case

Monitor's Add module search (⌘K, on `ShellSearchOverlay` since 2026-10-15) lists every module. On a full
rack most 1U modules have no row to land in, and the old local palette greyed those out. The DS rows have no
disabled state, so a no-room row looks like any other, Enter on it closes the overlay, and nothing is added.

## Carried in monitor meanwhile

`src/rack/VideoModulo.jsx`: a no-room row gets `group: 'no room'`, which renders as a section heading above it.

## The fix

`disabled` on a row: muted ink (the oq ladder's disabled rung), skipped by ↑↓, Enter does nothing, `onSelect`
isn't called. Optional `disabledHint` on the row for the reason.

## Definition of done

- [ ] a row with `disabled` renders muted, is skipped by the arrow keys, and never reaches `onSelect`
- [ ] rows without it are unchanged
- [ ] monitor drops the `group: 'no room'` carry

## ✅ RESOLUTION — 2026-10-16 · kol-component@0.262.0

A `disabled` row in `ShellSearchOverlay` is drawn at the disabled opacity with a not-allowed cursor; ↑↓ step over it, hover does not activate it, click and Enter never reach `onSelect`, and the opening highlight lands on the first enabled row. `disabledHint` replaces `hint` with the reason. Rows without `disabled` are unchanged. Backed by a new `OptionRow disabled`. Verified in a harness: highlight starts on the first enabled row, ↓/↑ skip the disabled ones, a forced click on a disabled row leaves the overlay open and selects nothing.

**Remainder here:** none — kol-monitor bump kol-component@0.262.0; drop the `group: "no room"` carry in src/rack/VideoModulo.jsx for `disabled: true, disabledHint: "no room"`.

