# `ColumnBrowser` `height` takes any CSS length, so the browser can fill the space it is given

**Staged:** 2026-09-22 · from a kol-client-olina session
**Change:** one prop widened in `ColumnBrowser`, forwarded through the media pages' `settings.columnHeight`

---

## The problem, in one case

`apps/media` (media.olina-productions.com, `MediaLibraryExplorer` on kol-component 0.216.0) wants the
column browser to take the height left under the header, crumbs and stats, and follow the window.
It can't: `height` is pixels only (`ColumnBrowser.jsx:63-65`), and the drag does arithmetic on it
(`:500` `dragBase.current = h`, then `+ dy`). A string there breaks the drag.

So the consumer hard-codes one number, `COLUMN_HEIGHT = 800` in `apps/media/src/lib/settings.js`
(lines 23, 41, 79), and forces it on every load. At 900px tall the browser runs past the fold. At
1440px there's a dead band under it.

## The fix

Widen the prop. Don't add a mode.

- `height` accepts a **number** (px, exactly as today) **or any CSS length string**:
  `'100%'`, `'calc(100dvh - 240px)'`, `'60vh'`. Maybe also `'fill'` as sugar for
  flex-grow-in-parent, if that is how the organism can fill a flex column.
  A string goes straight to `style.height` (`:817`).
- **The drag measures and doesn't assume.** On the first drag step, take the base from the
  element's rendered `getBoundingClientRect().height` instead of `h`, so the arithmetic works from
  whatever the length resolved to. `onHeightChange(px)` still reports pixels, and the consumer
  decides whether that override lasts the session or gets persisted, same as today.
- `MediaLibraryPages.jsx` passes `settings.columnHeight` through (`:885`, `:953`) and defaults it to
  `528` (`:76`). The same widening applies there, so a consumer sets `columnHeight: '100%'` in
  `defaults` and the pages forward it.

## Rejected alternative

**A separate `fill` boolean / mode.** That's a second prop for the same axis, and the next layout
that wants `60vh` or a `calc()` files this ticket again. Any CSS length covers fill and every case
after it, and a number keeps meaning exactly what it means now.

## Relation to `apps-tier-media-first`

This one is standalone and doesn't wait on that ticket. It's easy to prove in `apps/media` once that
exists: resize the window and drag the edge.

## Definition of done

- [ ] `height="100%"` inside a sized parent fills it and follows window resizes.
- [ ] `height={528}` renders exactly as on 0.216.0.
- [ ] Dragging from a string height starts at the rendered height (no jump) and reports px.
- [ ] `MediaLibraryBrowse` / `MediaLibraryExplorer` forward a string `columnHeight` untouched.

## 🟠 ADDRESSED — 2026-09-23 · kol-component@0.217.0

`ColumnBrowser` `height` takes a number (px, as before) or any CSS length — `'100%'`, `calc(100dvh - 210px)`. The resize drag measures the rendered rect as its base, so a string height does not jump when dragged, and the grab handle is hidden on a fill height. Proved live in the DS fixture with `calc(100dvh - 212px)`: fills the viewport in all three views and follows window resize. Budget it exact to the pixel and fractional line heights push the page 1–2px past the viewport and a trackpad finds a scroll bar — the fixture carries 2px of slack for that.

**Bump** — `kol-component@0.217.0` · `kol-theme@0.147.0` · `kol-icons@0.27.1`, all three together (the component peers the other two, and the theme carries the chrome). Proved live in the DS's own `apps/media` fixture, not just built.

**Also in 0.217.0, so it is not a surprise:** the media surface changed shape underneath — Browse and Files are ONE surface with three views (columns · rows · grid; `list` duplicated rows and now lands on rows). `view` is the new key; `folderView` and `layout` are still read and kept in step beneath it, so nothing you pass breaks. Click selects · double-click opens · right-click is the menu · space is Quick Look (a resizable window, folders too). Opt-in, absent means unchanged: `trash={{ items, restore, purge, empty }}` (delete moves aside instead of "cannot be undone"). New dependency `pdfjs-dist`, lazy — PDFs show page one. Known, not fixed: in column view, dropping a file onto another FILE's row renames the dragged file (pre-existing, unfiled).

Closes on kol-client-olina verifying it in their running app.
