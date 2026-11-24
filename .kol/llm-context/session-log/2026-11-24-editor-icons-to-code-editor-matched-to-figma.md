# Session: Editor icon set to code, editor matched to Figma, one-style plan

**Date:** 2026-11-23 to 2026-11-24
**Agent:** Claude (Opus 5.5)
**Summary:** The Editor icon set is synced Figma to code and closed; the editor's Home and chrome were matched point by point to Figma's file browser; his direction for one style is written down, not built.

## Changes Made

### Files Modified
- `packages/icons/src/kol-icon-set-editor/**`: Editor set closed at 204 (twins as `x` / `x-solid`, B redrawn, valign trio on Text-lines, brush-wide, pointer-node, magic-wand family, perspective, paint-bucket-drop, opacity, controls, flip dashed pairs); noise moved to `kol-icon-set-signal/wave`.
- `packages/icons/src/kol-icon-set-interface/navigation/nav-settings-vertical.svg`: new, nav-settings turned upright, for Figma's adjust button.
- `packages/icons/src/{aliases,tags,cuts}.json`, `scripts/icon-duplicates-baseline.json`, `scripts/icon-fills-baseline.json`, `docs/documentation/02-icons/01-inventory.md`: renames, twins, allowed pairs.
- `packages/theme/kol-components-atoms.css`: kolbox icons draw one 1px stroke at every size (`vector-effect: non-scaling-stroke`), the 1.875 lift gone; kolbox Button `outline` tone.
- `packages/theme/kol-components-molecules.css`: kolbox sunken ButtonGroup = field track, pressed cell on the page ground inside the line.
- `packages/component/src/atoms/Button.jsx` (outline tone), `atoms/Input.jsx` (md focus line inside, md glyph 18), `molecules/Menu.jsx` (kolbox shortcuts plain text, no caps), `molecules/TreeRow.jsx` (sm glyph 18), `organisms/RailSwitcher.jsx` (glyph 18, bottom pad 4), `atoms/ViewToggle.jsx` and media library toggles (`grid` / `list-bullet`).
- `packages/design-editor/src/editor/kolbox/ui/MenuMain.jsx`: Figma's order (Home on top, Actions, menus, app rows), 196 wide; Node select uses `pointer-node` everywhere.
- `apps/editor/src/kolbox/pages/Home.jsx`, `ui/HomeRail.jsx`: top bar Create, Share, adjust, star (outlined, 8 apart); Folders group removed; Figma's search drop-down (built by kol-build-agent, then sized to Figma: 11px text, rail field, 16 tiles).
- `apps/style/src/index.css`: dropped its copy of the stroke lift.
- `docs/documentation/03-components/01-inventory.md`, `04-compositions/26-kolbox-system.md`: updated for the above.

### Figma (iconset, `Lud0oSRKPTyHvT9MDVIczN`)
- Outline/solid pairs are one component set with `solid` true/false; new parts line-3-center, Design/paint-fill, Magnet/body-solid, Sparkle/plus-set; nav-settings-vertical output and cell. Abandoned Sliders/pair moved to `_trash`.

## Current State

### Working
- Editor set: Figma = code, checks clean (icon-tags, icon-fills, icon-duplicates).
- Editor app shows all of it from source; nothing published.

### Known Issues
- Home search panel: light theme not looked at; its field keeps the no-accent focus ruling (Figma has a blue ring).
- Folio is half on kolbox: search modal, code box, New document dialog, ⌘K caps, document alignment (plan points 1 to 7).
- He found both styles-overview artifacts useless (https://claude.ai/artifact/V4dp692syuwv6wwjweF9rZ); do not repeat that shape.

## Next Steps
1. One-style plan (`plan-2026-11-24-one-style.md`), his calls: folio becomes kolbox, default stays, minimal goes, float goes. Open: kolcore, the Hub's look for fxr/mirror/monitor, mixer apps on minimal.
2. Home screen to FXR: proposed `HubHome variant="kolbox"` in kol-shell, not agreed.
3. Interface and Signal export runs; publish only on his word.
4. Note in icons plan: a `folder-solid` in Figma's shape.

## Amended — 2026-11-24

- Published kol-icons 0.72.0, kol-theme 0.226.0, kol-component 0.379.0, design-editor 0.47.0; `docs/operations/01-release/02-shipped-packages.md` bumped. Push is due (his).
