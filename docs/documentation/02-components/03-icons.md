---
title: Icons — the loader and the inventory
type: reference
status: active
updated: 2026-07-03
description: The kol-loader Icon model — stroke + solid cuts, name resolution order, the async iconData chunk, keys-only inventories, mirror gaps, and the keyline guide.
aliases:
  - icons
sources:
  - packages/loader/src/Icon.jsx
  - packages/loader/src/index.js
tags:
  - domain/design-system
  - domain/iconography
related:
  - "[[../00-overview/INDEX|overview]]"
  - "[[01-inventory|components]]"
---

# Icons — the loader and the inventory

`@kolkrabbi/kol-loader` ships one component and the inventories around it. Browse live: showcase `/icons` (gallery: BG · SIZE · STYLE · GRID keyline controls, click-to-copy) and `/icons/variants` (solid | stroke | stroke-on-grid per icon, with a Mirror filter for gaps).

## The Icon component

```jsx
import { Icon } from '@kolkrabbi/kol-loader'
<Icon name="download" size={16} variant="stroke" />   // variant: 'stroke' (default) | 'solid'
```

- **Two canonical cuts** — `stroke/` (1.5-weight, round caps) and `solid/` (fills), mirrored trees. Resolution order: requested cut → other cut → legacy `svg/` set (with `00-kol` overrides) → app-specific `svg-web/`. A name always resolves.
- **Async by design** — the raw SVG maps live in `iconData.js` behind one dynamic `import()`, so ~1.3 MB of SVG text streams as its own chunk instead of blocking the consumer's first paint (entry −66% at the origin app). On a cold first paint an icon holds a same-sized empty box for a frame.
- **Vite-only** (`import.meta.glob`).

## Inventories (keys-only, zero content cost)

| Export | What |
|---|---|
| `ICON_ENTRIES` | `{ name, folder }[]` from the stroke tree — the canonical inventory |
| `SOLID_ICON_ENTRIES` | same for the solid tree — diff the two for mirror gaps |
| `ICON_INDEX` / `ICONS` | grouped `{ folder: names[] }` |
| `ALL_ICONS` / `hasIcon()` / `getCategory()` | flat list + lookups |

Current state: **~890 stroke icons across 21 folders; ~845 fully mirrored** — stroke-only/solid-only gaps are surfaced as "—" cells on the variants page.

## The keyline guide

The gallery's GRID toggle overlays the icon **keyline** (Material-style paint-by-numbers): dashed teal diagonals + three keyline rounded-rects + center circle on the 24×24 grid — yellow on dark, magenta on light. Shared component: `showcase/src/lib/icon-controls.jsx` (`KeylineBg`), identical to the brand/kolkrabbi reference apps.

## Graphics

`<Graphic category name>` (in **kol-component**) is the illustration loader — same async-chunk model (`graphicData.js`, ~4.8 MB off the entry path), keys-only `GRAPHICS` inventory, missing assets render a labeled `AssetPlaceholder`.
