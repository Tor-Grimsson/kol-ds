# BrandHero

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 14 across 11 files in 6 apps
- **Weighted inbound:** 34★ across 11 edges — 1×4★ · 10×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-canalix, kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 4 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Gallery.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/Brand.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/Styleguide.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Demo.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Reference.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/pages/Canalix.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix/src/pages/Casedoc.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/pages/Styleguide.jsx` |
| 3 | 1 | `kol-website/_tmp/brand-page-split-elder/Brand.jsx` |
| 3 | 1 | `kol-website/apps/brand/src/pages/brand/Overview.jsx` |

## Import

```jsx
import { BrandHero } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apps/kol-client/src/pages/Brand.jsx`:

```jsx
<BrandHero
        label="/ command"
        title={BRAND.name}
        lede="Federation flag. Fleet commission. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of sovereign institutions."
      />
```

From `kol-apps/kol-client-ac/src/pages/Styleguide.jsx`:

```jsx
<BrandHero
        label="brand guidelines"
        title={BRAND.name}
        lede="Client-facing identity guidelines — chapter-structured for handoff. Mirrors the shape of the deliverable PDF."
      />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Demo.jsx`:

```jsx
<BrandHero
        label="demo · unlisted"
        title="Button"
        lede="Four variants share the same padding scale as .ac-control (sm 4/12 · md 6/16 · lg 8/20). Heavier-background variants (secondary, accent) use font-weight 500 for ink punch; primary and outline stay at the ac-mono default 400."
      />
```

From `kol-apps/kol-client-canalix/src/pages/Canalix.jsx`:

```jsx
<BrandHero
        label="/ canalix"
        title="Canalix"
        lede="Master brand. Branded house. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of governmental institutions."
        mark={<BrandLogo brand="canalix" name="logomark-light" className="kol-hero-mark" title="Canalix" />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Gallery.jsx`:

```jsx
<BrandHero
        label="media library"
        title="Gallery"
        lede={`Unavailable: ${String(error)}. Is the dev server running and the photoIndexPlugin registered in vite.config.js?`}
      />
```
