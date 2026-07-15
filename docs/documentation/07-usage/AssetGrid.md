# AssetGrid

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 7 across 7 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

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
