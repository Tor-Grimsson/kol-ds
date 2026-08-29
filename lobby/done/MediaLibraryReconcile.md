---
component: MediaLibraryReconcile
source: kol-r2b2/src/FileList.jsx#L1-L698
staged: 2026-08-26
status: draft
deps: [MediaCard, MediaRow, ViewToggle, Divider, Input, Button, Icon, MediaViewer]
---

# MediaLibraryReconcile

## Purpose

Two renders of the same bucket, both on `MediaCard` / `MediaRow`, disagree at the
organism level. The DS `MediaLibrary` page variant
(`packages/component/src/organisms/MediaLibrary.jsx` → brand.kolkrabbi.io/library)
is the weaker one; kol-r2b2's `FileList` (media.kolkrabbi.io read-only ·
admin.kolkrabbi.io) is the one the user works in. kol-r2b2 trialled the DS
`MediaBrowser` as a tab beside FileList on 2026-08-15 and retired it 2026-08-26
("three renderings of one list; only FileList has paging, per-bucket settings,
duplicate folding and writes").

**Ask:** the page variant converges on FileList's read-only render so brand
`/library` and media. are one picture. Modal / picker variant untouched.

## Deltas — DS `MediaLibrary` (page) vs kol-r2b2 `FileList`

| | DS `MediaLibrary` | `FileList` | Converge on |
|---|---|---|---|
| Folders | disclose in place, `chevron-down/right` leading, depth indent (Finder list model) | click-to-enter rows, `chevron-right` trailing, `border-b var(--kol-fg-08)`, `hover:bg-fg-04` | FileList |
| Path | `PathBar` at the FOOT | breadcrumb `root / seg / seg` on TOP | FileList |
| Stats | none (system count rides the path bar) | `N folders · N files · size  ·  bucket: N files · size  ·  N system files hidden` under the breadcrumb; whole-bucket figures at root or in flat | FileList |
| Tiles | `.kol-media-grid` (~155px at 1500px content) | `grid-cols-[repeat(auto-fill,minmax(260px,1fr))]` | FileList |
| Sort | `SegmentedToggle` 4-way, no direction | label buttons; active carries `arrow-down` asc / `arrow-up` desc; click active flips | FileList |
| Flat | none | boolean `kol-control` toggle; folders stay, struck through | FileList |
| Paging | none — mounts everything | `pageSize` + `Show N more · N remaining` | FileList |
| Chrome | `ContentFilters` with title "Media library" · folder icon · N-of-M | bare toolbar, no title | FileList — the title is the consumer's page header |
| Card actions | Copy URL; download chip top-right | Copy URL + ghost `iconOnly="download"` inline (chip too) | FileList |
| Default sort | name asc | date desc | FileList, as a prop |

## Anatomy (FileList, read-only host)

```
div.flex.flex-col.gap-3
├─ breadcrumb   root / seg / seg
├─ stats line
├─ ul  FolderRow ×N          (always, any scope; click → prefix)
└─ toolbar block  div.flex.flex-col.gap-3
   ├─ row  justify-between
   │  ├─ left   filter icon · search icon → ghost Input
   │  └─ right  Flat · ViewToggle(icon) · Divider(vertical) · SortControls
   ├─ kind-filter row (when open)   `Kind` + chips with counts
   ├─ Divider(horizontal)
   ├─ grid of MediaCard  |  list of MediaRow
   └─ Show N more button (when paged)
```

## Props (page variant, proposed)

| prop | type | default | controls |
|---|---|---|---|
| `pageSize` | number | `60` | rows mounted before `Show N more` |
| `defaultSort` | `{ by, dir }` | `{ by: 'date', dir: 'desc' }` | initial sort |
| `flat` | boolean | `false` | initial flat mode |

Navigation becomes click-to-enter + breadcrumb. The Finder disclose-in-place
model is **dropped, not kept as a variant** — two navigation models in one
organism is the fork this ticket exists to end. If the DS wants it kept, that
is a 🔴 for the user.

## Styling (exact, from FileList)

- Breadcrumb: `flex items-center gap-1 kol-mono-12 text-fg-48`; crumbs are buttons `hover:text-fg-default transition-colors`, separator literal `/`
- Stats: `kol-mono-12 text-fg-48`; bucket + system-files spans `text-fg-32`
- FolderRow `li`: `flex items-center gap-3 py-2 border-b cursor-pointer hover:bg-fg-04 transition-colors px-1 rounded`, `borderColor: var(--kol-fg-08)`; icon box `w-8 h-8 shrink-0 flex items-center justify-center text-fg-48` with `folder` 18; name `kol-mono-12 flex-1 text-fg-default` (flat: `line-through text-fg-48`); trailing `chevron-right` 14 `text-fg-32`
- Toolbar row: `flex items-center justify-between gap-4`
  - left `flex items-center gap-2`; icon buttons `p-1.5 rounded transition-colors` — rest `text-fg-48 hover:text-fg-default`, active `text-fg-default bg-fg-absolute-08`; `filter` 16 / `search` 16; search expands to `Input size="sm" variant="ghost" width="200px"` placeholder `search name…`, Esc clears + closes, blur closes when empty
  - right `flex items-center gap-3`; Flat = `kol-control kol-control-sm kol-mono-12` + `kol-control--filled` when on, else `text-meta hover:text-emphasis`; `ViewToggle variant="icon"` (grid / view-list); `Divider variant="vertical"`
- SortControls: `flex items-center gap-4`; buttons `kol-mono-12 flex items-center gap-1 transition-colors` — active `text-fg-default` + `Icon` 10 (`arrow-down` asc / `arrow-up` desc), rest `text-fg-32 hover:text-fg-64`
- Kind chips: label `kol-mono-12 text-fg-32` "Kind"; chips same `kol-control kol-control-sm` pattern, text `{label} {count}`
- Grid: `grid gap-3 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]`; list: `flex flex-col`
- Thumb box: `w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden` (+ `cursor-zoom-in` when it opens the viewer); non-paintable kinds show `kol-mono-12 text-fg-48` kind label
- Show more: `kol-mono-12 text-fg-48 hover:text-fg-default transition-colors self-start py-2`
- Empty: `kol-mono-12 text-fg-48` "No files match." / "No files yet."

**Drop on recreation** (kol-r2b2 keeps them): Rename / Delete / click-to-rename /
Select mode + batch Move · Download · Delete; `SettingsPanel` (own ticket,
filed 2026-08-26); `bucket` / `settings` / `onSettings` props (become the props
above); `lib/api` + `lib/media` helpers (the provider already folds variants and
hides system files); the local `MediaLightbox` stage with its
`rgba(0,0,0,0.6)` shadow (keep the DS `MediaViewer`).

## States & interactions

- Folder row hover `bg-fg-04`; click enters (prefix); breadcrumb steps back
- Flat on: every object under the prefix, recursive, displayKey = path relative to the prefix; folder rows stay, struck
- Sort click: inactive → active ascending; active → flip
- Prefix / flat / search / kinds change → paging resets to `pageSize`
- Copy URL → `Copied` for 1.5 s; thumb click opens the viewer (image / video only); Esc closes

## Dependencies

`MediaCard` · `MediaRow` · `ViewToggle` · `Divider` · `Input` · `Button` ·
`Icon` · `MediaViewer` — all existing. `MediaLibraryProvider` keeps client
injection, variant folding and system-file hiding; its list model changes from
tree-with-expanded-set to prefix-scoped.

## Recreation notes

Same organism, same file. `FolderRow` / `PathBar` / `LibraryChrome` are replaced
by the shapes above; the provider grows `prefix`, `flat` and paging.
Long-term: FileList = `MediaLibrary` + a writes slot (an `actions` render-prop
or `onRename` / `onDelete` / `onSelect` hooks) so kol-r2b2 re-adopts and there
is ONE render of the bucket. Consumer here: `apps/brand/src/pages/Library.jsx:52`
`<MediaLibrary variant="page" client={mediaClient} />` — bump only. Text casing
at the call site.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.69.0 · kol-theme@0.53.0

The page variant is FileList's read-only render: breadcrumb `root / seg / seg` on top, the stats line (`N folders · N files · size · bucket: N files · size · N system files hidden`, whole-bucket figures at root or in flat), folder rows that ENTER a prefix (`folder` 18 · name · trailing `chevron-right`, hairline, `fg-04` hover; struck in flat), a bare toolbar (filter + search on DS nav Buttons | `Flat` chip · `ViewToggle` icon · vertical Divider · sort labels with `arrow-down` asc / `arrow-up` desc, click active flips), a `.kol-media-grid` at 260px tiles / gap 12, `Show N more · N remaining` paging, Copy URL + ghost `iconOnly="download"` beside the card chip. Props: `pageSize` 60 · `defaultSort` `{ by: 'date', dir: 'desc' }` · `flat`. The provider is PREFIX-SCOPED now (`prefix` / `setPrefix` / `crumbs` / `folders` / `flat` / `kinds` / `search` / `sort` / `sorted` / `shown` / `showMore` / `stats`); paging is keyed to what is listed so entering a folder resets it. Finder's disclose-in-place tree is dropped, not a variant. The picker keeps its ContentFilters chrome and foot path bar and navigates the same way. Measured live over the website bucket in the showcase: root `3 folders · 7 files · 2.6 MB · bucket: 433 files · 1.29 GB`, enter → crumb `labs-render-examples`, Name sort → glyph, Flat → 433 files / 60 tiles / `Show 60 more · 373 remaining` → 120, kind chips with counts, picker folders + path bar, no console errors. BREAKING for `useMediaLibrary()` consumers (`rows` / `expanded` / `toggleFolder` gone).

**Remainder here:** none — kol-r2b2 bump kol-component to 0.69.0 + kol-theme 0.53.0; brand `/library` is a bump only (`<MediaLibrary variant="page" client />`). Long-term: FileList = `MediaLibrary` + a writes slot — file it when you want ONE render of the bucket.

