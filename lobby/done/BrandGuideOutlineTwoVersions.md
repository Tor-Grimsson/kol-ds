# Brand guide outline in two versions — blank placeholders and VOYAGER

**Staged:** 2026-10-27 · from a kol-hq session
**Change:** one chapter structure, two data sets
**Plan:** `~/dev/projects/kol-hq/.kol/llm-plan/02-estate-split.md`

---

## The problem, in one case

The brand guide outline lives in kol-branding (`/template/general`). The DS has a brand section and `kol-brand-template` but not this outline.

## The fix

Take the outline from kol-branding `src/App.jsx` `template/general` (`TEMPLATE_SECTIONS`, `TEMPLATE_STRUCTURE`). Version 1: `[client-name]` and `[input]` placeholders. Version 2: filled with VOYAGER (`apps/voyager-fixture`), not a new brand.

## Definition of done

- [ ] blank version renders with placeholders
- [ ] VOYAGER version renders from the same chapter structure

## ✅ RESOLUTION — 2026-10-27 · kol-brand-template@0.4.0 · kol-styleguide@0.8.0

The outline is kol-brand-template 0.4.0: GUIDE_SECTIONS (kol-branding's TEMPLATE_SECTIONS, the research citations left there) and GUIDE_TEMPLATE (its book copy on a blank manifest — [client-name] for the name, [input] for every value; also at ./guide). kol-styleguide 0.8.0 renders it: BrandGuide({ brand, sections, logoSources, structure }), kol-branding's guide renderer carried, with guideSections · guideToc. A client fills it by passing its own manifest with a book keyed the same. Both versions render in apps/brand-hub: /guide/blank and /guide/voyager (voyager-fixture's VOYAGER_GUIDE). Docs: 04-compositions/10-styleguide-system.md § Guide, 05-brand/02-packages.md.

**Remainder here:** none — kol-hq none here — kol-atlas builds its guide on these (atlas-brand-guide).

