# The media pages ask through `useModal()`, not bare `prompt()` / `confirm()`

**Staged:** 2026-09-22 · from a kol-client-olina session
**Change:** one file: swap the bare calls for the DS's own promise-based dialogs, no new API

---

## The problem, in one case

On media.olina-productions.com (kol-component 0.216.0), right-click → New folder opens the browser's
own `prompt()`: grey, OS-styled, with the page title in its header. Rename, Move to… and Delete do
the same. It's the only non-DS surface left in the app.

Every call site in `MediaLibraryPages.jsx` is a bare global: `:536`, `:541`, `:547`, `:553`, `:598`,
`:601`, `:638`, `:1186`, `:1211`, `:1227`. Errors go to `alert(e.message)` (`:531`).

The comment at `:520-525` says this is deliberate, so as not to add a second modal idiom to one
component. **The DS already has that idiom.** `useModal()` (`molecules/Modal.jsx:125`) is
promise-based `prompt` / `confirm` with `okLabel` / `cancelLabel`. It renders DS dialogs under a
`ModalProvider` and **falls back to the native ones** when none is mounted. Using it adds no idiom;
it reuses the one that exists.

## The fix

- Replace every bare `prompt` / `confirm` in both pages with `await modal.prompt(...)` /
  `await modal.confirm(...)` from `useModal()`. Where it helps, name the buttons after the result:
  `okLabel: 'Delete'`, `'Move'`, `'Create'`.
- Nothing changes for a consumer that mounts no provider: native dialogs, one dev warning
  (`Modal.jsx:132`). A consumer that mounts `ModalProvider` gets the DS dialogs. **That provider is
  the override seam, and it already exists.**
- `alert(e.message)` in `runAction` has the same problem. Routing it through the modal, or an
  `onError(err, verb)` seam that defaults to the current behaviour, is the DS's call.

## Rejected alternative

**A `prompt` / `confirm` prop pair on the pages.** That would be a second override seam next to
`ModalProvider`, which already is one. Two ways to do the same thing drift.

## Definition of done

- [ ] No bare `prompt(` / `confirm(` / `alert(` left in `MediaLibraryPages.jsx`.
- [ ] Under a `ModalProvider`, New folder · Rename · Move to… · Delete (single and multi) open DS dialogs; Enter/Escape behave.
- [ ] Without a provider, behaviour matches 0.216.0.

## 🟠 ADDRESSED — 2026-09-23 · kol-component@0.217.0

Every `prompt()`/`confirm()`/`alert()` in `MediaLibraryPages.jsx` now goes through `useModal()`; `useModal()` gained `alert` (one button, resolves `undefined`) for the one place that needed it. Under a `ModalProvider` you get the DS dialogs; with none, the native ones as before, and dev warns. No new API on the pages.

**Bump** — `kol-component@0.217.0` · `kol-theme@0.147.0` · `kol-icons@0.27.1`, all three together (the component peers the other two, and the theme carries the chrome). Proved live in the DS's own `apps/media` fixture, not just built.

**Also in 0.217.0, so it is not a surprise:** the media surface changed shape underneath — Browse and Files are ONE surface with three views (columns · rows · grid; `list` duplicated rows and now lands on rows). `view` is the new key; `folderView` and `layout` are still read and kept in step beneath it, so nothing you pass breaks. Click selects · double-click opens · right-click is the menu · space is Quick Look (a resizable window, folders too). Opt-in, absent means unchanged: `trash={{ items, restore, purge, empty }}` (delete moves aside instead of "cannot be undone"). New dependency `pdfjs-dist`, lazy — PDFs show page one. Known, not fixed: in column view, dropping a file onto another FILE's row renames the dragged file (pre-existing, unfiled).

Closes on kol-client-olina verifying it in their running app.
