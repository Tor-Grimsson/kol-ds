# `fileActions` takes consumer-defined menu items, so a new verb is not a new publish

**Staged:** 2026-09-22 · from a kol-client-olina session
**Change:** one optional array on the existing `fileActions` seam, rendered after the built-in verbs

---

## The problem, in one case

The client wants **Duplicate** in the right-click menu on media.olina-productions.com. The server
side is small and is `apps/media`'s to write. The menu is the blocker: `fileActions` is a fixed set,
`{ createFolder, rename, move, remove }` plus `createFile` (`MediaLibraryPages.jsx:477-484`), and the
menu hard-codes one entry per known verb (`:1032-1080`). A verb the page doesn't already know can't
be offered.

Asking for a `duplicate` verb would fix this one case and set up the next ticket: Copy link,
Download, Tag… Each one is a DS publish for something only the consumer implements.

## The fix

`fileActions` also accepts consumer items. The shape is the DS's call, roughly:

```js
fileActions={{
  rename, move, remove, createFolder,
  items: [
    { label: 'Duplicate', icon: 'copy', when: (t) => t.type === 'file', run: (t) => duplicate(t.path) },
  ],
}}
```

- `t` is the payload the menu already builds: `{ type, path, o, targets }` (`:978`, `:1001`).
- `when` filters per target, and multi-select passes `targets` so an item can act on a set or hide.
- The items render **after** the built-in verbs, go through the same `runAction` (busy state and
  error), and the consumer re-lists through `refreshKey` as now.
- A read-only bucket still gets no menu (`canWrite`, `:526`).

## Rejected alternative

**A built-in `duplicate` verb.** It fixes today's case and ships the same limit again: every
verb is a roundtrip. Whether Duplicate should *also* become a first-class verb later is the DS's
call. The seam covers it until then.

## Relation to `apps-tier-media-first`

That ticket names context menus as part of the product. This is the extension point for them. The
fixture app can prove it with one fake item.

## Definition of done

- [ ] A consumer item appears in the menu for targets its `when` accepts, and runs with the menu payload.
- [ ] Busy state and error handling match the built-in verbs.
- [ ] `fileActions` without `items` renders exactly the 0.216.0 menu.

## 🟠 ADDRESSED — 2026-09-23 · kol-component@0.217.0

`fileActions.items` — `[{ label, icon?, when?, run }]`. `run` receives the menu payload `{ type, path, o?, targets? }`, `when(target)` filters per row (absent = always), and the items render AFTER the built-in verbs through the same busy/error path as Rename and Delete. Without `items` the menu is unchanged. Proved with a Duplicate item in the DS fixture (Finder-style ` copy` / ` copy 2`, not offered on folders or a multi-selection).

**Bump** — `kol-component@0.217.0` · `kol-theme@0.147.0` · `kol-icons@0.27.1`, all three together (the component peers the other two, and the theme carries the chrome). Proved live in the DS's own `apps/media` fixture, not just built.

**Also in 0.217.0, so it is not a surprise:** the media surface changed shape underneath — Browse and Files are ONE surface with three views (columns · rows · grid; `list` duplicated rows and now lands on rows). `view` is the new key; `folderView` and `layout` are still read and kept in step beneath it, so nothing you pass breaks. Click selects · double-click opens · right-click is the menu · space is Quick Look (a resizable window, folders too). Opt-in, absent means unchanged: `trash={{ items, restore, purge, empty }}` (delete moves aside instead of "cannot be undone"). New dependency `pdfjs-dist`, lazy — PDFs show page one. Known, not fixed: in column view, dropping a file onto another FILE's row renames the dragged file (pre-existing, unfiled).

Closes on kol-client-olina verifying it in their running app.
