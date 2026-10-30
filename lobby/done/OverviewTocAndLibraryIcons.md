# OverviewTocAndLibraryIcons — overview pages as a TOC of their sub-pages, no forced hero; the library's files and languages as icons and chips

**Staged:** 2026-10-29 · from kol-website (record, user walking record.kolkrabbi.io: *"we need a better system for the overview pages and what they list. I think they should just TOC the sub pages"* · *"the hero literally was designed to INTRO BRAND GUIDE, not to be a every goddamn page standard"* · *"file type and language, can use icons? the table is deadboring like this"* · and on every ticket: *"props are good. we use variants and presets to define how things ship, but props make things flexible"*)
**Files:** kol-framework `CategoryPage.jsx`, `PageHero.jsx`, `PageSection.jsx`; kol-styleguide `DocumentLibrary.jsx` (`columnsFor`, `DocumentFiles`); kol-icons (file-type glyphs). Consumer: kol-website `apps/record/src/App.jsx` (`overview(id)`), `pages/Documents.jsx`; brand `pages/BusinessDocs.jsx`.

## 1 — CategoryPage: a TOC of the category's pages, the head a choice

### The problem
`CategoryPage` always opens on a `PageHero` and lists only the pages that carry a `card`, as article cards. On record the overviews are folder notes for plain pages with no cards, so they show a hero and nothing under it, or a page invents its own list. That is why `/records` stacks every table in an order that doesn't match the rail. The hero is the brand book's intro; on an overview it pushes the content below the fold.

### The fix
- `view`: `cards` (today) · `toc` · `list`.
  - `toc`: every page of the category in the rail's order, each row its label, plus the page's `lede`/`card.body` if present and a `trailing` (a count, a node). It works with no `card` at all.
  - `list`: the same rows as a `Table`, with columns configurable as `DocumentLibrary` does.
- `head`: `hero` (today) · `section` (PageSection's brand-chapter head: `kol-prose-label` + `kol-prose-title` + lede) · `none` · a node. The default stays `hero`, so nothing changes for anyone who passes nothing.
- Groups inside a category (`{ label, children }`) render as sub-headings in the TOC, nested as deep as the rail goes.
- `filter(page)`, `pages` (an explicit list wins over the tree) and `renderItem` (page, defaultNode) as the seams for anything else.

## 2 — PageHero / PageSection: no tall band unless asked

### The problem
`PageHero` carries the brand-intro height, so a hero used as an ordinary page head leaves a near-empty screen before the content.

### The fix
- `PageHero size`: `intro` (today's band) · `compact` (the same voices, no min-height, `--kol-page-header-mb` below). Default `intro`.
- `PageSection level`: `section` (today) · `page`, which puts the h1 in the section voice for pages that open on a section head instead of a hero, keeping one h1 per page.

## 3 — DocumentLibrary: icons and chips, as props

### The problem
The Assets cell is text buttons (`PDF EN`, `PDF IS`, `PNG`) and Language is plain text (`EN, IS`). The table reads as a wall of mono.

### The fix
- `assetsView`: `label` (today) · `icon` · `icon-label`. `icon` draws a file-type glyph per original, with the extension and language in the tooltip and the aria-label. Two of one kind are told apart by a small language subscript on the icon.
- `langView`: `text` (today) · `chips` (a `Tag` per language) · `icon` (globe + code).
- `fileIcon(file)`: a render seam for any other mapping. `kindIcon` is the default map, by extension: pdf · doc/docx · image (jpg/png/webp/heic) · svg · video · audio · zip · md · other.
- `DocumentView`'s button row takes the same `assetsView`.

## 4 — kol-icons: file-type glyphs

### The problem
kol-icons has `file` and `image` but no file-type set, so 3 can't tell a PDF from a Word file from a ZIP.

### The fix
- An interface-set family on the 24 keyline: `file-pdf` · `file-doc` · `file-image` · `file-svg` · `file-video` · `file-audio` · `file-zip` · `file-md` · `file-text`.
- Each is `file` plus a mark or label. They follow the set's stroke and sit beside the existing `file`.

## Definition of done
- [ ] reference app: a category overview in `view="toc"` with `head="section"`, listing pages with no cards, groups as sub-headings; the same category in `list`; `cards` unchanged
- [ ] `PageHero size="compact"` and `PageSection level="page"` shown beside today's
- [ ] a DocumentLibrary folder in `assetsView="icon"` + `langView="chips"` beside `label` / `text`; a PDF EN/IS pair told apart
- [ ] the file-type glyphs in the icon gallery
- [ ] every current consumer renders unchanged with no new props passed
- [ ] published, versions named in the resolution


---

## Built — 2026-10-29 (held: publishes with the BrandLabToolWindow batch after the user's review)

Ready: kol-framework 0.65.0 · kol-styleguide 0.18.0 · kol-icons 0.53.0.

- **CategoryPage** takes `view` (`cards`, the default; `toc`, every page in the rail's order with label, lede or `card.body`, and `trailing`, card or not, groups as sub-headings; or `list`, the same rows as a Table with `columns`) and `head` (`hero`, the default; `section`; `none`; or a node). The seams are `pages`, `filter` and `renderItem`.
- **PageHero** takes `size`: `intro` (the default) or `compact` (no min-height). **PageSection** takes `level`: `section` (the default) or `page` (the title is the page's h1).
- **DocumentLibrary** takes `assetsView` (`label`, the default; `icon`; or `icon-label`; a pair of one kind gets a language subscript, and the tooltip and aria-label give extension and language) and `langView` (`text`, the default; `chips`; or `icon`). `fileIcon(file)` overrides the default `kindIcon` map. DocumentView and DocumentFiles take `assetsView` too.
- **kol-icons**: `file-pdf` · `file-doc` · `file-image` · `file-svg` · `file-video` · `file-audio` · `file-zip` · `file-md` · `file-text`, drawn on `file`'s outline. They are candidates for the user's review.
- **Today's look unchanged:** five pages were compared before and after (site-hub `/research`, `/research/compare` and `/brand`, document `/library` and an open document). The fingerprints are identical and the screenshot diff is 0 px.
- **Reference:** site-hub's Mission log `/log` (TOC with a section head; `?view=list|cards`, `?head=hero|none`; a compact hero on `/log/crew`; `level="page"` on `/log/flight-plan`) and apps/document `/library?assets=icon&lang=chips`.

**Remainder at kol-website:** bump once published; record's overviews take `view="toc"` with `head="section"`, and its library takes `assetsView="icon"` with `langView="chips"`.
