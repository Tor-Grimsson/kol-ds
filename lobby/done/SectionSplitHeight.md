---
component: SectionSplitHeight
source: kol-website/apps/web/src/components/sections/studio/StudioProcessCard.jsx#L1-L38
staged: 2026-08-27
status: draft
deps: [SectionSplit, SectionCards, SectionFaq, SectionCta, SectionHero]
---

# SectionSplitHeight — one `height` ladder on EVERY section, not just the hero

## Purpose

`SectionSplit` (0.81.0) has no `height` prop — the section is content plus
`py-16 md:py-24 lg:py-32`, and the media `ratio` (4/5) decides most of it.
Beside a `SectionHero` on a preset tier, the Studio process split reads as an
arbitrary height. User, 2026-08-27: *"we need to set some sizes."*

## Ask — widened 2026-08-27 (user: "does that sound consistent?" — no)

Only `SectionHero` sizes; split, cards, FAQ and CTA are content + padding.
One family, one ladder: `height` on **`SectionSplit` · `SectionCards` ·
`SectionFaq` · `SectionCta`**, as **min-height** (content may still grow; the
two columns stay vertically centred, as today):

| value | min-height |
|---|---|
| `full` | 100dvh |
| `80` | 70svh / 80vh |
| `60` | 50svh / 60vh — **default** |

Same three names as `SectionHero`'s presets so the whole family speaks one
height ladder, hero included — literal class strings (the `SPLIT_HEIGHTS` lesson: no runtime
rewrite). The padding stays; it sits inside the min-height.

## Consumer state

Every section on kol-website gets the default (`60`) with nothing passed —
Studio process split, Home foundry split, the cards bands, licensing FAQ, the
page-foot CTA. No call-site change on return unless a page wants `80`.

## ✅ RESOLUTION — 2026-08-27 · kol-component@0.82.0

`SectionSplit height` — min-height on the family's ladder, the same three names as `SectionHero`: `full` = 100dvh, `80` = 70svh / 80vh, `60` = 50svh / 60vh, the default. Literal class strings, no runtime rewrite; the section is a flex column so the two columns stay vertically centred inside the min-height and the padding sits inside it. Measured on the Section Set at 1000 tall: computed min-height 600 / 800 / 1000 for 60 / 80 / full; the inner grid centred. BREAKING-flagged: every split that passes nothing now stands at least 60vh.

**Remainder here:** none — kol-website bump kol-component 0.82.0; Studio process split and Home foundry split take the default — pass `height="80"` where a page wants more.

