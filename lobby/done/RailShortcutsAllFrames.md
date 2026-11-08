---
component: RailShortcutsAllFrames
source: kol-shell@0.104.0 FloatLayout · AppShell (railToggleKey) · kol-framework SiteLayout — kol-website apps/record/src/App.jsx (record on FloatLayout)
staged: 2026-11-04
status: draft
deps: [FloatLayout, AppShell, SiteLayout, NavRail (app · site · float)]
---

# RailShortcutsAllFrames — one keyboard rule for every rail

## Purpose
record now runs on `FloatLayout` and has no rail key; the studio rail (`AppShell railToggleKey='\\'`) shows/hides with `\`; the site rail (`SiteLayout`) has none. The user: *"shortcut to collapse expand hide? the studio nav had '\'? … that should also go for site and app rail"*.

## The ask — the general thing, once, in the frames
The same two keys in all three frames that draw a nav rail — `AppShell` (app rail), `SiteLayout` (site rail), `FloatLayout` (float rail):

| key | does |
|---|---|
| `\` | expanded ↔ collapsed (the float rail's 280 ↔ 72; the app/site rail's open ↔ collapsed width) |
| `⇧\` | hide ↔ show; showing returns the rail to the state it had (FloatLayout already keeps `lastShown`) |

- Ignored while typing (input, textarea, select, contenteditable) and with ⌘/⌃/⌥ held.
- The state persists like the rail's own (`kol-sidenav` / the float rail's); a controlled `rail` + `onRailChange` still wins.
- One prop to opt out or rebind, the same name on all three: `railKeys={false}` or `railKeys={{ collapse: '\\', hide: 'shift+\\' }}`. `AppShell`'s `railToggleKey` maps onto `hide` (kept as an alias).
- Help/Shortcuts: each frame's shortcut list (where it has one) names the two keys.

## Recreation notes
- One shared hook (`useRailKeys`) in kol-component, the tier all three reach — the way `useGrabEdge` / `useDragResize` were placed.
- Consumer: kol-website (record) bumps and passes nothing; no local key handler is written meanwhile.

## Built
2026-11-04 — kol-component 0.339.0 · kol-shell 0.105.0 · kol-framework 0.70.0 (one release with FloatRailOverlayShadowRestore).
- `useRailKeys(keys, { onCollapse, onHide })` + `RAIL_KEYS` + `railShortcuts` in kol-component (`packages/component/src/hooks/useRailKeys.js`): `\` expand ↔ collapse, `⇧\` hide ↔ show; ignored while typing, on repeat and with ⌘/⌃/⌥; matched on `e.key` or `e.code`.
- `railKeys` on AppShell, FloatLayout and SiteLayout (on by default; `false` off; `{ collapse, hide }` rebinds). Each wires its own state: AppShell `navHidden` + the app rail's grab toggle (NavRail `toggleRef`); FloatLayout `rail` / `lastShown` (controlled `rail` + `onRailChange` still wins); SiteLayout the site rail's `useDragResize` toggle (`kol-sidenav`) + a hide kept as `kol-sidenav-hidden` (track to 0; the phone drawer ignores it).
- `railToggleKey` maps onto `hide` (alias). The Hub stopped passing it and lists both keys in its keymap as **Rail**; the in-repo apps dropped theirs.
- Docs: 04-compositions/11-shell-system, 17-rail-and-overlay (rail keys table), 24-float-system; 07-apps-tier/09-app-adoption; api-tables regenerated; shipped-packages table.
- Consumer (record): bump, pass nothing.
- 2026-11-04 patch — kol-shell 0.105.1 · kol-component 0.339.1: AppShell remembers the app rail's state when `⇧\` hides it and shows it open or collapsed as it was (checked headless on apps/shell: open → ⇧\ ⇧\ → open, collapsed → ⇧\ ⇧\ → collapsed).

## ✅ RESOLUTION — 2026-11-04 · kol-component@0.339.0 · kol-shell@0.105.0 · kol-framework@0.70.0

One keyboard rule for every nav rail: `\\` expands ↔ collapses, `⇧\\` hides ↔ shows (showing returns it as it was), ignored while typing and with ⌘/⌃/⌥. kol-component's useRailKeys, used by AppShell, FloatLayout and SiteLayout through one prop, railKeys (false off, { collapse, hide } rebinds); railToggleKey is the alias for hide. The Hub lists both keys in its keymap as Rail. Site hide persists as kol-sidenav-hidden.

**Remainder here:** none — kol-website bump kol-shell@0.105.0 (and kol-component@0.339.0, kol-framework@0.70.0 where used); pass nothing — the keys are on by default.

