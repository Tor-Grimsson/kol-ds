---
title: Icons — the loader, the set, and bring-your-own
type: reference
status: active
updated: 2026-07-28
description: The kol-icons model — the async Icon loader, kol-icon-set-v1 as THE only packaged set (v1-only since 0.8.0; legacy trees removed), registerIcons() for per-repo custom icons, and the /kol-lobby-icon promotion loop. Its own top-level tier, not part of the component library.
aliases:
  - icons
  - iconography
sources:
  - packages/icons/src/Icon.jsx
  - packages/icons/src/index.js
tags:
  - domain/design-system
  - domain/iconography
related:
  - "[[../00-overview/INDEX|overview]]"
  - "[[01-inventory|icon inventory]]"
  - "[[../03-components/01-inventory|components]]"
---

# Icons — the loader, the set, and bring-your-own

`@kolkrabbi/kol-icons` ships one component (`Icon`) plus the inventories and the loader around it. It is its **own architectural tier** (`theme ← icons ← component ← framework`, ARCHITECTURE §3), not part of the component library. Two things live here: the **loader** (how a name resolves and streams) and **kol-icon-set-v1** (the curated set the system is converging on). Browse live: showcase `/icons` (kol-icon-set-v1, grouped — the legacy gallery and `/icons/v1` were consolidated into it, 2026-07-28).

## The Icon component

```jsx
import { Icon } from '@kolkrabbi/kol-icons'
<Icon name="download" size={16} />
```

- **Resolution order:** consumer-registered (see *Bring your own icons*) → **kol-icon-set-v1**. That is the whole chain (v1-only since **0.8.0**, 2026-07-28) — a miss is a real miss and renders nothing (`console.warn`).
- **Async by design** — the packaged SVG maps live in `iconData.js` behind one dynamic `import()`, so the SVG text streams as its own chunk instead of blocking the consumer's first paint. Consumer-registered icons resolve synchronously (no wait).
- **Vite-only** (`import.meta.glob`).

> The `variant` prop was removed in 0.8.0 with the legacy solid cut — the set is a **single stroke cut**; intentional solids are their own named icons (e.g. `star-solid`).

## kol-icon-set-v1 — the curated set

One small, hand-reviewed set — **144 icons across 23 groups** (2026-07-28: 17 promotions with 0.8.0, keyline-conformed in 0.8.1 — chevrons/carets fit the 18×18 rect; 0.8.2 killed chevron-expanded (twin of chevron-up) and completed the four-diagonal arrow family as baked mirrors of the arrow-downright master), a **single stroke cut**, every icon authored with `currentColor` and normalised to the 1.5 keyline. It **ships in the package** at `packages/icons/src/kol-icon-set-v1/<group>/<name>.svg` and is the ONLY packaged set. It renders on `/icons`, which **dogfoods** it — groups from the `KOL_ICON_SET_V1` inventory, each icon via the package `<Icon>`.

- **Grouped, flat-by-name.** Foldered by group (chevron, arrow, nav, singletons, layout, files, code, atomic, shape-primitives, …) but resolved by basename — so no two icons share a name across groups.
- **Single cut.** No stroke/solid duality; intentional solids (filled carets, dots) are baked into the individual icon, not a parallel tree.
- **Grows slowly, curated** — new icons enter via the promotion loop below, not bulk import.

## Bring your own icons

The package ships the *small* shared set; each consumer repo registers the extra icons it needs from its own folder — so no repo pulls hundreds of icons it never uses.

```js
import { registerIcons } from '@kolkrabbi/kol-icons'
// once, at app boot — runs in YOUR source (import.meta.glob is compile-time + path-relative)
registerIcons(import.meta.glob('./icons/**/*.svg', { eager: true, query: '?raw', import: 'default' }))
```

Registered icons are keyed by filename, **win over the packaged set** (add *or* override), and render synchronously. Author them with `currentColor`.

## Legacy is gone — the hotfix shelf

The legacy trees (stroke / solid / svg / svg-web, ~1,900 SVGs) were **removed from the package in 0.8.0** (user ruling 2026-07-28: audience-of-one repos break-and-fix, no compat layer). The editable local shelf is **`_tmp/legacy-icons/`** in this repo (gitignored, this machine only). Downstream repo breaks on a dead name → grab the SVG from the shelf, drop it in that repo's own icons folder, `registerIcons()` picks it up — and if a glyph keeps earning hotfixes, promote it into v1 here instead.

## The promotion loop

Icons flow both ways, keeping the shared set clean while every repo stays lean:

- **⬇ down** — a repo consumes the shared set and `registerIcons` its own locals.
- **⬆ up** — when a local icon earns a place in the shared set, `/kol-lobby-icon` promotes it: **clean** (currentColor, strip export junk, normalise the name), **check** (stroke-weight, keyline fit, false/expanded stroke, name collision), then drop it into `kol-icon-set` under a group.

## Inventories (keys-only, zero content cost)

| Export | What |
|---|---|
| `KOL_ICON_SET_V1` / `ICONS` | THE set grouped `{ group: names[] }` (keys-only); `ICONS` aliases it |
| `KOL_ICON_SET_V1_NAMES` / `ALL_ICONS` | flat sorted names; `ALL_ICONS` aliases it |
| `hasIcon()` / `getCategory()` | name lookups over the v1 set |

`ICON_ENTRIES` / `SOLID_ICON_ENTRIES` / `ICON_INDEX` died with the legacy trees (0.8.0). Per-category roster: [[01-inventory|icon inventory]].

## The keyline guide

The gallery's GRID toggle overlays the icon **keyline** (Material-style paint-by-numbers): dashed diagonals + three keyline rounded-rects + center circle on the 24×24 grid — yellow on dark, magenta on light. Shared component: `showcase/src/lib/icon-controls.jsx` (`KeylineBg` + the `SegGroup` BG · SIZE · GRID toggles) — consumed by the `/icons` v1 gallery.

## Graphics

`<Graphic category name>` (in **kol-component**, not the loader) is the illustration loader — same async-chunk model (`graphicData.js`, off the entry path), keys-only `GRAPHICS` inventory, missing assets render a labeled `AssetPlaceholder`.
