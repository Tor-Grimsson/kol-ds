# segmented-toggle-sunken-tone — `SegmentedToggle` is the one control without `tone`, and two consumers carry the same three lines to fake it

**Filed:** 2026-09-03 ← **kol-client-olina**
**Packages:** `@kolkrabbi/kol-component@0.179.0` — `src/atoms/SegmentedToggle.jsx` (`{ value, onChange, options, variant, size, ariaLabel, className }` — no `tone`) · `@kolkrabbi/kol-theme@0.138.0` — `kol-components-molecules.css` § `.kol-seg`
**Origin:** the user, on olina's deck-editor inspector, pointing at kol-fxr's labs rail: *"look at this segmented toggle — is this a variant? its not what you have."* It is not a variant. It is fxr's local CSS.

## The problem

`tone="sunken"` (ControlToneSunken, 2026-08-28) is on `Dropdown` · `Input` · `Button` ·
`IconFrame` · `ThemeToggle` · `ViewToggle`. `SegmentedToggle` alone never took it. The
default variant already has the sunken anatomy — rest cells on `surface-secondary`,
1px dividers, one group radius — but wears a 1px shell and marks the selected cell by
emptying it. On a panel that reads wrong, so:

- kol-fxr, `src/editor/styles/kol-labs.css:220-226`, scoped to `.kol-editor-labs`,
  with its own comment saying it goes *"the day it grows the prop in kol-component"*:
  ```
  .kol-seg { border-color: transparent; }
  .kol-seg-cell.is-active { background: var(--kol-surface-sunken); color: var(--kol-fg-96); }
  ```
- kol-client-olina, `apps/brand/src/styles/olina.css`, the same lines verbatim,
  scoped to `.slide-inspector`, today.

Two consumers, one override, copied — the duplication the lobby exists to end.

## The ask

`tone="sunken"` on `SegmentedToggle` (alias `inverse`, like the others): shell border
transparent, `.is-active` on `--kol-surface-sunken` / `--kol-fg-96`, rest cells as
the default already paints them. Through `toneClass` like every other control, so a
`kol-tone-sunken` wrapper reaches it too. Nothing else changes; `filled` and `tonal`
keep their quiet-unselected law.

## What stays at olina

The three lines in `olina.css`, until the bump — then `tone="sunken"` on the six
toggles in `SlideInspector.jsx` and the block retires.

## ✅ RESOLUTION — 2026-09-03 · kol-theme@0.139.0

kol-theme 0.139.0 · kol-component 0.180.0. `SegmentedToggle tone` through `toneClass` like the rest of the set, so a `kol-tone-sunken` wrapper reaches it and unset inherits. The theme rule is kol-fxr's three lines promoted verbatim: under `kol-tone-sunken` (on the element or inherited) the shell's ring goes and the selected cell takes `--kol-surface-sunken` / `fg-96`; rest cells as the default paints them; `filled` and `tonal` keep their own selected law. The control-chrome doc's sunken list carries it.

**Remainder here:** none — kol-client-olina bump kol-theme@0.139.0 · kol-component@0.180.0 (pin the numbers); tone="sunken" on the six toggles in SlideInspector.jsx and retire the .slide-inspector block in olina.css — and tell kol-fxr its kol-labs.css:220-226 can go.

