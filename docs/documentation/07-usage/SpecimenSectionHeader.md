# SpecimenSectionHeader

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 5 across 5 files in 1 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/FontPreviewSection.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/FoundryCharacterSets.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/GlyphMetricsSection.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/TypefaceStyleSection.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/VariableFontSection.jsx` |

## Import

```jsx
import { SpecimenSectionHeader } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/foundry-system/sections/FontPreviewSection.jsx`:

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

From `kol-website/apps/web/src/foundry-system/sections/FoundryCharacterSets.jsx`:

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

From `kol-website/apps/web/src/foundry-system/sections/TypefaceStyleSection.jsx`:

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

From `kol-website/apps/web/src/foundry-system/sections/VariableFontSection.jsx`:

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

From `kol-website/apps/web/src/foundry-system/sections/GlyphMetricsSection.jsx`:

```jsx
<SpecimenSectionHeader
          selectedStyle={showDropdown ? selectedStyleVariant : showAxisDropdown ? selectedValue : undefined}
          onStyleChange={showDropdown ? setSelectedStyleVariant : showAxisDropdown ? onValueChange : undefined}
          showDropdown={showDropdown || (showAxisDropdown && valueOptions.length > 0)}
          styleOptions={showDropdown ? italicOptions : valueOptions}
          label="Glyph Viewer"
          icon="underline"
          size="md"
          showWeightDropdown={showAxisDropdown && valueOptions.length > 0}
          weightOptions={valueOptions}
          selectedWeight={selectedValue}
          onWeightChange={onValueChange}
        />
```
