# Brand apps structure — a home over brand sections and brand-lab

**Staged:** 2026-10-27 · from a kol-hq session
**Change:** rename one app, add a home
**Flag:** 🔴 needs-ruling — his call before building.
**Plan:** `~/dev/projects/kol-hq/.kol/llm-plan/02-estate-split.md`

---

## The problem, in one case

`apps/brand` routes to 5 pages behind the rail but has no home. `apps/brand-lab` (the tools) is separate. It reads as messy.

## The fix

His idea: rename `apps/brand` to `apps/brand-sections`; a new `apps/brand` is the home over brand sections and brand-lab. Needs his ruling before building.

## Definition of done

- [ ] user ruled on the structure
- [ ] built as ruled

## RULING — 2026-10-27

The user ruled YES (relayed by kol-hq): rename `apps/brand` → `apps/brand-sections`; a new `apps/brand` is the home over brand-sections and brand-lab.

## ✅ RESOLUTION — 2026-10-27 · kol-ds-ui apps/brand · apps/brand-sections (no package)

Built as ruled 2026-10-27. apps/brand → apps/brand-sections (pnpm brand-sections, 5207, /apps/brand-sections, its own manifest and vercel rewrite; nothing in it changed but the name). The new apps/brand (pnpm brand, 5179, /apps/brand) is the home: kol-framework's SiteLayout with the site rail and the sites' wash, a Home of two cards (Sections, Lab), and a rail row per app that hands over to it. Showcase Apps page and docs/operations/07-apps-tier/INDEX.md updated.

**Remainder here:** none — kol-hq none.

