# Ship kol-studio's PDF tools through the DS

**Staged:** 2026-10-27 · from a kol-hq session
**Change:** new package or app — size set by the ruling
**Flag:** 🔴 needs-ruling — his call before building.
**Plan:** `~/dev/projects/kol-hq/.kol/llm-plan/02-estate-split.md`

---

## The problem, in one case

kol-studio renders markdown onto A4 pages and prints them through Chrome, waiting on fonts first (`kol-studio/app/scripts/render-pdf.mjs`, `render-svg.mjs`, `src/pages/A4Page.jsx`). Other repos may want it; `/kol-print` also makes PDF and DOCX separately.

## The fix

Decide where it lands (a package, `apps/md-pdf`, …) and how `/kol-print` relates, then move and refine. `@kolkrabbi/kol-markdown` is the parser to build on.

## Definition of done

- [ ] user ruled on where it lives and the kol-print relation
- [ ] PDF output matches kol-studio's current kit PDFs
