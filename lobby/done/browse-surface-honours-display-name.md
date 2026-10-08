# The browse surface shows the key, never a name the client gives

**Staged:** 2026-10-08 · from a kol-fxr session
**Change:** `MediaLibraryBrowse` (and the rows · grid · columns under it) honour `o.displayName`, the way the modal picker already does

---

## The problem, in one case

kol-component 0.242.0. fxr puts its files dialog on the browse surface, as this lobby advised
(*"consume, don't copy … where fxr's browser differs, fxr files the missing seam"*). The client
wraps a stored library: a folder per kind, one object per file. File names are not unique — two
files can both be "Untitled" — so the key is `kind/<id>` and the name has to travel beside it.

The surface has nowhere for it. Every path rewrites `displayKey` from the key:

- `MediaLibraryPages.jsx:1948` and `:2974` — `displayKey: prefix ? o.key.slice(prefix.length) : o.key`
- `:1961` and `:2305` — `displayKey: o.key`
- `ColumnBrowser.jsx:190` keeps a passed `displayKey`, but it arrives already overwritten

Measured in fxr at 1600: the column view lists `w-alpha`, `w-beta` — the ids — for files named
*Walk alpha* and *Walk beta*.

The modal picker already solved it: `MediaLibrary.jsx:353` —
`displayKey: o.displayName ?? (flat ? … : fileName(o.key))`.

## The ask

The browse surface reads `o.displayName` first wherever it derives `displayKey`, the modal's own
rule. Absent, nothing changes for any bucket consumer. Search should match it too, or a file is
found by an id nobody sees.

One related line, not an ask: the built-in Rename prompts with the key's last segment. fxr routes
Rename through `fileActions.items` already, so it needs nothing — but a surface that shows a
`displayName` would want its own Rename to start from it.

## What stays in fxr

The port is written and parked (`_tmp/2026-10-08-filesdialog-before-browse/FilesDialog.browse-port.jsx`):
client over the store, Delete on `fileActions.remove`, Rename · Duplicate · Export on
`fileActions.items`, `onPickFile` driving an Open footer. The 2026-09-04 dialog stays live until
this ships. Then: bump, swap the file in, set `displayName`, walk it.

---

## Resolution — 2026-10-08 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.243.0`.** `o.displayName` is the label wherever the browse
surface draws or matches a file; absent, the label is the key as before.

- `MediaLibraryPages.jsx` — the four `displayKey` derivations (flat · wall · filter items · smart
  folders) read `o.displayName` first; the row label, Quick Look's title, the document editor's
  name and the search modal's result label fall back to it
- `ColumnBrowser.jsx` — the default partition reads `displayKey ?? displayName ?? rel`
- `utilities/mediaSearch.js` — the engine item's title is `displayName` when given, the key stays
  a keyword: a file is found by the name you see and by its id (checked: `alpha` finds
  `walk/w-alpha` named *Walk alpha*)
- Render gate clean over `apps/media` at 1440 and 390

Not changed: the built-in Rename still prompts with the key's last segment (fxr routes Rename
through `fileActions.items`, as the ticket says). For fxr: bump kol-component to ^0.243.0, swap the
parked port in with `displayName` on each object, walk it.
