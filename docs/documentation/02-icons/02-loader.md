---
title: Icon loader
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The Icon component and the packaged set
tags:
  - domain/iconography
  - audience/consumer
related:
  - "[[INDEX|icons]]"
---

# Icon loader

How a glyph reaches the screen — the async loader, and the one packaged set it reads.

## Icon component

```jsx
import { Icon } from '@kolkrabbi/kol-icons'
<Icon name="download" size={16} />
```

- **Resolution order:** consumer-registered (see *Bring your own icons*) → **kol-icon-set-v1**. That is the whole chain (v1-only since **0.8.0**, 2026-07-28) — a miss is a real miss and renders nothing (`console.warn`).
- **Async by design** — the packaged SVG maps live in `iconData.js` behind one dynamic `import()`, so the SVG text streams as its own chunk instead of blocking the consumer's first paint. Consumer-registered icons resolve synchronously (no wait).
- **Vite-only** (`import.meta.glob`).

> The `variant` prop was removed in 0.8.0 with the legacy solid cut — the set is a **single stroke cut**; intentional solids are their own named icons (e.g. `star-solid`).

## kol-icon-set-v1

One small, hand-reviewed set — **144 icons across 23 groups** (2026-07-28: 17 promotions with 0.8.0, keyline-conformed in 0.8.1 — chevrons/carets fit the 18×18 rect; 0.8.2 killed chevron-expanded (twin of chevron-up) and completed the four-diagonal arrow family as baked mirrors of the arrow-downright master), a **single stroke cut**, every icon authored with `currentColor` and normalised to the 1.5 keyline. It **ships in the package** at `packages/icons/src/kol-icon-set-v1/<group>/<name>.svg` and is the ONLY packaged set. It renders on `/icons`, which **dogfoods** it — groups from the `KOL_ICON_SET_V1` inventory, each icon via the package `<Icon>`.

- **Grouped, flat-by-name.** Foldered by group (chevron, arrow, nav, singletons, layout, files, code, atomic, shape-primitives, …) but resolved by basename — so no two icons share a name across groups.
- **Single cut.** No stroke/solid duality; intentional solids (filled carets, dots) are baked into the individual icon, not a parallel tree.
- **Grows slowly, curated** — new icons enter via the promotion loop below, not bulk import.
