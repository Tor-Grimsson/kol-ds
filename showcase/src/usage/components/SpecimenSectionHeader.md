# SpecimenSectionHeader

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 8 across 8 files in 1 apps
- **Weighted inbound:** 24★ across 8 edges — 8×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/FontPreviewSection.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/FoundryCharacterSets.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/GlyphMetricsSection.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceStyleSection.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/VariableFontSection.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-specimen-sections/FoundryOpentypeFeatures.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-specimen-sections/FoundryTypefaceDetails.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-specimen-sections/FoundryTypefacePairing.jsx` |

## Import

```jsx
import { SpecimenSectionHeader } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/_tmp/2026-08-27-foundry-reconcile/FontPreviewSection.jsx`:

```jsx
<SpecimenSectionHeader
          selectedStyle={selectedStyleVariant}
          onStyleChange={setSelectedStyleVariant}
          showDropdown={showDropdown}
          label="Font Preview"
          icon="type-02"
          size="md"
          selectedWeight={selectedWeight}
          onWeightChange={setSelectedWeight}
          showWeightDropdown={availableWeights.length > 0}
          weightOptions={weightOptions}
        />
```

From `kol-website/_tmp/2026-08-27-foundry-reconcile/FoundryCharacterSets.jsx`:

```jsx
<SpecimenSectionHeader
          label="Character Sets"
          icon="grid"
          size="md"
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          showDropdown={showDropdown}
        />
```

From `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceStyleSection.jsx`:

```jsx
<SpecimenSectionHeader
          selectedStyle={selectedStyleVariant}
          onStyleChange={handleStyleVariantChange}
          styleOptions={styleOptions || undefined}
          showDropdown={showDropdown}
          label="Styles"
          icon="italic-a"
          size="md"
        />
```

From `kol-website/_tmp/2026-08-27-foundry-reconcile/VariableFontSection.jsx`:

```jsx
<SpecimenSectionHeader
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          showDropdown={showDropdown}
          label="Variable Font"
          icon="slider-02"
          size="md"
        />
```

From `kol-website/_tmp/2026-08-27-foundry-specimen-sections/FoundryOpentypeFeatures.jsx`:

```jsx
<SpecimenSectionHeader
          label="OpenType Features"
          icon="variant-01"
          size="md"
          showDropdown={false}
        />
```
