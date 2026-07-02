# AssetPlaceholder

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 17 across 17 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-lightroom

## Import

```jsx
import { AssetPlaceholder } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/primitives/Image.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="missing" className={className} />
```

From `kol-apparat/kol-lightroom/src/components/graphics/Graphic.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} aspectRatio={aspectRatio} note="pending" className={className} />
```

From `kol-client/kol-client/src/components/client/icons/Icon.jsx`:

```jsx
<AssetPlaceholder category="icons" name={name} aspectRatio="1 / 1" note="pending" className={className} />
```

From `kol-client/kol-client-ac/src/components/loaders/images/Image.jsx`:

```jsx
<AssetPlaceholder category={category} name={name} note="pending" className={className} />
```
