---
component: SectionNewsletter
source: kol-website/apps/web/src/components/sections/home/HomeSignup.jsx#L1-L40
staged: 2026-08-27
status: draft
deps: [NewsletterBand, SectionText, SectionCta, sectionHeights]
---

# SectionNewsletter — the newsletter card joins the section family

## Purpose

`NewsletterBand` is the one section-shaped card still outside the set (the
SectionSet return, 0.71.0, listed it as "not folded, follow-up" — never
filed). It carries its own hardcoded `max-w-[1400px]` and `py-24`, no height
rung, no `theme`, no vertical-centring rule — on `/stack` and Home the form
sits under its top padding in a taller section. User, 2026-08-27: the
newsletter as a card in the family — same ladder, same cap, content centred
on y — not its own thing.

## Ask

`SectionNewsletter`:

- `SectionText` (`label · headline · body`, `align="center"`) with the email
  form (`Input` + `Button`, `placeholder` · `submitLabel` · `onSubmit` ·
  `successCopy` · `errorCopy` — today's `NewsletterBand` contract) in the
  text's `children` slot;
- the shared container cap (`--kol-container-max`), the height ladder
  (`height`, default `60`, content vertically centred), `theme` like the
  other sections, `slotClass` / `slotStyle` for the reveal;
- `NewsletterBand` becomes a deprecated alias with its props mapped
  (`title` → `headline`, `description` → `body`); retirements row.

## Consumer state

`HomeSignup.jsx` (used on Home and `/stack`) passes title · description ·
placeholder · submitLabel · onSubmit; on return it renames the two text props
and nothing else.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.90.0

SectionNewsletter: SectionText (label · headline · body, centred) with the email form (Input + Button + aria-live status line) in its children slot, on the family's height ladder (height, default 60, content vertically centred), the shared --kol-container-max cap, theme, slotClass/slotStyle. NewsletterBand is a deprecated alias (title → headline, description → body, everything else passes through), on the retirement ledger; the showcase set, demo, mdx and inventory carry it. Measured on the section set: min-height 600 at 1400×1000 / 500 at 390, content centred at 0px offset, cap 1600, eyebrow uppercase, headline display-01; demo submit shows the success line.

**Remainder here:** none — kol-website bump kol-component 0.90.0; HomeSignup.jsx: NewsletterBand → SectionNewsletter, title → headline, description → body, nothing else.

