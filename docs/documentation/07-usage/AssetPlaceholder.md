# AssetPlaceholder

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 26 across 26 files in 10 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

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
