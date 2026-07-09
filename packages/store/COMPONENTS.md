# `@kolkrabbi/kol-store` — target component list

The commerce / storefront system. Every row is a **public export** from `src/index.js`. Product data is consumer-injected (or via the `./data` demo fixture); shared form primitives stay in `@kolkrabbi/kol-component`.

**Status:** `core` = present before the 2026-07-09 monorepo extraction · `new` = pulled from `kol-monorepo` in that extraction.

## Components

| Component | Layer | Role | Status |
|-----------|-------|------|--------|
| `ProductDetailLayout` | organism | Full product-detail apparatus — media gallery, price, quantity stepper, spec list, tab rows. Gained **opt-in** props (`editionOptions`, `shippingOptions`, `computePrice`, `renderActions`) for the size/edition→price matrix; old API unchanged | core (enhanced) |
| `DiagonalMarqueeRiver` | organism | gsap diagonal marquee of editions (tilted auto-scroll columns; click to select) | core |
| `PriceDisplay` | atom | Formatted multi-currency price (primary + secondary) | core |
| `PrintsGrid` | organism | Filterable storefront / collection grid (`ContentFilters` shell over `PrintGridCard`; optional `ctaSlot`) | new |
| `PrintGridCard` | molecule | Product / edition card — A-paper (√2) aspect, 3D flip when active | new |
| `PrintGridCardGsap` | molecule | River-column card variant (`forwardRef`, no flip) for the marquee | new |
| `PrintBuyButton` | atom | Smart fulfillment CTA — Stripe / print-on-demand / "Coming Soon"; **all URLs injected via config**, zero hardcoded links | new |

### Not shipped here (by design)

- **`ScrollDriftGallery`** ("The Drift" scroll gallery) — reuse the generic engine from `@kolkrabbi/kol-content`, composed with a prints `renderCard` (e.g. `PrintGridCardGsap`). Not re-implemented here, to avoid a second near-identical gsap + ScrollTrigger river.

## Data — `./data` subpath (demo fixture)

`import { … } from '@kolkrabbi/kol-store/data'` — severed static fixture (chess pattern); real consumers inject their own catalog.

| Export | What |
|--------|------|
| `prints` | 24-print demo catalog |
| `printPricing`, `editionOptions`, `shippingOptions` | pricing matrix + option sets |
| `printInfo`, `paypalLinks` | edition/shipping copy + **placeholder** checkout links |
| `filterData` | category/year filter model for `PrintsGrid` |
| `getPrintBySlug`, `formatPrice`, `resolvePrintPrice` | helpers (`resolvePrintPrice` wires the PDP price matrix) |

## Dependencies

- **Shared primitives** (from `@kolkrabbi/kol-component`, never bundled): `Button` · `Pill` · `Divider` · `Dropdown` · `Tag` · `Icon` · `ContentFilters` · `ViewToggle` · `QuantityInput` · `SpecList` · `TabsRow`.
- **Peer:** `gsap` (the marquee / river).
- **CSS:** none of its own — styling comes from `@kolkrabbi/kol-theme` utility classes.
- **Router / framer-motion:** none — the grid takes `onCardClick` + `activeSlug`; page-level animation stays in the consumer.
