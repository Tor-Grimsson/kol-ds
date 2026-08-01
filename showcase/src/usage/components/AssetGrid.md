# AssetGrid

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 7 across 7 files in 7 apps
- **Weighted inbound:** 21★ across 7 edges — 7×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client/src/components/framework/sections/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/components/cards/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/sections/FullscreenGallery.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-orphan-elder/FullscreenGallery.jsx` |

## Import

```jsx
import { AssetGrid } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/sections/FullscreenGallery.jsx`:

```jsx
<AssetGrid cols={cols}>{tiles}</AssetGrid>
        : <div>{tiles}</div>}
      <FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? ''} />
```
