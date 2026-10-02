# kol-monitor's bump — what the rehearsal found

**From:** `apps/rack` (the rack alone) and `apps/rack-hub` (its shell and pages around it) (2026-10-02): monitor's whole `src/`, copied from the clone and run on this repo's packages — the rack's files in `apps/rack/src`, the pages, stage and shell in `apps/rack-hub/src`. Monitor is on kol-controls ^0.3.0 · kol-component ^0.162.0 · kol-theme ^0.129.0 · kol-shell 0.40.0 · kol-framework ^0.36.0 · kol-icons ^0.25.0. The clone was only read; these edits are made in the kol-monitor repo itself, when it bumps.

**How it was checked:** every route and 15 interaction states screenshotted here and on `monitor.kolkrabbi.io` at the same viewport and diffed pixel by pixel (threshold 12/255), at 1600×1000, 1600×3000 and 390×844 on a touch device; every module compared one by one in the `init` rack plus a custom patch holding the 11 types `init` lacks. Scripts and screenshots: `_tmp/2026-10-02-rack-testbed/` (`routes.mjs` · `modules.mjs` · `states.mjs`).

## 1. Edits monitor needs (each one is in `apps/rack/src` or `apps/rack-hub/src` as the file to copy)

| Where | Edit | Why |
|---|---|---|
| `pages/CreatePage.jsx` · `ModuleDetailPage.jsx` · `PatchDetailPage.jsx` | `PageHeader` from `@kolkrabbi/kol-component`, not kol-shell | **Hard break** — kol-shell no longer exports it; every page throws at load |
| every `@kolkrabbi/kol-controls` import (15 files) | `@kolkrabbi/kol-hardware` | the rename; kol-controls 0.4.0 still re-exports, so this one is optional until the alias drops |
| `modules/parametric/Knob.jsx` | kol-component's `Knob variant="panel"`, old `variant` → `labelPlacement`, `onHold` → `ParamSheet` | hardware 0.4.0: a touch hold no longer opens the sheet itself. Verified: an 800ms touch hold opens it |
| `modules/parametric/Fader.jsx` (new) + `CvSlider.jsx` · `display/ConsoleModule.jsx` import it | `Slider variant="panel"` + `onHold` → `ParamSheet` | same break for faders. Verified on ModulatorGen's slider |
| 19 `<Button variant="grey">` (pages, StagePage, PatchTableOverlay) | `tone="grey"` | deprecated alias — works, warns in the console |
| `modules/utility/Module.jsx` | wrap kol-hardware's `ModuleFrame` (or add `kol-hw-panel` to its root) | needed for the touch fix below; `Case.jsx` · `eurorack.js` can go the same way, all pixel-identical |

Nothing else changes: the Stage's `@kolkrabbi/kol-component/atoms/RotaryDial` import resolves again (fixed here, in the export map).

## 2. Fixed in the design system for this bump (unreleased)

- **Dropdown list ignored zoom** — in the rack at 80% the preset list cut off 18 of 40 names (41 at 50%); live has the bug today. The list now zooms with its trigger.
- **Touch rung inside a module** — on a phone the Patch dropdown rendered 32px / 16px type (22 / 8 on live), and the fields in Expr · Oscilloscope · Recorder grew. `.kol-hw-panel` (ModuleFrame) opts a plate out. After it: 57 of 60 modules identical to live on touch.
- **`atoms/RotaryDial` subpath** — aliased in kol-component's export map.
- **`ShellSearchOverlay selectLabel`** — for the Add module search.

## 3. Result on the new packages

- **Modules:** 59 types, 60 instances compared. 56 identical pixel for pixel. The other four: Patch ×2 (the button change below), Sequencer (its steps start random), Constant (its `OUT` label is small now — live draws it oversized; the new one is right).
- **Tabs at desktop (1600 wide, both heights):** Home, Library (grid, list, patches, filter, search, a module page, a patch page), Create (case, modules), Stage (empty and a loaded stage) — **0% difference**. Settings: the theme toggle is 26px (28 on live).
- **Console:** no errors on any route.

## 4. What the bump visibly changes (the user's eye)

1. **The shortcuts sheet** (`S` in the rack) is a different design: no backdrop blur, a narrower panel, UPPERCASE labels, bold section names, right-aligned keys. Live: blurred backdrop, sentence-case labels, dim section names. `states/rack-shortcuts-{mine,live}.png`.
2. **Phones — the filter bar's tabs** (Recent / Saved, Modules / Patches, Settings / About / Repo) drop to their own row under the rule. On live they share the row, wrap "ALL MODULES" to two lines and push "Repo" off screen. `routes/pair-*-touch.png`.
3. **Phones — every app-chrome control is bigger** (the touch rung): buttons type at 16px, the Stage's bottom bar grows, the Settings theme toggle is 32px.
4. **Phones — Settings › shortcuts** stack the key under its label instead of beside it.
5. **Patch table drawer** — its header is 4px shorter.

## 5. Changed here on the user's word — monitor's own code, his to take or leave

- **Patch module buttons** — Load · Save · Clear · Export · Import were raw `<button>` tags (~17px); they are `Button size="xs"` (22px, the dropdown's height). To fit the 1U plate the column gap went 6 → 4 and the dropdown's wrapper lost a stray 5px of line. The Preset / File pair stays text: the DS's `xs` SegmentedToggle is 22px and does not fit the plate.
- **Add module** (`⌘K`) is kol-component's `ShellSearchOverlay`, not `overlays/LibrarySearchOverlay.jsx`.
- **Trackpad pinch** zooms the rack about the cursor (`rack/RackViewport.jsx`, the ctrl+wheel branch).
- **Icon ink** — six wrappers inked their icon on the alpha ladder (`ModuloSidebar` ×2, `VideoModulo` ×2, `CreatePage` ×3, `StageDock`); they are on `oq` here (the icons-use-oq law).

## 6. Monitor's own, not the bump's

- **Its glyphs are not kol-icons' glyphs.** The 27 rack glyph names monitor draws (waves, cables, logic gates, line shapes, pen caps, chevrons) exist in kol-icons as different drawings. Monitor keeps its own through the `iconComponent` seam, so the bump does not change them, and `apps/rack` carries monitor's. Which set is the truth is the user's call.
- `VideoModulo.jsx` calls `nav.setNavHidden` inside a state updater — React warns "Cannot update a component while rendering a different component" when the sidebar opens. Same on live.

## 7. Not rehearsed

- The dev-only pages (`/design`, `/dev/*`).
- Recording (the Recorder's export), file import / export dialogs, and audio-rate behaviour — the render loop runs and Mon / Out draw, but output was not compared frame for frame.
- Real iOS Safari: the touch runs were Chromium with a touch pointer.
