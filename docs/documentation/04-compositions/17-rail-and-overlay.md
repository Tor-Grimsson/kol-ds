---
title: Rail and overlay
type: reference
status: active
created: 2026-10-17
updated: 2026-11-04
description: Two words for edge and overlay surfaces
aliases:
  - rail
  - overlay
  - drawer
  - shelf
sources:
  - packages/component/src/molecules/Rail.jsx
  - packages/component/src/organisms/CommandOverlay.jsx
  - packages/component/src/hooks/useDragResize.js
  - packages/component/src/hooks/useRailKeys.js
tags:
  - domain/compositions
  - domain/architecture
related:
  - "[[16-app-anatomy|app anatomy]]"
---

# Rail and overlay

Two words for the surfaces at the edge of an app or over it (RailOverlay, kol-monitor 2026-10-17 — the user's
ruling: *"rail and overlay"*). Drawer, shelf, panel and sheet are retired as names for them.

| Word | What it is | Built from |
|---|---|---|
| **Rail** | Docked to an edge — left, right, top or bottom. It collapses and expands. Over the page (`mode="over"`, a scrim, focus trapped) or in the layout pushing it (`mode="push"`); `resizable` from the edge that faces the page. | `Rail` (was `ShellDrawer`); the nav rail, the Settings rail, a bottom edit rail |
| **Overlay** | Floats over the page and closes. | `CommandOverlay` (⌘K), `Modal`, `FullscreenOverlay`, popovers, the media picker |

**Panel** is not a surface: it is the body inside a rail or an overlay. A rail that covers the page instead of
pushing it is a prop (`mode`), not a third word. `SettingsPanel`'s two presentations are one of each:
`variant="drawer"` is a rail, `variant="overlay"` an overlay — the prop values are API and stay.

`useDragResize` resizes a rail from any edge: `side` `left` · `right` · `top` · `bottom`, the size in
`--<token>-w` (sides) or `--<token>-h` (top and bottom). On a top or bottom Rail the grab pill wakes on the y axis and travels along x (0.338.1).

**The rail keys** (RailShortcutsAllFrames, 2026-11-04) are one rule in every frame that draws a nav rail — `AppShell`, `SiteLayout` and `FloatLayout`, each through kol-component's `useRailKeys` with its own state:

| Key | Does |
|---|---|
| `\` | expands ↔ collapses the rail (the app rail's grab toggle, the site rail's `kol-sidenav` state, the float rail's 280 ↔ 72) |
| `⇧\` | hides ↔ shows it; showing returns it as it was (the site rail's hide is kept as `kol-sidenav-hidden`) |

Ignored while typing and with ⌘ / ⌃ / ⌥ held. One prop on all three: `railKeys={false}` turns them off, `railKeys={{ collapse, hide }}` rebinds (`'\\'`, `'shift+\\'`). `AppShell railToggleKey` is the old alias for `hide`. The Hub lists both in its keymap as **Rail** (`railShortcuts`).
