# Session: system-follow returns — theme 0.11.6 + framework 0.5.4

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** **USER LAW CORRECTED: `explicit choice > system/auto > light`.** The 0.9.2-era "light-first" law was over-read as "never consult the OS" (finished being enforced as such in framework 0.5.1 earlier today). The user clarified the intent: light is the *last-resort fallback*, not a blindfold — system/auto always outranks it, YouTube-style. Any consumer can still veto the OS by stamping `data-theme` (stamp = lock, no stamp = follow).

## Changes Made

### Files Modified
- `packages/theme/kol-base-tokens.css` — the dark surface/link token set now ALSO applies under `@media (prefers-color-scheme: dark)` scoped to `:root:not([data-theme])` — OS-follow gated on "no explicit choice stamped". MIRROR of the `:is([data-theme="dark"], .dark)` block (edit both — flagged in comments).
- `packages/theme/kol-theme.css` — same gated mirror for the dark shadow block.
- `packages/framework/src/theme.js` — `getInitialTheme`: explicit → `matchMedia` → light (fallback restored); the live `prefers-color-scheme` change listener restored in `useTheme`; policy comments rewritten to the corrected law. Net: 0.5.1's deletion reverted, but now the CSS follows too, so the 07-20 state-vs-render mismatch cannot recur.
- Versions: theme 0.11.5 → **0.11.6** · framework 0.5.3 → **0.5.4** · SHIPPED-PACKAGES rows.

## Current State

### Working
- Published: `+ @kolkrabbi/kol-theme@0.11.6` · `+ @kolkrabbi/kol-framework@0.5.4`. **git push = user's (pinged).** Consumer side (kol-chess) same session: boot script stops stamping `light` when nothing is saved.

### Known Issues
- **Showcase index.html boot still stamps an explicit theme** → the showcase itself stays OS-blind (its own choice as a docs site, but now a *decision*, not an accident) — revisit if the user wants the showcase to auto-follow.
- The mirrored dark blocks are duplication by design (CSS can't share a declaration block across a media gate without `light-dark()` refactor) — both carry MIRROR comments.

## Next Steps
1. None blocking. Optional later: migrate tokens to CSS `light-dark()` to kill the mirror duplication.
