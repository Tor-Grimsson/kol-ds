# Session: primary hover is the well (dark only)

**Date:** 2026-10-10
**Agent:** Claude (Grim)
**Summary:** kol-fxr's PrimaryHoverIsTheWell closed — kol-theme 0.173.0; dark primary hover goes to the well, light kept.

## Changes Made

### Files Modified
- packages/theme/kol-base-tokens.css — `--kol-surface-secondary-hover` / `-press`, per theme: light rest −8 / −16, dark the well (10) and one past it (2) — **0.173.0, published**
- packages/theme/kol-components-molecules.css — primary tone hover/active read the new tokens
- lobby — PrimaryHoverIsTheWell → done/, ledger row + history; receipt in kol-fxr's outbox
- docs/operations/01-release/02-shipped-packages.md — kol-theme 0.173.0

### Features Added/Removed
- Two surface tokens for the secondary fill's hover/press

## Current State

### Working
- Measured on the running showcase: light 242 · 234 · 226, dark 25 · 10 · 2 on an 18 rail. Foundations gate clean.

### Known Issues
- The ticket asked hover = sunken in both themes; light was deliberately left alone (its well is white, would hover lighter) — explained in the receipt
- The hover tokens resolve at the theme scope, so a local override of `--kol-surface-secondary` no longer moves the hover with it

## Next Steps
1. Push
2. fxr bumps kol-theme ^0.173.0
