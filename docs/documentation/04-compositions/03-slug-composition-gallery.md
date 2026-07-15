---
title: Slug pages & the composition gallery — how a set/block lists every component it uses
type: reference
status: active
updated: 2026-07-15
description: How every /sets/:slug and /blocks/:slug page derives and renders its full component manifest — the transitive composition scanner plus the live per-component gallery, one container per component.
aliases:
  - composition
  - set slug
  - composition gallery
sources:
  - scripts/extract-composition.mjs
  - showcase/src/lib/CollectionPage.jsx
  - showcase/src/usage/composition.json
tags:
  - domain/design-system
  - pattern/blocks
related:
  - "[[01-blocks-and-sets|blocks & sets]]"
  - "[[../03-components/01-inventory|components]]"
---

# Slug pages & the composition gallery

Every block and set has a dedicated page at `<basePath>/:slug` (`/sets/stack-blog`,
`/blocks/color-picker`, …), rendered by the **one** shared component
`showcase/src/lib/CollectionPage.jsx`. Change it once, every set and block
changes. The page has two halves:

1. **The live viewer** (`BlockViewer`) — the composition itself, running, with
   Preview/Code + device toggles. See [[01-blocks-and-sets|blocks & sets]].
2. **The composition gallery** — **every component the composition uses,
   each rendered live in its own container, one after another.** This doc is
   about that half.

## Slugs are kebab-case

The slug **is the filename** (`sets-registry`/`blocks-registry` glob the folder
and `keyOf` = filename without `.jsx`). So the file must be kebab-case:
`showcase/src/sets/stack-blog.jsx` → `/sets/stack-blog`. No PascalCase files.

## Where the component list comes from — the scanner

`scripts/extract-composition.mjs` derives the manifest **from source** (nothing
hand-authored, so it can't drift). For each block/set file it walks the import
graph **transitively** and sorts every reference into four buckets:

| bucket | what | example |
|---|---|---|
| `kol` | published `@kolkrabbi/*` components | `ArticleCard`, `Button`, `Table` |
| `local` | showcase-internal parts, grouped by area | `workshop/dashboards` → `DashMetricCard`, `LineChart` |
| `support` | hooks / utils (lowercase exports, local `.js`) | `useTilt`, `resolveCssVar` |
| `external` | third-party deps | `hls.js`, `gsap` |

**Transitivity is the point.** A set that imports only `ArticleCard` still
lists `Figure`, `Button`, `Avatar`, `Image`, … because the scanner resolves each
`@kolkrabbi/*` import through the package barrels (`packages/*/src/index.js`,
enumerated by the shared `scripts/lib/parse-barrel.mjs` across **every**
package — the `KOL_PKGS` list and the export map both derive from `packages/`
itself, so a new package can't fall out of the walk) to the real source file
and keeps walking. Since 2026-07-15 the manifest also surfaces at browse
level: every card and stage header on `/blocks` + `/sets` carries a
provenance badge (`N KOL · M local · external deps`) derived from it. That's
why `stack-blog`
shows **17** components, not the 4 it names directly.

Rules the scanner applies:

- Capitalised export → `kol` component; lowercase (`useX`, `resolveX`) → `support`.
- `UPPER_SNAKE` exports are data/consts, not components — skipped (`CANVAS_VIRTUAL_W`).
- New KOL packages/subpaths must be added to `KOL_PKGS` in the script.

**Output:** `showcase/src/usage/composition.json`
(`{ blocks: { <slug>: { kol, local, support, external } }, sets: { … } }`).
The registries attach `composition[slug]` to each item.

**Run it:** `node scripts/extract-composition.mjs` (or as the 3rd step of
`pnpm extract:docs`). ⚠ It does **not** touch `usage-index.json` — but do **not**
run the separate usage miner before a release; that regenerates `usage-index.json`
from mined apps and wipes the hand-seeded new-component entries.

## How the gallery renders — one container per component

`CollectionPage`'s `Composition` maps every `kol` name (then each `local` area)
through `ComponentSpecimen`, stacked vertically:

- **Header row** — the component name + a tag (`FUNCTION` for KOL, `LOCAL PART`
  for locals) + a `View →` link to `/components/<slug>` when the component has a
  page.
- **Body** — the component rendered **live** via `DEMOS[name]` (the one-file
  demo, through `DemoStage`), wrapped in an `ErrorBoundary`. If no demo exists,
  a labelled fallback card shows the description and links out.

So the gallery is a live, top-to-bottom showcase of everything the set is built
from — the same treatment for **every** set (chess & metrics included: their
dashboard cards / board parts render live as `local` containers).

## Adding or changing a set/block

1. Drop `showcase/src/<sets|blocks>/<kebab-name>.jsx` — default export + `meta`.
2. Make sure **every member component has a demo** at
   `showcase/src/demos/<ComponentName>.jsx` (name matches the export exactly),
   so its gallery container renders live rather than a labelled fallback.
3. `node scripts/extract-composition.mjs` to regenerate the manifest.
4. `pnpm build` + open the slug; confirm the gallery lists every component.

The registries auto-glob — no registry edits. The gallery, the transitive list,
and the live renders all follow from those four steps.
