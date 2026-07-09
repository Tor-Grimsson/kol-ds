# `@kolkrabbi/kol-specimen` — target component list

The type-foundry / specimen apparatus. **The membership test: does the component render, inspect, or manipulate an actual font?** Type tools and live specimens belong; generic cards, marketing chrome, and prose-that-mentions-type do not — even if they sit in the monorepo's `routes/foundry/` folder. Data is consumer-injected; shared primitives stay in `@kolkrabbi/kol-component`.

**Status:** `core` = present before the 2026-07-09 monorepo extraction · `new` = pulled in that extraction.

## Components (13)

### Specimen tools — one typeface, inspected

| Component | Role — what it does *to the font* | Status |
|-----------|-----------------------------------|--------|
| `TypefaceHero` | Specimen hero — renders the typeface's live identity sample | core |
| `TypefaceStyleSection` | Per-weight/style specimen block, live | core |
| `FontPreviewSection` | Size ladder + free-preview of the live font | core |
| `VariableFontSection` | Variable-axis playground — manipulates `wght`/`wdth` live | core |
| `GlyphMetricsGrid` | Parsed-metric glyph inspector (`opentype.js` optional) | core |
| `GlyphMetricsSection` | Stateful axis/style driver feeding `GlyphMetricsGrid` | new |
| `FoundryCharacterSets` | Character/glyph-set browser in the live font | core |

### Catalog — the "foundry collection"

| Component | Role — what it does *to the font* | Status |
|-----------|-----------------------------------|--------|
| `TypefaceLibraryGrid` | Typeface catalog grid, live font cards | new |
| `TypefaceLibraryGridWithVariables` | Catalog grid with interactive weight previews | new |
| `TypefaceLibraryItem` | Single catalog card (Ðð → pangram, rendered in the font) | new |
| `TypefaceVariablePreview` | Interactive size / leading / spacing on a live weight | new |

### Scaffold + composition

| Component | Role | Status |
|-----------|------|--------|
| `SpecimenSectionHeader` | Internal section header (title + weight/style axis dropdowns) every specimen section mounts under | core |
| `TypefaceSpecimenPage` | Full data-driven specimen composition (hero → styles → preview → axes → glyph metrics) | new |

## Data exports

| Export | Source | Status |
|--------|--------|--------|
| `glyphSets`, `glyphCategories`, `SPECIMEN_SAMPLE_TEXT` | `glyphData.js` | core |
| `typefaceConfig`, `getTypefaceConfig`, `getAllTypefaceIds`, `getAllTypefaces` | `typefaceConfig.js` | new |

## Dependencies

- **Shared primitives** (from `@kolkrabbi/kol-component`, never bundled): `Button` · `Divider` · `Icon` · `Slider` · `Dropdown` · `Pill` · `Tag` · `ContentFilters` · `useAxisAnimation`.
- **Optional peer:** `opentype.js` (`GlyphMetricsGrid` falls back without it).
- **CSS:** `kol-components-specimen.css` in `@kolkrabbi/kol-theme` — re-slim to only classes the kept set references.
- **Router:** none — injected `linkComponent` prop (defaults to `<a>`).

## Explicitly excluded — not type-specific

These were in the first (folder-based) selection and are cut. They fail the membership test: none render, inspect, or manipulate a font.

| Removed | Why |
|---------|-----|
| `ButtonGroup` | Generic UI primitive — belongs in `kol-component`, never a foundry component |
| `FoundryCTA` | Generic centered call-to-action band |
| `FoundryFeatureSection` | Generic split image/text promo block (self-described "generic") |
| `FoundryLicenseQuestions` | Licence/contact band with hardcoded copy — content, not a component |
| `InDevelopmentSection` | "Coming soon" cards via generic `FeaturesCardSection` |
| `FoundryTypefaceDetails` | Typeface metadata (designer/format) + download buttons — info/CTA chrome |
| `FoundryOtherTypefaces` | Redundant — just wraps `TypefaceLibraryGridWithVariables` over a default set |
| `FoundryTypefacePairing`, `PairingsList`, `PairingCard` | Static editorial "recommended pairings" cards — display-only, no inspection/manipulation |
| `FoundryOpentypeFeatures`, `FeatureGrid`, `FeatureCard` | Prose descriptor cards ("Ligatures — …") that never apply a feature to the font |

> A *genuine* OpenType tester (live `font-feature-settings` toggles) or a real pairing tester would qualify — but they'd be new builds, not these editorial cards.
