# Session: ThemeToggle on the button ladder — kol-framework 0.5.2

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** User ruling (2026-07-28): the Button size ladder (sm 14 / md 16 / lg 18 glyph) is THE size reference for bar icons — the ThemeToggle icon variant's hand-rolled 36×36/20px chrome was a second sizing system living next to it. **This deliberately overrules the 2026-07-15 "36/20 = DS reference" ruling.**

## Changes Made

### Files Modified
- `packages/framework/src/ThemeToggle.jsx` — icon variant: new `size` prop (`'sm'|'md'|'lg'`, default `'md'`) → 14/16/18px glyph; chrome is now `kol-btn kol-btn-ghost kol-btn-{size} kol-btn-icon` (same classes as any sibling icon button) instead of the inline `w-9 h-9` + opacity-hover one-off. Hop variants untouched. Doc comment + overrule note in place.
- `packages/framework/package.json` 0.5.1 → **0.5.2** · `docs/operations/SHIPPED-PACKAGES.md` row bumped.

## Current State

### Working
- Published: `+ @kolkrabbi/kol-framework@0.5.2`. **git push = user's (pinged).** Consumer bump lands app-side same session (kol-chess shell bar, whose nav links use the same ghost icon-only chrome — one geometry across the bar).

### Known Issues
- Consumers that liked the old 36/20 will see md (16 glyph, ~30px box) after bumping — intended; `size="lg"` (18) is the closest bigger rung.

## Next Steps
1. None here — showcase demos pick the change up from source automatically.
