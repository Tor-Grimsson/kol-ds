---
title: Foundry system — the type-specimen package
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-foundry — the type-specimen apparatus (typeface hero, variable-font axis playground, parsed-metric glyph inspector, character-set browser, font preview), graduated from the component/foundry subpath to its own package on 2026-07-09.
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

# Foundry system — `@kolkrabbi/kol-foundry`

The type-foundry / specimen apparatus. A distinct content domain (typefaces, glyph metrics, variable-font axes — **not** Sanity CMS) with its own consumer (kolkrabbi.io/foundry) and versioning cadence. Lifted out of the `component/foundry` subpath into its own package on 2026-07-09.

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
| `SpecimenSectionHeader` | shared section header (title + `Divider`) | title |

### Data exports

| Export | What |
|--------|------|
| `glyphSets` | glyph inventory by set |
| `glyphCategories` | category groupings |
| `SPECIMEN_SAMPLE_TEXT` | default specimen copy |

## Consumer notes

- **Data is injected** — typeface metrics / font files are consumer-supplied flat props.
- **Shared primitives stay in `kol-component`** — `Tag`, `Pill`, `Slider`, `Button`, `Divider`, `Dropdown`, `useAxisAnimation`. This package depends on them.
- **`opentype.js` is an optional peer** — install it for parsed glyph metrics; without it, `GlyphMetricsGrid` falls back.
- **CSS** ships in `@kolkrabbi/kol-theme`. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-foundry/src"`).
- Live specimen: `showcase/src/sets/foundry-specimen.jsx`.
