# Session: One Header, ModalSettings to his mock, NavRailFloat, rails as windows

**Date:** 2026-11-13
**Agent:** Claude (Opus 5.5, then Fable 5.2)
**Summary:** Plan `plan-2026-11-12-one-header.md` W1–W11 built in code and the library; W12 (Float labs rebuild) waits on his library publish; W7.3 waits on his Wrappers strike-through.

## Changes Made

### Files Modified
- `packages/component` 0.376 → 0.378 — `Header` (variants nav · property · modal · settings), `ButtonSplit`, `collapsedV` / `collapsibleV` / `onCollapseV` / `onCollapseH` (fold names aliased), MenuFloat + MenuFloatRows moved in, `Slider readout="input"`, ModalDialog settings to his mock (no outer border, r20, 60/536/60), LabeledControlSection chevron at the head's right end, section spacing by gap.
- `packages/shell` → 0.131.0 — PropertyRail `windows`, transport `collapsedH` with one play/pause button and the small chevron.
- `packages/design-editor` → 0.46.0 — ModalSettings from base float parts only (Settings* wrappers aliased, NumberBox gone), Output as ButtonSplit + Button, FloatLabs right side as windows, no middot titles.
- `packages/theme` 0.225.0, `packages/dashboards` 0.17.0, `packages/styleguide` 0.27.0.
- `~/.claude/skills/kol-figma/LAW.md` — rule 17 (base components keep their names, no wrappers for nothing); rule 15 preset exception; rule 16 selection fg-12 / hover fg-04. `audit.js` updated.
- `figma/*.figma.js` — Header, ButtonSplit, Tab, NavRailFloat added; published.
- Docs: `04-compositions/24-float-system.md`, `11-shell-system.md`, `14-design-editor-system.md`, `03-components/01-inventory.md`, `01-release/04-retirements.md`, `10-figma/01-file-setup.md`.

### Features Added/Removed
- Library: one `Header` set (2055:15993); RailFloat `collapse-v` same tree, compact/wide lossless; `NavRailFloat` with `collapse-h` (2085:16101), NavRailFloatBody on `_trash`; ModalSettings (1975:17225) to his mock; `Tab` set (2099:9392); transport `collapse-h`; `↳ Wrappers` review page (2041:3, 79 hits).
- Float file: every header slot one Header; old rails rebuilt on RailFloat; Output as ButtonSplit; theme set once per page.

## Current State

### Working
- Code published and checked on screen against his mock; library checked against his mock; Code Connect published.

### Known Issues
- Library changes of 2026-11-13 are NOT published yet (his GUI step); the float file has not picked them up.
- RailSettings sections sit 8 apart after the padding went; NavRailFloat search text too bright; the standalone transport pill has no collapsed cut in the library; in Figma the Header's chevron does not flip by itself when a rail collapses.
- Trash must not be emptied before W7.3.

## Next Steps
1. His library publish + float file update, then W12: ↳ Float labs to `_trash`, rebuilt with the real Labs controls per effect, measured from the live app.
2. His strike-through on ↳ Wrappers, then W7.3 (remove) and W7.4 (audit guard).
3. Git push (his).
