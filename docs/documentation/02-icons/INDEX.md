---
title: Icons — the loader, the set, and bring-your-own
type: reference
status: active
updated: 2026-07-08
description: The kol-icons model — the async Icon loader, the curated kol-icon-set-v1 (single stroke cut, currentColor, grouped), registerIcons() for per-repo custom icons, and the /kol-lobby-icon promotion loop. Its own top-level tier, not part of the component library.
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

`@kolkrabbi/kol-icons` ships one component (`Icon`) plus the inventories and the loader around it. It is its **own architectural tier** (`theme ← icons ← component ← framework`, ARCHITECTURE §3), not part of the component library. Two things live here: the **loader** (how a name resolves and streams) and **kol-icon-set-v1** (the curated set the system is converging on). Browse live: showcase `/icons` (legacy gallery — BG · SIZE · GRID keyline controls, click-to-copy) and `/icons/v1` (kol-icon-set-v1, grouped).

## The Icon component

```jsx
import { Icon } from '@kolkrabbi/kol-icons'
<Icon name="download" size={16} />
```

- **Resolution order:** consumer-registered (see *Bring your own icons*) → **kol-icon-set-v1** (the curated set) → legacy stroke / solid / `svg/` / `svg-web/`. A name that falls through to the legacy set **warns once** (`console.warn` — it isn't in v1, so register it locally or migrate before legacy is dropped). A registered or v1 name always resolves clean.
- **Async by design** — the packaged SVG maps live in `iconData.js` behind one dynamic `import()`, so the SVG text streams as its own chunk instead of blocking the consumer's first paint. Consumer-registered icons resolve synchronously (no wait).
- **Vite-only** (`import.meta.glob`).

> The `variant="solid"` prop still resolves the legacy solid cut, but the curated direction (kol-icon-set-v1) is a **single stroke cut**. The showcase's stroke/solid toggle and the `/icons/variants` page were retired.

## kol-icon-set-v1 — the curated set

The system is converging from the sprawling legacy inventory onto one small, hand-reviewed set: **107 icons across 20 groups**, a **single stroke cut**, every icon authored with `currentColor` and normalised to the 1.5 keyline. It **ships in the package** at `packages/icons/src/kol-icon-set-v1/<group>/<name>.svg` and resolves first (before legacy). It renders on `/icons/v1`, which **dogfoods** it — groups from the `KOL_ICON_SET_V1` inventory, each icon via the package `<Icon>`. The legacy set still ships alongside during migration; it's dropped in a future major once consumers are off it.

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

## Migrating off legacy

v1 and the legacy set ship together so the rename breaks nothing. Two helpers show each repo where it stands:

- **`console.warn` on legacy resolution** — `<Icon>` warns once per name that resolves from the legacy set (not in v1). Running the app surfaces exactly which icons are on borrowed time.
- **`npx kol-icons audit`** — scans the repo's `<Icon name>` / `iconLeft` usage and reports **in v1** / **legacy-only** (migrate to a v1 name or `registerIcons` locally) / **not in package**. Run it until legacy-only is empty — then the repo is slim-ready.

The legacy set is dropped in a future major once consumers are clear.

## The promotion loop

Icons flow both ways, keeping the shared set clean while every repo stays lean:

- **⬇ down** — a repo consumes the shared set and `registerIcons` its own locals.
- **⬆ up** — when a local icon earns a place in the shared set, `/kol-lobby-icon` promotes it: **clean** (currentColor, strip export junk, normalise the name), **check** (stroke-weight, keyline fit, false/expanded stroke, name collision), then drop it into `kol-icon-set` under a group.

## Inventories (keys-only, zero content cost)

| Export | What |
|---|---|
| `KOL_ICON_SET_V1` | the curated v1 set grouped `{ group: names[] }` (keys-only) — resolves first |
| `KOL_ICON_SET_V1_NAMES` | flat sorted v1 names — lets consumers/audits tell curated names from legacy |
| `ICON_ENTRIES` | `{ name, folder }[]` from the (legacy) stroke tree |
| `SOLID_ICON_ENTRIES` | same for the solid tree — diff the two for mirror gaps |
| `ICON_INDEX` / `ICONS` | grouped `{ folder: names[] }` |
| `ALL_ICONS` / `hasIcon()` / `getCategory()` | flat list + lookups |

Legacy packaged inventory: **881 stroke · 849 solid · 21 categories** — the transitional set the package still ships until it slims onto kol-icon-set-v1. Full per-category roster + mirror gaps: [[01-inventory|icon inventory]].

## The keyline guide

The gallery's GRID toggle overlays the icon **keyline** (Material-style paint-by-numbers): dashed diagonals + three keyline rounded-rects + center circle on the 24×24 grid — yellow on dark, magenta on light. Shared component: `showcase/src/lib/icon-controls.jsx` (`KeylineBg`).

## Graphics

`<Graphic category name>` (in **kol-component**, not the loader) is the illustration loader — same async-chunk model (`graphicData.js`, off the entry path), keys-only `GRAPHICS` inventory, missing assets render a labeled `AssetPlaceholder`.
