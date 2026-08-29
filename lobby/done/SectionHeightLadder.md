---
component: SectionHeightLadder
source: kol-website/apps/web/src/routes/Studio.jsx#L60-L75 + routes/foundry/FoundryLicensing.jsx + components/sections/shared/ConnectCta.jsx
staged: 2026-08-27
status: draft
deps: [SectionCards, SectionFaq, SectionCta, SectionSplit, SectionHero]
---

# SectionHeightLadder — the same `height` ladder on cards · faq · cta

## Purpose

`SectionSplitHeight` was widened on 2026-08-27 to the whole set (user: *"does
that sound consistent?"* — no) but returned as `SectionSplit` only
(0.82.0). This is the rest of it: **`SectionCards` · `SectionFaq` ·
`SectionCta`** still size to content + padding while hero and split stand on
the ladder.

## Ask

`height` as **min-height** on the three, identical to the split's:

| value | min-height |
|---|---|
| `full` | 100dvh |
| `80` | 70svh / 80vh |
| `60` | 50svh / 60vh — **default** |

Literal class strings, content vertically centred inside the min-height,
padding inside. Same BREAKING flag as 0.82.0 — a section that passes nothing
now stands at least 60vh.

## Consumer state

kol-website passes nothing on any of them; cards bands (Home, Studio,
foundry in-development), licensing FAQ, every page-foot CTA take the default.

## ✅ RESOLUTION — 2026-08-27 · kol-component@0.83.0

`height` on `SectionCards` · `SectionFaq` · `SectionCta` — min-height on the family's ladder, identical to split and hero: `full` = 100dvh, `80` = 70svh / 80vh, `60` = 50svh / 60vh, the default; one shared `sectionHeights` map, literal strings; each section is a flex column so its content stays vertically centred and the padding sits inside. Measured on the Section Set at 1000 tall, nothing passed: split · cards · CTA · FAQ all compute min-height 600 and the three content-light ones stand at exactly 600, centred. BREAKING-flagged: a section that passes nothing now stands at least 60vh.

**Remainder here:** none — kol-website bump kol-component 0.83.0; nothing to pass — every cards band, the licensing FAQ and every page-foot CTA take the default.

