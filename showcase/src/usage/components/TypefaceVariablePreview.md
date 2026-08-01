# TypefaceVariablePreview

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 2 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-website/apps/web/src/foundry-system/sections/TypefaceLibraryGridWithVariables.jsx` |

## Import

```jsx
import { TypefaceVariablePreview } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/foundry-system/sections/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceVariablePreview
                key={`${typeface.name}-${w.weight}`}
                typeface={typeface}
                weight={w.weight}
                weightValue={w.value}
                variant="card"
              />
```

From `kol-website/apps/web/src/foundry-system/sections/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceVariablePreview
              key={`${typeface.name}-${w.weight}`}
              typeface={typeface}
              weight={w.weight}
              weightValue={w.value}
              variant="list"
            />
```
