# GlyphItem

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 9 across 9 files in 2 apps
- **Weighted inbound:** 27★ across 9 edges — 9×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/GlyphGrid.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/GlyphInspector.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/MetricsViewerCard.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/foundry/FoundryAtomsPreview.jsx` |
| 3 | 1 | `kol-website/_tmp/packages-elder-flush/ui/src/molecules/foundry/GlyphGrid.jsx` |
| 3 | 1 | `kol-website/_tmp/workshop-museum-elder/components/workshop/foundry/FoundryAtomsPreview.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/fontviewer/GlyphInspector.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/fontviewer/MetricsViewerCard.jsx` |
| 3 | 1 | `kol-website/apps/web/src/foundry-system/sections/FoundryCharacterSets.jsx` |

## Import

```jsx
import { GlyphItem } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/foundry/GlyphGrid.jsx`:

```jsx
<GlyphItem
          key={index}
          glyph={glyph}
          fontStyle={fontStyle}
          fontFamily={fontFamily}
        />
```

From `kol-website/apps/web/src/components/fontviewer/GlyphInspector.jsx`:

```jsx
<GlyphItem
                  key={index}
                  glyph={glyph}
                  fontStyle={fontStyle}
                  fontFamily={fontFamily}
                  isSelected={glyph === selectedGlyph}
                  onClick={setSelectedGlyph}
                  onMouseEnter={setHoveredGlyph}
                />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/MetricsViewerCard.jsx`:

```jsx
<GlyphItem
                    key={index}
                    glyph={glyph}
                    fontStyle={fontStyle}
                    fontFamily={fontFamily}
                    isSelected={glyph === selectedGlyph}
                    onClick={setSelectedGlyph}
                    onMouseEnter={setHoveredGlyph}
                  />
```

From `kol-website/apps/web/src/foundry-system/sections/FoundryCharacterSets.jsx`:

```jsx
<GlyphItem key={i} glyph={glyph} fontFamily={fontFamily} fontStyle={fontStyle} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/foundry/FoundryAtomsPreview.jsx`:

```jsx
<GlyphItem key={i} glyph={glyph} />
```
