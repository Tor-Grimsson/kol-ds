# PrintBuyButton

- **Package:** `@kolkrabbi/kol-store`
- **Category:** flat
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Used in:** kol-monitor, kol-website

## Import

```jsx
import { PrintBuyButton } from '@kolkrabbi/kol-store'
```

## Real usage

From `kol-website/apps/web/src/routes/prints/PrintDetail.jsx`:

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
