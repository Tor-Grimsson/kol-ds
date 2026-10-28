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


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-print 0.1.0 · kol-styleguide 0.14.0 · kol-theme 0.196.0** (his go 2026-10-28 on the plan: one engine, its app, a page tool).
- **`@kolkrabbi/kol-print`** (engine tier): the dotfiles `/kol-print` pipeline moved in — flow, pagination, the A4 sheets, PDF (headless Chrome or the browser's print), DOCX (`docx`), MD, and the `kol-print` CLI. Proved against the dotfiles tool: PDFs pixel-identical, DOCX body and MD identical. The studio's details are the caller's (`--studio`) — the old `studio.json` carried a kennitala and a phone number, which a public package must not ship.
- **`PrintStudio`** (kol-styleguide): pick a layout (Document, or a finished A4 board), the project fields, the markdown, the sheets, PDF · DOCX · MD. The browser and the CLI cut identical pages (same document, same studio). **`A4Pages`**: apps/record's `A4Page`, carried verbatim, its sheet CSS in kol-theme.
- **`apps/print`** (5210) on AppHub over VOYAGER's studio and stationery; the stationery boards moved into `voyager-fixture/stationery` so apps/stationery and apps/print read one set. Walked: 6/6.
- Parser: `marked` with kol-print's own rules, carried for byte-for-byte parity; moving it onto kol-markdown is a later step, recorded in ARCHITECTURE.
- Follow-ups filed: kol-website (`RecordOnKolPrint`), dotfiles (`KolPrintSkillOnPackage`).
