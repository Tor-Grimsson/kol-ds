# Session: The minimal style: Figma kit, apps/minimal, and the styles board

**Date:** 2026-11-17
**Agent:** Claude (Fable 5.2), Opus agents for the app builds
**Summary:** A stripped-down UI style he calls "minimal" now exists as a Figma kit with four proof screens, as a demo app with Labs and the editor in it, and as a column on a new styles board in `apps/style`.

## Changes Made

### Files Modified
- `apps/minimal/` — new app. `src/ui/` (Button, Input, Slider, Select, Segmented, Toggle, FieldRow, Section, Panel, Bar, Toolbar, Sidebar, Icon), tokens in `src/index.css` under `@theme`, hash routes `#/labs` and `#/editor`; `src/labs/` (the real Flow generator, `loops/flow/obstacleFlow.js`), `src/editor/` (the real engine and canvas in minimal chrome). Port 5218.
- `apps/style/` — the styles board is the landing route (`src/Board.jsx`, `src/rows.jsx`, `src/folio-boot.js`); the earlier default-beside-float page is at `#/pair` (`src/Pair.jsx`). Aliases `@folio`, `@minimal`; `react-router-dom` added; `@kolkrabbi/kol-component` deduped in its Vite config.

### Features Added/Removed
- Figma file `NzEN7gwu5UyjipXiItWzXs` (des-tols), page `des minimal`: frame `minimal` 38:13873 (variable collection `minimal`, text styles `minimal/*`, 22 component sets incl. the sidebar parts; proof screens `minimal-editor`, `minimal-typelab`) and frame `minimal-labs` 44:14166 (`labs-flow`, `labs-glyph`). Slots carry content in Panel, Section, FieldRow, Bar, Menu, Toolbar, SidebarSub.
- Styles board: 21 rows by four styles (default 18, float 19, folio 9, minimal 13 parts), each cell the style's real component or a labelled gap; "Gaps only" switch; gap list by style.
- The style is local to `apps/minimal`; nothing went into `packages/`.

## Current State

### Working
- `pnpm --filter minimal dev`: Labs with Flow live and every rail control wired; editor with layers, inspector (transform, appearance, layer, plus loop and generate parameters), the engine's own timeline, transport.
- `pnpm style`: the board; roster gate clean.

### Known Issues
- The editor engine does not export what a host chrome needs (layer list and edits, the play clock, blend list): `apps/minimal/src/editor/engine.js` imports those from the package's source through an alias. Works in this repo only; a real chrome needs exports added on the kol-fxr side.
- Editor screen: shape, text, pattern, photo, kinetic type and group parameters not built; no reorder, remove or zoom; nothing saved; the timeline strip is in the float look.
- Labs: only Flow is built; Light mode, Audio, Style and Animation tabs are visual only.
- Board: default modal shows no header; Folio's toolbar scrolls sideways in its cell; default sidebar item shows closed.
- An agent removed one of its own test screenshots with `rm` (no-delete rule broken; nothing of his touched).
- Still open from before: his library publish, then linking the reading text in the three `folio` documents (plan-2026-11-15-folio-reading-styles.md W2.1, W3.2).

## Next Steps
1. His call on the minimal style: keep and move parts into the packages, or leave as a demo.
2. If kept for the editor: ask kol-fxr for the engine exports listed above.
3. Folio: publish, then the swap.
