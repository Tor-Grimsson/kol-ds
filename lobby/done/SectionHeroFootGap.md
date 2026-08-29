---
component: SectionHeroFootGap
source: kol-website/apps/web/src/routes/Stack.jsx#L118-L160
staged: 2026-08-27
status: draft
deps: [SectionHero]
---

# SectionHeroFootGap — end-justified text sits too far above the foot; the right gap is ~50px, not the padding ramp

## Purpose

`SectionHeroFootClearance` (0.86.0) made the content's bottom inset = padding
ramp **plus** `overlap` — so with the default 250 overlap and the xl ramp of
224 the text floats ~474px above the hero's foot, mid-hero. Live (the retired
`StackHero`) sat the lede ~50px above the card. Tuned locally on `/stack`
(user's order: get it right here first): the text panel is pushed down
`translate-y-24 md:translate-y-44` (96 / 176px) — i.e. the correct inset is
**overlap + ~50px**, not overlap + the ramp.

## Ask

When `justify="end"` and a `foot` is present, the content's bottom inset =
`overlap` + one small gap (the DS picks the token — the local tune says ~48px
at desktop, ~32 on phones), **not** overlap + the section padding ramp. The
ramp still applies when there is no foot. Measured target on `/stack` at
1235 tall, hero 90vh, overlap 250: lede baseline ≈ 50px above the card's top
edge.

## Consumer state

`Stack.jsx` carries the `translate-y-*` on its `SectionText` panel; it comes
off on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.92.0

justify=end with a foot: the content's bottom inset is overlap + 32px (48 from md), not overlap + the padding ramp; without a foot the ramp applies as before. Measured on the demo at default overlap 250: text bottom 48px above the foot at 1280 and 900, 32 at 390; foot rises 250 at every width.

**Remainder here:** none — kol-website bump kol-component 0.92.0; Stack.jsx drops the translate-y-24 md:translate-y-44 on its SectionText panel.

