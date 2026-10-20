# Session: the stationery desk, the quote layouts, catalog search fix, Round 15

**Date:** 2026-10-20
**Agent:** Claude (Grim)
**Summary:** Built `apps/stationery` (a pan-and-zoom desk with the brand book's set, the real invoices and the kol-atlas quote mockups on A4), handed the quote · invoice · letter layouts over as the Kolkrabbi Stationery artifact, fixed the catalog search losing its query on click, lifted Blocks out of Templates, and put icon categories on Open questions as Round 15.

## Changes Made

### Files Modified
- apps/stationery/ (new) — `PanZoomViewport` over rack's dot grid; rows: brand sheets + Aftra / Studio 16 invoices (iCloud via `/@fs/`, PDFs rendered by `qlmanage` into `_tmp/refs/`), kol-styleguide stationery at print size wearing kol-brand's marks and `brandInfo(brand)`, the A4 row (letterheads, quote v1 · v2 · v3 in iframes with `.page` forced to 297mm and a red A4 line, blank invoice). Keys: Space+drag · ⌘ scroll · ⌘0 · G · T · S. Port 5202
- package.json, vercel.json — `pnpm stationery`, the build step, the `/apps/stationery` rewrite
- packages/component/src/molecules/SearchInput.jsx — a click outside closes the expanding search only when it is empty (the icon catalog lost its query on every tile click). **Unpublished** — kol-component 0.282.0 on his yes
- showcase/src/open-questions/2026-10-20.jsx — Round 15, parent categories for both icon sets (Arrows, Actions, … / Waves, Patterns, …), open
- showcase/src/lib/ShellChrome.jsx — Blocks lifted out of Templates as its own group, "Template blocks", between Modules and Templates
- showcase/src/pages/Apps.jsx — the stationery app entry (`/app/stationery`)
- docs/operations/07-apps-tier/04-stationery-desk.md (new, plan) + INDEX.md row and link

### Features Added/Removed
- The Kolkrabbi Stationery artifact: https://claude.ai/artifact/AnPpQodTF7GFhk2y7DRkYS — quote (3 pages) · invoice · letter on A4, v1's content on his own invoice system (two-tone lockup, navy ink, bordered table with tinted total, 18mm margins, mono `1.335.000,-`), fonts shipped with the page. The user takes it, iterates, and brings the layout back
- Ticket `QuoteDocument` (kol-atlas) stays open until the layout is settled; the ledger is untouched

## Current State

### Working
- The desk, verified with real input at 1440×900: fit at rest, zoom/pan/reset, G, T, S; every sheet 1123px; the five marks draw at their sizes; the lockup two-tone in the mockups (`.logo path` first/last)
- The rail: Modules → Template blocks → Templates → Apps

### Known Issues
- kol-brand has no two-tone horizontal lockup asset (only `kol-lockup-vert` carries the orange); the desk composes it from `kol-logomark` + `kol-wordmark`
- kol-styleguide's stationery mocks size the mark from its box; with kol-brand's viewBox-only SVGs the mark collapses to 0×0 unless the consumer gives a definite box (the desk does)
- VSK on the quote: 24 % in the mockups, 0 on the real invoices — his call
- The brand-book mocks (envelope, card, letterheads) are judged "boring / bad" — a redesign belongs to the stationery work, not done

## Next Steps
1. He iterates the artifact and shares the layout back → `packages/stationery` (Quote · Invoice · Letter · Envelope · BusinessCard, data contract, print CSS), the styleguide mocks move over, kol-atlas bumps, QuoteDocument closes
2. Parked behind it, all three said yes to: a `brand` function in the closed set with the branded components under it; rename kol-shell's `Logomark` (an SVG loader) so "Logomark" means the brand asset; a Brand chapter under Styles (Logos · Colors · Type · Stationery · Social)
3. Round 15 awaits his review; the SearchInput fix awaits his publish yes
