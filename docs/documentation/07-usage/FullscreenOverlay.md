# FullscreenOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 14 across 14 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

## Import

```jsx
import { FullscreenOverlay } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/components/framework/brand/AssetCarousel.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <Image src={current.src} alt={current.caption ?? current.alt ?? ''} category={category} name={current.caption ?? current.alt} />
```

From `kol-apps/kol-client-ac/src/components/styleguide/FullscreenGallery.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? ''} />
```

From `kol-apps/kol-client-canalix/src/components/brand/AssetCarousel.jsx`:

```jsx
<FullscreenOverlay open={!!current} onClose={() => setCurrent(null)}>
        {current && <img src={current.src} alt={current.caption ?? current.alt ?? ''} />
```
