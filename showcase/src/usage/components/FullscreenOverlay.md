# FullscreenOverlay

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 14 across 14 files in 7 apps
- **Weighted inbound:** 42★ across 14 edges — 14×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client/src/components/framework/brand/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/sections/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/components/brand/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/components/cards/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/styleguide/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/styleguide/FullscreenGallery.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/brand/AssetCarousel.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/sections/FullscreenGallery.jsx` |
| … | | _2 more_ |

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
