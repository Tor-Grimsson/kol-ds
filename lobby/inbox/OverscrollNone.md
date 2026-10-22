# OverscrollNone

**Staged:** 2026-10-22 · from a kol-monitor session
**Change:** one rule in kol-theme's base layer — `html { overscroll-behavior: none; }`

---

## The problem, in one case
The page bounces (overscroll, rubber-banding) on Monitor's Home and Library in Safari and on iPhone. Monitor has no `overscroll-behavior` rule, and kol-theme's only one is in `kol-components-workshop.css`, which `@kolkrabbi/kol-theme/core` doesn't load.

Every app that fixed it carries its own copy:
- `kol-mirror/src/index.css:120` — `html { overscroll-behavior: none; }` (changed today from `-x`, which stopped only the sideways bounce)
- `kol-ds-ui/apps/{brand-hub,brand,catalog,editor,labs,hub,media,media-hub}/src/index.css` — `overscroll-behavior: none`
- `kol-atlas/apps/workspace/src/index.css:64` — `overscroll-behavior-y: none`

## The fix
`html { overscroll-behavior: none; }` in kol-theme's base layer (the one `core` and the umbrella both load), so every KOL app has it. Then the local copies can be retired.

## Rejected alternative
Adding it to Monitor's `src/index.css` — the tenth copy of the same rule.

## Definition of done
- [ ] The rule ships in kol-theme, loaded by `core` and the umbrella
- [ ] Published; kol-monitor's receipt names the version
- [ ] Monitor's Home and Library don't bounce on iPhone after the bump
