---
title: Foundry components — the type-specimen apparatus
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-foundry — the type-specimen apparatus (typeface hero, variable-font axis playground, parsed-metric glyph inspector, character-set browser, font preview, typeface-catalog grid). Cut to type-only on 2026-07-09 (non-type chrome removed, republished 0.2.0); the type-specimen kit + live-font effects (TypeSample, TypeSpecCard, TextPressure, ColorLoader) moved in from kol-component later that day (0.3.0). Every export renders, inspects, or manipulates a live font.
aliases:
  - foundry
  - kol-foundry
  - type specimen
sources:
  - packages/foundry/src/index.js
  - packages/foundry/README.md
  - showcase/src/sets/foundry-specimen.jsx
tags:
  - domain/design-system
  - domain/foundry
related:
  - "[[01-package-topology|package topology]]"
  - "[[06-store-system|store system]]"
---

# Foundry components — `@kolkrabbi/kol-foundry`

The type-specimen apparatus — the component set a type foundry's site is built from. **Every component renders, inspects, or manipulates a live font**; the commercial chrome (pairings, licensing, CTAs, descriptor cards) was cut on 2026-07-09 (see below). A distinct content domain (typefaces, glyph metrics, variable-font axes — **not** Sanity CMS) with its own consumer (kolkrabbi.io/foundry) and versioning cadence. Graduated from the `component/foundry` subpath.

```js
import { TypefaceHero, VariableFontSection } from '@kolkrabbi/kol-foundry'
```

## Component index

| Component | What it is | Key inputs |
|-----------|-----------|-----------|
| `TypefaceHero` | specimen hero — typeface name, style list, live sample | typeface meta, sample text |
| `VariableFontSection` | live weight/axis playground (drives `useAxisAnimation`) | axis defs, `SpecimenSampleText` |
| `GlyphMetricsGrid` | parsed-metric glyph inspector — fetches the font, best-effort parses via **optional** `opentype.js` (degrades gracefully if absent) | font src, glyph set |
| `FoundryCharacterSets` | character-set browser (by category) | `glyphSets`, `glyphCategories` |
| `TypefaceStyleSection` | per-style specimen block | style meta |
| `FontPreviewSection` | size-ladder / free-preview control (size + text) | preview text |
| `GlyphMetricsSection` | section wrapper — header (style/axis dropdowns) over `GlyphMetricsGrid` | font URLs, axis defs |
| `SpecimenSectionHeader` | shared section header (title + `Divider`) | title |

### Type-specimen kit + live-font effects (moved from `kol-component` 2026-07-09)

Four components moved in from `@kolkrabbi/kol-component` — each passes the membership test (renders, inspects, or manipulates a live font). `kol-component` never imports back (topology §3: no reverse dependency).

| Component | What it is |
|-----------|-----------|
| `TypeSample` | a single labeled type-specimen block — family/weight/size/line-height rendered live via props |
| `TypeSpecCard` | two-column type-spec row — font-metric key/value panel beside a live sample slot |
| `TextPressure` | a line of variable-font text whose glyphs deform toward the pointer — manipulates `wght`/`wdth`/`ital` per glyph, each frame |
| `ColorLoader` | full-height branded loading curtain — times in a live TextPressure variable-font wordmark (**peer:** `framer-motion`) |

`kol-component`'s `LoaderOverlay` now takes a `loader` SLOT instead of hardcoding ColorLoader — consumers inject `<ColorLoader/>` from this package.

### Catalog + composition (added 2026-07-09)

The typeface-catalog family and the assembled specimen page. Each ships a bundled default fixture and takes overrides via props.

| Component | What it is |
|-----------|-----------|
| `TypefaceSpecimenPage` | full data-driven specimen composition (severed route — no router/SEO/data-fetch): hero → styles → preview → variable axes → glyph metrics. Hero is an injectable `HeroComponent` slot; navigation via `linkComponent` prop |
| `TypefaceLibraryGrid` / `TypefaceLibraryGridWithVariables` | filtered typeface-catalog grids (wrap `ContentFilters`); the second adds a "By Typeface" weight-variant mode |
| `TypefaceLibraryItem` / `TypefaceVariablePreview` | catalog card/list item (renders the live font) + interactive per-weight preview (size / leading / spacing) |

> **Cut on 2026-07-09** — failed the membership test (they describe or market type, never act on the font): `FoundryOtherTypefaces` (redundant vs the grid); `FoundryTypefacePairing` / `PairingsList` / `PairingCard` (editorial pairing cards); `FoundryOpentypeFeatures` / `FoundryTypefaceDetails` / `FeatureGrid` / `FeatureCard` (descriptor cards); `FoundryCTA` / `FoundryFeatureSection` / `FoundryLicenseQuestions` / `InDevelopmentSection` (marketing chrome); and the vendored `ButtonGroup`. See `packages/foundry/COMPONENTS.md`.

### Data exports

| Export | What |
|--------|------|
| `glyphSets` | glyph inventory by set |
| `glyphCategories` | category groupings |
| `SPECIMEN_SAMPLE_TEXT` | default specimen copy |
| `typefaceConfig` · `getTypefaceConfig` · `getAllTypefaceIds` · `getAllTypefaces` | bundled default typeface fixture + accessors (consumers can inject their own via props) |

## Consumer notes

- **Data is injected** — typeface metrics / font files are consumer-supplied flat props (or the bundled `typefaceConfig` fixture).
- **Shared primitives stay in `kol-component`** — `Button`, `Divider`, `Dropdown`, `Pill`, `Slider`, `Tag`, `ContentFilters`, `useAxisAnimation`, `usePrefersReducedMotion` (+ `Icon` from `kol-icons`). This package depends on them.
- **No router / app-shell dependency** — the pieces that navigate (`TypefaceLibraryGridWithVariables`, `TypefaceSpecimenPage`) take an injected `linkComponent` (receives `to`), falling back to a plain `<a href>`. The severed page's `FullBleedHero` is an injectable `HeroComponent` slot with a minimal built-in default.
- **`opentype.js` is an optional peer** — install it for parsed glyph metrics; without it, `GlyphMetricsGrid` falls back. **`framer-motion` is a peer** — `ColorLoader`'s curtain motion (2026-07-09).
- **CSS lives in `kol-theme`** — `kol-components-foundry.css` (recreated 2026-07-09 for the moved kit: type-sample/spec rules + the TextPressure stroke ghost); everything else styles with `@kolkrabbi/kol-theme` utility classes. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-foundry/src"` — Tailwind skips `node_modules`, or the utilities never generate).
- Live specimen: `showcase/src/sets/foundry-specimen.jsx`.
