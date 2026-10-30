# DocumentLibraryAndBoardParts — one markdown library for every app (parse · table · preview · download), a Kanban board and a Flip card

**Staged:** 2026-10-29 · from kol-website (user: *"Record and brand should treat markdown parsing and render the SAME WAY"* · *"I already asked for tables, and download and file preview"* · *"DASHBOARD NEEDS TO CONSUME DS COMPONENTS"* · and on every ticket: *"make the tickets flexible, I dont wanna have to send the same ticket more then once because the request was too tight"*)
**Files:** source, read in place (kol-website):
- `apps/record/src/lib/documents.js` — `library()`, `kindAndTitle()`, `originals()` (the parser)
- `apps/record/src/pages/DocumentSection.jsx` — `DocumentsIndex` · `DocumentsPage` · `FolderTable` · `Files` · `MdDownload` (the table + buttons)
- `apps/record/src/pages/Bucket.jsx#L18-L30` — `QuickLook` (FullscreenOverlay + QuickLookFrame + KindPreview, paging ‹ ›, download)
- `apps/brand/src/brand/business.js` + `apps/brand/src/pages/BusinessDocs.jsx` — brand's side today (`documentTabs` + `documentFiles` → `DocumentIndex` cards)
- `apps/record/src/components/DashboardCapture.jsx#L240-L310` — the kanban board
- `apps/record/src/components/DashboardCard.jsx` + `apps/record/src/styles/kol-dashboard.css` — the flip card

**Ask for the general thing.** Each part below is wanted as the reusable piece the next app can use without a second ticket. The seams listed are the minimum; add any you see.

## 1 — The document library

### The problem
Brand and record both render markdown with `MarkdownPage`, but each reads its folder its own way. Brand uses `documentTabs` + `documentFiles` into `DocumentIndex` (contents cards). Record wrote its own `library()`, which adds a Kind, a clean title, a date, a language and the originals for each row, and shows a table per folder. Its originals open in Quick Look and download, and the markdown downloads too. Brand's `/business` has none of that, so a fix in one app never reaches the other.

### The fix
- **One parser in kol-framework** (beside `documentTabs`, or as its next version). It takes a glob of `.md` plus the originals, and returns `{ rows, folders, pages }`. Each row carries `id` (its path under the root) · `to` · `folder` · `title` · `kind` · `date` · `lang` · `files` · `source`.
  - **kind + title:** a kinds map (default is record's `KINDS`, overridable). The file name's first word is the kind, and the title drops the kind, date, language and `-01` counters. A heading wins over the file name.
  - **date:** the frontmatter `date`, else the file name's date.
  - **lang:** the frontmatter `lang`, else the file name's language tokens, else the originals' tokens. The token list is configurable, defaulting to `is · en · de`.
  - **files:** the originals that belong to a row, from any source. Brand's are a fixed list of `private.kolkrabbi.io` URLs and record's come from a bucket manifest, so pass them in as `{ key, name, size?, type?, url }` with a matcher. The default matcher is record's `originals()`: the file named in the frontmatter `description`, else the same stem without language tokens.
  - Folders are directories; `INDEX.md` is the folder's note, not a row. A root option handles brand's flat folder.
- **One index in kol-styleguide** (`DocumentIndex`, or a `DocumentLibrary` beside it): a `Table` per folder, `width="column"`, sortable, with each folder as a `PageSection`.
  - Columns are configurable. The default is Title (links to the page) · Kind · Date · Language · Assets · Markdown, and a consumer can drop, reorder or add columns.
  - Keep the cards as a `view` option for anyone who still wants them.
- **Preview + download:** the Assets cell holds one button per original, labelled by extension, with two of one kind told apart by language (`PDF IS`, `PDF EN`). Each opens the DS Quick Look over the row's files: paging ‹ ›, a download inside, images shown directly and anything else through `KindPreview`. The Markdown cell downloads the source as `<stem>.md`.
- **The open document:** the same Assets + Markdown buttons sit above `MarkdownPage`, plus a slot for more actions.
- **Hooks for app-specific bits:** `urlOf(file)` (record serves the bucket in prod and a local mirror in dev), `onNavigate`, `resolveLink`, `assetUrl`.

## 2 — Kanban board

### The problem
record's Capture tab draws its board by hand: columns with a dot and count, cards that drag between and within columns, ‹ › to shift a card, a tag/size/age row, hover actions, archive-all on the last column, and an archive list. The DS has no board.

### The fix
- An organism `Kanban`, controlled: `columns: [{ id, label, tone? }]`, `cards: [{ id, column, order, … }]`, `onMove(cardId, toColumn, beforeId | null)`.
- **Slots:**
  - `renderCard(card)` for the body (media, text, tags);
  - `cardActions(card)` for the hover row;
  - `columnActions(column)` for things like "archive all";
  - `footer` for the archive list.
- **External drops:** `onExternalDrop(column, beforeId, payload)` with a `dataTransfer` key, so items dragged in from outside the board (record drags inbox lines in) land in a column.
- Keyboard-reachable ‹ › moves alongside drag; works at 390, where columns stack.
- Pieces the card can use, if the DS lacks them: a size chip that cycles (`S · M · L`) and an age label (`now`, `5h`, `3d`).

## 3 — Flip card

### The problem
record's Projects tab is a grid of fixed-height cards that flip in 3D between a front (title, status dot that cycles, kind, a progress bar, notes, "Details →") and a back (a Tasks · Links tab strip, checkable tasks with an add field, links). It is drag-reorderable. The flip and drag states live in a local CSS file (`kol-dashboard.css`).

### The fix
- `FlipCard`: `front` and `back` slots, controlled or uncontrolled `flipped`, a `height` prop (default 240), and each face scrolling its own overflow.
- **Optional props:**
  - `draggable` with `onReorder`;
  - a drag handle;
  - `is-dragging` and `is-drop-target` states.
- **Small parts the faces use, as atoms if missing:**
  - a status chip that cycles a set of `{ id, label, tone }`;
  - a progress bar with a `value / max` caption.
- A grid wrapper (`auto-fill, minmax(280px, 1fr)`) is optional, since `ContentCollection` may already cover it.

## 4 — TabsRow on a narrow screen

### The problem
`TabsRow look="underline"` with six tabs is 394px wide; at 390 the page scrolls sideways (record's dashboard). The row has no overflow handling of its own, so every consumer wraps it.

### The fix
- `TabsRow` handles overflow itself, for every look. Make it a choice: scroll sideways (no scrollbar, fade at the clipped edge with the shared `.kol-scroll-fade`, the active tab scrolled into view) or wrap, with scroll as the default.
- record wraps it in `overflow-x-auto` until then (`apps/record/src/pages/Dashboard.jsx`).

## Drop on recreation
- The hardcoded status and column colours (`bg-green-500`, `bg-amber-500`, `bg-sky-500`, `bg-neutral-400`, `text-red-600`) become tones.
- The unicode glyphs (`⠿ ○ ↗ ✕ ‹ ›`) become kol-icons.
- `fetch` calls, Todoist and the inbox stay in record; the parts take data and callbacks only.

## Definition of done
- [ ] kol-ds-ui's reference app shows a folder table built by the parser: a PDF opens in Quick Look and downloads, and the `.md` downloads, in both themes
- [ ] a `Kanban` fixture moves a card between columns by drag and by ‹ ›, and accepts an external drop
- [ ] a `FlipCard` fixture flips, scrolls a long back face, and reorders by drag
- [ ] published, versions named in the resolution


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-theme 0.198.0 · kol-component 0.315.0 · kol-framework 0.64.0 · kol-styleguide 0.16.0 · kol-hardware 0.10.0**.

**1 — The document library.**
- **Parser:** kol-framework **`documentLibrary(glob, { base, root, files, match, kinds, langs, label })`** is record's `library()`, returning `{ rows, folders, pages }` with the row shape the ticket names.
  - Kinds are `DOCUMENT_KINDS` (record's), merged with yours or off.
  - Languages default to `is · en · de`.
  - `files` takes any source (`{ key, name?, size?, type?, url? }`).
  - The default matcher is **`matchOriginals`**, record's `originals()` with one addition: a named original brings its language twin. A `description` naming the EN PDF now brings the IS one too; record's version dropped it.
  - `INDEX.md` is the folder's note. `kindAndTitle` and `libraryLinks(lib)` (the wikilink resolver) are exported.
- **Index:** kol-styleguide **`DocumentLibrary`** draws a sortable `Table` per folder (`width="column"`, each folder a `PageSection`).
  - Columns: Title · Kind · Date · Language · Assets · Markdown. Pass `columns` as keys or Table columns, or as `(defaults) => columns`. `view="cards"` keeps the contents cards. `folder` shows one folder.
  - **`DocumentView`** is the open document: the same buttons and an `actions` slot above `MarkdownPage`. Other props pass through, and `resolveLink` defaults to the library's.
  - `DocumentFiles` (the Assets cell, `PDF IS` · `PDF EN` told apart), `DocumentMarkdown` (downloads `<stem>.md`) and `useFileQuickLook` are exported.
- **Quick Look:** kol-component **`FileQuickLook`** is the composition record and `DocumentIndex` each drew by hand: dim, window, ‹ ›, a download, images shown directly, everything else through `KindPreview`. `DocumentIndex` uses it now, so its Quick Look gains the download. `urlOf(file)` is the app's.
- **Proved:** apps/document `/library`, on `voyager-fixture/library` (VOYAGER's press, letters and poster with generated PDFs and an SVG). A PDF opened in Quick Look paging 1/2 with its download, the `.md` download, the open document with PDF EN · PDF IS above it, and a wikilink resolving to its row, in light and dark. `voyager-fixture`'s self-test runs the parser over the library.

**2 — Kanban.** kol-component **`Kanban`** is controlled:
- `columns [{ id, label, tone? }]`, `cards [{ id, column, order, archived? }]`, `onMove(id, column, beforeId | null)`.
- Slots: `renderCard`, `cardActions` (the hover row), `columnActions(column, cards)` and `footer`.
- `externalType` + `onExternalDrop(column, beforeId, payload)` handle outside drops.
- ‹ › buttons sit on every card, and the columns stack below 768.
- The parts a card uses: **`StatusChip cycle`** (the existing chip, with a click stepping to the next option and `placeholder` for `·`) and **`formatAge`** (`now` · `5h` · `3d`).
- Walked on the showcase preview: drag Lobby → Working, ‹ Working → Backlog, an inbox line dropped onto Lobby, the size chip `·` → `S`, the columns stacked at 390. A Done column's Archive wraps inside a narrow column.

**3 — Flip card.** `FlipCard` already existed in kol-hardware's frames, so it **moved to kol-component** (kol-hardware re-exports it on the same path) and gained:
- `height` (a fixed tile, each face scrolling its own overflow);
- `defaultFlipped` / `onFlippedChange`;
- faces as `({ flip }) => node`.

The reorder is **`SortableGrid`**: `auto-fill` tracks with `min` 280, a drag-handle button per item (drag, or arrow keys on the focused grip), and `is-dragging` / `is-drop-target` states from record's CSS. **`ProgressBar`** (`value / max`, a caption, the ink or a tone) is new; the status chip is `StatusChip cycle`. Walked on the showcase preview: a drag reorder, an arrow-key reorder, Details flipping a 240 card and its 14-task back scrolling, in dark.

**Dropped on recreation:** the green, amber, sky and neutral fills became the `success · warning · info` tones and the ink; ⠿ ‹ › are kol-icons (`drag-handle`, `chevron-*`). No fetch, Todoist or inbox code is in the DS.

**Remainder at kol-website:** bump; record and brand onto `documentLibrary` + `DocumentLibrary` / `DocumentView` (brand's private URLs as `files`); the Capture board onto `Kanban`, the Projects grid onto `SortableGrid` + `FlipCard`; retire `lib/documents.js`, `DocumentSection.jsx`, `QuickLook` and `kol-dashboard.css`.
