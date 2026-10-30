---
title: Document page
type: reference
status: active
created: 2026-10-28
updated: 2026-10-28
description: A markdown file as a document page
aliases:
  - document page
  - MarkdownPage
  - the sheet
sources:
  - packages/framework/src/MarkdownPage.jsx
  - packages/framework/src/LinkPreview.jsx
  - packages/framework/src/documentTabs.js
  - packages/framework/src/documentFiles.js
  - packages/styleguide/src/DocumentIndex.jsx
  - packages/framework/src/documentLibrary.js
  - packages/styleguide/src/DocumentLibrary.jsx
  - packages/markdown/src/parse-markdown.js
  - packages/theme/kol-typography.css
  - apps/document/src/App.jsx
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[18-site-frame|Site frame]]"
  - "[[07-content-system|Content system]]"
  - "[[21-print|Print]]"
  - "[[../../operations/09-phase-log/2026-10-28-document|Phase log: Document space]]"
---

# Document page

A folder of markdown files rendered as pages inside the site frame, with a contents page. kol-markdown reads the file, `MarkdownPage` writes the markup `.kol-sheet` already styles (kol-theme's port of kol-atlas's `workspace.css`, class for class), and the page invents no class. Proved against kol-atlas's own engine: its Project, SEO + GEO, Brief and Naming system render block for block the same. `apps/document` is the reference.

## The parts

| Part | Package | What it is |
|---|---|---|
| `MarkdownPage` | kol-framework | the page: `source` in, `.kol-sheet` out — headings with their numbers and marks, meta lines, notes under their passage, tables on `Table`, fences on `CodeBlock`, the figure grid, quotes with their cite |
| `LinkPreview` | kol-framework | kol-atlas's hover card: pause on a link in the sheet and a card opens under it — image, title, a line of text, the site; `cardFor(anchor)` is the app's |
| `documentTabs(glob)` | kol-framework | a folder's markdown as page rows `{ id, title, group, file, source }` — the rail's rows and the index's cards are made from them |
| `documentFiles(glob)` | kol-framework | the files beside the markdown (PDFs, images) as rows `{ id, title, group, file, ext, kind }` from a `?url` glob |
| `DocumentIndex` | kol-styleguide | a folder's pages as the brand book's contents cards (`Contents`, routed) under a compact `PageHeader`; a file row is a card too and opens in the DS Quick Look (`FileQuickLook`), ‹ › paging the folder's files |
| `documentLibrary(glob, { base, root, files, match, kinds, langs })` | kol-framework | a folder of markdown as a **library** — record's parser, one for every app (2026-10-29): rows `{ id, to, folder, title, kind, date, lang, files, source }`, `folders`, `pages`. The kind is the file name's first word (`DOCUMENT_KINDS`, overridable); a title that is only the file name drops the kind, date, language and counters; the date and language come from the frontmatter, else the name, else the originals'; `files` are the originals from any source (`{ key, name, size, type, url }`), matched by `matchOriginals` — the file the `description` names plus its stem siblings and language twins, else the same stem without language tokens. `INDEX.md` is a folder's note, never a row. `libraryLinks(lib)` resolves a wikilink to its row |
| `DocumentLibrary` · `DocumentView` | kol-styleguide | the library drawn: a sortable `Table` per folder (`width="column"`, each folder a `PageSection`) — Title · Kind · Date · Language · Assets · Markdown, `columns` as keys or `(defaults) => columns`; `view="cards"` for the contents cards. The Assets cell (`DocumentFiles`) is a button per original by extension, two of one kind told apart by language (`PDF IS`, `PDF EN`), opening `FileQuickLook` over the row's files; the Markdown cell (`DocumentMarkdown`) downloads `<stem>.md`. `assetsView`: `label` (default) · `icon` (kol-icons' file-type glyph, a language subscript on a twin) · `icon-label`; `langView`: `text` (default) · `chips` (a `Tag` per language) · `icon` (globe and codes); `fileIcon(file)` overrides the glyph, `kindIcon` the default map (kol-styleguide 0.18.0; `?assets=icon&lang=chips` on apps/document `/library`). `DocumentView` is the open document: the same buttons and an `actions` slot above `MarkdownPage`. `urlOf(file)` is the app's (a bucket in prod, a mirror in dev) |
| `parseDocsMarkdown` | kol-markdown | the one parser; `{ numbered: true }` lets a `###` carry a bare integer |
| `.kol-sheet` | kol-theme | the styles: `.proj` and the number gutter, `[data-ms]`, `.tb`, `p.when` `.k` `p.dw` `p.note`, `ol.fns` `.fnn` `.url`, `.media` and `[data-fit]`, the accent (orange-300, yellow-300 dark) |

## MarkdownPage

| Prop | Default | What it does |
|---|---|---|
| `source` | `''` | the file's text, frontmatter included |
| `numbered` | `false` | a numbered document (kol-atlas's `proj`): `.proj`, the number gutter, milestone · phase · item levels (`data-ms`, plain, `.tb`), `####` items counted `1.1.n` |
| `linkNotes` | `false` | every external link becomes a numbered note too (kol-atlas's Project and SEO + GEO) |
| `toc` | `'frame'` | `'frame'`: the headings go to the frame's TOC rail through `ShellTocContext`, nothing drawn; without a frame or with `'rail'`: `DocsToc variant="rail"`; `false`: none |
| `fit` | `'cover'` | a figure fills its frame; `'contain'` shows the whole image on the plate |
| `ratio` | theme (`4/3`) | the figure frame's aspect ratio, as CSS (`'16/9'`) |
| `resolveLink` | identity | `(url) => href` — the app maps `#page`, `#page--section`, `.md` and wikilinks to its routes |
| `assetUrl` | `() => null` | `(file) => url` for `![[file]]` embeds and local images; null draws the file's name on a plate |

## What the file may hold

Everything `parseDocsMarkdown` reads (kol-markdown 0.2.0): `# Title`; `## Section {#id}`; numbered headings `M1`, `1.1`, `####` items; marks ✋ 🅿️ 📍 ✓ ✅ with a reason after the title; a paragraph of `Dates:` `Date:` `Phases:` `Pages:` `Covers:` lines (one `p.when`, `Client:` and `Contact:` ride along), `Acceptance:` (`p.dw`), an italic-only paragraph (`p.note`); `[^key]` and `[^key]: text`; a `## Sources` list; `> quote — who`; `![[file|caption]]` runs and `:::tabs` filmstrips as one grid, a line that is only `![caption](https://…)` as a web link card; tables with alignment, a two-column table `kv`; fences; `%% thumb: file` for the hover card. kol-atlas's `docs/documentation/` is the worked example (`apps/document-fixture`).

## Notes

One sequence through the page in reading order, headings included. A `[^key]` takes its number at its first reference or when its definition is listed; with `linkNotes` every external link takes a new number where it stands (the same address twice in one passage shares one). The pending notes are listed before the next `##` or `###` and at the end, under the passage they belong to; a note's own links join its list. The note's text is the link, the short address a span.

## Wiring a folder

```jsx
import { MarkdownPage, LinkPreview, documentTabs, documentFiles } from '@kolkrabbi/kol-framework'
import { DocumentIndex } from '@kolkrabbi/kol-styleguide'

const PAGES = documentTabs(import.meta.glob('./brand/business/**/*.md', { query: '?raw', import: 'default', eager: true }))
const FILES = documentFiles(import.meta.glob('./brand/business/**/*.{pdf,png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true }))
// the rail: PAGES into the nav tree by group; the page route: <MarkdownPage source={row.source} … />;
// the folder route — pages and files in their parts, a file opening in Quick Look:
// <DocumentIndex rows={[...PAGES.map((r) => ({ id: r.id, to: `/${r.id}`, title: r.title, part: r.group })), ...FILES.map((f) => ({ ...f, part: f.group }))]} onNavigate={navigate} />
```

A **library** — the same folder with a kind, date and language per row and the originals beside each — is
`documentLibrary` + `DocumentLibrary` (apps/document `/library`, on VOYAGER's `voyager-fixture/library`):

```jsx
const LIB = documentLibrary(import.meta.glob('./data/documents/**/*.md', { query: '?raw', import: 'default', eager: true }),
  { base: 'documents', root: './data/documents/', files: BUCKET_FILES })
// /documents:            <DocumentLibrary library={LIB} onNavigate={navigate} urlOf={(f) => bucketUrl(f.key)} />
// /documents/<folder>:   <DocumentLibrary library={LIB} folder={id} … />
// /documents/<id>:       <DocumentView row={row} library={LIB} urlOf={…} assetUrl={…} />
```

The app's CSS loads `@kolkrabbi/kol-framework/kol-brand-color.css` for the sheet's accent ramps, and a Tailwind `@source` line for each package.
