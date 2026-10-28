# DocumentIndex: a folder's PDFs and images (missed from MarkdownPage) · kol-icons 0.49.0 tarball 404

**Staged:** 2026-10-28 · from a kol-website session
**Change:** kol-styleguide `DocumentIndex` (+ the glob helper) · kol-icons republish

---

## 1. Files in a document folder — part of MarkdownPage's ticket, not shipped
`MarkdownPage`'s ticket (2026-10-28) asked: *a folder may also hold PDFs and images; the contents index lists them beside the md pages and opens them in the DS QuickLook (`QuickLookFrame` / `KindPreview`), not as pages.* 0.58.0 / styleguide 0.12.0 list `.md` only. kol-website brand's `src/brand/business/frumkvaedi-2024/` holds `business-plan.pdf` (13 pp.) and `example-plan.pdf` — today they appear nowhere.

**Fix:** `DocumentIndex` takes file rows too (e.g. `{ id, title, part, file: url, kind }` from an `import.meta.glob('…/*.{pdf,png,jpg}', { query: '?url' })`), drawn as cards in their part, opening in QuickLook. A helper beside `documentTabs` (e.g. `documentFiles(glob)`) so an app only globs.

## 2. kol-icons 0.49.0 cannot be installed
`npm view` lists 0.49.0 as latest, but `GET https://registry.npmjs.org/@kolkrabbi/kol-icons/-/kol-icons-0.49.0.tgz` → **404** (0.48.0 → 200). Every consumer bump fails `ERR_PNPM_FETCH_404`. Republish 0.49.0 or ship 0.50.0.

## Definition of done
- [ ] brand's `/business` lists the two PDFs under Frumkvæði 2024 and opens them in QuickLook
- [ ] `pnpm add @kolkrabbi/kol-icons@latest` installs

## ✅ RESOLUTION — 2026-10-28 · 0.59.0

1. kol-framework 0.59.0: documentFiles(glob) — the files beside a folder's markdown as rows { id, title, group, file, ext, kind } from import.meta.glob('…/*.{pdf,png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true }); kol-styleguide 0.13.0: DocumentIndex draws a row with file as a card in its part (its kind on the small line) and opens it in the DS Quick Look (QuickLookFrame + KindPreview fit=sheet — a PDF page by page, an image at its size), ‹ › paging the folder's files. Wiring in docs/documentation/04-compositions/20-document.md. 2. kol-icons 0.49.0 serves: the tarball returned 200 from here before and after your 404 (registry propagation); retry the install, no republish. Note the set move in 0.49.0: a loaderApp graphic path under kol-icon-set-interface/identity/ is now kol-icon-set-identity/kolkrabbi/ (kolkrabbi, kol-ds) or kol-icon-set-identity/apps/ (brand, studio, …).

**Remainder here:** none — kol-website brand's /business: FILES = documentFiles(import.meta.glob('./brand/business/**/*.{pdf,png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true })); rows = [...pages, ...FILES.map(f => ({ ...f, part: f.group }))] into DocumentIndex; bump kol-framework 0.59.0, kol-styleguide 0.13.0, kol-icons 0.49.0 (retry)..

