# Plan — apps/document, the markdown page for kol-website's brand

**Raised:** 2026-10-28, kol-website's lobby ticket `MarkdownPage` (`lobby/inbox/MarkdownPage.md`, points verbatim there): brand needs a folder of `.md` files rendered as pages inside `SiteLayout`, with a contents page, and nothing in the estate does it. The user the same day: *"we should make an apps/* space for this"*; the rail: *"CLOSELY bound to pages in sidebar"*; the examples: *"the only thing/content wise you need to refference is already in kol-atlas, its literally brimming with examples"*; and: *"this is not for kol-atlas, its for website"*.
**Status:** W1–W3 built 2026-10-28 and reviewed (*"ok love it, I think this is fine for now"*); W5.1 and W5.2 shipped 2026-10-28 (kol-markdown 0.2.0, kol-theme 0.193.0, kol-framework 0.58.0, kol-styleguide 0.12.0). W5.3 closed 2026-10-28 once the registry served the wave (the receipt in kol-website's outbox names the glob-and-rows wiring). W4 ruled 2026-10-28: Public Sans (kol-theme 0.194.0). Nothing open.
**Shape:** W › phase › list.
**What is already true:** kol-atlas's `docs/documentation/` (≈45 markdown files behind a tab table) and `research-data/src-research/` (≈30 reviews) are the examples: real documents with headings, meta lines, numbered phases, footnotes, Sources lists, claim tables, image grids. kol-theme already carries the styles those documents are rendered in — `.kol-sheet` (kol-atlas's `workspace.css`, class for class, 2026-10-24); site-hub's Research › Sheet shows it on pasted HTML, because nothing in the DS turns markdown into that markup. That is the gap: **kol-markdown reads the files, a page writes `.kol-sheet`**.
**Laws carried:** one parser — `kol-markdown`'s `parseDocsMarkdown` (kol-workshop, the showcase vault and `apps/markdown` already read it), and an engine's additions are proved in the engine's own app before a consumer switches. One set of document styles — `.kol-sheet`; the page writes the markup it already styles, it invents no class. Tier rules § Ownership: the page is born in the app and moves into a package once it is proved. Cloned repos are reference only: kol-atlas is read and its files are copied into a fixture, never linked. Subdomain law: `document`, one word. Visual calls go on the open-questions page as specimens. Rail words: enter/exit, expand/collapse.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — The examples: `apps/document-fixture`

kol-atlas's documents, copied as they are. Nothing is written for this.

### 1.1 — The files — ✅ built 2026-10-28

- `apps/document-fixture/src/docs/` — kol-atlas `docs/documentation/`'s client-visible pages (its "Who sees what" table: Overview, Project, Plan, Quote, the Assets pages with their `_assets/`, Brief, Brand summary, Positioning, Updates and its entries, Research and its eight papers, SEO + GEO; not Hours, Conventions, Visual references, the Studio group), frontmatter and file names kept.
- `apps/document-fixture/src/research/` — the reviews (`reviews/`, `branding/reviews/`, `guides/reviews/`).
- `TABS` — kol-atlas's tab table minus the internal rows: id, title, group, parent, folder, file. Exported with the two raw globs (Vite-only, as the other fixtures).
- **Accept:** every `TABS` row resolves to a file; every file splits its frontmatter and parses with today's `parseDocsMarkdown` without throwing; the fixture test counts the files.

## W2 — What the parser drops today, in kol-markdown

Proved in `apps/markdown` (5184), the engine's app, before any page draws it. Only what the example documents are written in and a brand page may also use.

### 2.1 — The additions — ✅ built 2026-10-28

- Heading anchors `## Title {#id}`. Numbered headings: `## M1 Title`, `### 1.1 Title`, `####` items numbered `1.1.n` — the number carried on the block (`num`) so a page can set it in the gutter. Status marks `✋ reason` / `🅿️ reason` / `📍` on a heading → `marks`.
- Meta lines — `Dates:` `Acceptance:` `Date:` `Covers:` `Client:` `Contact:` `Price:` at the top of a section → one `meta` block of `{ key, value }` rows.
- Footnotes — `[^key]` inline and `[^key]: text` definitions, collected per section; the `## Sources` / `## Heimildir` list flagged `sources`; `> quote — who` → blockquote with `cite`.
- `![[file]]` image embeds, a run of them one `media` block — a `:::tabs` filmstrip too, its `::tab` labels as the captions (the Media page is nothing else); `\.` and backslash escapes; `%%` comment lines dropped.
- kol-atlas's generated lines (`@plan` `@quote-*` `@entries` `@counts` `::toc` `::embed` `{{terms}}`) are not markdown: the parser drops them. They are kol-atlas's data; this page is for brand.
- **Accept:** `packages/markdown/src/selftest.mjs` carries one check per block kind above, each against a line from the fixture; Project parses to numbered phases and items with marks and meta; a review parses to its claim table and a `sources` list; a generated line never reaches a block.

### 2.2 — `apps/markdown` shows it — ✅ built 2026-10-28

- The document fixture in the picker beside workshop-fixture's; the Blocks view lists the new kinds; the Rendered view stays kol-workshop's reader.
- **Accept:** every fixture document is in the picker and parses live; the Blocks view shows `meta`, `marks`, `footnote`, `sources`, `media` on the documents that carry them.

## W3 — The space: `apps/document` (5208)

### 3.1 — The app — ✅ built 2026-10-28

- An apps/* member on `SiteLayout` (BrowserRouter, the sites' wash `fg-02`; `pnpm document`, `/apps/document`, vercel rewrite, root build + script, showcase Apps entry, apps-tier INDEX row).
- The site rail is `TABS`: Overview · Project · Plan · Quote as rows; Assets and Reference as foldernotes with their pages, Updates and Research as groups inside Reference with their entries; the reviews a third foldernote grouped by folder. The TOC rail on the right carries the open page's sections.
- THE LAYOUT (his ruling on review, 2026-10-28: *"I want this [kol-atlas's tabs header] in this layout [the site rail] WITHOUT THIS … RIGHT RAIL"*): `SiteLayout` with the site rail on the left; kol-atlas's tabs header on top of every page through `SiteLayout`'s `header` (the client's name, `TabsRow` for the plain tabs, the groups as `MenuItem`s at the row's right end, on DS parts); the sheet under it; **no TOC rail** — a page draws none unless its frame asks. The switch keeps `AppShell` as the second frame (the same header, the DS rail for its TOC).
- **Accept:** every `TABS` row opens its page on its own route in all three frames; `/` opens Project; a folder shows its own document with its pages under it; nothing is drawn by the app that a package draws already (rail, frame, tabs, menus, section, table, code, toc).

### 3.2 — `MarkdownPage`, born in the app — ✅ built 2026-10-28

- `apps/document/src/MarkdownPage.jsx` — `({ source, kicker, toc, linkNotes, resolveLink, assetUrl })`: `splitFrontmatter` + `parseDocsMarkdown`, then the blocks written as the markup `.kol-sheet` already styles: `# Kind Name` → the head (accent label, title); `.proj` with the `num` gutter when the document has numbered headings; `p.when` meta lines with `k`; `.mk` marks and `.why` reasons; `sup.fn` + `ol.fns` notes under the passage that cites them (kol-atlas's rule: the end of the phase, not the page) and, with `linkNotes` (Project, SEO + GEO), every external link a numbered note with its short address; `ol.fns.src` for Sources; tables on the DS `Table` inside `.tablewrap` (plain, `kv`, `num`, `group`, `total`); `CodeBlock` for fences; the `.media` figure grid; blockquote with `cite`; `.tb` item text.
- TOC: `toc="frame"` (default) publishes `DocsToc` to `ShellTocContext` and draws nothing of its own — site-hub's Sheet does exactly this; `"rail"` draws `DocsToc variant="rail"` (the AppShell case); `false` none. Links: `#page`, `#page--section`, `.md` and wikilinks through `resolveLink`, the rest plain `<a>`.
- PARITY WITH THE ENGINE (his review, 2026-10-28: *"wrong indent… go fucking diff"*, *"missing thumbnail overlay / missing some accent color / date indent wrong / footnote indent wrong… read the fucking repo"*): kol-atlas's `engine/render.js` run in Node on the fixture's own files is the reference, and the page's block sequence is diffed against it (Project, SEO + GEO, Brief, Naming system: identical, 37 notes in the same lists). The rules carried: `numbered` and `notes` are the tab's flags (the engine's `proj` and `autoFn`), not read from content; milestone-level text (`data-ms`), phase text, item text (`.tb`); one `p.when` per run of `Dates:` `Date:` `Phases:` `Pages:` `Covers:` lines with `<br>` and `.k` keys, `Acceptance:` as `p.dw`, an italic-only paragraph `p.note`; notes in one sequence in reading order, headings included, every external link a new note where it stands, listed before the next ##/### and at the end, a note's own links joining its list, `fnn` "n.", `ol start`; the title is the h1, no kicker; a caption falls back to its file name; `✅` lead → `.done`. `.kol-sheet`'s accent is kol-atlas's (orange-300, yellow-300 in the dark) — a kol-theme rule, unpublished, the app loads `kol-brand-color.css` for the ramps.
- THE HOVER CARD: `apps/document/src/LinkPreview.jsx`, kol-atlas's `LinkPreview.jsx` + `previews.js` on DS parts — `#page` previews the page's title, intro and `%% thumb:` (kept by the parser); `#page--section` the section's or `###`'s heading, first paragraph and first image; an outside link its stored card (`link-cards.json`, the fixture carries kol-atlas's cards for the URLs these documents cite, shots as 800px JPEGs). A line that is only `![caption](https://…)` is a web link card in the grid.
- **Accept:** every fixture document renders; Project shows the numbers in the gutter with its marks, meta lines and the footnotes under each phase; a review shows its claim table on the DS Table and its Sources in the footnote style; the TOC rail follows the page on the site frame and the rail variant shows on the app frame; the app ships no CSS of its own and no `kol-doc-*` or workshop class; phone: the gutter closes as `.kol-sheet`'s rule says.

### 3.3 — The index — ✅ built 2026-10-28

- `apps/document/src/DocumentIndex.jsx` — a group's pages as `BrandGuide`'s contents cards (label, title, arrow; the same cards the brand book's Chapters page draws), routed; Home is the whole table by group, a foldernote is its group.
- **Accept:** Home lists every page under its group; a card opens its page; the cards are the brand book's cards.

## W4 — The look — ✅ ruled 2026-10-28: Public Sans, like the reference

Nothing here is decided for him. One specimen on the open-questions page: the body face. `.kol-sheet` reads `--body` as KOL's sans; kol-atlas sets Public Sans (`@fontsource-variable/public-sans`) and the ticket asks whether the DS takes it. The same Project page on both. Public Sans enters `public/fonts` and kol-theme's tokens only on his ruling.

- **Accept:** the specimen is on the page (`showcase/src/open-questions/2026-10-28.jsx`, Round 23 — done 2026-10-28) and his ruling is written on this plan before W5. RULED 2026-10-28 (*"I already said Public Sans!!! like the fucking reference"*): kol-theme 0.194.0 — `.kol-sheet`'s `--body` is Public Sans, the face declared from `/fonts/public-sans/` (the variable woff2, latin and latin-ext, normal and italic, in `public/fonts/public-sans/` as the other faces are hosted); headings stay on the display face.

## W5 — Into the packages, and the ticket

After his judgement of W3 (*"ok love it, I think this is fine for now"*, 2026-10-28; *"make sure that things are flexible enough"* — every behaviour is a prop, the rows are the consumer's). W4 stays open: the body face is one token in kol-theme when he rules.

### 5.1 — kol-markdown ships W2 — ✅ shipped 2026-10-28

- A minor; the new blocks are additive and kol-workshop's reader ignores them until it is taught. kol-theme ships the `.kol-sheet` rules the port missed (`ol.fns a` plain, `ol.fns.src` a step larger) and the sheet's accent (orange-300, yellow-300 in the dark — kol-atlas's `index.css`, not the DS ink), in the workspace since 2026-10-28.
- **Accept:** selftest green, version live, `apps/markdown` and `apps/workshop` unchanged on screen.

### 5.2 — kol-framework ships the page — ✅ shipped 2026-10-28

- `MarkdownPage` + `LinkPreview` + `documentTabs(glob)` (the folder → rows helper: id, title from frontmatter, group from the path) move beside `CategoryPage` — the site's content parts live there, `.kol-sheet`'s frame and `ShellTocContext` too; `@kolkrabbi/kol-markdown` becomes kol-framework's peer (engine tier). `DocumentIndex` goes to kol-styleguide instead (decided 2026-10-28, for his review: kol-styleguide peers on kol-framework, and the cards are `BrandGuide`'s `Contents` — kol-framework importing them would be a cycle). The app imports them and keeps nothing local (the app copies in `_tmp/2026-10-28-document-into-packages/`). `fit` (cover by default — *"should SHIP scale to fill, no margins"*) and `ratio` are the page's; the theme's `.media` rule fills.
- Classification, a showcase preview from a fixture document, `04-compositions/18-site-frame.md` (the parts table), a `04-compositions/20-document.md` naming the additions and the markup, changelog, shipped list, publish.
- **Accept:** `apps/document` renders identically from the package; roster · previews · syntax · vault-links green; the versions are live on the registry.

### 5.3 — The ticket closes — ✅ closed 2026-10-28

- `lobby-close MarkdownPage` with the versions; the receipt names the glob-and-menu wiring brand needs: `documentTabs(import.meta.glob('src/brand/foundation/**/*.md', …))`, its rows into brand's tree, `MarkdownPage` on the page route, `DocumentIndex` on the folder route.
- **Accept:** the receipt is in kol-website's outbox after the tarballs serve; brand renders its folder with a glob and menu rows only.
