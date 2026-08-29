---
component: StackCardHover
source: kol-website/apps/web/src/routes/Stack.jsx#L78-L110 + apps/web/src/styles/ui.css (tail)
staged: 2026-08-27
status: draft
deps: [ListingCard (kol-content), ContentCard, ContentText, kol-theme]
---

# StackCardHover — hero-size thumb zooms 1.02; article card titles dim 70% on hover

## Purpose

Tuned locally on kol-website `/stack` first (user's order, 2026-08-27: get
the look right, then file), two values the DS cards don't carry:

1. **Hero-size thumb zoom = 1.02.** `ListingCard size="hero"` on
   `.kol-media-zoom` (kol-content 0.10.1) zooms 1.06 like every card — on a
   ~1500px thumb that's 90px of travel; the 500px list thumbs move 30px.
   User: *"that is TOO MUCH ZOOM."* 1.02 on the hero gives the same pixel
   travel as 1.06 on the list cards.
2. **Article card title dims to 70% on hover** (200ms), the way the hero
   `ListingCard` title already does (`group-hover:opacity-70`,
   `ListingCard.jsx:162`). `ContentCard variant="article"` dims nothing on
   hover today (only the media zooms), so hero and list cards hover
   differently side by side. User: *"shouldn't it also do it to the cards in
   the content filter?"* (And yes — this is opacity dimming; the user is
   fine with it for hover.)

The local rules, verbatim (`ui.css`):

```css
.stack-featured .group:hover .kol-media-zoom > img { transform: scale(1.02); }
.stack-article-title { transition: opacity 200ms ease; }
.stack-articles > *:hover .stack-article-title { opacity: 0.7; }
```

## Ask

1. `ListingCard size="hero"` (and any hero-size thumb) zooms 1.02 by rule —
   a hero rung on the media zoom, not the list rung.
2. `ContentCard` / `ContentRow` `article`: the title dims to 70% / 200ms on
   card hover, matching `ListingCard`. `ContentCard`'s root is not a
   Tailwind `group`, so it has to be a rule on the card root.

## Consumer state

Both rules live in kol-website's `ui.css` scoped to `.stack-featured` /
`.stack-articles`; they come out on return.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.61.0 · kol-component 0.90.2 · kol-content 0.10.2

Hero rung on the media zoom: .kol-media-zoom.is-hero scales 1.02 — ListingCard size=hero wears it, ContentMedia takes zoom="hero" (ContentCard passes it through); the default size stays 1.06. Title dim: ContentText stamps kol-content-title-dim on the article title in both forms; the theme dims it to 70% / 200ms on .kol-card / .kol-row hover (keyed off the card root, not any .group ancestor), reduced-motion opt-out. Measured on the comparison page: ContentCard article title 1 → 0.7 over 0.2s, ContentRow 0.7, the is-hero rule at matrix(1.02). Note: ContentCard's root IS a Tailwind group (kol-card group) — the rule is on the card root anyway.

**Remainder here:** none — kol-website bump kol-theme 0.61.0 + kol-component 0.90.2 + kol-content 0.10.2; delete the .stack-featured / .stack-articles rules and the stack-article-title hook from ui.css.

