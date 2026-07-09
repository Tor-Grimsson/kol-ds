# @kolkrabbi/kol-store

The KOL **commerce / storefront system** — lifted out of `@kolkrabbi/kol-component` into its own package. The prints store (kolkrabbi.io/prints) is its consumer; commerce evolves on its own cadence, separate from the core UI.

## What's in the box

| Export | What |
| --- | --- |
| `ProductDetailLayout` | full product-detail apparatus — media gallery, price, quantity, specs, tabs |
| `PriceDisplay` | formatted price (multi-currency) |
| `DiagonalMarqueeRiver` | gsap-driven diagonal marquee of editions/products |

```js
import { ProductDetailLayout, DiagonalMarqueeRiver } from '@kolkrabbi/kol-store'
```

## Requirements

Product data is consumer-injected (flat prop bags). Shared form primitives (`Pill`, `Divider`, `QuantityInput`, `SpecList`, `TabsRow`, `Dropdown`) stay in `@kolkrabbi/kol-component`; this package depends on them. Styling comes from `@kolkrabbi/kol-theme`. Peer: `gsap` (the marquee). Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-store/src"`).
