# Session: One menu engine, the faint tone, the Controls set

**Date:** 2026-10-31
**Agent:** Claude (Opus 5.5) — "Grim"
**Summary:** Menu became the only menu engine, indicators became real icons (• single, check multi), tone faint (oq-06) replaced Dropdown variant raised, showcase got a Controls set; published and mirrored to Figma.

## Changes Made

### Files Modified
- packages/component/src/molecules/Menu.jsx — `Menu` is the engine: trigger slot / `anchor`, `align`, `fused`, `closeOnSelect`, controlled open, tone copied onto the portalled panel
- packages/component/src/molecules/{Dropdown,MultiSelect,MenuItem,ContextMenu}.jsx — rebuilt on `Menu`; Dropdown `multiple` + `label`; MultiSelect `align`
- packages/component/src/molecules/MenuItem.jsx — `MenuRow` `indicator` (dot · check · chevron, kol-icons) + `kbd` (Kbd); `shortcut` deprecated
- packages/component/src/organisms/SettingsPanel.jsx — SettingsMulti on Dropdown `multiple` (no fake summary row, no typed ✓)
- packages/component/src/utilities/tone.js — `faint` in TONES
- packages/theme/kol-components-molecules.css — `.kol-tone-faint` (oq-06), raised as its alias; grey restored (raised block had split `.kol-tone-grey` from its rule); `.kol-menu-panel` tone-aware + `--fused` (was `.kol-dd-panel`, alias kept)
- callers swept (MediaLibrary*, ShapeDropdown, SplitToolButton, Combobox panel, AppItemMenuProvider, design-editor MenuTop/KineticPanel/BindDot, rack-hub StageParams, styleguide IconBrowser, metric) — typed ✓ ⌘ → indicator / kbd; MenuDropdown* → Menu* names
- apps/metric — sites + gear on a `kol-tone-faint` wrapper; single-pick menus wear the dot
- apps/controls — Menus page (9 behaviour specimens, page-level size/tone/align picker); Specimen `does`, `bare`
- showcase — `sets/controls.jsx` (mounts apps/controls); PreviewCard Align axis; menu previews take tones/aligns via `lib/controls.js`; MenuItem preview's fake offset "variants" removed
- figma/MenuRow.figma.js, figma/Dropdown.figma.js — dot, raised retired
- docs/operations/01-release/04-retirements.md — Dropdown `variant="raised"` → `tone="faint"`
- earlier: NavRail comment broke the Vercel build (Tailwind scanned `@max-[…]`) — reworded

### Features Added/Removed
- Published kol-theme 0.210.0 · kol-component 0.330.0 (also carries the five fxr lobby tickets a background agent built: BezierPathEditor, FunctionPlot, ParamBindDot, StepList slots, ColorPickerPopover footer) · kol-styleguide 0.20.0 · design-editor 0.24.0
- Figma library: `oq/06`, tone mode `faint`, Dropdown raised ×3 → _trash, MenuRow `dot`, date/⋮ current rows on the dot, MenuItem panel on the menu panel with a real Kbd cap
- Figma proxy--components `3:2`: the wireframe board explaining the engine

## Current State

### Working
- One engine; tone from the wrapper verified live (faint/grey/sunken panels match); align end flush; multiselect stays open; no typed ✓ › ⌘ in any menu (source + DOM scan)

### Known Issues
- Two looks remain on the one engine: Menu-family rows (38px, fill on hover and current) vs select rows; panel radius 8 vs the trigger's — W5, TALK
- Combobox and SplitToolButton still hand-roll their popover (marks fixed)
- The dot is ascii-dot drawn at 24 in a 14 slot; a real dot glyph would be an icon round
- Figma library unpublished (his click)

## Next Steps
1. Close the five fxr lobby tickets once kol-component 0.330.0 is live on the registry (cite the version)
2. W5 when he rules: one row look + one panel radius
3. Move Combobox and SplitToolButton onto Menu
