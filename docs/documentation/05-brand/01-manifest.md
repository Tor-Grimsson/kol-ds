---
title: Brand manifest
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The schema every brand instance conforms to
tags:
  - domain/brand
  - audience/consumer
  - brand/assets
related:
  - "[[INDEX|brand kit]]"
---

# Brand manifest

The contract a brand is expressed in — the schema, and what generates from it.

`@kolkrabbi/kol-brand-template` defines `BrandManifest` (JSDoc-typed): `meta` (declared identity) · `identity` (role→ramp bindings — which stop is primary/secondary + the ink pairs) · `colors.anchors` · `ramps` (literal hex per stop) · `type` (families + cuts + scale) · `logos` (package-relative SVGs) · `clearspace` · `stationery` · `presence` (observed footprint, scraper-fed) · `press` · `timeline`.

**Every field is optional** — fill or leave empty; renderers must degrade gracefully. `defineBrand()` is the type anchor; `validateBrand()` checks types of present fields only.

**House defaults + generator.** `withHouseDefaults()` bakes the shared KOL baseline — the fixed 10-stop grey ramp, the seven house hues + cream, the Right Grotesk (PP) / JetBrains Mono type pair, and the default Kolkrabbi `identity` binding — so a client declares only its deltas (a hue, the identity lines, an overriding `type.families`). `emitBrandColorCss(manifest)` then projects the manifest into the de-facto **4-section `kol-brand-color.css`** skeleton — palette primitives (`--kol-color-*` / `--grey-*`) → brand roles (`--brand-*`) → accent rebind (`--kol-accent-*`) → Tailwind `@theme` contract — ending the hand-authored per-client colour file.
