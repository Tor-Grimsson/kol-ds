---
component: ListingCardHoverZoom
source: kol-website/apps/web/src/routes/Stack.jsx#L155-L175
staged: 2026-08-27
status: draft
deps: [ListingCard (kol-content), ContentCard, kol-theme]
---

# ListingCardHoverZoom — the hero ListingCard zooms 5%; the family zooms 3%

## Purpose

`/stack`: the featured `ListingCard size="hero"` (kol-content) hovers with
`group-hover:scale-105` (`ListingCard.jsx:148`) — 5%, hardcoded, no seam.
The article cards under it (`ContentCard variant="article"`, `zoom: true`)
hover on the theme's media zoom (`.kol-media-zoom > img { scale(1.06) }`,
kol-components-molecules.css:1038) — while the card-visual rule from
CardFeatureHoverZoom is 1.03 (`:586`). Three factors in play: 1.03 · 1.05 ·
1.06. User, 2026-08-27: *"the big featured card has too much zoom on
hover, it's not relative to the others."* On a 1600px hero thumb 5% is 80px of
travel; on a 500px list thumb 6% is 30px — the hero reads as the big one.

## Ask

ONE zoom rule for the family — the DS picks the factor (1.03 or 1.06, not
three) and `ListingCard` (both sizes) uses that class/token instead of its own
`scale-105`; a hero-size thumb may want the smaller factor by rule since its
travel is 3× a list thumb's. If a `zoom` seam exists on `ContentCard`,
mirror it on `ListingCard`. No consumer change.

## Consumer state

`/stack` hero card passes nothing; on return it matches the list cards.

## ✅ RESOLUTION — 2026-08-27 · kol-content 0.10.1

ListingCard hero + default thumbs wear .kol-media-zoom — the content-card family's rule (1.06 / 600ms house ease, hover:hover only, reduced-motion opt-out) — the hero's own group-hover:scale-105 / 300ms is gone. Note the family's number is 1.06 / 600ms (ContentMedia), not the 1.03 / 300ms of CardFeatureItem the ticket cited; article cards were already on 1.06. Measured on the comparison page: ListingCard and ContentCard article both hover to matrix(1.06) over 0.6s.

**Remainder here:** none — kol-website bump kol-content 0.10.1; no consumer change.

