# @kolkrabbi/kol-print

## 0.1.0 — 2026-10-28

- **New engine** (PdfToolsFromStudio, kol-hq — user: one package that `/kol-print` and kol-website's apps/record both call). The dotfiles `/kol-print` pipeline moved in, ESM, its code verbatim: `flow` (kol-docs markdown → the sheet's HTML), the pagination script (`paginateInDocument` in a browser, `paginateHtml` for headless Chrome), `sheetHtml` · `printHtml`, `toDocxBlob` · `toDocxBuffer`, `toMarkdown`, `SHEET_CSS`, and the `kol-print` CLI. What changed is the studio: its details and logo are the caller's (`--studio`), so no studio's kennitala or phone ships. Proved against the dotfiles tool on two documents: PDFs pixel-identical, DOCX body and MD identical (the DOCX logo's alt text now names the studio). The CLI waits for web fonts before printing (`--virtual-time-budget`), record's render-pdf lesson.
