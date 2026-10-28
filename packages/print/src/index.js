/**
 * @kolkrabbi/kol-print — markdown to a Kolkrabbi A4 document: the sheets, PDF, DOCX and MD.
 *
 * ENGINE TIER (ARCHITECTURE §3): plain JS, no React, no UI package. The dotfiles `/kol-print` pipeline moved here
 * (PdfToolsFromStudio, 2026-10-28 — user: one package that `/kol-print` and kol-website's apps/record both call). Its
 * pieces, each usable alone:
 *
 *   flow(src, meta, studio)        kol-docs markdown → the sheet's HTML (`.c` vocabulary)
 *   paginateInDocument(html)       → pages, in the browser you are in (PrintStudio)
 *   paginateHtml(html)             → the page headless Chrome cuts the same pages in (the CLI)
 *   sheetHtml · printHtml(pages)   → A4 sheets, one printable document (PDF via Chrome or the browser's print)
 *   toDocxBlob · toDocxBuffer      → .docx (the `docx` library, browser or Node)
 *   toMarkdown(src, …)             → the source under the export frontmatter
 *
 * THE STUDIO IS THE CALLER'S: `{ studio, designer, address, contacts }` and the logo (SVG for the sheets, PNG bytes for
 * the DOCX). The package ships none — a public package does not carry a studio's kennitala and phone (kol-brand's line).
 * The CLI: `kol-print <doc.md> --studio studio.json [--meta print.json] [--out dir]` (bin/kol-print.mjs).
 */
export { flow, frontmatter } from './flow.js'
export { SHEET_CSS } from './sheetCss.js'
export { PAGE_LIMIT, PAGINATE_SCRIPT, paginateHtml, paginateInDocument } from './paginate.js'
export { sheetHtml, printHtml, footLine } from './sheet.js'
export { toDocxBlob, toDocxBuffer, docxDocument } from './docx.js'
export { toMarkdown } from './markdown.js'
