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
  - "[[05-specimen-system|specimen system]]"
---

# Store system — `@kolkrabbi/kol-store`

The commerce / storefront system. Lifted out of `kol-component` on 2026-07-09; the prints store (kolkrabbi.io/prints) is its consumer, and commerce evolves on its own cadence separate from the core UI.

```js
import { ProductDetailLayout, PrintsGrid, PrintBuyButton } from '@kolkrabbi/kol-store'
import { prints, printPricing, resolvePrintPrice } from '@kolkrabbi/kol-store/data'
```

## Component index

| Component | What it is | Key inputs |
|-----------|-----------|-----------|
| `ProductDetailLayout` | full product-detail apparatus — media gallery, price, quantity stepper, spec list, tab rows. Optional commerce block folds in an edition/shipping price matrix (see below) | product model (flat props) |
| `PriceDisplay` | formatted price, multi-currency | amount, currency |
| `DiagonalMarqueeRiver` | gsap-driven diagonal marquee of editions/products (tilted auto-scroll columns; click to select) | items, `renderItem` |
| `PrintsGrid` | filterable storefront grid organism — `ContentFilters` shell over a grid of `PrintGridCard`. FLIP-into-detail via `onCardClick` | `prints`, `onCardClick`, `activeSlug`, `ctaSlot` |
| `PrintGridCard` | compact √2 product card with 3D flip; commerce-free, router-free | `print`, `onCardClick`, `isFlipped` |
| `PrintGridCardGsap` | river-column card variant of the above; forwards a ref for GSAP measurement | `print`, `onCardClick`, `ref` |
| `PrintBuyButton` | smart fulfillment CTA — self-fulfilled / POD / "Coming Soon" default. **No hardcoded URLs**; every link enters via `print` | `print` (`buyUrl`, `printOnDemandUrl`, `price`) |

> **"The Drift" gallery is NOT a store export.** The generic pinned-scroll engine already ships as `ScrollDriftGallery` in `@kolkrabbi/kol-content` (slot-based: `renderCard`/`intro`/`outro`/`title`). Rather than duplicate a second gsap+ScrollTrigger river here, the prints storefront composes content's gallery with a prints `renderCard` (e.g. `PrintGridCardGsap`).

## Optional commerce block (ProductDetailLayout)

The PDP skeleton stays presentational by default. Pass the opt-in props to fold in the print-store purchase logic — the default API is untouched when they are absent:

- `editionOptions` → swaps the single Size select for a "Size & Edition" select.
- `shippingOptions` → swaps the Quantity stepper for a "Shipping" select.
- `computePrice({edition,shipping})` → recomputes `PriceDisplay` from the live selection; wire it to `resolvePrintPrice(printPricing, edition, shipping)` from `/data`.
- `renderActions({edition,shipping,price})` → CTA as a function of the selection (e.g. pick the right PayPal link).

## `./data` subpath — demo fixture

`@kolkrabbi/kol-store/data` (→ `packages/store/src/data/prints.js`) ships a demo catalog mirroring `@kolkrabbi/kol-chess/data`: `prints` (24 entries), `printPricing`, `editionOptions`, `shippingOptions`, `printInfo`, `paypalLinks`, `filterData`, and helpers `getPrintBySlug` / `formatPrice` / `resolvePrintPrice`. **Severed** — `CDN_BASE` is a placeholder host and `paypalLinks` values are empty; real consumers inject their own catalog + config.

## Consumer notes

- **Product data is injected** — flat prop bags, no fetch. Router (`Link`/`useNavigate`) and `framer-motion` are page concerns; the grid/card/gallery take injected click handlers and use gsap where the source used gsap.
- **Form primitives stay in `kol-component`** — `Pill`, `Divider`, `QuantityInput`, `SpecList`, `TabsRow`, `Dropdown`, `ContentFilters`, `Button` (used across the store components). This package depends on them; `PriceDisplay` lives **only** here (no duplicate in `kol-component`).
- **`gsap` is a peer** (the marquee + the drift gallery); `usePrefersReducedMotion` (from `kol-component`) gates the animation.
- **CSS** ships in `@kolkrabbi/kol-theme`. Vite + Tailwind v4 consumer (`@source "…/node_modules/@kolkrabbi/kol-store/src"`).
- Live storefront: `showcase/src/sets/prints-store.jsx`; product panel block: `showcase/src/blocks/product-panel.jsx`.
