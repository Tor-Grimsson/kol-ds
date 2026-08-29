# PrintBuyButton

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/PrintDetail.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintDetailOverlay.jsx` |

## Import

```jsx
import { PrintBuyButton } from '@kolkrabbi/kol-store'
```

## Real usage

From `kol-website/_tmp/web-quarantine-elder/PrintDetail.jsx`:

```jsx
<PrintBuyButton
                    print={print}
                    layout="stack"
                    size="lg"
                    className="w-full"
                  />
```

From `kol-website/apps/web/src/routes/prints/PrintDetailOverlay.jsx`:

```jsx
<PrintBuyButton print={print} layout="stack" size="lg" className="w-full" />
```
