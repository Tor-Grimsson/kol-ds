---
title: Authoring an icon
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The keyline guide, and Graphic
tags:
  - domain/iconography
  - audience/consumer
related:
  - "[[INDEX|icons]]"
---

# Authoring an icon

The grid an icon is drawn to, and the separate loader for full-colour artwork.

## Keyline guide

The gallery's GRID toggle overlays the icon **keyline** (Material-style paint-by-numbers): dashed diagonals + three keyline rounded-rects + center circle on the 24×24 grid — yellow on dark, magenta on light. Shared component: `showcase/src/lib/icon-controls.jsx` (`KeylineBg` + the `SegGroup` BG · SIZE · GRID toggles) — consumed by the `/icons` v1 gallery.

## Graphics

`<Graphic category name>` (in **kol-component**, not the loader) is the illustration loader — same async-chunk model (`graphicData.js`, off the entry path), keys-only `GRAPHICS` inventory, missing assets render a labeled `AssetPlaceholder`.
