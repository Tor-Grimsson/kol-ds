# GlyphMetricsGrid

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 5 across 3 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

## Import

```jsx
import { GlyphMetricsGrid } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/GlyphMetricsGrid.jsx`:

```jsx
<GlyphMetricsGrid
 *   fontUrl={malromurFont}
 *   fontFamily="TGMalromur"
 *   fontStyle="italic"
 * />
```

From `kol-website/apps/web/src/components/fontviewer/GlyphMetricsGrid.jsx`:

```jsx
<GlyphMetricsGrid
 *   fontUrl={dylgjurFont}
 *   fontFamily="TGDylgjur"
 *   fontStyle="normal"
 *   uppercaseGlyphs={glyphSets.uppercase}
 *   lowercaseGlyphs={glyphSets.lowercase}
 *   initialGlyph="A"
 * />
```

From `kol-website/apps/web/src/routes/foundry/components/GlyphMetricsSection.jsx`:

```jsx
<GlyphMetricsGrid
          fontUrl={currentFontUrl}
          fontFamily={fontFamily}
          fontStyle="normal"
          variationSettings={variationSettings}
        />
```
