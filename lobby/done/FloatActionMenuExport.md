---
component: FloatActionMenuExport
source: kol-shell@0.105.0 src/HubHome.jsx#L370-L385 (`function HomeMenu`, not exported) — kol-website apps/record/src/App.jsx (record's top-right action)
staged: 2026-11-04
status: draft
deps: [HomeMenu, usePopover, PopoverPanel, MoreRows (float), floatSurfaceClass, FloatLayout / TopControlsBar]
---

# FloatActionMenuExport — fxr's + menu as a shared part, and a slot for it in FloatLayout's bar

## The case
The user's reference is fxr.kolkrabbi.io's Home (screenshots in the session): the inverted round **+** top right (solid ink circle, float shadow), which becomes **×** while open; its float card opens to the LEFT, top edges level (`placement: 'left-start'`, 12 off), rows in the float look — New File · Walkthrough · Sign in. That is kol-shell's `HomeMenu` inside HubHome — private, so record could not use it and built three wrong versions (a labelled Sign in capsule, a ghost ⋮, `Menu variant="float"` whose rows are unreadable — FloatMenuPanelInk). His words: *"I wanted an action button, non descript + or [...] to sign in and more"* · *"wrong, for the third time … I gave you reference"*.

## The ask
1. Export `HomeMenu` as a named shared part (e.g. `FloatActionMenu`): `{ actions: [{ label, icon, onPress }], icon = 'plus' | 'more', surface, className }` — the inverted round button, × while open, the float sheet beside it, exactly as fxr's Home draws it today.
2. `FloatLayout`'s bar takes it in its end slot — `bar.menu = actions` (drawn as FloatActionMenu in the top-right corner, aligned like fxr's) — so an app gets the same corner without composing it.

## Recreation notes
- No new look: lift the existing component as is; HubHome keeps using it.
- record bumps, passes `bar.menu = [Sign in (signed out) · Search ⌘K]`, and drops its own `Menu`/`Button` composition.

## Built

kol-shell 0.107.0 (2026-11-04).
- **`FloatActionMenu`** exported: HubHome's `HomeMenu` lifted as is (`{ actions, icon = 'more', variant, surface, className }`): the inverted round button, × while open, the sheet to the LEFT, top edges level, 12 off. HubHome uses it.
- **`bar.menu`** on FloatLayout (TopControlsBar `menu`): `[{ label, icon?, onPress }]` draws FloatActionMenu (`plus`, the float sheet on the frame's `surface`) at the bar's end, the top-right corner.
- record: bump, `bar={{ menu: [Sign in, Search] }}`, drop its own Menu/Button composition.

## ✅ RESOLUTION — 2026-11-04 · kol-shell@0.107.0

FloatActionMenu exported: HubHome's HomeMenu lifted as is ({ actions, icon = 'more', variant, surface, className }), the inverted round button, × while open, its sheet to the left with top edges level, 12 off; HubHome uses it. FloatLayout bar.menu (TopControlsBar menu) = [{ label, icon?, onPress }] draws it with plus and the float sheet on the frame's surface in the top-right corner.

**Remainder here:** none — kol-website bump kol-shell ≥0.107.0; pass bar={{ menu: [Sign in, Search] }} and drop record's own Menu/Button composition.

