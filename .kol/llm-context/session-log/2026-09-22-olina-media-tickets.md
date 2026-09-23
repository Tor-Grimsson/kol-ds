# Session: kol-olina's five media tickets — dialogs, custom verbs, OS drop, fill height, tooltips

**Date:** 2026-09-22
**Agent:** kol-ds-ui (Claude Opus 5 / Sonnet 5)
**Summary:** All five DS blockers kol-olina filed against media.olina-productions.com (component 0.216.0) fixed in `packages/` and proved live in `apps/media` against the fixture.

## Changes Made

### Files Modified
- `packages/component/src/molecules/Modal.jsx` — `useModal()` gained `alert` (one-button, resolves `undefined`, `whitespace-pre-line` body); fallback path warns for prompt/confirm/alert.
- `packages/component/src/organisms/MediaLibraryPages.jsx` — every `prompt()`/`confirm()`/`alert()` in both pages replaced with `useModal()`; `fileActions.items` (consumer menu items, rendered after the built-ins, same `runAction` busy/error path); `onDropFiles(files, folderPath)` wired through both views (columns + rows) with virtual-root unrooting.
- `packages/component/src/organisms/ColumnBrowser.jsx` — `height` takes a number or any CSS length string; the resize drag measures the rendered rect as its base when uncontrolled-by-number; new `onDropFiles` seam on folder rows and columns, alongside the existing internal drag-to-move; exported `isFileDrag()`.
- `packages/component/src/utilities/Popover.jsx` — `Tooltip` now suppresses itself while a nested `Tooltip` inside its trigger is open (`TooltipNest` context), so a disabled-switch hint doesn't fight its row's hint.
- `packages/component/src/atoms/ViewToggle.jsx`, `packages/component/src/organisms/SettingsPanel.jsx` (`SettingsRow`, `SettingsSwitch`, `SettingsFooter`), `packages/component/src/organisms/ContentFilters.jsx` (layout strip), `packages/component/src/atoms/ActionButton.jsx` — native `title` replaced with the DS `Tooltip`; prop names unchanged.
- `packages/theme/kol-components-molecules.css` — `.kol-view-toggle` tone selectors loosened from `> button` to `button` (the buttons now sit one level deeper, inside the Tooltip's trigger span).
- `apps/media/src/main.jsx`, `apps/media/src/App.jsx` — `ModalProvider` mounted at the root; the `n` shortcut's folder prompt goes through `useModal()`; `fileActions.items` carries a fixture `Duplicate` (Finder-style ` copy`/` copy N` naming); `onDropFiles` uploads via the fixture and re-lists.
- `apps/media/src/lib/settings.js` — `COLUMN_HEIGHT` changed from `800` (px) to `'calc(100dvh - 224px)'`.
- `apps/media/src/fixture/store.js` — new `copy()` verb; `put()` accepts a `url` (object URL) that rides the record through rename/move; new `urlOf()`.
- `apps/media/src/fixture/client.js` — `mediaUrl`/`downloadUrl` prefer the uploaded object's own `url`; new `copyObject`; `uploadFile` creates the object URL.
- `apps/media/src/fixture/store.test.mjs` — extended: copy (success + already-exists), uploaded url survives a rename.

### Features Added/Removed
- Five kol-olina tickets closed: `media-pages-route-dialogs-through-usemodal`, `file-actions-take-custom-verbs`, `os-file-drop-onto-folder-seam`, `column-browser-height-takes-css-length`, `native-title-tooltips-in-ds-components`.
- Scope of the tooltip sweep was **media pages only** — the editor-chrome components (`LayerStack`, `TimelineDock`, `SelectionOverlay`, `ColorInputRow`, `ShapeDropdown`, `ColorRamp`, `SpectrumGrid`, `MediaLibrary`'s full-key hover) still carry native `title` and were NOT touched; no ticket in the inbox covers them and I wrongly said one did before checking.

## Current State

### Working
- All 26 `pnpm validate` gates clean.
- Verified live in `pnpm media` (port 5391, task-scoped, killed after): DS dialogs for New folder/Rename/Move/Delete; right-click Duplicate on a file (not offered on folders/multi); OS file drop on a folder row and a column, highlight + landing, internal drag-to-move unchanged; column browser fills the viewport and follows resize, drag starts from rendered height with no jump; icon ViewToggle and settings-drawer hints show the DS tooltip, no native title left on the media pages.

### Known Issues
- ⚠️ **Pre-existing bug found, not a media-ticket regression**: in Column view, dragging a file and dropping it onto another file's row renames the dragged file to the target's name instead of refusing the drop (`dragFor`'s `canDrop` has no file-onto-file guard). Not filed yet.
- Nothing published — component 0.217.0 (+ the theme patch for `.kol-view-toggle`) staged locally, pending the user's look.

## Next Steps
1. Publish component 0.217.0 + the theme patch once reviewed.
2. File the column-view file-onto-file drop bug.
3. If the native-title sweep is wanted beyond media, that's a new/separate ask — not assumed here again.
