# Plan — folio through the design system (apps/folio)

**Raised:** 2026-11-05, the user: *"in kol-website apps/records there is a 'folio ebook library reader and text editor' its largely off brand but it has big potential. I feel like taking it through DS and giving it consideration would improve it … im thinking apps/folio?"*. Earlier the same day: *"a much better system is folio"* (over note).
**Source (reference only, read 2026-11-05):** kol-website `apps/record/src/folio/` (17 files, ~3,850 LOC; its plan `kol-website/.kol/llm-context/plans/2026-11-04-folio-library.md`). Routes `/demo-4` (shelf), `/demo-4/:collection/*` (reader), `/demo-4/new` + `/demo-4/edit/…` (editor); `/demo-3/*` are static mockups of his Figma zzzb4WqmCsDTPlP95Weo2M 228:12990.
**Status:** DRAFT — 2026-11-05.
**Shape:** W › phase › list.
**Laws carried:** carry-through means verbatim; no DS pass before his evaluation ruling; a local copy of what the DS ships is a defect; data is consumer-injected, the package never fetches (the kol-notes ruling, 2026-09-04); the roundtrip closes a move (we build, publish, kol-website consumes and retires its copy to `_tmp/`); a new look goes on an artifact board before code; dark first; Rail words; family-prefix names; dev servers on the network; never rm.
**How a phase closes:** measurable acceptance line first, gates green, Playwright on shelf, reader and editor, desk and 390, both themes.

## What folio is today
- **Library:** record's markdown corpus bundled at build (`lib/library.js` glob over `data/*`), grouped into books of chapters by `lib/books.js` + catalogue rules + his `overrides.json`. Generated jackets (6 patterns × 6 colourways). Search on kol-search.
- **Reader:** one scrolling 72ch column (react-markdown + gfm), contents tree left, cover and originals right (FileQuickLook), media through MediaPlayer, IS/EN/DE toggle, related books, scroll progress in localStorage. No highlights, notes or bookmarks.
- **Editor:** markdown (textarea over highlighted lines; write/split/preview), code (CodeMirror 6 with lint and minimap), rich text (contentEditable, Google Fonts); menu bar, tool row, find bar, status bar, context menu, command palette, tabs, frontmatter panel; autosave, export, convert. Saving is a dev-only Vite plugin writing into record's `data/`.
- **Off brand:** its own token layer (cream paper `#faf9f5`, ink, mint, green, six accent hexes, its own dark), its own type scale (`.kol-reader-*`, local despite the prefix), ~280 arbitrary Tailwind values, hard-coded jacket hexes, third-party syntax themes, ~1,700 Google Fonts.
- **About 30 local parts a DS ships:** MenuBar, CommandPalette, SearchOverlay, ContextMenu, Choice (dropdown), SegmentedToggle, Input, Button, LibraryTree, KeysPanel, StatusBar, FindBar, document tabs, Jacket (cover card), ContinueCard, Masthead, ImagePicker, Figure, code Fence.

## W1 — Move it in, unchanged

### 1.1 — apps/folio, verbatim, on a fixture ✅
- Copy `src/folio/` and the catalogue code it needs (`lib/books.js`, `library.js`, `catalogue.js`, `subjects.js`, `twins.js`, `bucket.js`, `shelf.js`) to `apps/folio` (`pnpm folio`, `server.host: true`). Routes drop `demo-4`: `/` shelf, `/:collection/*` reader, `/new`, `/edit/…`.
- His private corpus stays in kol-website. apps/folio runs on a fixture corpus (a few books of public markdown, like media-fixture).
- Acceptance: shelf, reader and editor render on the fixture with 0 console errors; a screenshot pair of the original (kol-website dev) and the copy, same document, matches.

### 1.2 — The data seam ✅
- Everything folio reads or writes goes through one client the app passes in: `list`, `read`, `save`, `create`, `convert`, `meta`, `upload`, `assetUrl`. The fixture implements it in memory; kol-website implements it over its files and buckets.
- Acceptance: a grep finds no `import.meta.glob`, `@data` or bucket URL inside the folio code, only in the fixture and the consumer.

## W2 — Evaluate, then decide — TALK

His words: *"I would be very careful in w2 … we dont have components for this setup 1:1. I just want it in the apps/folio then evaluate what decisions we take"*. Nothing is swapped, restyled or packaged until he rules on the evaluation.

### 2.1 — The evaluation ✅
- One artifact page: for each of folio's ~30 local parts, a live screenshot beside the closest KOL part (if any), with the honest gap: same, close, or nothing like it. Then its tokens and type next to KOL's, and the data seam as it stands.
- Acceptance: every local part listed (script count = rows on the page); each row has both screenshots or "no KOL part".

### 2.2 — His decisions — TALK
- Per part: keep folio's, extend a KOL part, or make a new KOL part. Then the look (paper, jackets, accent, float or reading app, fonts), whether it becomes a package and goes back to kol-website, and whether note retires into it. Each decision becomes its own phase once ruled.

## Later — PARKED: after W2
- A package (`@kolkrabbi/kol-folio`) and kol-website's cutover, if 2.2 says so.
- Reader features it lacks: highlights, notes, bookmarks, pagination.
- A real save endpoint (today it is dev-only), for kol-website to build.
