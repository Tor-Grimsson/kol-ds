# RailOverlay — two words for the edge surfaces: Rail and Overlay

**Staged:** 2026-10-17 → kol-ds-ui · from kol-monitor · **naming ruled by the user**

## The ask, in the user's words

> "we have 4 words? drawer, shelf, rail and panel, all collapsable and expandable. dont you think thats hard to
> mentally seperate. can we not just try to streamline / sharpen the convention" → ruled: **rail and overlay**.
> Also: "would it make sense to make a bottomshelf? or make a variant of the siderail that is a bottom rail? …
> do they both work in vertical and horizontal layout? should they also ship popover versions"

## The convention

- **Rail**: anything docked to an edge (left, right, top or bottom). It collapses and expands. The nav rail,
  the Settings rail and monitor's edit sheet (today `ShellDrawer side="bottom"`) are all rails.
- **Overlay**: anything floating over the page that closes rather than collapses: the ⌘K modal, popovers,
  dialogs, the media picker.
- Retired as names: drawer (a rail that covers the page instead of pushing it is a prop, `over`), shelf
  (a bottom rail), panel (the body of a rail or overlay), sheet.

## The build it implies (to discuss)

- `ShellDrawer` → **`Rail`**: `side` (left · right · top · bottom), `push | over`, collapsed / expanded,
  padding sized per side (monitor's bottom rail inherits side-rail padding today).
- `useDragResize` on **any** edge: its `side` is left/right only, so a bottom rail can't be resized from its
  top edge with the `line` grab.
- `SettingsPanel`'s `drawer` / `overlay` presentations map onto Rail / Overlay.
- Docs: one entry naming the two words, so consumers stop inventing a fifth.

## Acceptance

kol-component exports `Rail` with `side="bottom"` resizable by its top edge, and the docs use only rail and
overlay for these surfaces.

## ✅ RESOLUTION — 2026-10-17 · kol-component@0.266.0

kol-component 0.266.0: `Rail` (was `ShellDrawer`, now its alias) — any edge left · right · top · bottom; `mode="over"` (scrim, focus trap, Escape, as before) or `mode="push"` (in the layout, collapses to nothing); `resizable` from the edge facing the page — a bottom rail from its TOP edge (`minSize` · `maxSize` · `onResize`); padding per side (a bottom rail clears the home bar, a top rail the notch). `useDragResize` takes `side` top/bottom (into `--<token>-h`). SettingsPanel, RecordManager and the workshop shell ride Rail. Docs: 04-compositions/17-rail-and-overlay.md names the two words; the component docs were swept (`variant="drawer"` stays — an API value). Verified: bottom push rail dragged up 60 from its top edge, collapsed to 0; top and bottom over-rails flush.

**Remainder here:** none — kol-monitor bump kol-component@0.266.0; your edit sheet: `Rail side="bottom" mode="push" resizable` (drop the ShellDrawer import and the side-rail padding workaround).

