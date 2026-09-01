# SectionFamilyFullBleed — `fullBleed` belongs to the section family, not two of its members

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — the `Section*` organisms
**Origin:** deferred out of `SectionNewsletterFullBleed` — *"the right question, and it binds eight organisms."* The user's answer is build it.

## The problem

`SectionHero` has `fullBleed`. `SectionNewsletter` has it as of 0.147.0, using
SectionHero's breakout literal character for character — which was the right call
and is exactly the point: the second organism to need it had to copy the first.

The other members of the family have no way to do it. Any of them can be a filled
surface, and a filled surface inside `.kol-page` has its colour clipped by the page
gutter on mobile — white strips down both sides of the fill. That is not a
newsletter problem, it is a filled-section problem, and it will be reported once
per organism until the prop is shared.

`.kol-full-bleed` is not the answer for organisms: it is container-relative, so on
one whose parent has no gutter it over-bleeds. kol-website hit exactly that on the
Instagram section this evening.

## The ask

Hoist `fullBleed` to the family — one prop, one breakout literal, one place to fix
it if the mechanism ever changes. Default `false` everywhere, so nothing moves for
any existing consumer.

If some organism should never bleed, that is worth stating in the family docs
rather than expressed by the prop being absent.

## Note on scope

This is a consistency change across eight organisms with a false default, so the
blast radius is wide but shallow — no consumer's rendering changes until it passes
the prop.

## Remainder here once it ships

bump; nothing to change at the call sites — kol-website already passes `fullBleed`
on the one organism that has it.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.149.0

Hoisted. One literal in sectionBleed.js; SectionHero, SectionSplit and SectionNewsletter now import it instead of each carrying their own copy, and SectionCards, SectionCta and SectionFaq gained the prop. Six organisms, one breakout, one place to change it. Default false everywhere and verified: all six render at their existing width with margin-left 0 and no page overflow, so nothing moves until a consumer passes it. You were right that the SectionNewsletter copy was the argument rather than the mistake — the second organism to need a thing had to duplicate the first, and the third would have too. On your note about an organism that should never bleed: none is excluded. Every member can be a filled surface, so every member can have its fill clipped by the gutter; a member that should not bleed is a decision for the page, not a prop this family withholds. And confirming your read on .kol-full-bleed — it is container-relative and over-bleeds in a parent with no gutter, which is why this is viewport-relative and does not care what it is nested in.

**Remainder here:** none — kol-website bump kol-component >=0.149.0; nothing to change at the call sites.

