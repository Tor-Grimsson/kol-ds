# Files dropped from the OS onto a folder call an `onDropFiles(files, folder)` seam; the consumer uploads

**Staged:** 2026-09-22 · from a kol-client-olina session
**Change:** one new optional prop on the media pages + `ColumnBrowser`, reusing the existing drop highlight

---

## The problem, in one case

In Finder or Dropbox you drag photos from the desktop onto a folder and they land in it. On
media.olina-productions.com (kol-component 0.216.0) the folder doesn't react at all. Files only go
in through the upload box, after you've navigated to the folder first.

The drop targets exist. They only know about internal drags:

- `MediaLibraryPages.jsx:617-632`: `dragFor` keeps the dragged path in a ref and `canDrop`
  answers from that ref.
- `ColumnBrowser.jsx:252` (rows) and `:842-855` (column levels) call `dragFor(level).canDrop(...)`.
- An OS drag carries `dataTransfer.files` and no ref, so `canDrop` is false and the drop is
  ignored.

## The fix

- A new optional prop, **`onDropFiles(files, folderPath)`**, on `MediaLibraryBrowse`,
  `MediaLibraryExplorer` and `ColumnBrowser` (forwarded in the same edit, per the pass-through rule
  at `MediaLibraryPages.jsx:486`).
- When a drag's `dataTransfer.types` includes `'Files'`, folder rows and column levels accept it with
  the **same drop-over highlight** internal moves use, and the drop calls the seam with the
  `FileList` and the target folder's path.
- **The DS never uploads.** It hands the files over and the consumer re-lists via `refreshKey`,
  the same contract as `fileActions`. No prop, no OS drop target, same as today.

## Rejected alternative

**The DS does the upload** through `client.upload`. Each consumer's pipeline is different:
`apps/media` converts stills in the browser (≤2560 wide, ≤500 KB JPEG, original kept in
`original/`) and cleans every name first, and kol-r2b2 doesn't. Baking one pipeline in means the
other forks it. A seam lets each consumer keep its own.

## Relation to `apps-tier-media-first`

That ticket names drag as part of the target product. This is the one piece of it a consumer is
blocked on today. In `apps/media` the fixture's seam just pushes files into the in-memory tree.

## Definition of done

- [ ] Dragging a desktop file over a folder row or column shows the drop-over state; dropping calls `onDropFiles(files, path)`.
- [ ] Without `onDropFiles`, an OS drag shows nothing and does nothing (0.216.0 behaviour).
- [ ] Internal drag-to-move is unchanged.

## 🟠 ADDRESSED — 2026-09-23 · kol-component@0.217.0

`onDropFiles(files, folderPath)` on `MediaLibraryBrowse` / `MediaLibraryExplorer` and on `ColumnBrowser`: a desktop file dropped on a folder row or a column gets the same highlight as an internal drag, and the page hands you the `FileList` plus the bucket-relative folder. **The DS never uploads** — re-list through `refreshKey`. Writable buckets only. Internal drag-to-move is unchanged. One consequence: passing `onDropFiles` also adds `Upload here…` / `Upload into <folder>…` to the right-click menu, a file picker into the same handler.

**Bump** — `kol-component@0.217.0` · `kol-theme@0.147.0` · `kol-icons@0.27.1`, all three together (the component peers the other two, and the theme carries the chrome). Proved live in the DS's own `apps/media` fixture, not just built.

**Also in 0.217.0, so it is not a surprise:** the media surface changed shape underneath — Browse and Files are ONE surface with three views (columns · rows · grid; `list` duplicated rows and now lands on rows). `view` is the new key; `folderView` and `layout` are still read and kept in step beneath it, so nothing you pass breaks. Click selects · double-click opens · right-click is the menu · space is Quick Look (a resizable window, folders too). Opt-in, absent means unchanged: `trash={{ items, restore, purge, empty }}` (delete moves aside instead of "cannot be undone"). New dependency `pdfjs-dist`, lazy — PDFs show page one. Known, not fixed: in column view, dropping a file onto another FILE's row renames the dragged file (pre-existing, unfiled).

Closes on kol-client-olina verifying it in their running app.
