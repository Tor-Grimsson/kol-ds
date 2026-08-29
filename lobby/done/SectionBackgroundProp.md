---
component: SectionBackgroundProp
source: kol-component/src/organisms/{SectionHero,SectionSplit,SectionCards,SectionCta,SectionFaq,SectionNewsletter}.jsx — surfaces painted by class, no prop
staged: 2026-08-27
status: draft
deps: [SectionHero, SectionSplit, SectionCards, SectionCta, SectionFaq, SectionNewsletter, SectionText, kol-theme]
---

# SectionBackgroundProp — every section in the family takes its background as a prop

## Purpose

User (2026-08-27): *"ALL section family should pass bg as props."* Today the
surface is either hardcoded (`SectionCta` `bg-auto`, `SectionNewsletter`
`bg-surface-primary` when `theme` is set) or absent, and a page that wants
another one — or none — goes through `className` (`HomeSignup`:
`className="bg-fg-absolute-16"`; `/work`'s CTA: `className="bg-transparent"`,
which only wins on cascade order). `theme` (`inverse`/`light`/`dark`) is a
scope flip, not a surface switch.

## Ask

One prop across the family — `SectionHero` · `SectionSplit` · `SectionCards`
· `SectionCta` · `SectionFaq` · `SectionNewsletter`:

- `background` — a surface: `'primary' | 'secondary' | 'tertiary' | 'inverse' | 'none'`, or a raw utility/token string for the odd case (`'bg-fg-absolute-16'`). `'none'` paints nothing.
- Each section's default = what it paints today, so nothing moves on the bump (`SectionCta` → `auto`, `SectionNewsletter` → none / `primary` under `theme`, the rest none).
- The surface is the section root's; `theme` keeps scoping ink. `className` stays what it was — no longer the way to set a background.

## Recreation notes

- kol-component; one `SURFACES` map shared by the six, spelled in tokens.
- Bar for 🟢: `/work`'s CTA renders `<ConnectCta background="none">` → no
  surface; `HomeSignup` passes `background="bg-fg-absolute-16"` (or a named
  rung) and renders as today.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.103.0

background on all six sections through one SURFACES map (primary · secondary · tertiary · inverse · auto · none, or a raw utility / token string); defaults = what each painted before (Cta auto; hero / cards / newsletter primary under theme else none; split / faq none). Verified in source only (no server run, by your rule): every section root reads surfaceClass(background, …); all 21 gates clean.

**Remainder here:** none — kol-website bump kol-component 0.103.0; /work's CTA background="none", HomeSignup background="bg-fg-absolute-16"; drop the className surfaces.

