# Session: Apps review §6c — all six phases built

**Date:** 2026-09-29
**Agent:** kol-ds-ui (MBP, one /kol-goal force run)
**Summary:** The §6c build list of `plan-2026-09-29-apps-review.md`, end to end: every editor chrome reachable, the views gate, AppStudio, the panels lab, VOYAGER + the fixtures page, the brand catalogue + brand-hub. Bumped and changelogged, not published.

## Changes Made

### Files Modified
- `apps/editor/src/App.jsx` — one rail over `/` · `/labs` · `/randomiser` · `/core` (+ bare `/output`), path router under the Vite base, `/core` a full load, phone at `/` → randomiser
- `packages/design-editor` 0.17.0 — `setMediaClient` · `setMediaProxyBase` · `setSettingsStore` exported (LabsView/MobileView never got DesignEditor's media client → picked images rendered empty); randomiser = Generate · Effects (media first, effect sheet opens itself, media kept); `currentView()` reads the last path segment
- `packages/shell` (0.59.0, unpublished) — new `AppStudio` (Hub + Home · Library · Create · Use · pages · Settings, mono); `NavRail` fold chevron sm → md; README row
- `scripts/validate-views.mjs` (new, in `pnpm validate`) — V1: every View/Page/Screen/Layout/Editor/Library/Explorer/Dashboard/Book/Hub/Shell/Studio export is rendered by an app or showcase page, directly or through a parent
- `scripts/validate-render.mjs` — routes for editor · studio · panels · fixtures · brand · brand-hub; allowances narrowed to the compositor on phone
- `apps/studio` (5190) · `apps/panels` (5191) · `apps/voyager-fixture` · `apps/fixtures` (5192) · `apps/brand-hub` (5193) — new
- `apps/brand` — rewritten as the brand catalogue (14 routes on VOYAGER in kol-framework `PageLayout`, react-router)
- `apps/media-fixture` — `brandTool.jsx` to `_tmp/2026-09-29-media-fixture-brand-tool/` (no consumer), kol-brand dep dropped
- `showcase/src/pages/Apps.jsx` · `AppHome.jsx` (a `routes` table per app) · `nav/classification.js` (AppStudio: structure + NO_DEMO)
- Docs: `11-shell-system` § App tier · `14-design-editor-system` (the chromes, the host config, the panels) · `16-app-anatomy` § The Studio + brand · `07-apps-tier` INDEX rows · shipped-packages · the plan (§6c BUILT, §5 brand.<domain> answered)
- `vercel.json` rewrites + root `package.json` dev/build scripts for the five new apps

### Features Added/Removed
- Added: editor chromes on one rail; views gate; AppStudio + apps/studio; apps/panels; VOYAGER fixture (marks 7 · stationery 7 · deck 7 · diagrams 10 · graphics 41 · mood 4 · Playfair VF ×2; >2 MB → 1600px JPEG, 9.7 MB) + apps/fixtures; brand catalogue; brand-hub (Brand + opt-in Notes · Decks · Media tools, Editor app)
- Removed: media-fixture's `useBrandTool`

## Current State

### Working
- `pnpm validate` 31/31 · `validate:render` 20 apps / 124 views clean (6 allowed, all the compositor's) · `pnpm build` ✓ (21 builds) · voyager-fixture self-test ✓

### Known Issues
- Unpublished, bumped + changelogged (this session + the phases 1–5 run earlier today): design-editor 0.17.0 · kol-shell 0.59.0 · kol-component 0.229.0 · kol-theme 0.156.0 · kol-search 0.2.0 · kol-markdown 0.1.1 · kol-notes 0.2.0 · kol-deck 0.2.0 · kol-hardware 0.3.1 · kol-workshop 0.30.1 · kol-store 0.3.1 — and possibly the 09-28 set (kol-markdown/search 0.1.0 · theme 0.155 · framework 0.45 · component 0.228 · shell 0.58 · workshop 0.30) if that publish never ran; check npm before publishing
- panels shows bool params as a switch inline and an Off/On strip label-above — editor review

## Next Steps
1. Publish (engines → theme → framework → component → shell → the rest), then the user pushes
2. The phase log on the Development space — see the handoff
3. The workshop + showcase review (carried: the control-preview pattern)
