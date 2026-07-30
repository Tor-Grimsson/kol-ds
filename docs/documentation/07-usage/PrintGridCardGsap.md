# PrintGridCardGsap

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGridGsap.jsx` |

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
