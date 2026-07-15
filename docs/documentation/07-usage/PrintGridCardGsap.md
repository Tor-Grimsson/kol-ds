# PrintGridCardGsap

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { PrintGridCardGsap } from '@kolkrabbi/kol-store'
```

## Real usage

From `kol-website/apps/web/src/routes/prints/PrintsGridGsap.jsx`:

```jsx
<PrintGridCardGsap
                      key={`${print.id}-${i >= col.length ? 'dup' : 'orig'}`}
                      print={print}
                      onCardClick={onCardClick}
                    />
```
