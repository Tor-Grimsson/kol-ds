---
component: SectionNewsletterForm
source: kol-website/apps/web/src/components/sections/home/HomeSignup.jsx#L17-L30
staged: 2026-08-27
status: draft
deps: [SectionNewsletter, SectionText, Input]
---

# SectionNewsletterForm — the email field renders ~190px; and a `bodyClass` override crept in

## Purpose

`SectionNewsletter` (0.90.0) on kol-website `/stack` and Home: the email
`Input` renders about 190px wide beside the button — `NewsletterBand` gave it
~460px. The form wrapper carries `w-full sm:max-w-[400px] md:max-w-[520px]`
(`SectionNewsletter.jsx:127`) but the field inside doesn't fill it. User,
2026-08-27: *"the input is too short."*

Second thing, same file: `bodyClass="kol-mono-14 text-auto mx-auto
max-w-[64rem]"` (`:109`) is forced onto `SectionText` — the organism-side
override the set just removed from `SectionHero` (`SectionHeroNoOverrides`,
0.80.0). Same law: the organism renders the molecule bare; a measure cap is a
layout seam, not a type override.

## Ask

1. The `Input` fills the form wrapper (`width="100%"` / `w-full` on the
   field, wrapper keeps the 400/520 cap) — the field should read as the old
   ~460px at desktop.
2. Drop the `bodyClass` override; if the lede needs a measure, put it on the
   wrapper, not on `SectionText`'s body voice.

## Consumer state

`HomeSignup.jsx` passes headline · body · placeholder · submitLabel ·
onSubmit · `className="bg-fg-04"`; no change on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.90.1

The form is w-full: SectionText centres its children as flex items, so the form shrink-wrapped and the Input's w-full had nothing to fill (~190px intrinsic). The field's shell now reads 520 at 1400 and 900, 390 (full width) at 390. bodyClass override dropped — the lede renders bare kol-section-text-body; the 64rem measure sits on a wrapper inside the family cap.

**Remainder here:** none — kol-website bump kol-component 0.90.1; no consumer change.

