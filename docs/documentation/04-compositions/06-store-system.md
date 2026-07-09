---
title: Store system — the commerce package
type: reference
status: canonical
updated: 2026-07-09
verified: 2026-07-09
description: Component index and consumer guide for @kolkrabbi/kol-store — the commerce/storefront system (product-detail layout, price display, gsap diagonal marquee river), lifted out of kol-component on 2026-07-09. The prints store is its consumer.
aliases:
  - store
  - kol-store
  - commerce
  - prints
sources:
  - packages/store/src/index.js
  - packages/store/README.md
  - showcase/src/sets/prints-store.jsx
tags:
  - domain/design-system
  - domain/store
related:
  - "[[01-package-topology|package topology]]"
  - "[[05-foundry-system|foundry system]]"
---

# Store system — `@kolkrabbi/kol-store`

The commerce / storefront system. Lifted out of `kol-component` on 2026-07-09; the prints store (kolkrabbi.io/prints) is its consumer, and commerce evolves on its own cadence separate from the core UI.

```js
import { ProductDetailLayout, DiagonalMarqueeRiver } from '@kolkrabbi/kol-store'
```

## Component index

| Component | What it is | Key inputs |
|-----------|-----------|-----------|
| `ProductDetailLayout` | full product-detail apparatus — media gallery, price, quantity stepper, spec list, tab rows | product model (flat props) |
| `PriceDisplay` | formatted price, multi-currency | amount, currency |
| `DiagonalMarqueeRiver` | gsap-driven diagonal marquee of editions/products (tilted auto-scroll columns; click to select) | items, `onSelect` |

## Consumer notes

- **Product data is injected** — flat prop bags, no fetch.
- **Form primitives stay in `kol-component`** — `Pill`, `Divider`, `QuantityInput`, `SpecList`, `TabsRow`, `Dropdown` (used by `ProductDetailLayout`). This package depends on them.
- **`gsap` is a peer** (the marquee); `usePrefersReducedMotion` (from `kol-component`) gates the animation.
- **CSS** ships in `@kolkrabbi/kol-theme`. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-store/src"`).
- Live storefront: `showcase/src/sets/prints-store.jsx`; product panel block: `showcase/src/blocks/product-panel.jsx`.
