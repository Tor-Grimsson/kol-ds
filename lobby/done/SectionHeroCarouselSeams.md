---
component: SectionHeroCarouselSeams
source: kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx#L150-L217
staged: 2026-08-26
status: draft
deps: [SectionHero, FeaturedCarousel]
---

# SectionHeroCarouselSeams — the carousel branch drops three seams the foundry index needs

## Purpose

`SectionHeroRound2` (0.76.0) made `media=[…]` the carousel and deprecated
`FeaturedCarousel` as a consumer import. Adopting it on the foundry index
(`/foundry`) blocked: `SectionHero.jsx:196-213` forwards `items` · `height` ·
`autoPlay` · `autoPlayInterval` · `navPosition` · `children` and nothing else.
The foundry carousel passes three more that `FeaturedCarousel` honours:

| seam | what the foundry index does with it |
|---|---|
| `renderTitle(item)` | each slide's title set in the typeface's own font + a per-name size ramp (`fontFamily` / `fontStyle` ride the item) |
| `ctaLabel` | "Explore Typeface" on every slide |
| `onNavigate(href, e)` | SPA navigation for the CTA (`e.preventDefault(); navigate(href)`) |

Without them the titles render in the sans, the CTA says "Learn more", and
the link hard-navigates.

## Ask

Forward `renderTitle`, `ctaLabel`, `onNavigate` (and `showTitle` /
`showDescription` / `showCta` if cheap) from `SectionHero` to the carousel
engine when `media` is an array. Or spread the rest props — the hero is the
carousel's "one home", so its call-site contract has to be complete.

## Consumer state

`/foundry` stays on the deprecated `FeaturedCarousel` import
(`height="h-[80vh]"`) until this ships; every other hero on the site is on
`SectionHero`.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.76.1

`SectionHero` forwards every FeaturedCarousel seam when `media` is an array: `renderTitle`, `ctaLabel`, `onNavigate`, `showTitle` / `showDescription` / `showCta`, `titleClassName`, `descriptionClassName`, `options` — passed only when set, so the engine's defaults hold otherwise. Measured on the showcase carousel demo: `renderTitle` renders the slide title in its own class (italic, display-02), the CTA reads the `ctaLabel` copy, and the anchor keeps its href for `onNavigate` to intercept. Reference page row added.

**Remainder here:** none — kol-website bump kol-component 0.76.1; `/foundry` → `SectionHero media={[…]} height="80" autoPlay renderTitle={…} ctaLabel="Explore Typeface" onNavigate={…}` and drop the FeaturedCarousel import.

