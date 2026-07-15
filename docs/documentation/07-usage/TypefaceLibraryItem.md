# TypefaceLibraryItem

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 2 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { TypefaceLibraryItem } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/components/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceLibraryItem
                typeface={typeface}
                variant="card"
                isActive={activeIndex === index}
                onMouseEnter={() => setActiveIndex(index)}
              />
```

From `kol-website/apps/web/src/routes/foundry/components/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceLibraryItem
              typeface={typeface}
              variant="list"
              isActive={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
            />
```
