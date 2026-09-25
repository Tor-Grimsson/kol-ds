# The three media views should agree on folders, the right-click menu, and where ⌘↑ ends

**Staged:** 2026-09-23 · from a kol-client-olina session
**Change:** three fixes inside `MediaLibraryPages.jsx` (and `ColumnBrowser.jsx` only as the reference); no new props

---

## The problem, in three cases

`apps/media` (media.olina-productions.com), kol-component 0.218.0, with `bucketLevel` on. The
columns view is the reference. Grid and rows fall short of it in three ways, all seen by the user.

**1. Grid draws no folders.** The wall renders `wallSource = dirFiles` (`MediaLibraryPages.jsx:1444`)
— the current folder's own files, never its subfolders. At `projects/` the grid reads
`0 files · 0 B` over a blank pane, and its 28 subfolders cannot be reached from it. It only looks
fine in a leaf folder like `projects/dolce-madonna/`, which has none. Read live in the running
app: `#projects/` in grid → 0 tiles, no folder names anywhere.

**2. Grid has no context menu except on a tile.** The rows `<ul>` carries
`onContextMenu={(e) => menu.openAt(e, { type: 'level', path: prefix })}` (`:1568`), and every column
is a level, so a right-click anywhere in either opens the folder menu (New folder, Upload into…).
The wall's scroll container (`wallPane`, `:1650`) has only `onClick`; only tiles get
`onContextMenu`. Right-clicking the empty area of the grid opens the **browser's** menu (Back,
Forward, Reload, Inspect…). The user: *"the container should be treated like a column, context
menu anywhere by right click."*

**3. ⌘↑ ends in a different place in each view.** The user: *"grid just stops at a folder inside the
bucket folder, while column goes all the way to media, while row stops at bucket level. 3
different stops for 3 modes. they should all go all the way to the shared root folder."* Read
from the source (not run):

- **columns** — ⌘↑ is `ArrowLeft` (`ColumnBrowser.jsx:626-631`), so it walks the virtual levels
  right up to the title root.
- **rows** — `if (up) select(up)` (`:1249`). `dirOf` of a top-level folder is `''`, which is falsy,
  so it does nothing: the walk ends on the bucket's top-level folders and never reaches the
  bucket row or the title.
- **grid** — `if (!list.length) return true` (`:1224`) sits **above** the ⌘↑ line (`:1225`), so in
  any folder whose wall is empty (every folder that holds only subfolders, like `projects/`)
  ⌘↑ is swallowed and nothing moves. From a folder with files it climbs by
  `goFolder(dirOf(prefix))` until `prefix` is `''`, then stops — it never calls `setAppRoot(true)`.

## The fix

1. **Grid draws the current folder's subfolders as tiles**, ahead of the files, opening on
   double-click and taking the same folder menu as a folder row. `flat` is unchanged (the subtree's
   files, no folders).
2. **The wall's container takes `onContextMenu={(e) => menu.openAt(e, { type: 'level', path: prefix })}`**,
   the same handler the rows have. A tile's own menu must still win over the container's.
3. **One "go up" for all three views**: parent folder → … → the bucket (with `bucketLevel` or more
   than one bucket) → the title root, which is what `onHome` already does
   (`setAppRoot(true); setPickedFile(null); setPrefix('')`). In grid, ⌘↑ is handled before the
   empty-list bail-out.

## Definition of done

- [ ] Grid at a folder that holds only subfolders (`projects/`) shows them as tiles; double-click opens one; the count line matches what is drawn.
- [ ] Right-click on the empty area of the grid opens the folder menu; right-click on a tile still opens the file menu.
- [ ] From `projects/dolce-madonna/`, ⌘↑ repeated ends at the same place in columns, rows and grid: the title root (`OLINA MEDIA`), with the crumb reading just the title.
- [ ] ⌘↑ works in grid at a folder whose wall is empty.
- [ ] Without `bucketLevel` and with one bucket, ⌘↑ ends at the bucket's top (there is no higher level), the same in all three.

## ADDRESSED — 2026-09-23 · kol-component@0.219.0

All three, in `MediaLibraryPages.jsx`, no new props on the pages. **Grid** draws the level's subfolders as `MediaTile`s ahead of the files (double-click opens, the folder menu on right-click, click selects; `flat` draws none) and the count line reads `7 folders · 1 file · …`. **The wall's container** takes `onContextMenu` for the level; a tile's own menu stops the event first, so it still wins. **⌘↑** is one `goUp` — parent → … → bucket top → title root (`setAppRoot(true)`), handled before the empty-list bail-out in grid and falling through to it from the top of rows; with one bucket and no `bucketLevel` it ends at the bucket's top. Checked live at 1400 in `apps/media`: grid from `#img/` → bucket top → title root; rows reaches the title root and stays. 27 gates clean.
