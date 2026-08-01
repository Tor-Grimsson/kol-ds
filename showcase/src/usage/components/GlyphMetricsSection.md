# GlyphMetricsSection

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/components/TypefacePage.jsx` |

## Import

```jsx
import { GlyphMetricsSection } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/components/TypefacePage.jsx`:

```jsx
<GlyphMetricsSection
            fontUrlRoman={fontUrlRoman || fontUrl}
            fontUrlItalic={fontUrlItalic || fontUrl}
            fontFamily={fontFamily}
            fontStyle={fontStyle}
            badgeText={badgeText}
            showDropdown={styles.hasItalic}
            hasWeight={styles.hasWeight}
            hasWidth={styles.hasWidth}
            weights={styles.weights || []}
            widths={styles.widths || []}
          />
```
