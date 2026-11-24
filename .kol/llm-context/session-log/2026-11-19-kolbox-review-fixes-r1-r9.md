# Session: Kolbox review fixes, R1 to R9

**Date:** 2026-11-19
**Agent:** Grim (Claude Fable 5.2), with kol-build-agent and kol-figma-agent on Opus
**Summary:** His 19 review notes worked through: the editor's loading and `pnpm editor` in kolbox, one selection drawing, layer drag, rails on one grid, pinch zoom, and Line Swell, Tuner and System rebuilt from his canvas's own declarations. Plan: `plan-2026-11-19-kolbox-whats-left.md`, section R.

## Changes Made

- **R1** `compose/state.jsx`: a frames document opens as frames in any style. `apps/editor` starts in the kolbox theme under the kolbox style; the Page field resolves to a hex (`color/cssVar.js`); false "Saved" toast gone; the icon loader retries a failed fetch.
- **R2, R5** `SelectionOverlay variant="kolbox"`, `FrameChrome.jsx`: one line, four corner handles, size chip. `LayersList.jsx`, `frame.js` `placeInList`: drag into and out of frames, reorder.
- **R3, R4.2** Rail grid in `LabeledControlSection variant="kolbox"` (two 76 fields, two 16 icon columns, 8 gaps); closed titles in full ink; top rail right side at 24; dock glyphs 20; Morph is an effect row.
- **R6** `CanvasView.jsx`: `PINCH_STRENGTH = 0.01` (was about four times too weak), `gesturechange` handled, tuning key `kol.editor.pinchStrength`.
- **R7, R9** Done always writes the Tune row, Cancel added, H shows the mark alone; `apps/tuner` wears kolbox; panels equal `tuner-01-form`, `tuner-02-advanced`, `system-01-arcs`.
- **R8** `generate/lineSwell/spec/build.mjs` extracts every live board's `data-props` to `spec.json`; one panel draws any spec (`editor/kolbox/ui/RailTweaks.jsx`); Effects › Line Swell is a picture picker; the 24 references are the presets; Motion and Wave shapes boards are Labs loops.
- **Figma** Library: SelectionBox set 2423:217, dock, section titles, TopRail, FieldPair grid. Kolbox file: page `Tweaks panel` (388:10) and a Morph effect section.

## Current State

### Working
- Selection, layer drag, rails, Morph: re-run by the main thread on the merged code, all passing.
- Line Swell's nine forms match his boards side by side.

### Known Issues
- "No shortcuts work" and the missing glyphs were not reproduced (57 shortcuts pass in Chrome and Playwright's Firefox). Needs one failing key from him.
- Pinch measured in Chrome only; Firefox reasoned from Gecko source.
- R4.1 text settings waits for his reference.
- Library not yet published: Layout UI screens show the old look until he publishes and accepts.
- Figma's kolbox colors differ from the code's (rail `#19191d` against `#282828`).
- An agent ran `playwright install firefox` against the no-provisioning rule.
- The engine in `packages/design-editor` is ahead of kol-fxr; tell them before either side publishes.

## Next Steps
1. His publish click in the library, then accept in the kolbox file.
2. His reference for the text settings (R4.1).
3. To talk about: the no-comments rule and the video, both logged in the plan.
