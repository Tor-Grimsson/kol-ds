# FontPreviewSection

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { FontPreviewSection } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/components/TypefacePage.jsx`:

```jsx
<FontPreviewSection
            fontFamily={fontFamily}
            badgeText={badgeText}
            showDropdown={styles.hasItalic}
            availableWeights={(styles.weights || []).map(w => w.label)}
            initialWeight={(styles.weights || [])[0]?.label || 'Regular'}
          />
```
