# SectionNewsletterMobileFoot — 96px of dead space below the Subscribe button

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionNewsletter`
**Origin:** user's mobile shot of kol-website `/` — an empty band under the subscribe control, reported as "large empty area".

## The problem

Measured on production `/`, 390 wide, at true 1× (page `scrollWidth == innerWidth == 390`, so this
is not the iOS-zoom artefact that inflated other readings in the same review):

```
section  .kol-section-newsletter w-screen ml-[calc(50%-50vw)]   height 516px
Subscribe button bottom → section bottom                          96px
```

96px of empty ground below the last control, roughly a fifth of the band, on the viewport where
vertical room is scarcest. The band already went full-bleed and got its `lg` controls in the
2026-08-31 wave (`SectionNewsletterFullBleed`, `SectionNewsletterControlSize`,
`SectionNewsletterMobileMeasure`) — the foot is what those did not reach.

## The ask

Trim the foot on the stacked layout so the band ends near its last control. If the 96px is a
deliberate rung shared with the desktop composition, it wants a mobile value rather than removal.

## Remainder here once it ships

bump; `/` passes nothing here today and should still pass nothing.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

py-16 md:py-24 — the flat py-24 was the family outlier holding a desktop constant; SectionFaq and SectionSplit already carry the 16/24 rung. The band now ends 64px after Subscribe at 390 instead of 96 (symmetric — the head trims with it). Desktop unmoved.

**Remainder here:** none — kol-website bump kol-component@0.150.0; / passes nothing and should still pass nothing.

