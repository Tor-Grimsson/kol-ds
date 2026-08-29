---
component: ListingCardThumbBorder
source: kol-website/apps/web/src/routes/Stack.jsx#L155-L175
staged: 2026-08-27
status: draft
deps: [ListingCard (kol-content), ContentCard]
---

# ListingCardThumbBorder — the thumb hairline is hardcoded; no way off it

## Purpose

`ListingCard` (kol-content) draws `border border-fg-08` around its thumbnail
in both sizes (`ListingCard.jsx:139` hero, `:195` default) with no prop. The
`/stack` featured card (`size="hero"`, riding the hero's fold) shows the line
and the consumer cannot remove it. User, 2026-08-27: *"I hate border —
remove border."* `ContentCard` already exposes this as `frame` (`article`
frames by default, `frame={false}` opts out); `ListingCard` never got the
seam.

## Ask

`frame` on `ListingCard` (both sizes), same contract as `ContentCard`:
`false` drops the thumb's border (bg stays). And the user's ruling for the
family: **the article thumb frame defaults OFF** — on `ContentCard
variant="article"` too — the hairline is opt-in, not the rule.

## Consumer state

`/stack` list cards pass `frame={false}` on `ContentCard` today; the hero
`ListingCard` waits on this.

## ✅ RESOLUTION — 2026-08-27 · kol-content 0.10.0 · kol-component 0.88.0

ListingCard takes frame (default false) on the hero and default sizes — the hardcoded border border-fg-08 is gone, the bg-fg-04 tint stays, hero keeps its fg-16 hover step when frame is on; same contract as ContentCard's frame. And the ruling: ContentCard variant=article no longer frames its media by default — frame opts the hairline in. Measured on the comparison page, article variant: ListingCard thumb border 0 with the tint kept, ContentCard media border 0.

**Remainder here:** none — kol-website bump kol-content 0.10.0 + kol-component 0.88.0; the /stack hero ListingCard needs no prop (frame defaults off) and the list cards can drop frame={false}.

