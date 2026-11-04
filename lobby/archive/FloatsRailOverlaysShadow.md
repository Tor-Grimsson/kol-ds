---
component: AppShell touch="floats" · AppFloatNav variant="panel"
source: kol-fxr — Labs on a phone, kol-shell 0.99.3 AppShell.jsx#L452-459, AppFloatNav.jsx#L97
staged: 2026-11-03
status: draft
deps: [AppShell, AppFloatNav]
---

# FloatsRailOverlaysShadow

## Purpose
Follows FloatsOverlayNoBands (kol-shell 0.99.3). The user, 2026-11-03: *"settings panel is not supposed to move the background video viewer, its supposed to OVERLAY!! also missing shadow on the floating nav to elevate from the setting it OVERLAYS"*

1. **The Rail resizes the stage.** In `touch="floats"` the bottom Rail is a `shrink-0` block in the same flex column as the stage, so opening it shrinks the stage and moves the picture up.
2. **The top float has no shadow.** The `panel` preset is `shadow: false`, which was right while the stage started under it. Since 0.99.3 it floats over the stage and over the Rail's rows, and it reads flat against them. `transport` already has its shadow. fxr cannot pass `phoneNav.shadow`, because AppHub builds `phoneNav` (the More sheet) and a `shell.phoneNav` from the app would replace it.

## Change
- The stage is the full screen and never resizes: `floats.rail` is an overlay pinned to the bottom (`absolute`/`fixed`, `inset-x-0 bottom-0`, `max-height: railHeight`), over the stage, on `--kol-shadow-rail-up`. Opening, closing or dragging the Rail does not change the stage's box. The 0.99.3 spacer past the last row stays.
- `panel` preset `shadow: true`: the top float carries the same drop shadow as the transport.

## Acceptance
- At 390×844 with `touch="floats"`: the stage's box is identical (0,0,390,844) with the Rail open and closed, and the picture does not move.
- With the Rail open, the Rail is over the stage, and both floats are over the Rail with their shadows. The transport sits on the Rail's rows and the last row still scrolls clear of it.
- studio-hub's Settings › Phone nav › Floats shows the same.

## ⚫ WITHDRAWN — 2026-11-03

Withdrawn by kol-fxr the same hour it was filed: Labs is editor work, and the user ruled no round trips for that. fxr renders its own overlay Rail and gives the floats their shadow locally. Nothing to do here.

## ↩ FROM kol-fxr — 2026-11-03 · how fxr fixed it locally

The withdrawal reached you after kol-shell 0.99.4 had shipped. This is what fxr built instead, so you can compare it with what you shipped.

- **The Rail is fxr's own overlay.** fxr passes `floats.rail: null`, so AppShell never mounts its Rail slot and the stage keeps the whole column. `src/AppLayout.jsx` renders its own `fixed inset-x-0 bottom-0` box at `z-[var(--kol-z-sticky)]`, a step under the floats' `sticky+1`, on `bg-surface-primary` and `shadow-[var(--kol-shadow-rail-up)]` with `max-height: railHeight`. Labs portals its params Rail into a host inside it, the same `setRailHost` handoff as before. A spacer of `2 × TABBAR_PILL_INSET + TABBAR_PILL_H` plus the bottom safe area follows the last row, so the last row scrolls clear of the transport. Measured at 390×844: the stage's canvas stays at the same top and height with the Rail open and closed.
- **The top float's shadow is CSS on fxr's side.** AppLayout puts `data-labs-floats` on `<html>` while Labs runs its floats, and `src/editor/styles/kol-editor.css` adds `[data-labs-floats] .kol-mobile-tabbar-pill, [data-labs-floats] .kol-mobile-tabbar-tab { box-shadow: var(--kol-shadow-float) }`. That covers the pill and its ··· circle.

fxr stays on kol-shell 0.99.3 with this local fix (user ruling: editor work does not round-trip). 0.99.4 does the same thing in the package, so it has no fxr consumer for now. Whether it stays is your call.

**Remainder here:** none.
