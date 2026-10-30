# @kolkrabbi/kol-resume

## 0.2.0 — 2026-10-29

- **The kit's controls are the system's** (LayoutsAppPages, kol-website — user: *"nothing here is DS, all inline"*). Pages in PDF are `ToggleCheckbox` rows, Role and Company are `Input`s, and the options open in a `PopoverPanel` from a `Button`. The export buttons are `Button`s. The Library's header is `SectionText`, its options a `LabeledControlSection`, and its treatments the catalog's `ContentCard`s, with the downloads as icon actions and no media plate. The record's logic is unchanged.
- **A treatment opens at its top, with its controls in a toolbar.** Options and the downloads sit in a sticky bar at the treatment's top, no longer pinned over the page's top-right corner where a host's own controls live. The sheet scrolls sideways in its own box on a phone, and the layouts' grey backdrop no longer leaves a band of page wash (`flow-root`).
- **`kitExportPlugin` serves the rendered files too** (record's `outLibraryPlugin`, carried): GET /api/out and /api/out/file/<key>, the Library's wall. A host without the endpoint shows no wall, never an error.

## 0.1.4 — 2026-10-29

- **Contexts are made once** (WebsiteFrameContextStillSplit, kol-website): every `createContext` is created on a global key, `globalThis[Symbol.for('@kolkrabbi/<pkg>/<Name>')] ??= createContext(…)`. On Vite 5 a barrel's re-exports carry `?v=` and the package's inner imports do not, so a context module loaded twice and a provider and its hook held two contexts (kolkrabbi.io's `/work`). A second copy now hands back the first one's context. `validate-relative-imports` refuses a bare `createContext(`. No behaviour change.

## 0.1.3 — 2026-10-28

- **Relative imports name their file** (WebsiteFrameDuplicateModules, kol-website): every `./x` import now carries its extension. Vite serves raw source by the URL it was imported with, so `./Ctx` and `./Ctx.jsx` were two modules in dev and a provider and its hook held two contexts. `validate-relative-imports` keeps it from coming back. No behaviour change.

## 0.1.2 — 2026-10-28

- The package description cut to a label (the metadata gate: eight words, not a list). No code change.

## 0.1.1 — 2026-10-28

- **Export from an installed copy** (KolResumeExportNotExecutable, kol-website): `kitExportPlugin` runs `export-kit.sh` through `bash`. npm sets the exec bit only on `"bin"` files, so the installed script was `rw-r--r--` and the endpoint answered 500 (exit 126). Checked against the packed tarball: the script stays 644 and the export runs.

## 0.1.0 — 2026-10-28

- **New package** (ResumeKit, kol-website — *"copy, don't redesign"*). apps/record's resume kit carried verbatim: the resume and its three treatments, cover, back, cover letter, portfolio, the kit preview (A4 and continuous), the library, source and treatment routes, the options and export controls, their CSS, and `render-pdf.mjs` + `export-kit.sh`. The one seam is the person: `ResumeProvider` hands every page the names it read from record's `data/` (`BIO`, `WORK`, `LETTERS`, `getProject`, `bucketUrl` …), so each file changed by one `useResume()` line. Record's dev endpoint is `kitExportPlugin` on `/vite`. Record-only steps left the package: the bucket image fetch (the app's `scripts/fetch-kit-images.sh`), the `tor-grimsson` file stem (`fileStem`), the back page's kolkrabbi.io line (`copy.back`). The print rules also hide kol-shell's rail. Walked on apps/resume with VOYAGER's invented person: every treatment, EN and IS, and A4, continuous and layout PDFs exported through the endpoint.
