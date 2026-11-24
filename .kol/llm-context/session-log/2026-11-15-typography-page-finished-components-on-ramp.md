# Session: Typography page finished, components onto the ramp

**Date:** 2026-11-15
**Agent:** Claude (Fable 5.2), Opus agents for the Figma and code passes
**Summary:** The library's `↳ Typography` page is finished as two auto-layout frames (`font-sets`, `markdown-sets`); the old mono styles are gone from every component, in Figma and in code. He published the library.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-15-typography-page.md` — the plan, W1 to W8, all built except 6.5 (held)
- `.kol/llm-context/plan-2026-11-14-type-ramp.md` — 6.25 and 6.26 closed, 6.27 added
- `packages/theme/kol-type-mono-classes.css`, `packages/theme/kol-components-organisms.css` — `.kol-mono-*`, `.kol-helper-*` and the table cell classes read the ramp tokens (unpublished; CHANGELOG Unreleased entry)
- `docs/documentation/01-foundations/17-type-sets.md` (the two tiers), `03-typography.md`, `12-typography-lookup.md`

### Features Added/Removed (Figma library)
- Font sets are the whole 48-step ramp in four fonts: `sans` Special Gothic, `mono` JetBrains Mono, `serif` Malromur, `ui` Inter. 192 styles; weight is a variable mode (`weight` collection); a Malromur mode in `type`.
- Page: sections replaced by his auto-layout pattern. `font-sets` (sans, mono, serif, ui; `ui` also holds the `card` and `float` style tables) and `markdown-sets` (article, site, research, folio, workshop). One closed ramp per set.
- `SpecimenFontCard` `ramp=true` follows the type mode; long names wrap.
- Every component off the 16 old mono styles onto `mono/<step>` with a Medium weight mode where needed; three `mono/upper/*` styles for uppercase. Old styles renamed `_old/*`.
- `prose/*` and `sheet/*` leftovers renamed into `article/` and `research/`.
- `02 Typography` section gone: `Roles` and the `ui-font` doc frame in `_trash`; collection renamed `_ui-font`.

## Current State

### Working
- Library published by him with all of the above.
- Code change measured: 15 of 15 classes compute to their ramp step.

### Known Issues
- 11 old `sans/*` styles (heading-02, heading-05, body-01 and so on) stay: they follow the file's font mode, and moving them is the default-font change he is holding (7.3 in the type-ramp plan).
- `mono/label/shell-header-tab`, `mono/utility/28`, `mono/utility/12-upper-menu` stay by name (no ramp step fits).
- Line heights moved by about a pixel on mono 10, mono 16 and table cells; 19 components are 2 to 10px shorter.
- The table cells' 480px rule still sets `font-size: 0.65rem`.
- npm: kol-theme changes (ramp classes, set classes) unpublished.

## Next Steps
1. Back to Folio (W8 of `plan-2026-11-14-type-ramp.md`).
2. npm publish of kol-theme on his word; Inter as default sans stays held.
