---
component: SectionCtaEditorial
source: kol-website/apps/web/src/components/sections/shared/ConnectCta.jsx#L1-L16
staged: 2026-08-26
status: draft
deps: [SectionCta, SectionText]
---

# SectionCtaEditorial — cap the editorial CTA and put its row labels on the eyebrow voice

## Purpose

User, 2026-08-26, on the `/ CONNECT` band (`SectionCta variant="editorial"`,
every kol-website page foot): *"cta its full width. I would cap it at 1800 or
1600, I would also use the eyebrow style for 'working on project' and
'contact'."*

Today (`SectionCta.jsx:67-75`): the editorial section is `w-full bg-auto`
with no inner cap — the wordmark hugs the left viewport edge and the rows the
right, hollow middle at 2000px. The row labels (`promptLabel`,
`contactLabel`) are `text-auto kol-helper-16` — a different voice from the
set's eyebrow (`kol-helper-12 text-meta`, ruled 0.76.2).

## Ask

1. **Inner cap 1600px**, centred (`max-w-[1600px] mx-auto` on the inner
   grid; the section keeps its full-width surface). The centered variant
   already caps at 900.
2. **Row labels = the set eyebrow** — `labelClass` on the two rows becomes the
   `SectionText` default (`kol-helper-12 text-meta`, uppercase by role), same
   as every other label in the set. One eyebrow voice, as ruled in
   `SectionTextLabelVoice`.

## Consumer state

`ConnectCta.jsx` passes eyebrow `/ CONNECT` · `WORKING ON A PROJECT?` ·
`SEND A MESSAGE` · `CONTACT` · `hello@kolkrabbi.io` and nothing else. No change
here on return.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.76.4

`SectionCta` editorial: the inner grid is `max-w-[1600px] mx-auto` — the surface stays full width, the wordmark and the rows stop hugging the viewport edges (measured at 2000: section 2000 wide, inner 1600, centred). `promptLabel` / `contactLabel` drop their `text-auto kol-helper-16` for the SectionText default — helper-12 · meta · uppercase by role — so the band wears the one eyebrow the set has.

**Remainder here:** none — kol-website bump kol-component 0.76.4; ConnectCta needs nothing.

