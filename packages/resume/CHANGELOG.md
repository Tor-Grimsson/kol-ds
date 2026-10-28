# @kolkrabbi/kol-resume

## 0.1.1 — 2026-10-28

- **Export from an installed copy** (KolResumeExportNotExecutable, kol-website): `kitExportPlugin` runs `export-kit.sh` through `bash`. npm sets the exec bit only on `"bin"` files, so the installed script was `rw-r--r--` and the endpoint answered 500 (exit 126). Checked against the packed tarball: the script stays 644 and the export runs.

## 0.1.0 — 2026-10-28

- **New package** (ResumeKit, kol-website — *"copy, don't redesign"*). apps/record's resume kit carried verbatim: the resume and its three treatments, cover, back, cover letter, portfolio, the kit preview (A4 and continuous), the library, source and treatment routes, the options and export controls, their CSS, and `render-pdf.mjs` + `export-kit.sh`. The one seam is the person: `ResumeProvider` hands every page the names it read from record's `data/` (`BIO`, `WORK`, `LETTERS`, `getProject`, `bucketUrl` …), so each file changed by one `useResume()` line. Record's dev endpoint is `kitExportPlugin` on `/vite`. Record-only steps left the package: the bucket image fetch (the app's `scripts/fetch-kit-images.sh`), the `tor-grimsson` file stem (`fileStem`), the back page's kolkrabbi.io line (`copy.back`). The print rules also hide kol-shell's rail. Walked on apps/resume with VOYAGER's invented person: every treatment, EN and IS, and A4, continuous and layout PDFs exported through the endpoint.
