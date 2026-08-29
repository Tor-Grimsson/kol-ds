---
component: IconSetCut
source: kol-website/apps/brand/src/pages/IconsGallery.jsx (the `CUT` glob) + kol-icons/src/index.js (`KOL_ICON_SET_V1`)
staged: 2026-08-27
status: draft
deps: [kol-icons]
---

# IconSetCut — the set carries each glyph's cut (stroke | solid)

Brand's `/icons` gallery filters the set by TYPE — `Stroke` | `Solid` — as its
first filter group (user 2026-08-27: *"make a type as first toggle category
TYPE (stroke solid)? then TAGS"*). The package exposes names and folder groups
(`KOL_ICON_SET_V1`) but nothing about how a glyph is drawn, so brand globs the
shipped SVGs itself and reads the cut off the markup:

```js
const RAW = import.meta.glob('/node_modules/@kolkrabbi/kol-icons/src/kol-icon-set-v1/**/*.svg', { query: '?raw', import: 'default', eager: true })
const cut = (svg) => /fill="currentColor"/.test(svg) ? 'Solid' : 'Stroke'
```

Measured on the shipped set: `chevron-down` → stroke only (`fill="none"` +
`stroke="currentColor"`) → **Stroke**; `caret-down`, `star-solid` → a path with
`fill="currentColor"` → **Solid**.

A consumer reaching into a package's SVG folder to learn a fact the package
already knows is the wrong home for it.

## The ask

The set carries its own cut, next to the group index it already builds from the
folder:

```js
export const KOL_ICON_SET_V1_META = { 'chevron-down': { group: 'chevron', cut: 'stroke' }, … }
// or a parallel { group: [{ name, cut }] } — the shape is the DS's call
```

Derived the same way at build (the glob already reads the files; the regex is
the rule above), so nothing is hand-maintained and a new SVG classifies itself.

## Definition of done

- [ ] a per-glyph `cut` reachable from the package barrel, derived at build
- [ ] brand deletes its `CUT` glob and reads the package

## ✅ RESOLUTION — 2026-08-27 · kol-icons 0.24.0

`KOL_ICON_SET_V1_META` — `{ name: { group, cut } }` — and `getCut(name)` on the barrel; `cut` is `stroke` | `solid`, derived from the markup at build by your rule verbatim (`fill="currentColor"` = solid) into `src/cuts.json` (212 glyphs — 41 solid · 171 stroke); the `icon-cuts` gate (22nd) fails when the JSON is stale, so a new SVG classifies itself. Documented in `02-icons/INDEX.md § Glyph cut`. 22 gates clean.

**Remainder here:** none — kol-website: bump kol-icons 0.24.0; delete the `CUT` glob in `IconsGallery.jsx` and read `KOL_ICON_SET_V1_META[name].cut` (or `getCut`).
