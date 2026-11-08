---
title: Icon loader
type: reference
status: active
created: 2026-08-01
updated: 2026-11-05
description: The Icon component and the packaged set
tags:
  - domain/iconography
  - domain/packages
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

- **Resolution order:** consumer-registered (see *Bring your own icons*) → **kol-icon-set-interface**. That is the whole chain (v1-only since **0.8.0**, 2026-07-28) — a miss is a real miss and renders nothing (`console.warn`).
- **Async by design** — the packaged SVG maps live in `iconData.js` behind one dynamic `import()`, so the SVG text streams as its own chunk instead of blocking the consumer's first paint. Consumer-registered icons resolve synchronously (no wait).
- **Vite-only** (`import.meta.glob`).

> The `variant` prop was removed in 0.8.0 with the legacy solid cut — the set is a **single stroke cut**; intentional solids are their own named icons (e.g. `star-solid`).
>
> **`variant` is back in 0.60.0 (2026-11-01), as a pointer and not as a cut.** `<Icon name="cloud-storm" variant="solid" />` renders the drawn twin `cloud-storm-solid`. A name with no `-solid` twin renders its outline, and the `-solid` names still resolve on their own. No parallel tree comes back: a solid exists only where it was drawn (72 pairs today). In Figma each pair is one component set with `variant=outline|solid`.

## Search tags

```js
import { KOL_ICON_TAGS, getTags } from '@kolkrabbi/kol-icons'
getTags('lab-flask') // ['lab', 'science', 'chemistry', 'bottle', 'experiment']
```

- **Source:** `packages/icons/src/tags.json`, name to 2–6 lowercase tags, every glyph in all four sets (identity: every file in its folders).
- **What a tag is:** a synonym or a use a person types ("lab" for the flasks), never the name split again.
- **Read by:** the showcase's ⌘K search (icon rows' keywords) and `IconBrowser`'s search (`searchKeys={['name', 'tags']}`).
- **Gate:** `pnpm validate:icon-tags` (gate `icon-tags`) fails when a glyph has no entry or an entry names a glyph that is gone. A new SVG lands with its tags row.

## kol-icon-set-interface

One small, hand-reviewed set — **144 icons across 23 groups** (2026-07-28: 17 promotions with 0.8.0, keyline-conformed in 0.8.1 — chevrons/carets fit the 18×18 rect; 0.8.2 killed chevron-expanded (twin of chevron-up) and completed the four-diagonal arrow family as baked mirrors of the arrow-downright master), a **single stroke cut**, every icon authored with `currentColor` and normalised to the 1.5 keyline. It **ships in the package** at `packages/icons/src/kol-icon-set-interface/<group>/<name>.svg` and is the ONLY packaged set. It renders on `/icons`, which **dogfoods** it — groups from the `KOL_ICON_SET_INTERFACE` inventory, each icon via the package `<Icon>`.

- **Grouped, flat-by-name.** Foldered by category (direction, actions, navigation, status, layout, files, design, shapes, …) but resolved by basename — so no two icons share a name across groups.
- **Single cut.** No stroke/solid duality; intentional solids (filled carets, dots) are baked into the individual icon, not a parallel tree.
- **Grows slowly, curated** — new icons enter via the promotion loop below, not bulk import.
