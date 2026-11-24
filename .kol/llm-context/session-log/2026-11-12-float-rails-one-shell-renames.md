# Session: Float rails on one shell, family renames, Float labs in Figma

**Date:** 2026-11-12
**Agent:** Claude (Opus 5.5)
**Summary:** Float Labs layout, the float file reorganised, one Rail shell with slots, Figma law card + hook + audit, library sweep, W12/W13 tool windows, Float labs screens rebuilt from instances, family-prefix renames, list-row selection, arrows/chevrons.

## Changes Made

### Files Modified
- `packages/design-editor/src/editor/labs/FloatLabs.jsx`, `float/Movable.jsx` — Labs in float style: stage fills the window, rails float, transport window movable from bottom-right.
- `packages/component` 0.368 → 0.375 — RailFloat (was FloatModule) with header/body/footer slots; RailHeader variant="float" (was FloatModuleHeader) with a title slot and expand/collapse; ModalDialog (was Dialog); list rows selected `fg-12` / hover `fg-04` (TreeRow, TocRow, IndexRow, MediaLibrary, ModalDialog settings rows); ⌘K capsule `px-3`.
- `packages/shell` → 0.128.0 — MenuFloat + MenuFloatRows (was MoreSheet/FloatMenu) with an optional RailHeader title; openers pass their label.
- `packages/design-editor` → 0.43.0 — ModalSettings, RailSettings, ModalLayerEffects, ModalColorModes (were Generator*/…Window). `packages/styleguide` 0.26.0 — ModalLab.
- `packages/icons` 0.70.1 → 0.71.0 — transport set in signal/transport; diagonal arrows centred 5–19; `chevrons-*` full set. Old drawings in `_tmp/2026-11-12-arrows-before/`.
- `figma/*.figma.js` — renamed to the new names; transport icons map to their sets; retired files in `_tmp/2026-11-12-codeconnect-retired/`. Published.
- `~/.claude/skills/kol-figma/LAW.md` (16 rules), `scripts/audit.js`, hook `~/.dotfiles/claude/hooks/figma-law.sh`.
- Docs: `04-compositions/24-float-system.md`, `11-shell-system.md`, `02-icons/01-inventory.md`, `01-release/04-retirements.md`, `10-figma/01-file-setup.md`, `10-figma/02-issues.md`.

### Features Added/Removed
- Every float Rail is a RailFloat instance; open and folded are one component; Expand/Collapse live once in RailHeader.
- Float file: one page per view, shared header, ↳ Parts, Float labs rebuilt (14 states) from library instances, ↳ Selection board (his pick: C, white wash).
- Old `editor--kol-ds-ui` GeneratorWindow / FloatLabsShell moved to `_stash`.

## Current State

### Working
- Library and Code Connect published by/after his GUI publish; float file updated; 0 "Title" headers left; audit 0 on library master pages.

### Known Issues
- ModalSettings is not in the float style (border, radius, regular buttons); he will mark it up in Figma.
- RailRow, AssetRow and the doc TOC row draw no selected fill in code or Figma.
- Old `_FloatModule` header frames remain on the float file's Parts / UI Views pages.

## Next Steps
1. Git push (his).
2. ModalSettings to float, from his Figma markup.
