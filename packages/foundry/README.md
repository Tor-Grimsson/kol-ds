# @kolkrabbi/kol-foundry

The KOL **type-foundry system** — the type-specimen apparatus, lifted out of `@kolkrabbi/kol-component` (was the `/foundry` subpath) into its own package. It's a distinct content domain (typefaces, glyph metrics, variable-font axes — not Sanity CMS) with its own consumer (kolkrabbi.io/foundry) and versioning cadence.

## What's in the box

| Export | What |
| --- | --- |
| `TypefaceHero` | specimen hero — typeface name, styles, sample |
| `VariableFontSection` | live weight/axis playground (`useAxisAnimation`) |
| `GlyphMetricsGrid` | parsed-metric glyph inspector |
| `FoundryCharacterSets` | character-set browser |
| `TypefaceStyleSection` | per-style specimen block |
| `FontPreviewSection` | size-ladder / preview control |
| `SpecimenSectionHeader` | shared section header |
| `TypeSample` | labeled live type-specimen block (props-driven) |
| `TypeSpecCard` | font-metric data sheet + live sample slot |
| `TextPressure` | variable-font glyphs deforming toward the pointer |
| `ColorLoader` | branded loading curtain with a live variable-font wordmark |
| `glyphSets`, `glyphCategories`, `SPECIMEN_SAMPLE_TEXT` | glyph data |

```js
import { TypefaceHero, VariableFontSection } from '@kolkrabbi/kol-foundry'
```

## Requirements

Components take flat prop bags — typeface metrics / font files are consumer-supplied. Shared primitives (`Tag`, `Pill`, `Slider`, `Button`, `Divider`, `Dropdown`, `useAxisAnimation`, `usePrefersReducedMotion`) stay in `@kolkrabbi/kol-component`; this package depends on them. `framer-motion` is a peer (`ColorLoader`). Styling comes from `@kolkrabbi/kol-theme`. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-foundry/src"` — Tailwind skips `node_modules` when scanning, so without this line the specimen layouts never generate).
