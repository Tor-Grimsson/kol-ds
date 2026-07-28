# Session: the navigation-button variant — theme 0.11.4 + framework 0.5.3

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** Consumer finding (kol-chess shell bar): the DS had no navigation button. Icon-only `.kol-btn` keeps the rung's horizontal padding → wide pill, and the only "active" chrome was `.kol-btn-pressed` (solid toggle fill) — tool-button semantics, far too loud for nav. User ordered a dedicated variant: square container, states that make sense for navigation.

## Changes Made

### Files Modified
- `packages/theme/kol-components-atoms.css` — new `.kol-btn-nav` variant (after ghost): square box (`.kol-btn-nav.kol-btn-{sm,md,lg}` padding 4/6/8 all sides → 24/30/36 outer = the text-button height of the same rung, mixed bars line up). States: rest `--kol-oq-48` glyph on transparent · hover the ghost wash (`--kol-oq-04` + on-primary) · **active = `[aria-current="page"]`** (`--kol-oq-08` wash + on-primary glyph) — NavLink sets the attribute natively, state is pure semantics, never the pressed fill.
- `packages/framework/src/ThemeToggle.jsx` — icon variant chrome ghost → `kol-btn-nav` (needs theme ≥0.11.4); doc comment updated.
- Versions: theme 0.11.3 → **0.11.4** · framework 0.5.2 → **0.5.3** · `docs/operations/SHIPPED-PACKAGES.md` both rows.

## Current State

### Working
- Published: `+ @kolkrabbi/kol-theme@0.11.4` · `+ @kolkrabbi/kol-framework@0.5.3`. **git push = user's (pinged).** Consumer (kol-chess Shell) swaps ghost+pressed → `kol-btn-nav` same session.

### Known Issues
- None new — Button.jsx deliberately does NOT grow a `nav` variant: navigation renders as anchors (`<a>`/NavLink) with the theme classes; a `<button>` that navigates would be the wrong element.

## Next Steps
1. None here.
