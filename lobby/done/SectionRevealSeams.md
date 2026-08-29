---
component: SectionRevealSeams
source: kol-website/apps/web/src/styles/animations.css#L8-L30 + _tmp/2026-08-12-chrome-fork-retirement/FeaturesCardSection-local-fork.jsx#L99-L116 + _tmp/2026-08-15-anatomy-adoption/ArticleHeader.jsx#L92-L157 + _tmp/2026-08-26-sectionhero-round2/StackHero.jsx#L51-L52
staged: 2026-08-26
status: draft
deps: [SectionCards, SectionCardItem, SectionText, SectionHero, SectionSplit, SectionFaq, ArticleHeader (kol-content)]
---

# SectionRevealSeams — per-element class seams so the consumer's reveal system can stamp the set

## Purpose

kol-website runs a page-level entrance system: `.reveal` (fade + 24px rise on
`--kol-ease-house`, `--reveal-delay` per element, `.is-visible` flipped by one
IntersectionObserver in `App.jsx`). It stays app-side — ruled 2026-08-26, not
DS motion. Every DS adoption since 08-12 silently cut it, because the organisms
expose no per-element class/style seam:

| swap | cut | surfaces |
|---|---|---|
| 08-12 cards fork → `SectionCards` | per-card `reveal` + `--reveal-delay: index × 0.15s`; `reveal-group` on the actions row | Home · Studio · foundry in-development |
| 08-15 local → kol-content `ArticleHeader` | 7 staggered parts: tags 0s · title 0.1s · meta 0.2s · lede 0.25s · cover 0.3s | every Stack article |
| 08-15 split → `FeatureSplit` | the section reveal | Studio process |
| 08-15 HomeFoundry → `FeatureSplit` | per-element stagger → one block (`columnClassName="reveal"`) | Home foundry |
| 08-26 `StackHero` → `SectionHero` | title 0.2s · lede 0.3s | Stack hero |

User: *"how many reveal animations have been CUT due to this kind of DS
local/bypassing?"* — six surfaces, one degraded.

## Ask — seams, not motion

1. **`SectionCards`**: `itemClassName` (string) and `itemStyle(index)` (or
   `itemProps(index) → { className, style }`) applied to each `SectionCardItem`;
   `actionsClassName` already exists — keep.
2. **`SectionCardItem`**: accepts `className` + `style` and spreads them on
   its root (today it takes neither).
3. **`SectionText`**: `headlineClass` beside the existing `labelClass` /
   `bodyClass` / `actionsClass`, plus a `slotStyle` map (or per-slot `style`)
   so a consumer can put `--reveal-delay` on label / headline / body / actions
   separately. The organisms (`SectionHero` · `SectionSplit` · `SectionFaq` ·
   `SectionCards` header · `SectionCta`) forward them.
4. **kol-content `ArticleHeader`**: `partClassName` / `partStyle` keyed by
   `tags` · `title` · `meta` · `excerpt` · `hero` (same idea).

Nothing animates in the DS. A consumer with no reveal system passes nothing
and sees today's render.

## Remainder (kol-website, on return)

Re-stamp from the old delays: Home / Studio / in-development cards
(`index × 0.15s`), Stack article header (0 / 0.1 / 0.2 / 0.25 / 0.3), Studio
process split, Stack hero (0.2 / 0.3), Home foundry per-element.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.79.0 · kol-content@0.9.3

Seams, not motion — nothing animates in the DS. `SectionText` takes `slotClass` / `slotStyle` maps keyed `label · headline · body · actions`, forwarded by `SectionHero` (all three routes), `SectionSplit`, `SectionFaq`, `SectionCta` (every row / the centred block) and the `SectionCards` header; `SectionCards` takes `itemClassName` + `itemStyle` (an object or `(index) => style`) onto each card and forwards them; `SectionCardItem` accepts `className` + `style` on its root (all three root forms). kol-content `ArticleHeader` takes `partClassName` / `partStyle` keyed `tags · title · meta · excerpt · hero`. A consumer with no reveal system passes nothing and sees today's render — the Section Set measured unchanged. Reference pages carry the rows.

**Remainder here:** none — kol-website bump kol-component 0.79.0 + kol-content 0.9.3, re-stamp: cards `itemClassName="reveal" itemStyle={(i) => ({ "--reveal-delay": `${i * 0.15}s` })}` (Home · Studio · in-development), Stack header `partClassName={{ tags: "reveal", … }}` + delays 0 / 0.1 / 0.2 / 0.25 / 0.3, Studio process split + Home foundry `slotClass` / `slotStyle`, Stack hero `slotStyle={{ headline: { "--reveal-delay": "0.2s" }, body: { "--reveal-delay": "0.3s" } }}`.

