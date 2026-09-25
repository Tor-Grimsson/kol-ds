# Session: The explorer pass — title root, buckets as folders, grid parity — and publish 0.220.0

**Date:** 2026-09-25 (ran 2026-09-23 → 09-25)
**Agent:** kol-ds-ui (Claude Opus 5.5 / Sonnet 5)
**Summary:** kol-olina's title-root ticket fixed on the user's own `apps/media` (5174), then a long live pass the user drove against Finder; shipped as `kol-theme@0.148.0` · `kol-component@0.220.0` · `kol-workshop@0.29.0`.

## Changes Made

### Files Modified
- `packages/component/src/organisms/MediaLibraryPages.jsx` — the bulk:
  - **Title root is derived**, not stored: `atTitleRoot = appRoot && !prefix && !pickedFile && !pickedFolder`; `setPrefix`/`pickFile`/`pickFolder` clear `appRoot`. `appRoot` is `false | true | 'top'`; `atTop` is the new level ABOVE the title (the columns' column 0), holding the title as one folder.
  - Rows and grid list `rootItems` at the root levels (the title at the top, the buckets inside it); buckets are folders — click highlights (`pickedBucket`), double-click / Enter opens.
  - One way up: `goUp` → `goFolder(parent)` → `goTitleRoot` → `goTop`; `goFolder` selects the child you left; crumbs route through it; the title crumb goes to the top.
  - Enter opens a selected folder / bucket / title, ⇧Enter goes up (page key listener, skips what a focused tile already handled).
  - Grid: arrows walk folders then files in screen order; ⌘↓ opens a folder; drag-select band moved onto the full-height pane; size slider in every grid state; folder / bucket glyphs `size="100%"`.
  - ⇧+arrows keep selecting under Quick Look and the window re-pages to the grown selection; Quick Look's own ←/→ ignore ⇧.
  - Crumb ends with a picked FILE or FOLDER in every view (was columns-only), and with a picked bucket at the title level.
  - `ContainerPreview` — one preview body for folder, bucket and title (glyph · name · facts); bucket totals from `folderTree`; Space Quick-Looks a picked bucket / the title.
  - SVGs open in Quick Look at a 640 box (inline style — Tailwind never generated the arbitrary class from here).
  - Row view: file glyph 26 = folder glyph.
- `packages/component/src/molecules/MediaTile.jsx` — opens on the click's own `detail === 2`; `dblclick` never arrived on folder tiles.
- `packages/component/src/molecules/KindPreview.jsx` — (earlier in the session) `inert` doc thumbnails.
- `packages/component/src/organisms/ColumnBrowser.jsx` — one glyph size (18) for folders and files.
- `packages/theme/kol-components-molecules.css` — tile image/video previews fill the tile (`width/height: 100%; object-fit: contain`, was max-only — a 24px favicon drew at 24px); doc-thumb page padding 12 → 40px (page space; ~5.5% of the tile, the pane's proportion).
- `packages/workshop/src/tags/TagModeOverlay.jsx` — Clear filters row inset to the tag rows (`pl-5 min-[1600px]:pl-6`).
- `apps/media/src/lib/shortcuts.js` — Enter / ⇧Enter in the sheet.
- `packages/{theme,component,workshop}/package.json` + `docs/operations/01-release/02-shipped-packages.md` — 0.148.0 / 0.220.0 / 0.29.0.
- `lobby/INDEX.md`, `lobby/inbox/title-root-flag-outlives-the-path-in-rows-and-grid.md`, `~/dev/projects/kol-olina/lobby/outbox/<same>.md` — 🟠 addressed, ADDRESSED / RETURNED sections, history line.
- `.kol/llm-context/AGENT-CONTEXT.md` — showcase coverage audit queued for next session.
- `_tmp/2026-09-23-title-root/` — screenshots (plus one pre-existing `.playwright-mcp/divider.png` swept in by mistake).

## Current State

### Working
- Everything above proved live on the user's `apps/media` (5174) under Playwright; gates green except `retirements` (FoundryCTA is DROP-READY — date-triggered, user said leave it).
- Registry: publishes reported `+`; `npm view` lagged at 0.219.0 right after.

### Known Issues
- ~~`retirements` gate red~~ — resolved in the addendum: FoundryCTA dropped, all 27 gates green.
- Touch work still untried on a real iPhone.
- Title / bucket keys in rows use a sentinel (`ROOT_KEY`) in `pickedBucket`; one-bucket consumers without `bucketLevel` could not be exercised (fixture has two buckets).
- Lessons the user paid for this session: an "addressed" ticket was checked only on the path it named; a JSX comment shipped as visible text; a TDZ blanked the page. Check the whole gesture set in each view before calling a ticket done.

## Next Steps
1. **Showcase coverage audit** (queued in AGENT-CONTEXT) — what the site shows vs not, with each exemption's reason.
2. Close olina's 🟠 tickets as they verify running.
3. D1 — tags and file editing.

## Addendum — after the publish (2026-09-25)

- **Preview gaps closed** (in 0.220.0): `ContainerPreview` — one body for folder, bucket and title; bucket totals from `folderTree`, access only when the bucket states it; Space Quick-Looks a picked bucket or the title. Sweep found nothing else blank that should not be.
- **Upload conversion documented as an option** — `docs/documentation/04-compositions/15-media-uploads.md` (+ both indexes, back-linked from the media app plan). The DS never converts; olina's recipe (from its current `apps/media/src/lib/upload.js`), the originals-folder choice, the `~/.dotfiles/bin` shell twins, a new-consumer checklist.
- **FoundryCTA dropped** (user's call, after first saying leave it): export out of `kol-component`, source → `_tmp/2026-09-25-foundry-cta/`, `CHANGELOG.md` Unreleased BREAKING, ledger row deleted + history line in `docs/operations/01-release/04-retirements.md`, removed from `showcase/src/nav/classification.js` (three lists) and the section-system doc. **Unpublished** — ships BREAKING with the next component release. Generated usage JSON and `06-manifest-tree.md` still name it until regenerated.
- All 27 gates green.
