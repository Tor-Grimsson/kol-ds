# Session: kol-atlas ticket — the prompt's password mode, bright OK, keyboard

**Date:** 2026-10-19
**Agent:** Claude (Grim)
**Summary:** ModalPromptPassword built with the Modal's button tone and keyboard gaps, verified in Playwright, published as kol-component 0.281.0, closed with a receipt to kol-atlas.

## Changes Made

### Files Modified
- packages/component/src/molecules/Modal.jsx — `prompt` options `type` + `placeholder`; OK `tone="inverted"`; focus on open, Tab trap, Enter on a button presses it; dialog roles
- showcase/src/previews/useModal.jsx — Password trigger
- packages/component CHANGELOG + package.json, docs/operations/01-release/02-shipped-packages.md, lobby ledger + done/, kol-atlas outbox receipt

### Features Added/Removed
- Published: kol-component 0.281.0
- Ticket closed: ModalPromptPassword (kol-atlas)

## Current State

### Working
- useModal preview: password field masked + focused; confirm opens on OK; Tab / Shift+Tab stay in the dialog

### Known Issues
- The native no-provider fallback cannot mask a password

## Next Steps
1. User pushes kol-ds-ui

## Amended — 2026-10-19

- kol-component 0.281.0 confirmed live on the registry; the kol-atlas remainder is the bump plus `{ type: 'password' }` in `apps/workspace/login/main.jsx`
