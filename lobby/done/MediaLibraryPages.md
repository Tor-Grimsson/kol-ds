---
component: MediaLibraryPages
source: kol-r2b2/src/App.jsx#L1-L115 (header · bucket dropdown) + kol-r2b2/src/FileList.jsx (868 lines — the wall) + kol-component/src/organisms/MediaLibrary.jsx (the page variant it replaces)
staged: 2026-08-27
status: draft
deps: [MediaLibrary, ColumnBrowser, ContentFilters, ContentCollection, ContentCard, ContentRow, Dropdown, ViewToggle, IconFrame, kol-media-client]
---

# MediaLibraryPages — MediaLibrary becomes r2b2's two surfaces: Browse and Library

Brand's `/library` renders `MediaLibrary variant="page"` — the 08-26 reconcile of
r2b2's list. r2b2 has since moved on: `ColumnBrowser` (already a DS organism,
0.96+) over a file wall that lives as an 868-line app-local `FileList`. Brand
renders the old shape; r2b2 renders the new one from a fork. User 2026-08-27:
*"wouldn't it make sense to have these much newer components available in
library?"* — and the split, ruled the same hour: **one page for the content
filters, one page for folder/files, and a local gallery**. Bucket is a
control, not a page.

## The ask

`MediaLibrary` grows two variants that are r2b2's page, cut in two. Both take
the injected `client` (`{ listMedia, mediaUrl, proxied? }` — §3 stands) and
render read-only when there is no write seam.

### `variant="browse"` — folder / files

r2b2's header + `ColumnBrowser`:

- header: the bucket `Dropdown` (`R2B2 · all` + the buckets) · upload `IconFrame`
  when writable, `lock` when not · settings `IconFrame` — the three sit on the
  same sm ramp (`App.jsx:83-99`)
- the crumb line under it (`R2B2 / R2 · KOL-MEDIA`) with the `row | column` icon
  `ViewToggle` and the `ROW COLUMN` strip on the right
- `ColumnBrowser` on the flat key space; `prefix` in the URL hash as r2b2 does
  (Back/Forward walk folders) — or `prefix` / `onPrefix` controlled, the
  consumer's call
- the count line: `3 folders · 433 files · 1.29 GB`

### `variant="library"` — the content filters wall

r2b2's `FileList` promoted verbatim, minus the app wiring:

- `ContentFilters` — title `FILES`, kind filter (`mutuallyExclusiveFilters`),
  search on the display key, `layoutPlacement="header"` with `SELECT` / `TREE`
  (or `FLAT`) as the header strip, the `grid | list | off` icon `ViewToggle` in
  `trailingActions`, `SortControls` (`NAME · DATE ↑ · SIZE · KIND`) in
  `belowActions`, the selection bar in `leadingActions` while selecting
- the wall: `ContentCard` / `ContentRow variant="default"` — thumb, name, date,
  size, the download chip on the frame corner, `Copy URL`
- paging (`visible` + "N more"), the per-bucket list cache, the stats line
- the write actions (move / download / delete batch, rename) render only when
  the client exposes them — brand's read client shows none

### `kol-media-client` — one client, three buckets

`listMedia(prefix, { bucket })` and a `buckets()` list, so a consumer's bucket
dropdown reaches `R2 · kol-media`, `B2 · website`, `B2 · vault` through the one
client. r2b2's worker already takes `bucket=` on `/api/list` — asked r2b2
whether it answers for the B2 buckets from `admin.kolkrabbi.io` too (pending;
if not, the option lands with the worker change).

### What retires

- `MediaLibrary variant="page"` — replaced by the two above (alias one release)
- kol-r2b2's `FileList.jsx` — r2b2 swaps onto `variant="library"`; their call,
  their ticket

## Consumer side, so the shape is right

Brand's LIBRARY category becomes three pages: **Overview** = `variant="library"`
· **Browse** = `variant="browse"` · **Local** = the repo's own images on the
content-card family (no client — brand-local). Each DS page is one line.

## From kol-r2b2 (2026-08-27, same hour) — read before promoting

- **`FileList` is NOT stable today** — edited continuously, deployed minutes ago
  (overlay caption → hover bar on the media; preview frames snap to the
  export-specs ratio ladder, `src/lib/ratios.js`; column drags wired to
  per-bucket settings). **Ping `kol-r2b2` before promoting; they will freeze
  `FileList` for a day** so the promotion reads a stable file, not live src.
- **Do NOT promote the per-column width restore** (`COLUMN WIDTHS` in
  `FileList`) — a `width !important` hack around a prop that did not exist.
  It does now: `ColumnBrowser columnWidths` shipped in **kol-component
  0.115.0** (ColumnBrowserWidthsPersist). Build `variant="browse"` on the prop.
- **Four overrides in r2b2's `src/index.css` are corrections to
  `ColumnBrowser`, not house style — same pass, into the organism:** the last
  column drops its right border · the root column's single row drops its
  bottom hairline (`last:border-b-0`) · unselected files render `muted`
  (`text-fg-48`) while folders sit at full ink · the resize strip is the
  SideNav's pill (hidden at rest, 420ms ease, dead centre — pointer-following
  was tried and rejected), not an fg-08 wash.
- Everything else on that page is DS already (ContentFilters, ContentCard/Row,
  SortControls, SizeOrDownload, ToggleCheckbox media, LabeledControlSection,
  KindPreview + DocPage, AudioSheet/VideoSheet on PlaybackBar). What is
  genuinely r2b2-local: the bucket registry, the **R2B2 virtual root** (keys
  are `r2b2/<bucket label>/<real key>` with a baked folder tree, so columns
  need no fetch — the seam that lets one browser span three buckets), and the
  writes (upload / rename / delete / move). If `MediaLibrary` grows a writes
  slot, design it against that virtual-root seam.

### `kol-media-client` — verified live against prod

`GET https://admin.kolkrabbi.io/api/list?bucket=r2 | b2 | b2vault` → 200,
`access-control-allow-origin: *`, `cache-control: public, max-age=30`; no
param = `r2`, so an unaware client is unaffected; `/api/list` is public, only
writes sit behind Basic auth; the response shape is identical across providers
and **frozen** (kol-labs-single and kol-design-editor read it unguarded). So:
`listMedia(prefix, { bucket })` with ids exactly `r2` · `b2` · `b2vault`, and
`mediaUrl(key, { bucket })` **mapping id → public base** — `r2.kolkrabbi.io` ·
`b2.kolkrabbi.io` · `b2v.kolkrabbi.io` — never one host. Both B2 buckets are
**read-only** through the API (writes go through the `bucket` CLI): a
consumer's dropdown must offer no upload / rename / delete on them. Sizes: R2
433 · B2 website 3443 · B2 vault 4095 objects.

## Definition of done

- [ ] `MediaLibrary variant="browse"` and `variant="library"` render r2b2's page in two, read-only on a read client
- [ ] `kol-media-client` lists a named bucket (or the ticket says why not yet)
- [ ] brand's `/library` and `/library/browse` on the two variants with nothing local
- [ ] promoted from a FROZEN `FileList` (ask kol-r2b2 first), on `columnWidths`, with the four ColumnBrowser corrections in the organism
- [ ] r2b2 notified with the shipped version so `FileList.jsx` can retire

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.118.0 · kol-media-client 0.2.0

`MediaLibrary variant="browse"` (the header with the bucket Dropdown from `client.buckets()`, a lock when read-only, settings; the crumb line with ROW | COLUMN; `ColumnBrowser` on the flat key space with the virtual root — the title, then the buckets — and the baked `folderTree` seam; the count line) and `variant="library"` (FileList's wall verbatim minus the app wiring: ContentFilters with FILES · kind chips · search · SELECT / FLAT · grid | list | off · SortControls · the selection bar; ContentCard / ContentRow default with the frame-corner download + SizeOrDownload; paging; the per-bucket cache; the stats line; the inspector lightbox — image · VideoSheet · AudioSheet · DocPage through KindPreview, arrows fixed at the edges; your settings drawer on the DS SettingsPanel). Read-only unless the client carries `deleteObject` / `renameObject` / `downloadUrl`; `settings` / `onSettingsChange` + `defaults` = your per-bucket model (`SETTINGS_BASE`). `variant="page"` is a deprecated alias of `library` for one release. kol-media-client 0.2.0: `createMediaClient({ buckets })` → `listMedia(prefix, { bucket })`, `mediaUrl(key, bucket)`, `buckets()` — whether the worker answers for the B2 buckets from admin. is yours. Your `lib/media.js` + `lib/ratios.js` promoted verbatim to the barrel. 22 gates clean, the showcase builds; verified in source (no server run).

**Remainder here:** none — kol-r2b2: bump kol-component 0.118.0 · kol-media-client 0.2.0; build a client with `buckets: BUCKETS` and the write seams (`deleteObject`, `renameObject`, `downloadUrl`) and put App on `<MediaLibrary variant="browse" prefix onPrefix folderTree headerActions>` + `variant="library"`; `FileList.jsx`, `SettingsPanel.jsx`, `lib/media.js`, `lib/ratios.js` retire to `_tmp/`. Confirm the worker's `bucket=` for B2 from admin. · kol-website: brand's `/library` = `variant="library"`, `/library/browse` = `variant="browse"`, the local pages go.
