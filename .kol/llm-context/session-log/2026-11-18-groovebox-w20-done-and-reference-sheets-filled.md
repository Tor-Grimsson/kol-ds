# Session: groovebox in Figma: W20 finished, 15 reference sheets filled

**Date:** 2026-11-18
**Agent:** Claude (Fable 5.2), kol-figma-agents for the Figma builds
**Summary:** Figma accepted edits again, so W20's leftover bugs were closed and 14.2 was worked sheet by sheet: 15 of 20 sheets on `↳ groovebox reference` now hold our components. The run stopped when Figma refused edits again, five mobile sheets short and with the seven built mobile sheets unchecked.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-17-groovebox-labs-editor.md` — 20.1 built, 14.2 and the Status line current; ruling added to the laws: groovebox lists copy his reference, rows touch
- `_tmp/2026-11-17-groovebox/reference-sheets.md` — marks: 15 built, 5 to build, 18 reference for later
- `_tmp/2026-11-18-w20/`, `_tmp/2026-11-18-sheets/` — screenshots (ours beside his), `14.2-p4-resume-call.js` (the saved call for the last five sheets), `14.2-p4-ledger.md`
- No source code changed.

### Features Added/Removed
Figma file `SgfHBi22F7tYO7GHIorUbv`:
- W20: selected rows have equal insets in every rail (cause: the rail sections' right padding); the Layers tree has a type icon per row and his capture's spacing (ten `layer-*` glyphs; frame, component and rectangle are copies of existing glyphs); three stale `RightRail` instances replaced after the `PropertyRow` grid change; the Stroke title override in `editor` reset.
- Sheets built: design view docked, Surfaces, Controls, Menus, file browser grid, file browser list, design view floating, Modals, and mobile Log in, Recents card, Recents empty, Recents list, Search, Activity, Mirror.
- New components on `↳ shell` (rails Components 98:13865): group File browser (`Browser`, `BrowserTopBar`, `BrowserTitleRow`, `FileGrid`, `FileCard`, `FileList`, `FileListHeader`, `FileListRow`), Floating (`FilePill`), Modal parts (`Link`, `ModalSearch`, `ModalTabs`, `ModalFolderList`, `ModalFolderRow`, `ModalInviteRow`, `ModalAccess`, `ModalAccessRow`), Mobile 200:21313 (`MobileScreen` and about 35 parts, `BottomRail` on `Rail`), plus `MenuField`, `MenuHeading`.
- Changed components: `SplitButton` hover, `ToolButton` hover and `menu` chevron, `Dropdown` borderless padding (12 / 4), `MenuItem` icon ink per state, `Button` `menu`, `Shell` `top rail`, `RightRail` `floating`, `IconButton` icon fill, `HomeRail` matched to his sidebar, `Avatar` sizes and `letter`, `Input` text variants in sans.

## Current State

### Working
- The eight desktop sheets were looked at beside his originals; grid, list and modals match his positions.

### Known Issues
- Figma is refusing edits again. Not built: mobile Settings, File view, File view with menu, Comments sheet, Page picker (all parts exist; the call is saved).
- The seven built mobile sheets were never looked at, measured or audited. Colour mappings there are guesses (his blue to accent, his olive avatar came out red).
- Differences on built sheets: the floating view's toolbar is our small `ToolDock` (waits on W19) and its rail holds our editor content; modal buttons wider than his; filters row 28 against 24; controls 28 where his zoom field and selects are 24; `labs` borderless dropdowns moved 4 right.
- Audit: `LeftRail` and `RightRail` `variant` are two-value lists (becomes three with Morph, W17); the list-gap errors are waived by his ruling.
- Surfaces gaps awaiting his call: accent hover, disabled text, backdrop, disabled button.

## Next Steps
1. When Figma opens: run `_tmp/2026-11-18-sheets/14.2-p4-resume-call.js`, then the audit, then all twelve mobile screens looked at beside his with a measure table each.
2. Then W17, W18, W19 on his go.
3. Code: the kolbox align pass (`plan-2026-11-17-kolbox-app.md` W6) against the finished file.
