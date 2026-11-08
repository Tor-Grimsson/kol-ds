# Session: Labs on FloatLayout, the Figma library split into family files

**Date:** 2026-11-06
**Agent:** Claude (Opus 5.5) — "Grim"
**Summary:** Labs A/B ruled "neither is using float correctly" and rebuilt on FloatLayout; the Figma library reorganised into tier pages and every app's masters and screens moved out to per-family files.

## Changes Made

### Files Modified
- packages/design-editor/src/editor/labs/FloatLabs.jsx — `FloatLabsView` on kol-shell `FloatLayout` (catalog = nav Rail, capsule · transport · actions in the bar, LabsParams in the inspector slot, mode switch in `bottom`); `variant` and the A · B switch dropped
- apps/float/src/views/FloatLabs.jsx, apps/float/src/App.jsx — the A · B tabs removed, route label "Float labs"
- packages/design-editor/src/index.jsx — FloatLabsView comment
- docs/documentation/04-compositions/14-design-editor-system.md — float-labs row
- .kol/llm-context/plan-2026-11-05-float-editor.md — 3.2 ruled and built
- docs/operations/10-figma/INDEX.md + 01-file-setup.md (new) — the Figma file setup: the rule, every file, the library pages, the move steps, status, held and parked work
- docs/operations/INDEX.md, docs/documentation/06-research/05-figma-file-setup.md — links to it
- ~/.claude/skills/kol-figma/SKILL.md + scripts/audit.js — tier pages as master pages (TEMP staging ids added, then removed)

### Features Added/Removed
- Figma library: ↳ Components split into ↳ Atoms (index frame), ↳ Molecules, ↳ Organisms, ↳ Modules; placeholders to ↳ Not yet drawn; FloatLabsShell mirrored to the new Labs (rail expanded · collapsed)
- New Figma files (folder kol-ds-ui [library files]): editor, metric, brand, modular (published), media, presentation, website, document, layout, iconset, print (empty)
- Rule: a master stays in the library only if a published KOL package used by more than one app owns it; screens never live in the library

## Current State

### Working
- Labs on FloatLayout, checked live (expanded, `\` collapsed, an effect fills the params)
- All family moves done by the user; masters reparented, never recreated — keys, instances and Code Connect intact

### Known Issues
- ↳ Atoms index frame links to sections that left; family files' pages not set up
- ↳ Studio and ↳ Catalog--note--need--work held: need the Rail system, the Home system (HubHome, AccountForm sign in/up), CanvasStudio, and a real CatalogPage master
- ↳ Sets, ↳ Other apps, ↳ Not yet drawn undecided
- Inside masters: ~84 sample texts, 29 stacked Menu variants

## Next Steps
1. Cleanup pass: rebuild the index frame, set up the family files' pages
2. Build the Rail system, Home system, CanvasStudio and CatalogPage masters; then move studio / studio-hub to layout--kol-ds-ui
3. Parked: the article layouts (website → linked into document), a workshop document overview; W4 Randomiser and W5 Morph on the FloatLayout Labs
