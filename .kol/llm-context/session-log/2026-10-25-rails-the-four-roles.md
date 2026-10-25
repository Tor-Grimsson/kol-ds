# Session: rails — the four roles on one frame

**Date:** 2026-10-25
**Agent:** Claude (Grim)
**Summary:** The rail system standardised through three of his reviews — `Rail role` (patch P · page H · settings , · bottom E) with one shell per job, `apps/rails` rebuilt on AppHub as the reference, the standard header and foot, 380 · 16, the bottom rail over the nav rail with `RailNav` inside, slider rows and the Input rail preset — published as kol-theme 0.190.0 · kol-framework 0.56.0 · kol-component 0.302.0. Also the site rail's 20 gutter, HubHomeBackReveal (kol-shell 0.82.0) and CanvasStudio's 1–9 snap.

## Changes Made

### Files Modified
- `packages/component/src/molecules/Rail.jsx` — `role` + `RAIL_ROLES` + `useRailKey`; the standard header (title · × · the hairline, 12 above · 24 below); the foot as a full-width band; `nav` slot; the DS grab pill on `resizable` (horizontal too); one scroll lock across stacked rails; `style`; no `w-full` on vertical rails; the phone rule
- `packages/component/src/organisms/RailKit.jsx` — `RailNav` (the collapsed nav rail's 48 icon column, no edge); `RailFoot` draws no rule
- `packages/component/src/organisms/SettingsPanel.jsx` — `role` (settings · page), `backdrop` defaults to the role's, no own Divider; `SettingsFooter` no own Divider
- `packages/component/src/organisms/SettingsSections.jsx` — `type: 'slider'` rows (fluid track, 3-char Input readout with the rail preset, label column 80)
- `packages/component/src/atoms/Input.jsx` · `molecules/Slider.jsx` — `Input preset="rail"` (8 at the sides), `Slider readoutPreset`
- `packages/component/src/hooks/canvasViewport.js` · `organisms/CanvasStudio.jsx` — `1–9` snap (`snapKeys`, `snapRef`, `SNAP_PADDING`, the `snap` row)
- `packages/component/src/organisms/NavRail.jsx` — the grab strip keeps no focus after a pointer press
- `packages/theme/kol-design-tokens.css` — `--kol-rail-w-app` 380, `--kol-pad-rail-app` 16; `kol-components-shell.css` — `--kol-shell-rail-open` 380 flat; `kol-components-atoms.css` — `.kol-control--rail`; `kol-animation.css` — `.kol-rail-grab--top` · `--bottom`
- `packages/framework/kol-framework.css` — `--kol-sidenav-pad-x` 20 on the site rail, the collapsed width derived from it
- `packages/shell/src/HubHome.jsx` — `backReveal` (HubHomeBackReveal, kol-shell 0.82.0, published in the morning)
- `apps/rails/src/App.jsx` — rebuilt on AppHub: the nav rail, Stage · Rack, the Hub's settings on `,`, P · H · E stacking, the Variants button's Rail axis (app · SiteLayout); the tabbed first build in `_tmp/2026-10-25-rails-tabbed/`
- `apps/rack-hub` — `backReveal: 'flip-card'` on Home and Library
- `showcase/src/open-questions/2026-10-24-b.jsx` (round 18 answered, 380) · `2026-10-25.jsx` (round 19 answered, no edge, `edge` the opt-in); `showcase/src/pages/Apps.jsx` (rails and site-hub rows); `scripts/validate-render.mjs` (rails routes)
- Docs: `04-compositions/19-rails.md`, `03-components/06-content-card-system.md`, `03-components/07-canvas-family.md`, the mdx for Rail · SettingsPanel · Input · Slider, changelogs, `02-shipped-packages.md`; `vercel.json` (the rails rewrite)
- Plans: `plan-2026-10-25-rails.md`, `-review-1.md`, `-review-2.md`; lobby: HubHomeBackReveal and CanvasStudioSnapPositions closed with receipts, `RailRolesOnMonitor` filed into kol-monitor
- Walks: `_tmp/2026-10-25-rail-roles/walk3.mjs` (25/25), `snap.mjs`, `_tmp/2026-10-24-home-back-reveal/`

### Features Added/Removed
- The four rail roles and their keys; the standard header and the foot band; `RailNav`; the DS grab on every resizable rail
- Slider rows, the Input rail preset; CanvasStudio's snap positions; the site rail's 20 gutter
- Retired: the rail-beside-the-nav-rail measurement (`_tmp/2026-10-25-rail-beside-retired/`)

## Current State

### Working
- Published and live: kol-theme 0.190.0 · kol-framework 0.56.0 · kol-component 0.302.0 · kol-shell 0.82.0; gates clean (props · roster · taxonomy · syntax · vault-links · render on rails, studio-hub, rack-hub, media)
- `apps/rails` (5206) is the reference: every rail on its key, both nav rails under Variants

### Known Issues
- The slider readout chip's remaining width is the Input atom's rung padding; `readout="value"` (plain digits) is the alternative if he wants it tighter
- The tabs in the settings rail wrap to two lines when an app passes `docs` (four tabs at 380 − 32); not raised with him

## Next Steps
1. kol-monitor: `RailRolesOnMonitor` — the modules out of the nav rail, the rails onto `Rail role` on the bump; the receipt comes back here
2. kol-mirror: bump to 0.302.0, `1–9` on the desk; fxr: labs and randomiser on the phone rule (parked)
3. Push is his on this repo
