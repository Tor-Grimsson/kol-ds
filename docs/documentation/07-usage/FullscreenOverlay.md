# FullscreenOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 12 across 12 files in 6 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor

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
