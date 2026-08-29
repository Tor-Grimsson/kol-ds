---
component: ContentFiltersTitleGap
source: kol-website/apps/web/src/routes/Stack.jsx#L186-L200
staged: 2026-08-27
status: draft
deps: [ContentFilters, IconFrame, Divider]
---

# ContentFiltersTitleGap — the divider reads off-centre between the title and the icon frames

## Purpose

`ContentFilters` header row: title · vertical `Divider` · two `IconFrame
size="md"` (32px boxes round 16px glyphs), all on `gap-6`. The divider sits
24px from the title's text edge but 24px from the icon *box* — 32px from the
glyph — so it reads pushed toward the title. Tuned locally on `/stack`
(user, 2026-08-27): `titleClassName="kol-helper-14 pr-4"` — 16px on the
title's right balances the 8px-per-side air the frames carry.

## Ask

The title side carries that air by rule — 16px right padding on the title
(or the divider centred by an equal inset on both sides), so every consumer's
bar reads centred without passing a class. `titleClassName` stays a seam.

## Consumer state

`/stack` passes `pr-4` in `titleClassName`; drops it on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.93.1

The header title carries pr-4 by rule — 16px of right air on the title side, titleClassName untouched. Measured on the content-filters set: title text → divider 40px (24 gap + 16), divider → icon glyph 32, divider → frame 24 — the /stack tune, for every consumer.

**Remainder here:** none — kol-website bump kol-component 0.93.1; Stack drops the pr-4 from titleClassName.

