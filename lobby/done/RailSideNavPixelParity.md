---
component: NavRail · SideNav
source: kol-shell src/NavRail.jsx (the AppShell rail) · kol-framework src/SideNav.jsx (collapsed) — measured in kol-fxr 2026-08-27
staged: 2026-08-27
status: draft
deps: [AppShell, NavRail, SideNav, useDragResize]
---

# RailSideNavPixelParity

## The ask

**The collapsed `SideNav` and the `AppShell` rail are one rail, to the pixel.**
User, 2026-08-27: *"nothing has to shift … just maintain the position of the
icons, to the pixel"* and, pointing at the brand app's SideNav dragging from
wide to collapsed with every icon staying put: *"I think it's best in brand."*

Brand's geometry is the target. The shell rail adopts it.

## What is wrong, measured

kol-fxr runs AppShell's rail on `/`, `/library`, `/settings` and a collapsed
`SideNav` on `/labs` (WorkspaceSidebarGeometry — labs hides the shell rail and
its own rail carries the destinations). Arriving in labs is meant to change
nothing on the left. Measured on the same page width, same glyph set:

| | shell rail (`NavRail`) | labs collapsed (`SideNav`) |
|---|---|---|
| rail width | **48** (`--kol-shell-rail-width`) | **56** (`--kol-sidenav-w-collapsed`) |
| glyph | **20 px** at x = 13.5 | **16 px** at x = 19.5 |
| row pitch | **40** (32 button + 8 gap) | **38** (16 + 2×`--kol-spacing-2` + 2) |
| first glyph y | **76** (16 top pad + logomark block) | **26** (`pt-4` + hop pad) |
| bottom pair | theme · Settings (`bottomItems`), 8 px spacer | Settings row · theme slot · footer "K" |

Every icon moves on the route change, and the content column shifts 8 px with
the rail. These are two DS components (kol-shell / kol-framework) that were
never measured against each other; fxr is just the first app to put them on
adjacent routes.

## What is asked

1. **AppShell's rail IS a `SideNav` — one component, both states.** User
   ruling, 2026-08-27, verbatim: *"same component both states super nice."*
   The shell rail is the collapsed state of the same `SideNav` a route can
   widen; its tree is `items` + `bottomItems`; collapsed is 56 / 16 px / the
   hop pitch, expanded is the brand sidebar, and the drag between them is the
   whole transition. Not "make `NavRail` measure the same" — the ruling is
   that there is no second component to measure. `NavRail` retires into it.
2. **`SideNav` gains `bottomItems`** (or the rail's bottom pair is specified
   once): the shell pins theme + Settings at the bottom; SideNav has a theme
   slot and a hardcoded "K / Kolkrabbi Vinnustofa" footer and no slot for a
   pinned row, so a consumer's Settings row lands as the last tree item above
   the theme instead of below it. Same rail, two bottoms.
3. `--kol-shell-rail-width` and `--kol-sidenav-w-collapsed` should be one
   token, or one should derive from the other. Two names for the width of the
   same rail is how 48 and 56 happened.

## What this repo did and did not do

Adopted `SideNav` for labs (WorkspaceSidebarGeometry, 0.30.0) and stretched it
to its cell; labs opens collapsed, so the rail on arrival is meant to be the
shell rail, and the table above is the gap. **Not shimmed:** matching a 20 px
glyph to 16, or a 40 pitch to 38, from a consumer stylesheet means reaching
into `.kol-sidenav-hop` / `NavRail`'s button box — the no-shims ruling
(2026-08-09) says that goes here.

## Origin

Filed from **kol-fxr**, the first consumer to run both rails on adjacent
routes and the one carrying the measurements.

---

## ✅ RESOLUTION — 2026-08-28

The ruling (by message from kol-fxr, user verbatim: *"same component both states super nice"*): **the rail IS a collapsed `SideNav`.** Shipped as three packages:

1. **kol-framework 0.31.0** — `SideNav` seams, all opt-in: `bottomItems` (pinned below the theme slot, above the footer — the bottom specified once), `footer` (undefined = Kolkrabbi link · `false` = none · node), `themeToggle`, `iconComponent`, `expandOnSelect={false}` (an app rail stays a rail on navigate), `defaultCollapsed` (+ the `useDragResize` option).
2. **kol-theme 0.80.0** — `--kol-shell-rail-width` is live (`--kol-sidenav-w` / `-w-collapsed` / `0px` drawer), so `--fxr-rail` follows the drag; `.kol-shell-rail` retired.
3. **kol-shell 0.13.0** — `AppShell`'s root is `.kol-brand-layout`; `NavRail` maps `items` + `bottomItems` onto the SideNav, mounted collapsed with `hairline`; the `logomark` moved from the top to the footer (the sidenav's place for its mark), which is what puts the first glyph at the sidenav's y. Hidden rail = one grid column + `0px` token. Peers ≥0.31.0 / ≥0.80.0.

Not done, by design: NavRail's export stays (the adapter — monitor and mirror import through `AppShell`, nothing breaks); the old rail's 2026-08-12 active-state look retires with it — the rail wears the sidenav's. Verified in source only; fxr re-measures both routes.

Remainder in kol-fxr: bump the three; labs and the shell now mount the same component — drop `seedCollapsedOnce` (the shell boots collapsed itself) and re-measure `/library` ⇄ `/labs`.
