---
component: FeaturedCarouselFullWidth
source: kol-website/apps/web/src/routes/Studio.jsx#L57-L79
staged: 2026-08-26
status: draft
deps: [FeaturedCarousel, kol-framework.css]
---

# FeaturedCarouselFullWidth — `fullWidth` never widens the slides; neighbours peek in

## Purpose

kolkrabbi.io/studio hero: `FeaturedCarousel` with two HLS-video items,
`fullWidth`, `rounded={false}`, `height="h-[calc(100vh-3.5rem)] …"`. The user
sees **two videos at once** — the active slide plus the next one peeking on
both sides.

## Root cause (read 2026-08-26)

`packages/framework/kol-framework.css:497-504`:

```css
.kol-embla-slide { flex: 0 0 auto; width: clamp(260px, 32vw, 420px); }
.kol-embla.is-slides .kol-embla-slide { width: clamp(320px, 72vw, 900px); }
```

`FeaturedCarousel` always renders `.kol-embla.is-slides` and `align: 'center'`.
`fullWidth` (`FeaturedCarousel.jsx:226`) only drops the section's `py-16` — the
slide stays `clamp(320px, 72vw, 900px)`. At 1440 the slide is 900px wide in a
1440px viewport, so the neighbours show 270px each side; every slide's `<video>`
autoplays regardless of `active`.

## Ask

`fullWidth` means the slide fills the viewport: `.kol-featured-carousel.is-full
.kol-embla-slide { width: 100% }` (or a `slideWidth` prop with `'peek' |
'full'`, default `peek` so nothing existing moves). Inactive video slides
should not autoplay while off-stage — `active` is already computed per slide.

## Consumer note

No stopgap applied in kol-website; Studio's hero moves to `SectionHero`
(`SectionSet`) on return, but the defect stands for any `fullWidth` consumer
(`FoundryTypefaces` is the other call site).

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.25.0 · kol-component@0.70.0

`fullWidth` now fills the container: `.kol-featured-carousel.is-full .kol-embla-slide { width: 100% }` in kol-framework.css (the peek `clamp(320px, 72vw, 900px)` stays the default — nothing existing moves), and `FeaturedCarousel` stamps `is-full` on the section when `fullWidth` is set. Inactive video slides no longer play: the plain `<video>` and `HlsVideo` autoplay only while their slide is the selected one and pause when it leaves the stage (`HlsVideo` gains `active`, default true). Measured headless in the showcase at 1440: peek slide 900 in a 734 container; with `is-full` the slide is 734 = the container. No console errors.

**Remainder here:** none — kol-website bump kol-framework to 0.25.0 + kol-component to 0.70.0; Studio and FoundryTypefaces render one slide at a time with no change at the call sites.

