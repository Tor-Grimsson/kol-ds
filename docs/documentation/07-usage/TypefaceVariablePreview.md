# TypefaceVariablePreview

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 2 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { TypefaceVariablePreview } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/components/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceVariablePreview
                key={`${typeface.name}-${w.weight}`}
                typeface={typeface}
                weight={w.weight}
                weightValue={w.value}
                variant="card"
              />
```

From `kol-website/apps/web/src/routes/foundry/components/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<TypefaceVariablePreview
              key={`${typeface.name}-${w.weight}`}
              typeface={typeface}
              weight={w.weight}
              weightValue={w.value}
              variant="list"
            />
```
