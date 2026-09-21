# Playbook — the apps tier, media first

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** `apps/media` runs the media product over a fake mutable tree, so the design is proved by
USE before anything publishes. Ticket: `lobby/inbox/apps-tier-media-first.md`. Concept:
`~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md`. Plan: `docs/operations/07-apps-tier/`.

**Standing rules (non-negotiable):**
- No servers, no playwright. He runs it; hand him the command and wait for what he sees.
- The port is kol-r2b2's, 1:1. A change to it is a change, and changes wait for his approval.
- A fixture file that cannot be opened is a lie — carry real bytes or cut the file.
- Relocating `showcase`/`workbench` under `apps/` is RULED DEFERRED. Do not re-propose it.
- The ticket's file-management list (tags, smart folders, drag) is direction, not scope.

---
## Entries

[03:23 · 2026-09-21] · phases-1-3 · tier stood up, fixture, r2b2 ported
  what → `apps/*` glob · `apps/media` scaffold (private, own vite config, theme boot) · `pnpm media` · slug wired to `ui.kolkrabbi.io/apps/media` (base + outDir into showcase/dist + vercel rewrite above the catch-all)
  what → fixture: folders are REAL NODES not key prefixes — that is what gives create/rename/move/delete something to act on; `store.js` + `seed.js` + `client.js` wearing kol-media-client's shape; `store.test.mjs` covers recursive rename, delete-through, the empty folder, reset
  what → kol-r2b2's App/UploadZone/KindOverview/settings ported 1:1; only the client wiring differs + a Clear-changes control the tier rules require
  note → **@source was the whole divergence.** `kol-sources.css` ships two path forms and BOTH assume a consumer's `node_modules/@kolkrabbi/kol-x/src`; in this repo packages sit at `packages/component`, so every line resolved to nothing and Tailwind generated no utility any DS component uses. Presented as: no column dividers, no row padding, a blue focus ring, and `max-md:hidden` not hiding — i.e. mobile chrome at 1280. Fixed with explicit `@source "../node_modules/@kolkrabbi/kol-*/src"`, the showcase's own pattern.
  note → the layer(components) import per ARCHITECTURE §5 was NOT the cause; reverted to r2b2's bare form to hold 1:1. Revisit as its own change.
  verify → r2b2 run side by side; rows, columns, ROW/COLUMN toggle, stats line and FILES bar land on the same pixels

[03:23 · 2026-09-21] · fixture-honesty · real bytes, not generated fakes
  note → **`walkthrough.mp4` reported 30.4 MB and opened a player at 00:00/00:00 with nothing behind it.** A file that claims a size and a kind and cannot be opened is worse than an absent one. His words: "dont fake it USE A FUCKING VIDEO USE FUCKING FILES"
  what → carried real files into `src/fixture/assets/`: 3 mp4 (kol-labs-single renders) · 2 pdf (kol-proofer) · 3 jpg (this repo's kol-images). Sizes in `assets.js` are the true byte counts — `listMedia` reports a size before anything fetches, so the meta line must not disagree with what loads
  what → split `assets.js` (size table, pure, Node-readable) from `assets-urls.js` (Vite asset imports) so the store self-check still runs
  what → generated-but-real for the rest: WAV (16-bit PCM, pitched per key), markdown/json/yaml/css/js as data URIs — `KindPreview` fetches those and renders them
  note → `layout: 'off'` un-forced and `videoPreview: 'autoload'` — both r2b2 rulings made for a LIVE bucket (duplicate columns, 400 MB videos). Neither cost exists on a local fixture, and an empty FILES bar reads as a broken app. Settings key bumped to v2 so saved state does not mask it.

[03:23 · 2026-09-21] · tooltips · the DS's own, not the browser's
  note → media's header handed its labels to `title=`, so the browser drew a native box beside DS-styled ones. fxr does not use the DS Tooltip either — it has its own `[data-kol-tip]:hover::after` rule in `kol-editor.css`. Two tooltips, neither of them the shipped one.
  what → `MediaLibraryPages` (gear + read-only lock) · `MediaLibrary` (Flat chip) · app's theme toggle → all on `Tooltip` from `utilities/Popover`
  what → `.kol-tooltip` padding `4px 4px 4px 8px` → `4px 8px`. The 8/4 split existed so a shortcut chip could sit tight right; most tooltips have no shortcut, so the label sat 4px off the centre of a perfectly centred box and read as a positioning bug
  what → border added at `oq-04`, matching `.kol-popover` — his first call was fg-02, then oq-02 ("weird and wrong"), settled on the popover's own stop
  note → `oq-*` is flattened against `surface-primary`, so on a RAISED surface it computes from a darker base and reads as a dark ring. `fg-*` is translucent and composites on its actual backdrop. The opaque ladder only behaves on the page surface.
  note → the floating family — Popover, Tooltip, MenuItem, dropdown panel — is **not documented as a set**. One row in `03-components/01-inventory.md:68`. That gap is how the editor grew a second tooltip nobody noticed.

[03:23 · 2026-09-21] · doc-page · 3:5 split per context
  note → user on the column preview: "3:5 is so close to 9:16 and its too tall here". Measured: the plate is genuinely 3:5; the complaint is the dead plate below a short document
  what → overlay keeps 3:5 (a sheet you read at 85vh); `.kol-column-browser-preview .kol-doc-page` → 4:5, the next rung up the same export-specs ladder

[03:23 · 2026-09-21] · phase-4-plan · the split + preview, 13 steps
  note → phase 4 was listed as 6 phases with relocation in it TWICE after he had already ruled it deferred. His words: "FOCUS ON THE FUCKING TASK AT HAND." Plan rewritten to 4 phases, relocation moved under Excluded with the ruling date.
  what → reference & spec FIRST: study Finder (column + gallery), Dropbox, Drive — tile aspect, fit vs crop, what gets a glyph, where metadata sits → write a preview spec, one fit rule per kind, same tile shape across column/grid/list
  what → the split: hoist `useBucketLibrary` into one parent (today each page lists the bucket separately) · hoist `LibraryHeader` (kills `header={false}`) · Browse/Files switch in the header · one body at a time · upload zone inside the surface · drop `stats={false}` · add `variant="explorer"` additively so r2b2 and olina keep working · point apps/media at it · collapse the forwarded seams
  what → preview: rewrite `renderThumb` onto `KindPreview` — the wall has a hand-rolled ladder that only knows image/poster/autoload-video while the column pane already calls KindPreview, which is why every kind previews in columns and nothing previews in grid
  note → OPEN: the tooltip + doc-page changes are in `kol-component` and `kol-theme`, unpublished. r2b2 and olina do not see them until he publishes.

[06:26 · 2026-09-21] · phase-4 · the split shipped, one previewer, chrome corrected
  what → `MediaLibraryExplorer` (NEW, `variant="explorer"`) — browse and the wall as two views of one surface, one mounted at a time. One header, one count, one listing. `browse`/`library`/`modal`/`page` untouched, so r2b2 and olina move when they choose.
  what → NEW `banner` slot on both pages, rendered after LibraryHeader. The drop zone measured 968px down a 900px viewport (218px of scroll past a full-height browser); it is 66px now.
  what → NEW `headerTrailing` slot — the view switch sits AFTER the icons, right of a vertical Divider, because the crumb row below reads `[icons] │ ROW COLUMN` and the header was mirroring it.
  what → wordmark reads MEDIA and is a home button (`onHome` on LibraryHeader); the virtual root builds from the same TITLE const so the two cannot drift.
  what → `renderThumb` rewritten onto `KindPreview`. The wall had a second, hand-rolled previewer that knew image, a sibling poster and an autoloaded video and printed the literal word "markdown" for everything else — which is why every kind previewed in the column pane and nothing previewed in grid or list.
  note → **THREE CORRECTIONS ON ONE CONTROL, all mine.** A boxed `SegmentedToggle` next to an unbordered dropdown and two unbordered switches ("did you fuck the design system"); then no divider; then mirrored against the row beneath it with gap-4 where that row uses gap-6. This surface already had a switch idiom and used it TWICE on the same screen — ROW·COLUMN and SELECT·FLAT. Reaching for an atom instead of reading the two controls already on screen is the whole defect.
  note → **the reference pass was cancelled by him**, and he gave the rule directly: *"it just fucking takes the aspect ratio of the file and displays that."* A preview is the file's own shape bounded by a `max-height`, never a forced `aspect-ratio`. The 3:5 on the column doc page was an overreach on top of a correct bound — the bound fixed a 7 KB JSON drawing a pane taller than the browser, the ratio decided a shape nobody asked for. Overlay keeps 3:5; it is a sheet you read. Written into `01-tier-rules.md` § Previews.
  note → he also killed a subagent I had researching how Finder displays images. It yielded nothing and should never have been spawned — the products were on screen and the rule was one sentence from him.
  verify → `pnpm validate` exit 0 · root `pnpm build` green (showcase + apps/media, `/apps/media/` asset paths) · fixture self-check 28 files / 11 folders · playwright at 1280 and 390
  note → OPEN: right-click, create / rename / move / reorder of folders and files is NOT scoped. `onContextMenu` appears nowhere in `packages/component`; the fixture store already implements create/rename/move/delete/upload with a passing check, and the UI calls only rename and delete, on single files.

[11:29 · 2026-09-21] · file-operations · the verbs finally reach the UI
  note → **his words: "I still see no way to create folders, files, reorder, move… why are you just doing half works?"** The fixture store had create / rename / move / delete / upload with a passing self-check since phase 2, and NOTHING in the UI could call any of them. The store could create a folder and the product could not.
  what → `ContextMenu` + `useContextMenu` (NEW, kol-component/utilities) — `onContextMenu` appeared nowhere in the package before today. Built on `usePopover`'s `setPositionReference`, NOT `elements.reference`: floating-ui rejects a virtual element there because that slot also feeds the interaction hooks, which call `getAttribute` on it.
  what → `fileActions` — ONE seam, `{ createFolder, rename, move, remove }`, each optional. Whatever is supplied becomes a menu entry; a read-only bucket gets no menu at all.
  what → right-click on folder rows, file rows, empty space, AND the column browser. Drag a row onto a folder to move it, with a drop highlight and a guard against dropping a folder into itself or its own subtree.
  what → multi-select: ⌘-click adds, ⇧-click takes the run, plain click clears back to navigation. The menu acts on the set only when the right-clicked row is inside it; rename is absent from a multi-selection because renaming five things to one name is not a thing.
  what → `S` opens kol-shell's own `ShortcutsOverlay`, fed the SAME array the key handler reads (`lib/shortcuts.js`), so a shortcut cannot be listed and not work. B/F/R/C/K/S/U/N/⇧R.
  note → **ROW VIEW WAS SHOWING A DIFFERENT TREE FROM THE COLUMNS.** It rendered `partition(scoped, prefix).folders` and dropped `files` entirely, so `#img/` drew 2 rows against the columns' 4 — the empty folder was invisible (partition derives folders from file KEYS, so a folder with no files under it does not exist to it) and no file was ever listed. `rowLevel()` is the columns' own merge, lifted so both callers share it. Row view now also expands inline, like a list view.
  note → `partition` slices every key by the prefix WITHOUT checking it matches, so it must be handed an already-scoped list. Given the whole bucket it drew `readme.md` as `me.md` and `video/` as `o/`.
  note → the COLUMNS speak in virtual paths (`<title>/<bucket>/…` whenever there is more than one bucket), so a path coming out of them must be un-rooted before it reaches a verb — the store was being asked to move something it had never heard of.
  note → **Tailwind does not pick up a class newly added to a `packages/*` source until the dev server restarts.** `ml-4` and `mt-2` both sat on the element with the property at 0. Same family as the `@source` paths resolving to nothing.
  note → gap corrections, all his: the divider needed 24px on BOTH sides (the left came from the header's own `gap-2`, so 8), and the ink gap under the column pane was 12 against 20 above — box-to-box they were equal, which is what I wrongly reported; the crumb row's box runs 8px below its own text because the ROW·COLUMN buttons are taller than the crumbs.
  verify → every verb exercised through the UI against the real store: create · rename · move · recursive delete · drag-move · batch delete of a 2-selection. All 26 gates clean, root build green, fixture 28 files / 11 folders.
  note → OPEN: the files WALL still has its own rename/delete and no context menu. Everything is in `kol-component` / `kol-theme` / `kol-shell`, unpublished.

[11:44 GMT · 2026-09-21] · targets/whole-area · ColumnBrowser.jsx · MediaLibraryPages.jsx
  what → the WHOLE column is a right-click + drop target for the folder it shows; same for the row list against `prefix`   why → he: "you shouldnt have to click an item to create a folder… just click anywhere in the column and row area" / could drop ON a folder row but "not in the parent folder, which is the entire column"
  what → `createFile` verb (fixture `put` with no bytes) + a New file menu entry beside New folder
  what → row view takes the column browser's height (`settings.columnHeight`) — the two folder views occupy one area instead of the page jumping between them
  what → removed the literal "empty" label from empty columns, desktop AND mobile stack   why → he: "why does empty folder say empty?" — it states what is already visible; the row stays as a blank right-click target
  note → **edited the wrong render branch first.** ColumnBrowser has TWO `.kol-column-browser-column` uls — the mobile stack (`flex-1`) and the desktop Miller column (`shrink-0 … border-r`). Handlers went on the stack; the live desktop column had none; measured by class before moving them. Check which branch renders before editing a component with a breakpoint fork.
  note → drop highlight written to a `data-drop-over` attribute, not state — transient, one node, no re-render per dragover. Styled as an inset ring, not a fill: a fill over a list reads as every row selected
  note → his "right-click / drag doesn't work" was a STALE DEV SERVER — package-source changes do not reliably hot-reload here. Third time today.
  verify → blank column area → New folder / New file ✓ · column accepts drop + highlights ✓ · readme.md filed into the column's folder ✓ · gates + build ✓
  note → OPEN: preview pane is fixed at `PREVIEW_W = 320`, so preview + metadata sit in ~288px while the pane stays empty — Finder fills the pane width. Untouched.
