# GlyphMetricsSection

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-website

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
