---
title: Rail and overlay
type: reference
status: active
created: 2026-10-17
updated: 2026-10-17
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
`--<token>-w` (sides) or `--<token>-h` (top and bottom).
