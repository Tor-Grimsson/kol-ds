# Session: fxr on a phone — labs, the randomiser, the editor

**Date:** 2026-10-05 → 2026-10-06
**Agent:** Claude (Grim)
**Summary:** The user's review of the live fxr apps on a phone, a research page, five bugs, the plan's five stages and his second review — all built locally on the recommendation, unpublished.

## Changes Made

### Files Modified
- apps/generator → apps/randomiser (package, vite base, root scripts, `vercel.json` redirect, showcase row, docs)
- packages/component — `usePopover` hover is mouse-only (no tooltip on a tap)
- packages/shell — `NavRail`: a section press folds/unfolds in an open rail; `sections="enter"` / `AppShell railSections`
- packages/design-editor — `mobile/device.js` (`useBelow`, `NARROW_BELOW` 768, `LABS_BELOW` / `EDITOR_BELOW` 1024); `LabsView` (entry card, source card, no empty rail, S → standard sheet, zoom keys, `setMountedView`); `LabsCatalogCard` (new); `LabsSourcePicker` (doors column + `LabsSourceCard`); `LabsParams` (chips as strip, source strip gone); `LoopFields` (pickers on Generate only); `EditorFooter` (▶ in the strip; transport sheet under the drawer); `MobileView` / `MobileOverlay` (one sheet height, stage above, grabber, picker not under the sheet); `PanelHeader` (`SheetGrab`, `SHEET_H`); `Editor.jsx` (note under 1024); `mode.js`; `keymap.js`; `index.lib.css` (hamburger light over the randomiser); `kol-labs.css`; Colour → Color in schema labels
- apps/labs, apps/editor-hub — `railSections="enter"`; apps/panels — labs' width test
- scripts/validate-render.mjs — the compositor's phone allowance deleted
- docs — `06-research/04-tools-on-a-phone.md` (new), research + vault index rows, design-editor system, apps tier
- .kol — `plan-2026-10-05-fxr-on-a-phone.md`, `backlog/2026-10-05-fxr-phone-findings.md`
- Quarantined: `_tmp/2026-10-06-labs-shortcuts-card/` (labs' own shortcuts card)

### Features Added/Removed
- Labs opens on an entry card (Effects · Generative · Vector · Composition); effects ask for media in a card
- Phone frame by width as well as touch; both sheets half/tall with a draggable grabber
- Editor under 1024: a note with doors to Labs and the randomiser
- Flowchart artifact published (claude.ai/artifact/N3RVTBPH1hXv3zXNrFZfZB) — he could not read it

## Current State

### Working
- Check kits in `_tmp/2026-10-05-fxr-phone-walk/` (review · verify · frame-narrow · stages · last3) all pass; `validate:render` clean on six apps; `pnpm validate` 31 of 32 (retirements, the iMac's drop)

### Known Issues
- Nothing published; kol-theme untouched, component · shell · design-editor carry `## Unreleased`
- Not read: effect.app, unicorn.studio, tekdetek — the research page names what was read
- Labs' draft-restore prompt appears on a second load in one browser (existing behaviour)
- The editor below 1024 is a note, not a layout

## Next Steps
1. His look at `pnpm labs` / `pnpm randomiser` / `pnpm editor-hub`, then a publish wave
2. kol-website's lobby tickets (this session, next)
