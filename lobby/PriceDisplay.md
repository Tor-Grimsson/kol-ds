---
component: PriceDisplay
source: kol-monorepo/apps/web/src/routes/prints/PrintDetail.jsx#L276-L283
date: 2026-07-03
status: draft
deps: []
---

# PriceDisplay

## Purpose
A baseline-aligned price line: a large **primary amount** beside a small muted **secondary** note (a second currency, or a "art + shipping" breakdown). The store's missing price atom — **the DS ships no price/sale/edition component today**, so every PDP re-inlines this two-`<span>` pattern. Pure scalars in, formatted currency out; zero print-doc coupling.

## Anatomy
- `<div className="flex flex-wrap items-baseline gap-3">` — baseline row so the small secondary sits on the same typographic baseline as the big number.
  - **primary** `<span className="kol-heading-lg">{formatPrice(amount, currency)}</span>`
  - **secondary** (optional) `<span className="kol-mono-sm text-fg-48">{secondary}</span>` — muted, mono, one type-stop down.

## Variants
- **secondary = currency echo** (PDP, source L276-283): secondary is a parenthesized second currency — `(formatPrice(priceISK, 'ISK'))`.
- **secondary = cost breakdown** (overlay, `PrintDetailOverlay.jsx#L348-351`): secondary is the math — `(€{art} + €{shipping} shipping)`, class `kol-mono-xs text-fg-48` (one stop smaller, and source tacks a stray `mb-8` on it — **drop the `mb-8`**, it's an alignment hack).
- **no secondary**: primary alone.

Fold both into one `secondary` node slot; the `sm` vs `xs` size is the only real delta — expose a `secondarySize` if wanted, else standardize on `kol-mono-sm`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| amount | number | — | primary price; run through currency formatter |
| currency | string | `'EUR'` | ISO code for `Intl.NumberFormat` styling of `amount` |
| secondary | node | — | muted trailing note (second-currency echo or breakdown); authored **with its own parens/content** at the call site — omit to hide |
| locale | string | `'de-DE'` | number-format locale (see note) |

## Styling
- Tailwind only; no custom CSS.
- Row: `flex flex-wrap items-baseline gap-3`.
- Primary: `kol-heading-lg`. Secondary: `kol-mono-sm text-fg-48` (or `kol-mono-xs` for the breakdown variant).
- Tokens: `text-fg-48` (muted), type classes `kol-heading-lg`, `kol-mono-sm`, `kol-mono-xs`.
- No animation.
- **App-specific bits to DROP:** the `print.price` / `print.priceISK` / `currentPricing.art+shipping` reads (pass scalars); the stray `mb-8` on the overlay's secondary span.

## States & interactions
Static, presentational. No state, no interaction.

## Dependencies
None. Needs a currency formatter (source's `formatPrice`, capture below).

## Recreation notes
- **Tier:** atom. This is the store gap — **no price/sale/edition component exists in the DS**; PriceDisplay is the seed for that family (a future `SalePrice`/`EditionPrice` can extend the same baseline row).
- **The prop/slot seam replacing the Sanity doc:** flat `amount` + `currency` scalars in, `secondary` as a free node — no `print` object, no pricing table lookup.
- **`formatPrice` behavior to reproduce (important):** source is
  ```js
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  ```
  It takes **only** `price` and **hardcodes EUR + de-DE + 0 fraction digits** — the call site `formatPrice(priceISK, 'ISK')` passes a currency arg the function silently ignores, so "ISK" values still render as `€…` (a **latent bug**). The DS atom must honor the `currency` prop for real (`{ style:'currency', currency, maximumFractionDigits:0 }`) so `ISK`/`EUR`/`USD` format correctly. Keep the whole-number default (`maximumFractionDigits: 0`) — prints are priced in round units.
- **Text casing at call site:** none — output is numeric/currency. The `secondary` parens are content; author them verbatim.
