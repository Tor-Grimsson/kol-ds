# ResumeKit — the resume kit as a package, copied from apps/record

**Staged:** 2026-10-28 · from kol-website (user, after RecordOnKolPrint)
**Files:** `lobby/_assets/ResumeKit/` — every source as it runs today, plus example data

---

## The problem
`RecordOnKolPrint` took the A4 sheet; the kit itself is still one app's code: the resume and its three treatments, the cover, back, cover letter and portfolio pages, the kit preview (A4 and continuous), the options and export controls, and their CSS. No other app or client can produce a resume, letter or portfolio PDF.

## The fix — copy, don't redesign
A kit in the DS (kol-styleguide or its own package — your call), carried verbatim from `_assets/ResumeKit/`:
- `pages/` — `Resume` + `ResumeGrid` · `ResumeMarginalia` · `ResumeRail`, `Cover`, `Backside`, `CoverLetter`, `Portfolio`, `KitPreview` (already on `A4Pages`), `ResumeSource`, `ResumeLibrary`, `ResumeTreatment`
- `components/` — `KitOptions` · `ExportButtons` · `ContactLine` · `LangToggle`
- `lib/` — `i18n` · `kitOptions` · `treatments` · `kitSections` · `exportDownload` · `resume` · `letters` · `portfolio`
- `styles/` — `kol-print.css` · `kol-resume-source.css` · the kit half of `kol-kit-preview.css`
- `render-pdf.mjs` + `export-kit.sh` — the URL-to-PDF the kit exports through (kol-print does markdown, not this)

**The one seam is data.** Today the kit imports `@data/business-data.js`, `@data/info.js`, `@data/records/index.js`, `data/letters/*.md`, `data/portfolio/*.md` and a bucket URL helper. Those become props / a provider: the person (bio, jobs, skills, languages, education — the shape is `data-shapes/business-data.js`), contact (`info.js`), letters and portfolio entries (examples in `data-shapes/`), and an `assetUrl(key)` for images. Nobody's details ship in the package.

## Definition of done
- [ ] the kit exported from the DS, verbatim apart from the data seam
- [ ] a fixture person renders every treatment, A4 and continuous, on a DS app page
- [ ] export to PDF works from the package
- [ ] published

**Remainder at kol-website once it ships:** record passes its data to the package; the local pages, components, lib and CSS go to `_tmp/`.


---

## ✅ RESOLVED — 2026-10-28

Shipped **@kolkrabbi/kol-resume 0.1.0**, its own package (a whole tool: routes, a vite plugin, a bin).
- **Verbatim apart from the seam.** Every page, control, lib file and stylesheet from `_assets/ResumeKit/`. `ResumeProvider` hands the pages the names they read from `data/` (`BIO`, `SKILLS`, `WORK`, `LETTERS`, `getProject`, `bucketUrl` …), so each file changed by one `useResume()` line. Letters and portfolio come in as raw markdown by path (record's own `import.meta.glob`), with `media` · `workBase` · `workUrl` for the heroes.
- **Export from the package.** `kitExportPlugin({ name })` from `@kolkrabbi/kol-resume/vite` is record's `/api/export`; `export-kit.sh` + `render-pdf.mjs` ship as the package's bin.
- **Out of the package, record keeps them:** the bucket image fetch (now the app's `scripts/fetch-kit-images.sh`, cut verbatim), the `tor-grimsson` file stem (`fileStem`), the back page's kolkrabbi.io line (`copy.back`), the `?theme` / `?plain` boot in `index.html`. The print rules also hide kol-shell's rail.
- **Walked** on `apps/resume` (5211) with VOYAGER's invented person: every treatment in EN and IS, A4 and continuous, letter with Role/Company, portfolio; PDFs exported through the endpoint (A4 kit 5 pages, continuous fit-to-length, a layout) in the KOL fonts. 17 showcase previews.
- `data-shapes/` held real contact details, so it moved out of the pushed tree to `_tmp/2026-10-28-resumekit-private-data/`.
