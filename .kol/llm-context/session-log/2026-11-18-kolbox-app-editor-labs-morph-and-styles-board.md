# Session: kolbox: the groovebox style in code (Editor, Labs, Morph) and on the styles board

**Date:** 2026-11-18 (work ran the night of 2026-11-17)
**Agent:** Claude (Fable 5.2), kol-build-agents (Opus) for the builds
**Summary:** With Figma refusing edits, the groovebox style was built in code as `apps/kolbox` from the values already written in the Figma plan: tokens, kit, rail system, shell, overlays, floating timeline, and three screens on the real engine. Kolbox was then added as a fifth column on `apps/style`.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-17-kolbox-app.md` — new plan, W1 to W7; W1 to W4 and 7.1 marked built; W6 (parked) lists every guess, everything not built and everything not wired to the engine
- `apps/kolbox/` — new private app, port 5219, root script `pnpm kolbox`; `src/index.css` (tokens), `src/ui/` (42 parts), `src/labs/`, `src/editor/`, `src/morph/` (engine glue copied from `apps/minimal`'s seam), `src/pages/`
- `apps/style/` — `rows.jsx`, `Board.jsx`, `index.css`, `vite.config.js`, `package.json`: kolbox as the fifth style, 8 new rows
- `docs/operations/07-apps-tier/INDEX.md`, root `package.json` — kolbox registered
- `_tmp/2026-11-17-kolbox/` — check scripts, screenshots, the morph recording

### Features Added/Removed
- Routes `#/editor`, `#/labs`, `#/morph` (mode track Editor, Labs, Morph), plus kit specimens `#/dev/controls`, `#/dev/overlays`, `#/dev/timeline`.
- Rail system on one `Rail` shell: `LeftRail` and `RightRail` (`variant` editor, labs), `HomeRail`, `RailSection`, `ListRow`, `PropertyRow`, `FillRow`.
- Overlays in a body layer: `Menu`, `Popover`, `MenuBoolean`, `MenuBlendMode`, `MenuEffects`, `MenuFile`, `PopoverColor`, `PopoverStroke`, `PopoverEffect`, `PopoverEffects`, color parts.
- `MotionTimeline` as an overlay over the bottom 200; `ToolDock` and `ToolbarTransport` on one shell, at the canvas foot (an open timeline covers them).

## Current State

### Working
- Labs: real engine, opens on Flow, all 22 labs load, transport toolbar on the real clock, sliders redraw while paused.
- Editor: real engine; selecting a layer fills the right rail, editing writes back; the ten W13 overlay states open from their triggers.
- Morph: plays a real morph with the timeline driven by the engine's transport.
- Styles board: 5 columns, kolbox 25 of 29 parts.

### Known Issues
- Built from written values, not checked against Figma: every guess is in the plan's W6.
- Not built: corner split's settings button, effects picker tile images, File menu flyouts, Morph's add / edit / reorder step and Save, the Kinetic composer, most of the editor's menu bar and windows.
- Local state only: stroke position, sides, style, width profile; the six plain effects; the effect settings rows; extra blend modes; pages.
- The editor's canvas ground is the engine's near-black, not the canvas color. `Dropdown` opens the browser's own list. Decimals show a comma in Labs sliders.
- On the board at a 1600 window three older cells crop (minimal Section, float Field row and Property row); the board keeps a copy of three kolbox CSS rules.

## Next Steps
1. Figma: finish W20 of `plan-2026-11-17-groovebox-labs-editor.md` (selected row width, Layers tree), check the four screens, then fill the reference sheets (14.2).
2. When Figma is open: the W6 align pass, code changed to match the file.
3. His call (W5): whether design-editor gets host exports; kolbox reaches into its source until then.
