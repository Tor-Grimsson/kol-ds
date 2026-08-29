---
component: WorkCardAndShelf
source: kol-website/apps/web/src/routes/Work.jsx (`WorkCard` function + the `ParallaxShelf renderCard`) + styles/ui.css `.work-shelf p.kol-helper-12`
staged: 2026-08-27
status: draft
deps: [ContentCard, ContentText, ParallaxShelf, WorkCard, kol-theme]
---

# WorkCardAndShelf — the work card's ruled values, and the shelf renders it

Ruled on kol-website `/work` GRID + shelf (2026-08-27), one card for both.
Three asks across two packages.

## 1. `ContentCard work` — ruled values (kol-component)

| slot | shipped (0.102) | ruled |
|---|---|---|
| title | `kol-sans-display-03 text-fg-inverse` | same voice/ink, **one line — `truncate`** (the site passes its face `work-display-title text-4xl lg:text-5xl` as `titleClass`; the truncation is the card's) |
| meta | `kol-mono-12 text-fg-inverse-64` | **`kol-helper-12 uppercase text-fg-inverse-80`** |
| meta content | consumer | `client ?? type label · year` — the retired `WorkCard`'s rule, the consumer passes the string |

## 2. `ParallaxShelf` renders `ContentCard work` (kol-content)

The shelf's default card is kol-content's `WorkCard`; the grid is `ContentCard
work`. The user: *"it should be using the same card with 3 height sizes."*
Ask: `ParallaxShelf` renders `ContentCard work` by default on `WorkCard`'s
ragged ladder — `flex-none w-[280px] md:w-[400px]` × `['h-[408px] md:h-[560px]',
'h-[372px] md:h-[520px]', 'h-[336px] md:h-[480px]']` by `index % 3` — with the
title/meta seams forwarded; **`WorkCard` retires**. Local today via
`renderCard`.

## 3. The shelf's edge caption is the eyebrow (kol-content)

`ParallaxShelf.jsx:141` hardcodes `<p className="kol-helper-12 text-auto">` with
no seam. Ruled: the caption is `kol-eyebrow` (mono 12 / 500 / 0.06em /
uppercase / fg-64). Local rule until then:
`.work-shelf p.kol-helper-12 { text-transform: uppercase; letter-spacing: 0.06em; color: var(--kol-fg-64); }`

## Recreation notes

- Bar for 🟢: `/work` renders `<ParallaxShelf … />` with no `renderCard` and
  `<ContentCard variant="work" title meta media href onNavigate titleClass={face}>`
  with nothing else — one-line title, uppercase helper meta at inverse 80,
  eyebrow captions; the site's `.work-shelf` rule deleted.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.102.3 · kol-content 0.11.0

(1) ContentCard work: title one line (truncate), meta kol-helper-12 uppercase text-fg-inverse-80; the consumer passes the meta string. (2) ParallaxShelf renders ContentCard work by default on WorkCard's ladder (w-[280px] md:w-[400px] × 408/560 · 372/520 · 336/480 by index % 3), meta client ?? type label · year composed from the item, titleClass / metaClass / heights forwarded, renderCard still the seam; WorkCard no longer imported (stays exported, on the ledger). (3) the edge caption is kol-eyebrow text-fg-64. Verified in source only (no server run, by your rule); measure /work on the bump.

**Remainder here:** none — kol-website bump kol-component 0.102.3 + kol-content 0.11.0; drop renderCard on the shelf (pass titleClass={face}); the grid card passes title meta media href onNavigate titleClass only; delete .work-shelf p.kol-helper-12.

