---
title: Specimen system — the type-specimen package
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-specimen — the type-specimen apparatus (typeface hero, variable-font axis playground, parsed-metric glyph inspector, character-set browser, font preview, typeface-catalog grid). Renamed from kol-foundry on 2026-07-09 after cutting the non-type components; every export renders, inspects, or manipulates a live font.
aliases:
  - foundry
  - kol-specimen
  - type specimen
sources:
  - packages/specimen/src/index.js
  - packages/specimen/README.md
  - showcase/src/sets/foundry-specimen.jsx
tags:
  - domain/design-system
  - domain/foundry
related:
  - "[[01-package-topology|package topology]]"
  - "[[06-store-system|store system]]"
---

# Specimen system — `@kolkrabbi/kol-specimen`

The type-specimen apparatus. **Every component renders, inspects, or manipulates a live font** — the commercial *foundry* chrome (pairings, licensing, CTAs, descriptor cards) is excluded, which is why the package is `specimen`, not `foundry`. A distinct content domain (typefaces, glyph metrics, variable-font axes — **not** Sanity CMS) with its own consumer (kolkrabbi.io/foundry) and versioning cadence. Graduated from the `component/foundry` subpath; renamed from `kol-foundry` on 2026-07-09, pre-publish.

```js
import { TypefaceHero, VariableFontSection } from '@kolkrabbi/kol-specimen'
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

### Catalog + composition (added 2026-07-09)

The typeface-catalog family and the assembled specimen page. Each ships a bundled default fixture and takes overrides via props.

| Component | What it is |
|-----------|-----------|
| `TypefaceSpecimenPage` | full data-driven specimen composition (severed route — no router/SEO/data-fetch): hero → styles → preview → variable axes → glyph metrics. Hero is an injectable `HeroComponent` slot; navigation via `linkComponent` prop |
| `TypefaceLibraryGrid` / `TypefaceLibraryGridWithVariables` | filtered typeface-catalog grids (wrap `ContentFilters`); the second adds a "By Typeface" weight-variant mode |
| `TypefaceLibraryItem` / `TypefaceVariablePreview` | catalog card/list item (renders the live font) + interactive per-weight preview (size / leading / spacing) |

> **Cut on 2026-07-09** — failed the membership test (they describe or market type, never act on the font): `FoundryOtherTypefaces` (redundant vs the grid); `FoundryTypefacePairing` / `PairingsList` / `PairingCard` (editorial pairing cards); `FoundryOpentypeFeatures` / `FoundryTypefaceDetails` / `FeatureGrid` / `FeatureCard` (descriptor cards); `FoundryCTA` / `FoundryFeatureSection` / `FoundryLicenseQuestions` / `InDevelopmentSection` (marketing chrome); and the vendored `ButtonGroup`. See `packages/specimen/COMPONENTS.md`.

### Data exports

| Export | What |
|--------|------|
| `glyphSets` | glyph inventory by set |
| `glyphCategories` | category groupings |
| `SPECIMEN_SAMPLE_TEXT` | default specimen copy |
| `typefaceConfig` · `getTypefaceConfig` · `getAllTypefaceIds` · `getAllTypefaces` | bundled default typeface fixture + accessors (consumers can inject their own via props) |

## Consumer notes

- **Data is injected** — typeface metrics / font files are consumer-supplied flat props (or the bundled `typefaceConfig` fixture).
- **Shared primitives stay in `kol-component`** — `Button`, `Divider`, `Dropdown`, `Pill`, `Slider`, `Tag`, `ContentFilters`, `useAxisAnimation` (+ `Icon` from `kol-icons`). This package depends on them.
- **No router / app-shell dependency** — the pieces that navigate (`TypefaceLibraryGridWithVariables`, `TypefaceSpecimenPage`) take an injected `linkComponent` (receives `to`), falling back to a plain `<a href>`. The severed page's `FullBleedHero` is an injectable `HeroComponent` slot with a minimal built-in default.
- **`opentype.js` is an optional peer** — install it for parsed glyph metrics; without it, `GlyphMetricsGrid` falls back.
- **No package CSS** — the kept components style entirely with `@kolkrabbi/kol-theme` utility classes; the old `kol-components-foundry.css` (only the cut pairing/feature cards referenced it) was deleted. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-specimen/src"`).
- Live specimen: `showcase/src/sets/foundry-specimen.jsx`.
