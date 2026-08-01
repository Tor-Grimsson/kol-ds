# AssetPlaceholder

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 26 across 26 files in 10 apps
- **Weighted inbound:** 78★ across 26 edges — 26×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client/src/components/client/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/client/icons/Icon.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/primitives/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/loaders/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/primitives/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/loaders/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/loaders/images/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/primitives/Image.jsx` |
| 3 | 1 | `kol-apps/kol-client-hrafn/src/components/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client-hrafn/src/components/primitives/Image.jsx` |
| … | | _14 more_ |

## Import

```jsx
import { AssetPlaceholder } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/components/client/graphics/Graphic.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="pending" className={className} />
```

From `kol-apps/kol-client-ac/src/components/loaders/images/Image.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} note="pending" className={className} />
```

From `kol-apps/kol-client-acyr-website/apps/website/src/components/primitives/Image.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="missing" className={className} />
```

From `kol-apps/kol-client/src/components/client/icons/Icon.jsx`:

```jsx
<AssetPlaceholder category="icons" name={name} aspectRatio="1 / 1" note="pending" className={className} />
```
