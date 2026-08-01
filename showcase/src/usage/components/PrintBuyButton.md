# PrintBuyButton

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/jsx/PrintDetailOverlay.jsx` |
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

From `kol-apps/kol-monitor/a_torg/archive/jsx/PrintDetailOverlay.jsx`:

```jsx
<PrintBuyButton print={print} layout="stack" size="lg" className="w-full" />
```
