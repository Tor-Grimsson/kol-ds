---
component: MediaLibraryInfoKey
source: kol-component/src/organisms/MediaLibraryPages.jsx (0.317.3) — openQuickLook / setQuickLookFolder ~L1595–1660, the folder pane ~L467–490
staged: 2026-10-30
status: draft
deps: [MediaLibrary, ColumnBrowser, Modal]
---

# MediaLibraryInfoKey

## Purpose
Get Info for whatever is picked, in every view, the way Finder's ⌘I works. In kol-website's media app (media.kolkrabbi.io, Columns view), picking `labs-render-examples/` shows nothing beside the list, and no key opens its facts.

## Anatomy
- Today the folder info pane (same shell as the file preview) draws only in the row view's preview pane. In Columns view the next column stands in for a folder's preview (comment at ~L467), so a picked folder's facts are never shown.
- `setQuickLookFolder` already draws that pane at overlay size (~L1649–1652).

## Variants
None new. The ask reuses the existing file and folder panes.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `infoKey` | `string \| false` | `'mod+i'` | opens the info overlay for the current pick (file or folder) in every view; `false` turns it off |
| `columnFolderInfo` | `boolean` | `true` | Columns view: a picked folder shows its facts pane in the preview column, as in Rows view, instead of nothing |

## Styling
Use the existing preview / folder pane and the Quick Look overlay unchanged. Nothing new to draw.

## States & interactions
- ⌘I (Ctrl+I elsewhere) with a file picked: the file's info overlay. With a folder picked: the folder's (count, size, kinds, tags). Nothing picked: nothing happens.
- Esc closes. The same guard as `settingsKey`: not while typing in search or rename.

## Dependencies
`ColumnBrowser` (the preview column), and the existing Quick Look file and folder panes.

## Recreation notes
Props, with these defaults, on `MediaLibraryBrowse` (and `MediaLibraryLibrary` if it has a pick). Add the key to the host's shortcut list via the same `SHORTCUTS` shape kol-website passes.

## Definition of done
- [ ] ⌘I on a picked folder in Columns, Rows and Grid opens its info; on a file, the file's
- [ ] Columns view: a picked folder shows its facts in the preview column
- [ ] `infoKey={false}` and `columnFolderInfo={false}` reproduce today's behaviour exactly
- [ ] published, version named in the resolution

## Resolution — 2026-10-30

🟢 `closed` — shipped in `@kolkrabbi/kol-component` **0.317.4** (registry live 2026-10-30). Built as below.

## Built — 2026-10-30

Staged in `@kolkrabbi/kol-component` 0.317.4 (CHANGELOG L7), not published.

- `packages/component/src/organisms/MediaLibraryPages.jsx`
  - L288–310 — `useSettingsKey` generalised to `useHotkey(combo, on, run)`: a bare key (`','`) or `mod+key` (`'mod+i'`, ⌘ or Ctrl); the same guard — no other modifiers, no repeat, not while typing. Call sites renamed at L1192 (browse) and L3094 (library).
  - L1169–1174 — `infoKey = 'mod+i'` and `columnFolderInfo = true` on `MediaLibraryBrowse`.
  - L1695–1697 — `spaceQuickLook`: in the columns the pick is the open folder (`prefix`); Space never reaches it there, ⌘I does.
  - L1859–1862 — `useHotkey(infoKey, …, spaceQuickLook)`: inert over an open Quick Look, folder overlay or the search modal; Esc closes as before.
  - L2156–2164 — `renderFolderPreview` handed to `ColumnBrowser`: the existing `FolderPreview` (facts, favourite, tags) for the open folder, un-rooted; nothing for the title or a bucket level.
- `packages/component/src/organisms/ColumnBrowser.jsx` L524–527, L805–806, L1102–1107 — `renderFolderPreview(level, width)`: drawn in the preview column when no file is shown, with the same resize handle; absent, the column is empty as before.
- `apps/media-fixture/src/shortcuts.js` L46 — the sheet's Select section lists ⌘I (documentation row; the key is bound in the DS page).
- `MediaLibraryLibrary` has no pick (the wall opens its inspector on double-click), so it takes no `infoKey`.
- `docs/documentation/03-components/01-inventory.md` — the `MediaLibrary` row lists no props; left as is.

Verified on apps/media at :5299 (Playwright, 1440×900), screenshots in `_tmp/2026-10-30-media-info-key/`:
- `01-columns-folder-facts-pane.png` — Columns, `img/` open: its facts pane in the preview column.
- `02-columns-folder-cmd-i-overlay.png` — ⌘I on that folder: the folder overlay; Esc closed it (0 overlays after).
- `03-columns-file-cmd-i-overlay.png` — `README.md` picked, ⌘I: the file's Quick Look; Esc closed it.
- `04-rows-folder-cmd-i-overlay.png`, `05-grid-folder-cmd-i-overlay.png` — ⌘I on a picked folder in Rows and Grid: the folder overlay each time.
- `06-search-focused-cmd-i-inert.png` — search modal open, field focused, ⌘I: no overlay opened (dialog count unchanged); after Esc the same key opened the folder overlay.

Gates: `validate:syntax` clean, `validate:relative-imports` clean.
