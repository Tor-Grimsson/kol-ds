# Session: MediaLibrary Columns dock and the Get Info modal

**Date:** 2026-10-30
**Agent:** Grim (Claude Code, MBP)
**Summary:** Three kol-website lobby tickets on MediaLibrary built by background agents, published and closed with receipts.

## Changes Made

### Files Modified
- `packages/component/src/organisms/ColumnBrowser.jsx` — `previewPlacement: 'inline' | 'dock'` (inline default, unchanged render); dock pins the preview right at `columnWidths.preview`, columns scroll in their own strip; exports `COL_ICON`.
- `packages/component/src/organisms/MediaLibraryPages.jsx` — MediaLibrary passes `previewPlacement`, `'dock'` by default; ⌘I opens a private `GetInfoModal` (`QuickLookFrame` + `FullscreenOverlay`, Finder's Get Info facts); Space on a folder opens it too; the file preview is capped at 32vh at its own ratio, video at `#t=0.1`.
- `packages/theme/kol-components-molecules.css` — `.kol-column-browser-strip--dock` (kills a doubled divider on overflow).
- `showcase/src/previews/ColumnBrowser.jsx` — Inline / Dock toggle.

### Published
kol-component 0.317.5 / 0.317.6 · kol-theme 0.200.5 — verified at the registry.

### Lobby
ColumnPreviewDocked, MediaGetInfoModal, MediaGetInfoFileBody closed; receipts in kol-website's outbox (bump apps/media to 0.317.6).

## Current State

### Known Issues
- Dock mode with overflowing columns: the last column's resize handle and the pane's share one line; the pane's wins.
- A portrait video in Get Info draws narrower than the modal (32vh cap), an agent call not yet seen by him.

## Next Steps
1. Type lab review.
2. Close BrandLabToolWindow when he calls the review done.
3. ClaudeListIconSet import session.
