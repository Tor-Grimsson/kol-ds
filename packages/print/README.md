# @kolkrabbi/kol-print

Markdown to a Kolkrabbi A4 document: the sheets, PDF, DOCX and MD. The engine behind the `kol-print` CLI and kol-styleguide's `PrintStudio`.

Plain JS, no React. Pagination is measured, so it runs in a browser: `paginateInDocument` in the page you are in, or the CLI's headless Chrome — the same script either way.

## Use

```js
import { flow, paginateInDocument, printHtml, footLine, toDocxBlob, toMarkdown } from '@kolkrabbi/kol-print'

const studio = { studio: 'Studio ehf', designer: 'Name', address: 'Street 1, 101 Reykjavík', contacts: ['studio.example', 'hello@studio.example'] }
const meta = { project: 'Project', slug: 'project', client: 'Client ehf', dates: 'Oct 2026' }
const { doc, html } = flow(markdown, meta, studio)
const pages = paginateInDocument(html)
const foot = footLine(studio, meta, doc)
const printable = printHtml(pages, { title: doc, studio, logoSvg, foot }) // print it: PDF
const docx = await toDocxBlob(pages, { foot, title: `${doc} ${meta.project}`, studio, logoPng })
const md = toMarkdown(markdown, { meta, studio, doc })
```

## CLI

```
kol-print <doc.md> --studio studio.json [--meta print.json] [--nn 07] [--out ~/Downloads] [--canvas-dir dir]
```

Writes `NN-<slug>-<doc>.{pdf,docx,md}`. Needs Google Chrome (`CHROME` overrides the path); `pdfinfo` (poppler) checks the page count when present. `studio.json` is `{ studio, designer, address, contacts, logoSvg?, logoPng? }`, the logo paths relative to the file; `print.json` is `{ project, slug, client, contact?, site?, dates }`. Without the flags it looks for `.kol/studio.json` and `.kol/print.json` above the document.

**The studio's details are the caller's.** The package ships none.

## The markdown

kol-docs markdown with frontmatter `title`. The first `#` heading becomes the eyebrow, title and parties block; `### A. Title` numbers a section; a table with an empty header row is a key-value table; `[^n]` footnotes; ✋ To confirm · 🅿️ Optional · 📍 a checkpoint.
