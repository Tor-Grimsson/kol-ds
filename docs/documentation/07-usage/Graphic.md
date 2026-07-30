# Graphic

- **Package:** `@kolkrabbi/kol-component`
- **Category:** graphics
- **Real-world usages found:** 88 across 24 files in 10 apps
- **Weighted inbound:** 77★ across 24 edges — 5×4★ · 19×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 29 | `kol-apps/kol-client-ac/src/pages/Styleguide.jsx` |
| 4 | 29 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx` |
| 4 | 4 | `kol-apps/kol-client-kolkrabbi/src/pages/Styleguide.jsx` |
| 4 | 4 | `kol-website/apps/brand/src/pages/Styleguide.jsx` |
| 4 | 3 | `kol-apps/kol-client/src/pages/foundations/Logo.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/client/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/Landing.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/client-site/Home.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/foundations/GraphicsAssets.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/loaders/graphics/Graphic.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/styleguide/AssetTable.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/components/loaders/graphics/Graphic.jsx` |
| … | | _12 more_ |

## Import

```jsx
import { Graphic } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/Landing.jsx`:

```jsx
<Graphic category="abstract" name="abstract-03" />
```

From `kol-apps/kol-client-ac/src/pages/Styleguide.jsx`:

```jsx
<Graphic category="stationery" name="business-card-front" />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx`:

```jsx
<Graphic category="stationery" name="business-card-back" />
```

From `kol-apps/kol-client-hrafn/src/components/graphics/Graphic.jsx`:

```jsx
<Graphic category="patterns" name="pattern-05" />
```

From `kol-apps/kol-client-kolkrabbi/src/components/styleguide/AssetTable.jsx`:

```jsx
<Graphic category={category} name={name} />
```
