# Session: framework light-first — kol-framework 0.5.1

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** Closed the defect flagged consumer-side on 2026-07-20 (kol-chess theme-toggle arc): `theme.js` still modeled the OS-follow policy that theme 0.9.2 deleted — `getInitialTheme` seeded React state from `matchMedia`, and `useTheme` kept a `prefers-color-scheme` change listener, so state could read "dark" while the CSS rendered light. Consumers with a boot script (kol-chess) were masked; everyone else got the mismatch.

## Changes Made

### Files Modified
- `packages/framework/src/theme.js` — `getInitialTheme` = explicit choice (`data-theme` attr / saved toggle) `?? 'light'`; the `matchMedia` change-listener block removed from `useTheme`; policy comments rewritten to the light-first law. MutationObserver sync + saved-choice re-stamp untouched. Zero `matchMedia` refs remain; theme CSS already had zero `prefers-color-scheme`.
- `packages/framework/package.json` 0.5.0 → **0.5.1** · `docs/operations/SHIPPED-PACKAGES.md` row bumped.

## Current State

### Working
- Published: `+ @kolkrabbi/kol-framework@0.5.1`. **git push = user's (pinged).** Consumer bump lands app-side same session (kol-chess).

### Known Issues
- None from this arc — the 20/07 defect is closed at the source; the kol-chess boot script stays (correct belt-and-suspenders: pre-paint stamp kills FOUC regardless).

## Next Steps
1. Other framework consumers pick up light-first on their next routine bump — no action needed.
