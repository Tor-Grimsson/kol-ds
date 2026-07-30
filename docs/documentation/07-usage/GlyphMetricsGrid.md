# GlyphMetricsGrid

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 6 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/GlyphMetricsGrid.jsx` |
| 3 | 2 | `kol-website/apps/web/src/components/fontviewer/GlyphMetricsGrid.jsx` |
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/GlyphMetricsSection.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/GlyphMetricsSection.jsx` |

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

From `kol-website/_tmp/web-quarantine-elder/GlyphMetricsSection.jsx`:

```jsx
<GlyphMetricsGrid
          fontUrl={currentFontUrl}
          fontFamily={fontFamily}
          fontStyle="normal"
          variationSettings={variationSettings}
        />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/GlyphMetricsGrid.jsx`:

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
