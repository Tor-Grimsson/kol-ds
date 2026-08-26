---
component: CardFeatureHoverZoom
source: kol-component/src/molecules/CardFeatureItem.jsx (+ FeaturesCardSection.jsx)
staged: 2026-08-12
status: draft
deps: [CardFeatureItem]
---

# CardFeatureHoverZoom — the card's visual zooms slightly on hover

## The ask (user ruling 2026-08-12, kol-website session)

Hovering a `CardFeatureItem` should **zoom its visual slightly** — the `visual`
slot (mask-div / cover `<img>` / inline node per the polymorphic contract), not
the card box. Today's hover is border-brighten only
(`hover:border-fg-32` / `-24`, 300ms).

## Spec

- On card hover: visual scales ~**1.03**, `transition: transform` on the same
  300ms clock as the existing border transition, so the two read as one state.
- The visual's wrapper needs `overflow: hidden` so the zoom stays inside the
  card (respect the card's radius).
- All three visual forms behave the same (mask, img, node).
- `prefers-reduced-motion: reduce` → no zoom.

## Adoption remainder (kol-website's, once shipped)

kol-website's home renders a diverged LOCAL fork pair —
`src/components/sections/shared/FeaturesCardSection.jsx` (96-line
CardFeatureItem sibling at `src/components/workshop/molecules/`) vs the DS's
130-line pair. On ship: adopt the DS pair on `/` (Home.jsx), retire both local
files to `_tmp/`, same shape as the ContentFilters adoption 2026-08-12.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.40.0 + @kolkrabbi/kol-component@0.38.0**
(registry-verified). The visual wrapper carries `.kol-card-feature-visual`,
the card `.kol-card-feature`; the zoom (scale 1.03, 300ms — same clock as the
border transition) lives in kol-theme CSS per the same-day
ComponentTailwindSourceTrap law. All three visual forms ride the one wrapper;
the card's overflow-hidden + radius clip the scale; reduced-motion gets no
zoom and no transition. Adoption remainder is kol-website's: bump both, adopt
the DS pair on Home, retire the local FeaturesCardSection fork to `_tmp/`.
