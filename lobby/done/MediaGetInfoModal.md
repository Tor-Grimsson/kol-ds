---
component: MediaGetInfoModal
source: kol-component/src/organisms/MediaLibraryPages.jsx (0.317.4) — the ⌘I path (useHotkey(infoKey…) ~L1859 → spaceQuickLook → the folder overlay, setQuickLookFolder ~L1649); the file Quick Look modal (MediaInspector L659)
staged: 2026-10-30
status: draft
deps: [MediaInspector, Modal, FolderPreview, TagEditor, IconFrame]
---

# MediaGetInfoModal

## Purpose
⌘I (MediaLibraryInfoKey, 0.317.4) is broken as shipped. On a folder it draws the preview pane at overlay size with **no container**: a full-height folder glyph on a grey plate and a × in its corner, with the facts floating underneath over the dimmed columns (media.kolkrabbi.io, `kol-video/` picked). ⌘I should open a **Get Info modal**, Finder's ⌘I, inside the same container the file Quick Look already uses.

## Anatomy
- **Container**: the file Quick Look's modal (`MediaInspector`). Its header bar holds the name, a `·`-joined meta line and icon actions (copy URL · download · ×); the body sits under it. Same width rules, same scrim, same Esc.
- **Body**: Finder's Get Info order, using only fields the data holds:
  1. Head row: a small kind glyph (`IconFrame`, not a full-height plate), the **name**, the **size** right-aligned, and under them "Modified <date>".
  2. Tags: the existing `TagEditor`.
  3. General, as a key/value list:
     - Kind
     - Size, as bytes and readable, with "for N items" on a folder
     - Where: the path as a breadcrumb, bucket › folder › …
     - Modified or Newest (folder: its newest file's date; file: its uploaded date)
     - file only: Dimensions or Length when the kind has one
  4. File only: the preview, small (the Quick Look image or video at the modal's width), under General. Never the folder glyph as a hero.

## Variants
- folder: count and total from the rows under the path
- file: adds Type, Dimensions or Length, URL (copy)

## Props
None new. `infoKey` stays; what it opens changes from the bare folder overlay to this modal, for files and folders.

## Styling
- Reuse `MediaInspector`'s shell classes, and the facts list from `FolderPreview` / `Preview` (label `text-meta` left, value right).
- No `aspect-square` plate, no icon taller than the head row's line.
- Drop: the floating × on the plate.

## States & interactions
- ⌘I toggles it. Esc and the × close it. In Quick Look, ← and → step the selection as today.
- Read-only, except the tags field, as in the pane.

## Dependencies
`MediaInspector` (the container), `TagEditor`, and the facts rows the preview pane already computes.

## Recreation notes
A molecule-level `InfoBody`, shared by the folder and file cases, rendered inside `MediaInspector`'s shell. The Space Quick Look for files is unchanged. ⌘I is the info view, not the media viewer.

## Definition of done
- [ ] ⌘I on `kol-video/` (Columns) opens a contained modal: header bar, small glyph, name, size, "for N items", Where breadcrumb, Newest, tags
- [ ] ⌘I on a file opens the same modal with Type, Dimensions or Length and a small preview
- [ ] the giant folder plate is gone from every overlay path
- [ ] published, version named in the resolution

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.5** (registry live 2026-10-30). Built as below.

## Built — 2026-10-30

- `packages/component/src/organisms/MediaLibraryPages.jsx`
  - L539–572 — `InfoBody` (module-level, shared by folder and file): head row (`IconFrame variant="ghost" size="sm"` kind glyph, name, size right-aligned, "Modified <date>"), the tags slot, General as `text-meta` label / value rows, then a file's preview.
  - L574–636 — `GetInfoModal`: `QuickLookFrame` in a `FullscreenOverlay` (scrim, Esc), MediaInspector's shell. Folder: Kind, Size `N bytes (readable) for N items`, Where `bucket › folder › …`, Newest; header meta `N items · size`. File: Kind, Type, Size, Where, Modified, Dimensions / Length (read off the small `<img>` / `<video>`; audio loads a hidden `<audio>` for its length), URL with copy; header meta `size · dims · length`, actions copy URL · download · ×; the image or video at the modal's width under General.
  - L1797–1808 — `spaceQuickLook(info)`: ⌘I on a file opens Get Info; Space on a file is the Quick Look viewer as before.
  - L1964–1967 — the `quickLookFolder` state is now `infoFor` (folder, file or the title root); ⌘I toggles it, inert over Quick Look and the search modal.
  - L2739–2753 — the folder overlay (the pane at 420 with its aspect-square plate) is replaced by the modal: `GetInfoModal` with the existing `TagEditor` (editable when the client can tag), and the title/bucket root as `InfoBody` in the same frame. Space on a folder opens it too, so no overlay path draws the plate.
- `packages/component/src/organisms/ColumnBrowser.jsx` L1137 — `COL_ICON` exported for the kind glyph.
- No new props. The preview panes (Rows/Grid/Columns) keep their plate; only the overlay changed.

Verified on apps/media at :5299 (Playwright, 1440×900), screenshots in `_tmp/2026-10-30-get-info-docked/`:
- `02-columns-folder-cmd-i.png` — Columns, `img/` open, ⌘I: header bar `img · 10 items · 5.1 MB` + ×, small folder glyph, size, Modified, Tags, Kind Folder, Size `5,360,179 bytes (5.1 MB) for 10 items`, Where `R2 · kol-media`, Newest; 0 aspect-square plates in the overlay; ⌘I again closed it.
- `04-columns-file-cmd-i.png` — `tt-07.jpg`, ⌘I: Type, Dimensions 1200 × 1500 px, URL + copy, small preview, tags `#product #hero`; Esc closed it.
- `05-columns-file-space-quicklook.png` — Space on the same file: the Quick Look viewer, unchanged.
- `06-video-cmd-i.png` — `optic-reaction.mp4`: Dimensions 900 × 900 px, Length 0:07, small video. Audio (`casino.mp3`): Length 0:15.
- `08-rows-folder-space.png` — Rows, `video/reels/` picked, Space and ⌘I: the same modal (Where `R2 · kol-media › video`).
- No page errors.

Gates: `validate:syntax` clean, `validate:relative-imports` clean.
