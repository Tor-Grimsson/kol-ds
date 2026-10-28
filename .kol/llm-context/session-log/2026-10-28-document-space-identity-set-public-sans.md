# Session: the document space, the identity set, Public Sans

**Date:** 2026-10-28
**Agent:** Claude (Grim)
**Summary:** kol-website's MarkdownPage ticket became `apps/document` (W1–W5 of plan-2026-10-28-document): kol-atlas's documents as the fixture, the parser additions, the page proved block for block against kol-atlas's own engine, then shipped into kol-framework / kol-styleguide / kol-markdown / kol-theme and the ticket closed; Public Sans ruled as the document body; identity split out of the interface icon set; three more kol-website tickets closed on the way.

## Changes Made

### Files Modified
- `apps/document-fixture/` — kol-atlas's 27 client-visible documents + 29 reviews, `tabs.js` (`notes` · `numbered` per tab, kol-atlas's `proj`/`autoFn`), `link-cards.json` + `_assets/link-cards/` (the web link cards for the URLs the documents cite, 800px shots)
- `apps/document/` (5208) — `SiteLayout` + kol-atlas's tabs header, no TOC rail; `App.jsx` builds the previews index (`cardFor`) from the corpus and imports `MarkdownPage`, `LinkPreview` (kol-framework) and `DocumentIndex` (kol-styleguide); the app copies in `_tmp/2026-10-28-document-into-packages/`
- `packages/markdown/src/parse-markdown.js` (0.2.0) — anchors, numbered headings (`{ numbered }` for bare-integer `###`), marks incl. ✅, kol-atlas's meta-paragraph rule (`Dates|Date|Phases|Pages|Covers|Acceptance:` first line, a blank line closes), footnotes, pop-outs, media runs + `:::tabs` + `![caption](https://…)` lines, caption tokens, `%% thumb:`, nested link/code in bold and italic, heading `tokens`, plain-title slugs
- `packages/framework/src/MarkdownPage.jsx` · `LinkPreview.jsx` · `documentTabs.js` · `documentFiles.js` (0.58.0 → 0.59.0) — the page with kol-atlas's levels (`data-ms` · phase · `.tb`), one `p.when` per meta run, notes in one reading-order sequence (every external link a note where it stands, a note's own links join its list), `fit` · `ratio`; the hover card; the two glob helpers. `@kolkrabbi/kol-markdown` a peer
- `packages/styleguide/src/DocumentIndex.jsx` (0.12.0 → 0.13.0) — a folder's pages as `Contents` cards; a file row opens in `QuickLookFrame` + `KindPreview` with ‹ › paging; `BrandGuide.jsx` `Contents` takes a row's own `href`/`onClick`
- `packages/theme/kol-typography.css` (0.193.0 → 0.194.0) — `.kol-sheet` accent orange-300 / yellow-300 dark, `.media` fills (`[data-fit="contain"]`, `--media-ratio`), `ol.fns a` plain, `ol.fns.src`; `--body: 'Public Sans'` with four `@font-face`s from `/fonts/public-sans/`; `public/fonts/public-sans/` holds the woff2 + OFL
- `packages/icons/` (0.48.0 → 0.49.0) — `identity/studio` and `identity/brand` by ticket; `kol-icon-set-identity/` (`kolkrabbi` · `apps`) split out of interface with its own index/meta, the resolver reads three sets, `cuts.json` regenerated; the showcase's loader path followed the move
- showcase — previews `MarkdownPage` · `LinkPreview` · `DocumentIndex`, classification, `ICON_SETS` + categories gain identity, Round 23 marked decided (no Google Fonts fetch), `extract:docs` regenerated
- docs — `04-compositions/20-document.md` (new), `18-site-frame.md` parts, `02-icons/01-inventory.md` + INDEX (the third set), shipped list, four changelogs, phase log `09-phase-log/2026-10-28-document.md` + plan copy

### Features Added/Removed
- Published: kol-markdown 0.2.0 · kol-theme 0.193.0, 0.194.0 · kol-framework 0.58.0, 0.59.0 · kol-styleguide 0.12.0, 0.13.0 · kol-icons 0.48.0, 0.49.0
- Tickets closed with receipts: MarkdownPage, IdentityStudio, IdentityBrand, DocumentIndexFilesAndIcons049. kol-website told directly (his say) that kol-theme 0.194.0 is live and what to copy
- Rulings taken: "ok love it, fine for now" on apps/document; figures ship scale-to-fill with the props; identity separate from signal and interface; Public Sans like the reference

## Current State

### Working
- `apps/document` renders every fixture document from the packages; Project, SEO + GEO, Brief, Naming system match kol-atlas's engine block for block (37 notes in the same lists); hover cards, web link cards, Quick Look on file rows
- Gates: syntax · roster · imports · homes · taxonomy · vault-links · frontmatter · tags · previews clean

### Known Issues
- Pre-existing, not touched: `validate:preview-files` wants a `StudioDetail` preview (kol-shell); `validate:icon-ink` flags `AppItemMenuProvider.jsx:126`
- The Media page draws kol-atlas's `:::tabs` filmstrips as the grid (noted in the phase log); Overview and Client quote are their prose only (kol-atlas's generated blocks are dropped)
- My grouping of the identity set (`kolkrabbi` · `apps`) and `DocumentIndex` living in kol-styleguide (tier: it peers on kol-framework) are decided-for-review

## Next Steps
1. His push (every package above is live; the repo is behind it)
2. PdfToolsFromStudio stays in the inbox untouched until kol-studio moves into kol-website
3. If brand wants a PDF preview in the showcase's DocumentIndex preview, a fixture PDF is needed (none in the repo today)
