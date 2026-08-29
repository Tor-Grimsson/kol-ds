---
component: SectionHeroFootClearance
source: kol-website/apps/web/src/routes/Stack.jsx#L118-L175
staged: 2026-08-27
status: draft
deps: [SectionHero]
---

# SectionHeroFootClearance — `justify="end"` content must clear the `foot` overlap

## Purpose

Stack hero: `justify="end"` (text at the foot) + `foot` (the Featured card
riding the fold, `overlap` default 250). At 250 the card covers the lede —
the content's bottom padding is the fixed `pb-32 … xl:pb-56` ramp and knows
nothing about the foot rising 250px into the same space. kol-website cut
`overlap` to 120 as a workaround; live (the retired `StackHero`) had 250 with
the text lifted clear. User, 2026-08-27, dev vs live side by side: *"what is
the problem, why can't you make it the same?"*

## Ask

When `justify="end"` and a `foot` is present, the content's bottom inset =
the padding ramp **plus `overlap`** (`padding-bottom: calc(var(--pb) +
var(--kol-section-foot-overlap))`), so the text always sits above the card
regardless of the overlap value. Publish `overlap` as a custom property on the
section (`--kol-section-foot-overlap`) so the rule is one line. Default
`overlap` stays 250.

## Consumer state

Stack passes `overlap={120}` today only because of this; on return it drops
the prop (back to 250) and the lede clears the card.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.86.0

SectionHero justify=end + foot: the content's bottom inset is the pb ramp PLUS overlap — the ramp rides --kol-section-pb (8/10/12/14rem), overlap is published on the section as --kol-section-foot-overlap (0 without a foot), and the content padding is no longer the p-* shorthand (md:p-10 was winning the bottom back to 40px at 768-1023, before this change too). Measured on the showcase end demo at default overlap 250: padding-bottom 474 / 410 / 378 at 1280 / 900 / 390, the text clears the foot by exactly the ramp (224 / 160 / 128), foot rises 250 at every width.

**Remainder here:** none — kol-website bump kol-component 0.86.0; Stack.jsx drops overlap={120} (back to the 250 default) — the lede clears the Featured card.

