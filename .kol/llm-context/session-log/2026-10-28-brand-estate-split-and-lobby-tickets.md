# Session: brand estate split and a day of lobby tickets

**Date:** 2026-10-28
**Agent:** Claude (Grim)
**Summary:** kol-hq's estate-split tickets (brand-hub on the site rail, the guide outline, the brand app split, the stationery desk) and four kol-website tickets (Graphics/Patterns, social mocks + LetterheadB, the subdomain law, the private bucket and one sign-in), all closed with receipts.

## Changes Made

### Files Modified
- `packages/brand-template/src/guide.js` (new) — `GUIDE_SECTIONS` + `GUIDE_TEMPLATE`, kol-branding's guide outline blank (kol-brand-template 0.4.0)
- `packages/styleguide/src/BrandGuide.jsx`, `guideBook.js` (new) — kol-branding's guide renderer carried (0.8.0); `BrandAssets.jsx` + `brandBook.js` — Graphics, Patterns, graphics-patterns sections (0.9.0), drawn social mocks + LetterheadB card (0.10.0)
- `packages/media-client/src/index.js` + `selftest.mjs` — `KOL_BUCKETS.private`, `session` · `signIn` · `signOut` · `signInUrl`, cookie on the private list only (0.7.0); `packages/component/src/organisms/MediaLibrary.jsx` — asks the session once, re-reads buckets (0.306.0)
- `apps/brand-hub` — `SiteLayout` + site rail, pageWash fg-02, Guide (Blank, VOYAGER), Settings page
- `apps/brand` → `apps/brand-sections` (5207); new `apps/brand` home over sections + lab (5179); vercel, root scripts, manifest, showcase Apps entries
- `apps/stationery` — rebuilt: kol-branding's 35 stationery layouts as `src/boards/*.html` + the 16-sheet Brand comparison paper, all on VOYAGER; project details and numbers obscured to placeholders; old desk in `_tmp/2026-10-27-stationery-desk/`
- `apps/voyager-fixture` — `guide.js` (`VOYAGER_GUIDE`), social mocks + `letterheadB` on the manifest
- `apps/media-fixture` — fake session, `private` bucket
- `showcase/src/nav/classification.js` (BrandGuide), `showcase/src/pages/Apps.jsx`, `showcase/src/previews/MetricsDashboard.jsx` (metric.)
- Docs: `04-compositions/10-styleguide-system.md` § Guide, `16-app-anatomy.md`, `05-brand/01-manifest.md` + `02-packages.md`, `07-apps-tier/INDEX.md` (+ subdomain law), `04-stationery-desk.md`, changelogs, `02-shipped-packages.md`

### Features Added/Removed
- The brand guide outline in two versions (blank, VOYAGER) as published packages
- brand-hub is a site; the brand home over brand-sections and brand-lab
- The stationery desk on kol-branding's layouts, no private data
- BrandAssets parity with kol-website's /assets (kol-website now runs on it)
- The private bucket behind the one kolkrabbi.io sign-in

## Current State

### Working
- Live: kol-brand-template 0.4.0, kol-styleguide 0.10.0, kol-media-client 0.7.0, kol-component 0.306.0 (registry checked)
- Every ticket closed; PdfToolsFromStudio left untouched on the user's word (revisit after kol-studio moves into kol-website)

### Known Issues
- VOYAGER's mark SVGs are filled black, not currentColor — black logomark on the dark social mocks
- The guide outline's hero and Contents ledes still name kol-branding's research ("Another Creation", "sixteen chapters")
- The live cross-subdomain sign-in is untested here (kol-website's to check)
- The stationery quote/contract copy keeps Kolkrabbi's design-service shape with placeholders; for review

## Next Steps
1. His review of the guide outline copy, the stationery desk and the brand home
2. PdfToolsFromStudio when kol-studio has moved
3. Push is his
