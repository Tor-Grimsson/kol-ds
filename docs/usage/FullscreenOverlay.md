# FullscreenOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** primitives
- **Real-world usages found:** 10 across 10 files in 5 apps
- **Used in:** kol-client, kol-client-ac, kol-client-canalix, kol-client-kolkrabbi, kol-editor

## Import

```jsx
import { FullscreenOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/brand/AssetCarousel.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <Image src={current.src} alt={current.caption ?? current.alt ?? ''} category={category} name={current.caption ?? current.alt} />
```

From `kol-client/kol-client/src/components/framework/sections/FullscreenGallery.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? ''} />
```

From `kol-client/kol-client-canalix/src/components/brand/AssetCarousel.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? current.alt ?? ''} />
```
