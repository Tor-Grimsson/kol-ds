---
component: ProductDetailLayout
source: kol-monorepo/apps/web/src/routes/prints/PrintDetail.jsx#L158-L372
date: 2026-07-03
status: draft
deps: [SpecList, PriceDisplay, PrintBuyButton, Divider, Pill]
---

# ProductDetailLayout

## Purpose
The two-column product-detail (PDP) skeleton: a full-height **media gallery** column beside a scrollable **details** column — header (eyebrow + title + tags), a `SpecList`, a description **tablist/tabpanel**, then a purchase block (price, size `select`, qty `input`, **CTA slot**, shipping note, back link). The store's PDP has no DS equivalent; the reusable value is the **slot skeleton + grid**, not the print-specific content.

## Anatomy
- `<main className="min-h-screen w-full overflow-x-hidden bg-surface-primary text-auto">`
- `<section className="grid h-dvh w-full gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">` — 1.15 : 0.85 split at `lg`, single column below.
  - **Media column** `<div className="relative flex h-dvh bg-surface-secondary">` → centered image area `flex-1 flex items-center justify-center px-8 py-24 lg:px-16 lg:py-32 overflow-hidden` + an absolute bottom **thumbnail strip** (`absolute inset-x-0 bottom-0 flex gap-3 overflow-x-auto bg-surface-primary/80 px-6 py-4`, thumbs `h-20 aspect-[4/5] rounded border-2`, active `border-auto opacity-100` / idle `border-transparent opacity-40 hover:opacity-100`). → **this whole column is a `media` slot** (see DROP for the image-URL logic).
  - **Details column** `<div className="h-dvh flex flex-col text-left px-6 pt-20 pb-8 sm:px-10 lg:px-16 lg:pt-24 lg:pb-12 bg-surface-primary overflow-visible">`
    - inner `<div className="mx-auto flex flex-1 w-full max-w-[640px] flex-col gap-6 overflow-visible">`
      - **header** (`reveal`, `--reveal-delay:0.1s`): `<p className="kol-helper-uc-xs text-accent-primary">{category}</p>`, `<h1 className="kol-heading-md uppercase">{name}</h1>`, optional tag row of `<Pill variant="subtle" size="sm">`.
      - **specs** (`reveal`, `0.2s`): `<Divider />` + **`SpecList`** (`lobby/SpecList.md`) + `<Divider />`. Reference SpecList; don't re-spec.
      - **tabs** (`reveal`, `0.3s`): `<nav role="tablist">` of `<button role="tab" aria-selected aria-controls tabIndex>` (`kol-mono-sm pb-3 border-b-2`, active `border-auto text-auto` / idle `border-transparent text-fg-48 hover:text-auto`), then `<div role="tabpanel" aria-labelledby className="kol-mono-text text-fg-64 leading-relaxed space-y-4">`.
      - **purchase block** (`reveal`, `0.4s`, `mt-auto space-y-6 border-t border-auto pt-6`):
        - **price** → `PriceDisplay` (`lobby/PriceDisplay.md`).
        - **size + qty** grid `grid gap-4 sm:grid-cols-2`: labelled `<select>` of sizes + labelled `<input type="number" min=1 max=10>` (clamped 1–10). Inputs styled `w-full rounded border border-auto bg-surface-primary px-4 py-3 kol-mono-sm text-auto`.
        - **CTA slot** → the DS **`PrintBuyButton`** (`layout="stack" size="lg" className="w-full"`).
        - **shipping note** `<p className="kol-mono-xs text-fg-48">…</p>`.
        - **back link** `LinkWithIcon` → `/prints` (`iconName="arrow-left"`).

## Variants
- **Purchase-available vs inquiry** — source branches `hasPurchaseOption` between `PrintBuyButton` and an ad-hoc PayPal/inquiry `Button` pair. Collapse to a single **`actions` slot** (see Recreation notes).
- **Media count** — thumbnail strip only renders when `galleryItems.length > 1`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| media | node | — | left media/gallery column slot |
| eyebrow / title | node | — | category caption + product name (`kol-heading-md`) |
| tags | `string[]` | `[]` | optional `Pill` row |
| specs | `Array<{label,value}>` | `[]` | passed to `SpecList` (or accept a `specs` slot) |
| tabs | `Array<{ id, label, content }>` | — | tablist/tabpanel data |
| price | node | — | `PriceDisplay` slot |
| sizeOptions | `string[]` | `['A3']` | `<select>` options |
| quantity / onQuantityChange | number / fn | `1` | qty input (clamp 1–10) |
| actions | node | — | CTA slot — pass `PrintBuyButton` |
| shippingNote | node | — | fine-print line |
| backLink | node | — | back-to-catalog link |

## Styling
- Tailwind throughout; KOL type + surface/tone tokens.
- Grid: `lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`, `h-dvh` columns, `gap-0`.
- Surfaces: `bg-surface-primary` (details), `bg-surface-secondary` (media), `bg-surface-primary/80` (thumb strip).
- Tone tokens: `text-auto`, `text-accent-primary`, `text-fg-48`, `text-fg-64`, `border-auto`, `border-transparent`.
- Type: `kol-helper-uc-xs`, `kol-heading-md`, `kol-mono-sm`, `kol-mono-xs`, `kol-mono-text`.
- **Reveal stagger:** each block carries `className="reveal"` + inline `style={{ '--reveal-delay': '0.1s' … '0.4s' }}` — a CSS-driven entrance (the `.reveal`/`--reveal-delay` rule lives in the app's global sheet). Port the `.reveal` keyframe with it, or swap for an equivalent DS entrance util.
- **App-specific bits to DROP:**
  - `getPrintBySlug(slug)` + `useParams`/`Navigate` route wiring, `SEO`, and the trailing `FoundryCTA` — none belong to the layout.
  - **Hardcoded PayPal link** `'https://www.paypal.com/ncp/payment/78EW9SNGUMUTQ'` (source L104) and the `mailto:` inquiry href — never ship a hardcoded checkout URL.
  - The `galleryItems`/`primarySrcSet` `useMemo`s — that's Sanity/CDN image-URL normalization (`normalizeKey` regex, `srcSet` from `-<width>.jpg` suffixes). It belongs to the `media` slot's provider, not the layout skeleton.
  - `print.*` reads for header/specs/price — replaced by the slots above.

## States & interactions
- **Tabs:** `activeTab` state; ARIA `tablist`/`tab`/`tabpanel` with roving `tabIndex` and `aria-selected`/`aria-controls`/`aria-labelledby` — **keep the a11y wiring**.
- **Thumbnails:** `activeImageIndex` selects the main image; active thumb ringed.
- **Quantity:** `<input type=number>` clamped `Math.min(10, Math.max(1, parsed))`, non-finite → `1`.
- **Size:** uncontrolled `<select>` in source (no state) — wire to a controlled value in the DS.
- Reset-on-navigate (`window.scrollTo(0,0)`, reset image/qty on `slug` change) is route behavior — drop.

## Dependencies
- **SpecList** (staged, `lobby/SpecList.md`) — the key-facts block.
- **PriceDisplay** (staged, `lobby/PriceDisplay.md`) — the price line.
- **PrintBuyButton** (DS atom, `@kol/ui`) — the CTA slot fill.
- **Divider**, **Pill**, **Button**, **LinkWithIcon** (DS) — separators, tags, back link.
- Could adopt DS **`Dropdown`** for the size select (the overlay variant already does).

## Recreation notes
- **Tier:** organism — the reusable value is the **slot skeleton** (two-column grid + header/specs/tabs/purchase scaffold with correct a11y), not the print content. Keep it presentational; all data enters through slots/props.
- **The prop/slot seam replacing the Sanity doc:** `media`, `eyebrow`/`title`/`tags`, `specs` (→`SpecList`), `tabs`, `price` (→`PriceDisplay`), `sizeOptions`, `quantity`, `actions` (→`PrintBuyButton`), `shippingNote`, `backLink`. No `print` object crosses the boundary.
- **Consolidate the buy buttons — do NOT re-lobby them.** Both PDPs carry an ad-hoc PayPal/inquiry `Button` pair (`PrintDetail.jsx#L333-354` and `PrintDetailOverlay.jsx#L379-406`) as the fallback when `hasPurchaseOption` is false. These should **fold into the existing `PrintBuyButton` atom** (add its inquiry/PayPal fallback there), not become a new lobby brief — `ProductDetailLayout` just exposes one `actions` slot and lets `PrintBuyButton` own all purchase paths.
- **Text casing at call site:** `kol-heading-md uppercase` on the title and `kol-helper-uc-xs` on the eyebrow are presentational KOL classes — keep them; author `title`/`eyebrow`/tab labels verbatim in intended case, no JS uppercasing.
