---
title: Print
type: reference
status: active
created: 2026-10-28
updated: 2026-10-29
description: Markdown and stationery printed to A4
aliases:
  - print
  - kol-print
  - PrintStudio
  - A4Pages
sources:
  - packages/print/src/index.js
  - packages/print/bin/kol-print.mjs
  - packages/styleguide/src/PrintStudio.jsx
  - packages/styleguide/src/A4Pages.jsx
  - apps/print/src/App.jsx
  - apps/voyager-fixture/src/stationery.js
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[20-document|Document page]]"
  - "[[10-styleguide-system|Styleguide system]]"
  - "[[22-resume|Resume]]"
---

# Print

One engine turns a kol-docs markdown file into a Kolkrabbi A4 document — the sheets, PDF, DOCX and MD — and one tool puts it on a page beside the stationery.

| Part | Package | What it is |
|---|---|---|
| `flow` · `paginateInDocument` · `paginateHtml` · `printHtml` · `toDocxBlob` / `toDocxBuffer` · `toMarkdown` | `@kolkrabbi/kol-print` | the engine: markdown → the sheet's HTML → pages → PDF (Chrome, or the browser's print) · DOCX (`docx`) · MD |
| `kol-print <doc.md> --studio studio.json` | `@kolkrabbi/kol-print` (bin) | the CLI: headless Chrome cuts the pages and prints the PDF; writes `NN-<slug>-<doc>.{pdf,docx,md}` |
| `PrintStudio` | kol-styleguide | the tool: layout · project fields · markdown · the A4 sheets · PDF · DOCX · MD; templates (finished A4 boards) print as they are |
| `A4Pages` | kol-styleguide | any React content flowed across A4 sheets (794 × 1123, 48 margins), breaks between elements; `paged` shows one sheet at a time with QuickLookFrame's ‹ › and `n / N` |
| `apps/print` (5210) | app | PrintStudio on AppHub over VOYAGER's studio and stationery |

## The rules

- **The studio is the caller's.** `{ studio, designer, address, contacts }` and the logo (SVG for the sheets, PNG bytes for the DOCX). The package ships none — a public package carries no studio's kennitala or phone (kol-brand's line).
- **One cut.** The browser and the CLI run the same pagination script, so the sheets on screen are the sheets the CLI prints (proved: the same document, the same studio, identical pages and DOCX body).
- **The stationery is the fixture's.** VOYAGER's boards live in `voyager-fixture/stationery`; apps/stationery lays them on its desk and apps/print prints them.

## Use

```jsx
import { PrintStudio } from '@kolkrabbi/kol-styleguide'
<PrintStudio studio={studio} logoSvg={svg} logoPngUrl={pngUrl} meta={{ project, slug, client, dates }} markdown={md}
  templates={[{ id: 'letter', label: 'Letter', sheets: [letterHtml] }]} />
```

```
npx kol-print 07-positioning.md --studio .kol/studio.json --meta .kol/print.json --out ~/Downloads
```
