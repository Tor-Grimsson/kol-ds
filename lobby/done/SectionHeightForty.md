---
component: SectionHeightForty
source: kol-website/apps/web/src/components/sections/shared/ConnectCta.jsx#L1-L16 + routes/Studio.jsx#L60-L75
staged: 2026-08-27
status: draft
deps: [SectionCards, SectionFaq, SectionCta, SectionSplit, SectionHero]
---

# SectionHeightForty — add `40` to the section height ladder; change nothing else

## Purpose

The family's ladder is `60` · `80` · `full`, default `60` everywhere
(0.82.0 / 0.83.0). A page-foot CTA or a four-card band at a 60vh minimum is
a lot of air. User, 2026-08-27: add a rung below 60 — and keep it clean:
**same ladder, same default, on every section.** No per-section defaults.

## Ask

One new value in the shared `sectionHeights` map:

| value | min-height |
|---|---|
| `40` | 35svh / 40vh |

Available on every section that has `height` (hero included — one map, one
ladder). Default stays `60` on all of them. Nothing else moves.

## Consumer state

kol-website will pass `height="40"` where a band wants less air (page-foot
CTA, cards bands) once it ships; nothing passed today.

## ✅ RESOLUTION — 2026-08-27 · kol-component@0.84.0

`40` = 35svh / 40vh on the shared `sectionHeights` map and on `SectionHero`'s own two maps, so every section with `height` — hero (media + split), split, cards, FAQ, CTA — takes it. Default stays `60` everywhere; nothing else moves. Measured on the Section Set at 1000 tall: the 40 classes compute min-height 400 on the CTA and on the split hero.

**Remainder here:** none — kol-website bump kol-component 0.84.0; pass `height="40"` on the page-foot CTA and the cards bands that want less air.

