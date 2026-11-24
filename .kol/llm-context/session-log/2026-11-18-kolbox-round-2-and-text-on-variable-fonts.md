# Session: kolbox round 2 (menu bar, windows, wired controls, Morph) and the editor's text on variable fonts

**Date:** 2026-11-18
**Agent:** Claude (Fable 5.2), kol-build-agents (Opus) for the builds
**Summary:** Closed my own list of what was short in `apps/kolbox` before his review, then, on his ruling, moved the editor's text engine from 98 static font files to variable fonts (Inter and Malromur), built in this repo's editor source.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-18-kolbox-round-2.md` — new plan; W1 to W5 and W7 built, W6 parked on Figma
- `apps/kolbox/src/ui/` — `Dropdown` (opens `Menu`), `Menu` (row `value`, flyouts, keyboard fix, nested layers), `Popover` (`PopoverShell`), `Modal` (new), `Slider` (text number box), `ListRow` (tree lead), `Tooltip` (stays in window), `TopRail` (`menu` slot), `disabled` looks on `Input`, `Dropdown`, `Tabs`, `Toggle`, `IconButton`; tokens dim, hover, modal, modal-wide
- `apps/kolbox/src/editor/` — `MenuBar.jsx`, `Windows.jsx` and `windows/` (five windows), `Properties.jsx` (controls on the engine, Typography section), `engine.js` (exports)
- `apps/kolbox/src/morph/`, `pages/Morph.jsx` — `StepPicker.jsx`, `Files.jsx`, step editing, reorder, Save
- `apps/style/` — kolbox `Modal` cell, tokens re-synced (57)
- `packages/design-editor/src/editor/modes/type/` (`families.js`, `fontLoader.js`, `textOutline.js`, `buildTypeSvg.js`, `axisRandom.js`, `cuts.js`, `MorphedText.jsx`, `state.jsx`) and its users in `editor/compose/`, `editor/float/`, `editor/params/schemas/text.js`, `components/styleguide/TypeBlock.jsx` — the variable font model
- `docs/documentation/04-compositions/14-design-editor-system.md` — new "Text and fonts" section
- `public/fonts/TG/TGMalromurItalicVF.ttf` copied in from kol-foundry; `public/fonts/inter/Inter-VariableFont_slnt,wght.ttf` added by him; the two Inter Tight TTFs moved to `_tmp/2026-11-18-inter-tight/`; old versions of the rewritten engine files in `_tmp/2026-11-18-static-cuts/`
- `_tmp/2026-11-18-kolbox/` — check scripts, screenshots, recordings

### Features Added/Removed
- Editor: the ten real menus with 17 flyouts; windows Shortcuts, Settings, Color Modes, Layer Effects, Batch export on `Modal`; 39 of 49 right rail controls on the engine, the rest disabled as "Not wired"; Effects lists the engine's 10 layer effects and 67 stages; canvas on the canvas color.
- Morph: add step, edit step, reorder, Save and reopen.
- Text engine: outline families are Inter (one file, weight 100 to 900, italic from the slant axis) and Malromur (roman and italic files, weight 300 to 900); weight is any axis value; old cut, Inter Tight and Google Inter layers read as Inter. The static cut system is out of the engine.

## Current State

### Working
- Export PNG and SVG with text layers; all cases export as paths; kerning and advances match the browser's drawing of the same files.
- `apps/editor` and `apps/minimal` place Inter text with 0 console errors.
- Styles board: kolbox 26 of 29.

### Known Issues
- The text engine was changed HERE, deliberately against ARCHITECTURE §3's mirror rule, on his word ("build it here … we will just tell fxr when we get to it"). kol-fxr does not have it; he tells them. Not published, bundle not built.
- Old cut names still show in the Generate letter mask, the ASCII font list, the Generate Cut window, pattern glyph tiles and `typography-cuts.js`, though every option draws as Inter. Kinetic type untouched. The two static TTFs stay, `showcase/` uses them.
- Wording changed in the editor's text pane ("Weight B", standard weight names; random morph's two lock options gone): for his review.
- kolbox: 31 menu rows disabled (their target is not mounted); Settings' Theme row not wired; seen and not fixed: Morph's first step draws as a half circle at 0 s, Labs' Rolls row stacks three buttons, a "Not wired" tip sits over a divider.
- Parked on Figma (W6): corner split's settings button, effects picker tile images, file browser, modals and mobile views in code, the align pass.

## Next Steps
1. His review of kolbox (`pnpm kolbox`) and of the text pane wording.
2. Figma, when it opens: `_tmp/2026-11-18-sheets/14.2-p4-resume-call.js`, the audit, the twelve mobile screens beside his.
3. The old cut names in the other pickers, on his go.
