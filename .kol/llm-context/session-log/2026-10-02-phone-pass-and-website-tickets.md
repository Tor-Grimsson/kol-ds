# Session: The phone pass built, three kol-website tickets answered

**Date:** 2026-10-02
**Agent:** Claude (Grim)
**Summary:** The parked mobile plan was opened, his questions answered one at a time and built; three kol-website tickets were fixed; two publish waves went out.

## Changes Made

### Files Modified
- packages/theme — `.shell-main .kol-page` yields its x pad, cap and auto margin; `.kol-popover-float` caps at the window; `.kol-doc-body` wraps an unbroken run; the `tab` bundle; `.shell-tree`; `.kol-shell-rail-list` + its fade
- packages/framework — `--kol-pad-chrome-x` is 20 below 768, 24 from 768
- packages/component — `SectionSplit` frame is `w-auto` from 901px; `Button variant="tab"`; `TabChips` drawn from it, `size` on the control ramp
- packages/workshop — `ShellSidebar` (a group's own home leaves its fold alone; rail mode `full`), `ShellLayout` (`T`, the whole-tree overlay), external markdown links open a new tab
- packages/shell — `NavRail fade` / `AppShell railFade`: the rows in their own scroll region, fading at the foot
- packages/markdown — republished only (0.1.3)
- showcase — Lookup as one section of three groups (Start · Foundations · Taxonomy) with two new pages and homes; module categories sidenav · chrome · footer are one, `navigation`; `Nested` (Nested components · Used by) on every component page; a re-export is a roster row under its owner only; a glyph per rail group; module, card and set pages in `DocArticle`; the landing hero on a phone
- scripts — `validate:rail-pages` P5 (a title click expands nothing); `validate:roster` checks a re-export's owner exports the name
- docs — shells, shell system, control chrome, layout systems, shipped packages, five changelogs
- lobby — two kol-website tickets closed, one addressed; four outbox receipts synced to their destinations' ledgers

### Features Added/Removed
- Published: theme 0.164.1 · markdown 0.1.3, then theme 0.165.0 · framework 0.49.0 · component 0.239.0 · workshop 0.38.0 · shell 0.61.0
- Quarantined to `_tmp/2026-10-02-module-category-homes/`: the three old module category homes

## Current State

### Working
- All 32 default gates, `validate:rail-pages` (40 title clicks) and `validate:render` (23 apps) clean before the second publish
- Measured in the browser: the tree overlay, the Lookup rail, Game Picker's nested list, the tab chip (26px, `08` fill), the SectionSplit ratio at two desktop heights and at 390, the NavRail list and fade, the menu pages at 390

### Known Issues
- Phone pass, still open (`plan-2026-10-02-mobile-pass.md` § D): `/sets/preview/prints-store` scrolls sideways; `/documentation/01-tokens` 3px; the 3–7px gaps of § A6; the preview bar's cut-off dropdowns (A5) not looked at
- The registry check after each publish was blocked by the permission classifier — the versions are npm's own `+ name@version` lines, not `npm view`
- A package edit that adds a new Tailwind class is not picked up by a running showcase dev server until `showcase/src/index.css` is touched
- The showcase dev server on 5394 and rack-hub on 5296 were running before this session and were left alone

## Next Steps
1. User pushes kol-ds-ui
2. kol-website measures `section-split-frame-ratio-holds-at-desktop` on component 0.239.0, then it closes
3. The rest of the phone pass, § D of the plan
