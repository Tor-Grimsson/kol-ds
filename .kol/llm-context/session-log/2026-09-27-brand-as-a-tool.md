# Session: Brand as a tool — kol-styleguide Brand, apps/brand, Apps tab

**Date:** 2026-09-27
**Agent:** kol-ds-ui (Claude Opus 5.5)
**Summary:** olina's brand book carried into kol-styleguide as `Brand` over a manifest; `apps/brand` runs it alone on the fixture, media-shell carries it as a tab, and the showcase gained an Apps door.

## Changes Made

### Files Modified
- `packages/brand-template/src/schema.js` — optional `book` (copy per section), `social`, `stationery.marks`, `logos[].previewWidth`, `type.note`, `meta.phone`, `location.street/postcode` (0.3.0)
- `packages/styleguide/src/` — new `Brand.jsx` (tool: Brand ⇄ Assets ViewToggle + DocsToc rail), `BrandBook.jsx`, `BrandAssets.jsx`, `BrandMark.jsx` (Logo component or raw SVG), `brandBook.js` (section registry, `brandInfo`, `scrollToAnchor`), `typeSpecimen.js`; peer on kol-framework (0.5.0 → 0.5.1)
- `apps/media-fixture/src/brandTool.jsx` — `useBrandTool`: kol-brand + website About/Tone copy + social templates on fixture images; re-exported from `wiring`
- `apps/brand/` (new, :5179) — the tool alone, page in the hash (`#assets`); root script, build chain, vercel rewrite
- `apps/media-shell` — Brand tab (`/brand`, `/brand/assets`, ⌥6), walkthrough step
- `showcase/src/pages/Apps.jsx` + `nav/shell-nav.js` + `nav/admitted.js` + `App.jsx` — Apps tab at `/apps`, full-page links to `/apps/<name>/`
- `showcase/src/nav/classification.js`, docs: shipped-packages, 07-apps-tier INDEX, 16-app-anatomy

### Features Added/Removed
- Carried class-for-class from kol-olina's apps/brand; deviations: arrow icon `text-oq-48` (icon-ink gate), `xl:pr-32` to clear the fixed rail, Logos/Branded default ledes dropped (they named olina files; 0.5.1)

## Current State

### Working
- Both pages render at 1440 and 390 in apps/brand and media-shell; rail + scroll-spy work; anchors never replace the host's hash route; 28 gates clean
- Published: kol-brand-template 0.3.0 · kol-styleguide 0.5.1

### Known Issues
- AssetTable ink dot / download ~16px tap targets (package's size, same in olina)
- Colour swatches are one per row below 640px (olina's `cols={{ sm: 2, md: 5 }}`)
- Apps page links only resolve on the deployed site

## Next Steps
1. Push (git owed) — apps/brand and the Apps tab go live on deploy
2. olina cutover to `Brand` + manifest `book`, filed from the iMac
3. Responsive/touch pass over media, shells, notes, presentation (not checked this session)
