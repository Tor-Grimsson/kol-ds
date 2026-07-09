---
title: Foundry system — the type-specimen package
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-specimen — the type-specimen apparatus (typeface hero, variable-font axis playground, parsed-metric glyph inspector, character-set browser, font preview), graduated from the component/foundry subpath to its own package on 2026-07-09.
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

# Foundry system — `@kolkrabbi/kol-specimen`

The type-foundry / specimen apparatus. A distinct content domain (typefaces, glyph metrics, variable-font axes — **not** Sanity CMS) with its own consumer (kolkrabbi.io/foundry) and versioning cadence. Lifted out of the `component/foundry` subpath into its own package on 2026-07-09.

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

### Collection + sections (added 2026-07-09)

Pulled from the monorepo `apps/web/routes/foundry` delta. Every section ships a bundled default fixture and takes overrides via props.

| Component | What it is |
|-----------|-----------|
| `TypefaceSpecimenPage` | full data-driven specimen composition (severed route — no router/SEO/data-fetch). Hero is an injectable `HeroComponent` slot; navigation via `linkComponent` prop |
| `FoundryOtherTypefaces` | "other typefaces" collection over `TypefaceLibraryGridWithVariables` |
| `TypefaceLibraryGrid` / `TypefaceLibraryGridWithVariables` | filtered library grids (wrap `ContentFilters`); the second adds a "By Typeface" weight-variant mode |
| `TypefaceLibraryItem` / `TypefaceVariablePreview` | library card/list item + interactive per-weight preview |
| `FoundryTypefacePairing` · `PairingsList` · `PairingCard` | font-pairing section + list + card |
| `FoundryOpentypeFeatures` · `FoundryTypefaceDetails` · `FeatureGrid` · `FeatureCard` | OpenType-feature / font-detail sections + grid + card |
| `FoundryCTA` · `FoundryFeatureSection` · `FoundryLicenseQuestions` · `InDevelopmentSection` | CTA band, split feature section, licence band, in-development showcase |
| `ButtonGroup` | **vendored** — not yet in `kol-component`; delete + repoint if it graduates |

### Data exports

| Export | What |
|--------|------|
| `glyphSets` | glyph inventory by set |
| `glyphCategories` | category groupings |
| `SPECIMEN_SAMPLE_TEXT` | default specimen copy |
| `typefaceConfig` · `getTypefaceConfig` · `getAllTypefaceIds` · `getAllTypefaces` | bundled default typeface fixture + accessors (consumers can inject their own via props) |

## Consumer notes

- **Data is injected** — typeface metrics / font files are consumer-supplied flat props (or the bundled `typefaceConfig` fixture).
- **Shared primitives stay in `kol-component`** — `Tag`, `Pill`, `Slider`, `Button`, `Divider`, `Dropdown`, `Icon`, `SectionLabel`, `ContentFilters`, `TiltCard`, `FeaturesCardSection`, `useAxisAnimation`. This package depends on them.
- **No router / app-shell dependency** — the sections that navigated (`FoundryCTA`, `TypefaceLibraryGridWithVariables`, `FoundryFeatureSection`, `TypefaceSpecimenPage`) take an injected `linkComponent` (receives `to`), falling back to a plain `<a href>`. The severed page's `FullBleedHero` is an injectable `HeroComponent` slot with a minimal built-in default.
- **`opentype.js` is an optional peer** — install it for parsed glyph metrics; without it, `GlyphMetricsGrid` falls back.
- **CSS** ships in `@kolkrabbi/kol-theme` — foundry classes (`.foundry-title`, `.pairing-card`, `.feature-card`) in `kol-components-specimen.css`. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-specimen/src"`).
- Live specimen: `showcase/src/sets/foundry-specimen.jsx`.
