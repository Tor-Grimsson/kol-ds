# Session: The apps tier stood up — media as a working file manager, proved by use

**Date:** 2026-09-21
**Agent:** kol-ds-ui (Claude Opus 5)
**Summary:** `apps/*` tier created from kol-r2b2's `apps-tier-media-first` ticket; `apps/media` runs kol-r2b2's media product over a fake mutable tree with real bytes, and grew the file-manager verbs the store always had but the UI never reached. Published component 0.216.0 · theme 0.146.0.

## Changes Made

### Files Modified
- `pnpm-workspace.yaml` — `apps/*` glob. `showcase`/`workbench` NOT moved (ruled deferred).
- `apps/media/` — NEW. Vite app, `private: true`, `pnpm media`; builds into `showcase/dist/apps/media` for the `ui.kolkrabbi.io/apps/media` slug (`vercel.json` rewrite above the catch-all).
- `apps/media/src/fixture/` — NEW. `store.js` (folders are REAL NODES, not key prefixes) · `seed.js` · `client.js` (kol-media-client's shape) · `content.js` (generated WAV + text data URIs) · `assets.js` / `assets-urls.js` (real mp4/pdf/jpg carried from kol-labs-single, kol-proofer, kol-images) · `store.test.mjs`.
- `apps/media/src/{App,UploadZone,KindOverview}.jsx`, `lib/settings.js`, `lib/shortcuts.js` — r2b2's app ported, then extended.
- `packages/component/src/utilities/ContextMenu.jsx` — NEW.
- `packages/component/src/organisms/MediaLibraryExplorer.jsx` — NEW (`variant="explorer"`).
- `packages/component/src/organisms/MediaLibraryPages.jsx` — `fileActions`, context menu, drag, multi-select, `banner` / `headerTrailing` / `onHome`, row view rebuilt (files + empty folders + inline expand + column height), `renderThumb` onto `KindPreview`, DS `Tooltip`.
- `packages/component/src/organisms/ColumnBrowser.jsx` — `onRowContextMenu`, `dragFor`, whole-column targets, "empty" label removed.
- `packages/component/src/organisms/MediaLibrary.jsx` — explorer dispatch; Flat chip on `Tooltip`.
- `packages/theme/kol-components-molecules.css` — tooltip `4px 8px` + `oq-04` border · column doc preview `max-height` not 3:5 · `.kol-media-thumb` · drop-target styles.
- `docs/operations/07-apps-tier/` — NEW shelf: INDEX · 01-tier-rules (shape, publishing, ownership, data, viewing, previews, gotchas) · 02-media-app-plan · 03-candidate-apps.
- `showcase/src/nav/classification.js` — `MediaLibraryExplorer`, `ContextMenu`, `useContextMenu` classified; NO_DEMO reasons.

### Features Added/Removed
- **The apps tier** — a product proved by USE over fake data before anything publishes.
- **File operations**: right-click on rows, columns and blank space · new folder / new file / rename / move / delete (recursive) · drag onto a folder or into a whole column · ⌘/⇧ multi-select with batch move/delete.
- **`S` shortcuts overlay** — kol-shell's `ShortcutsOverlay`, fed the same array the key handler reads.
- **Explorer** — browse and files as one surface; upload drop zone under the header (was 968px down a 900px viewport, now 66px).
- **One previewer** — every kind previews in grid and list, not just the column pane.

## Current State

### Working
- Every verb exercised through the UI against the real store: create · rename · move · recursive delete · drag-move · column drop · batch delete.
- All 26 gates clean; root build green (showcase + apps/media); fixture self-check 28 files / 11 folders.
- Published and tarball-checked: component 0.216.0 · theme 0.146.0.

### Known Issues
- ⚠️ **`kol-sources.css` resolves to nothing inside this repo** — both `@source` forms assume a consumer's `node_modules/@kolkrabbi/kol-x/src`; packages here are `packages/component`. Any app in `apps/` needs explicit `@source "../node_modules/@kolkrabbi/kol-*/src"` or DS utilities silently vanish (no dividers, no padding, `max-md:hidden` dead).
- ⚠️ **Package-source changes don't reliably hot-reload** — a new Tailwind class in `packages/*` sat at 0 until a restart (`ml-4`, `mt-2`), and the user saw right-click/drag as "missing" three times on a stale server.
- ⚠️ **ColumnBrowser has two `.kol-column-browser-column` uls** (mobile stack vs desktop Miller) — I wired the wrong one first.
- ⚠️ Theme 0.146.0 changes tooltip padding/border and the column doc preview for every consumer on their next bump.
- The files WALL has its own rename/delete and no context menu.
- Preview pane fixed at `PREVIEW_W = 320` — preview + metadata sit in ~288px; Finder fills the pane.
- `showcase`/`workbench` relocation under `apps/` — ruled deferred, not done.

## Next Steps
1. Preview pane width — fill the pane like Finder (preview + full-width metadata).
2. Context menu + drag on the files wall, so all three surfaces share one set of verbs.
3. Replace `prompt`/`confirm` with a DS dialog once the verbs have settled.
4. Close the lobby ticket `apps-tier-media-first` on the filer's verification.
