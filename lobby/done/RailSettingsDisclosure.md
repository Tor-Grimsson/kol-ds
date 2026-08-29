---
component: SideNav · NavRail
source: kol-fxr src/editor/labs/RailSettings.jsx + src/editor/labs/LabsNav.jsx (the working reference, measured)
staged: 2026-08-27
status: draft
deps: [SideNav, NavRail, ThemeToggle]
---

# RailSettingsDisclosure

## The ask

**Settings in the rail is a DISCLOSURE, not a route, and the theme toggle
lives inside it.** User, 2026-08-27, verbatim: *"put the settings where the
logo is, and logo back on top"* · *"sidebar setting should open close on click
and click again"* · *"put the theme toggle in the settings and out of the
sidebar"* · *"we make it work here then ship it."*

Built and measured in kol-fxr first (the user's build order); this is the
reference, not a wish.

## What it is

- The gear is the pinned bottom row it already is (`bottomItems`), but an
  **action** that toggles, lit while open. Same pixel as today's route row —
  measured 858 on both `/library` and `/labs`.
- Click opens a **panel directly above the row, the rail's own width**, that
  works collapsed (icon column) and expanded (rows) alike: the theme toggle
  (`icon` collapsed / `hop-bare` expanded — the two variants SideNav's own slot
  used) and the Settings page as a row. Click again closes; Escape closes;
  navigating closes.
- The rail's standing theme slot is OFF on both rails (`themeToggle={false}`);
  the toggle exists in the disclosure and on the `/settings` page only.

## What the DS needs to add

`NavRail` has no `footer` / disclosure seam, so the shell rail on `/` ·
`/library` · `/settings` still has Settings as a route row (same gear, same
pixel — a click opens the page). One of:

1. `AppShell` / `NavRail` take a `settings` disclosure (the panel above,
   themeToggle inside) as the ruled shape of the pinned bottom row, or
2. `SideNav` gains a `bottomItems` leaf shape `{ …, panel }` — an action leaf
   that owns a panel rendered above the row — and `NavRail` uses it.

Either way both rails behave identically. The panel geometry that works is in
`RailSettings.jsx`: portal, `left` / `width` from the rail's rect, `bottom` =
viewport height − the row's top, `--kol-z-tooltip`.

## Also noted

The active row's icon wears `--kol-accent-primary` (`.kol-sidenav-hop.is-active
.kol-sidenav-hop-icon`, kol-theme atoms:752). The user asked what the yellow
was; no ruling yet. Flagged so it is a decision, not a surprise.

## Origin

Filed from **kol-fxr** with the working implementation.

---

## ✅ RESOLUTION — 2026-08-28

Option 2, as the ticket ordered it: **kol-framework 0.34.0** — `SideNav` gains the **panel leaf**, `{ id, label, icon, panel }` at the top level (tree or `bottomItems`): the row is a disclosure (`aria-expanded`, `.is-active` while open, click toggles), `panel` is a node or `({ collapsed, close }) => node`, portalled to `<body>` directly above the row at the rail's width (left/width from the aside's rect, bottom = viewport − the row's top, `--kol-z-tooltip`) — fxr's `RailSettings.jsx` geometry verbatim, minus the MutationObserver (SideNav owns `collapsed`) and the textContent row lookup (`data-panel-trigger` on the row). Escape closes; `handleNavigate` / `handleSelect` close. One panel open at a time.

**kol-shell 0.14.0** — `AppShell settings={{ icon, path, label }}` → `NavRail` appends the panel leaf to `bottomItems` with fxr's panel content verbatim (the theme slot in the slot's two variants + the settings page as a hop row with `arrow-right`); `themeToggle` defaults to `false` when `settings` is given.

🔴 Held for the user, not decided: the active row's icon wears `--kol-accent-primary` (kol-theme atoms `.kol-sidenav-hop.is-active .kol-sidenav-hop-icon`) — "what's going on with the yellow accent?".

Verified in source + showcase build only. Remainder in kol-fxr: bump both; the shell passes `settings`; labs' `bottomItems` Settings becomes `{ …, panel }` with the same content (or reuses the shell's leaf) and `RailSettings.jsx` retires to `_tmp/`; re-measure the gear at 858 on both routes.

---

## ⚠️ SHIPPED AND WITHDRAWN — 2026-08-28 (record, not a state change)

The shell half of this ticket no longer exists. `AppShell settings` shipped in **kol-shell 0.14.0** and was deleted the same day by **0.16.0** (`RailFlatGrabOpen`, kol-mirror), which reversed the SideNav-backed rail the disclosure hung on — that entry's own words: *"`RailSettingsDisclosure` does not apply — settings is a route toggle, the theme toggle is on the page."* kol-fxr bumped 0.14.0 → 0.16.1 straight past the window, so the feature was **never adopted anywhere**.

What survives: **kol-framework 0.34.0's `SideNav` panel leaf** (`{ id, label, icon, panel }`), which is general and still live for any `SideNav` — fxr's labs rail included.

What does not: the flat rail carries no settings disclosure and no theme slot. The user's rulings behind this ticket — *"sidebar setting should open close on click and click again"* · *"put the theme toggle in the settings and out of the sidebar"* — are currently unimplemented on the app rail.

**🔴 Held for the user.** Two readings, and it is his call, not the DS's: either `RailFlatGrabOpen` superseded this ruling (retire the entry, `RailSettings.jsx` to `_tmp/`), or the behaviour still stands and wants porting onto the flat rail (the panel geometry is rail-agnostic — it portals above its row — so the port is small). Flagged by kol-fxr, who declined to close it from their side; correctly, declaring a ticket stale is not a consumer's call either.
