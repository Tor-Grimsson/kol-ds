---
component: CatalogAppVariant
source: kol-fxr/src/components/FileCard.jsx#L1-L97 · kol-fxr/src/pages/LibraryPage.jsx#L118-L156 · kol-fxr/src/AppLayout.jsx#L323-L360
staged: 2026-10-23
status: draft
deps: [ContentCard, ContentRow, CatalogPage, ActionButton, ContextMenu, MenuDropdownItem, useModal, useContextMenu, downloadBlob, formatSize, Icon]
---

# CatalogAppVariant — an `app` variant on ContentCard + ContentRow and `preset="app"` on CatalogPage

## Purpose
The saved-file card the user approved for kol-fxr on 2026-10-22 (Home + `/library`), made a DS variant so
every app's library gets it by a bump instead of a hand copy. Today the `file` frame is the DS's and every
part inside it is fxr's own (`FileCard.jsx`). kol-mirror and kol-monitor are on `CatalogPage` too and
need the same card; monitor has not updated at all yet.

**`file` stays untouched.** Three consumers use it bare and must not grow a download, cog or trash:
fxr `src/editor/compose/AssetsBody.jsx`, mirror `src/components/mirror/MobileStudio.jsx`, shell `HubHome.jsx`.

## Anatomy
```
ContentCard variant="app"            (the `file` frame, tone `secondary` by default)
├─ cover                             media (the consumer's thumb, or the placeholder below)
│  └─ control                        ActionButton chrome="media" icon="download" → confirm "check"
├─ text                              title (truncates before the plate — 0.290.0 behaviour) · date · size
└─ plate (actions)                   stacked, padded height, justify-between
   ├─ ActionButton inline sm  settings-01  → opens the card's menu at the button
   └─ ActionButton inline sm  trash        → confirm dialog → verbs.remove()

ContextMenu (one per page, opened by the cog AND right-click on card or row)
├─ Rename      (edit)   → prompt → verbs.rename(name)
├─ Duplicate   (copy)   → verbs.duplicate()
└─ Delete      (trash)  → confirm → verbs.remove()

ContentRow variant="app"             the `file` row (48px thumb) with the same date · size · plate · menu
```

## Variants
- `app` card and `app` row, one look each. A verb the consumer does not pass is not drawn (no trash
  without `remove`, no menu row without its verb). Without `download` the cover has no control.

## Props
New keys `toCard` may return for `app` (spread through `CatalogPage` like every other key):

| prop | type | default | controls |
|------|------|---------|----------|
| `verbs` | `{ rename?(name), duplicate?(), remove?() }` | — | raw writes; the DS asks the dialogs (prompt / confirm) before calling them |
| `download` | `() => void` | — | the cover's download control |
| `menuItems` | node | — | extra menu rows after the three (mirror: Export · Thumb) |
| `date` | ms \| string | — | ms → ISO day `YYYY-MM-DD` |
| `size` | bytes \| string | — | bytes → `formatSize` |
| `media` | node \| src | placeholder | src → `<img class="size-full object-cover">`; none → the placeholder |
| `tone` | string | `secondary` | as 0.288.0 |

`CatalogPage preset="app"` → `cardVariant: 'app'`, `rowVariant: 'app'`, `listColumns: 3`, and mounts the
one `ContextMenu` itself, so a page passes no `useContextMenu` and no menu element.

## Styling
- Plate: `flex h-full flex-col items-center justify-between`, `onClick` stops propagation (a plate press
  never opens the card).
- Plate buttons: `ActionButton chrome="inline" size="sm"`, icons `settings-01` / `trash`, confirmIcon the same.
- Cover control: `ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded"`.
- Placeholder: `size-full flex items-center justify-center bg-oq-04 text-fg-24`, `Icon image 24`, `aria-label="No preview yet"`.
- Menu glyphs: `Icon` size 14 in `iconLeft` (`edit` · `copy` · `trash`).
- Dialog copy: prompt `Rename:` (current name prefilled); confirm `Delete “<name>”?` with `okLabel: 'Delete'`, name falls back to `Untitled`.
- **Drop on recreation:** `FILE_TONE` const (becomes the variant default), `fileDate` / `bytesOf` (the date and
  size props take raw values), fxr's `storedVerbs` / `chromeOf` / `downloadFile` (app storage and routing — they
  stay in the consumer and arrive as `verbs` / `download` / `onClick`).

## States & interactions
- Card click = the consumer's `onClick` (fxr opens a preset in its chrome; others may do nothing).
- Right-click on card or row and the cog open the same menu at the pointer / button.
- Trash and Delete both confirm first; Rename prompts and skips an empty or unchanged name.
- Download confirms with the check glyph (ActionButton's own confirm state).

## Dependencies
All DS already: ContentCard / ContentRow `file`, CatalogPage presets, ActionButton, ContextMenu +
`useContextMenu`, MenuDropdownItem, `useModal` (prompt / confirm — needs the shell's `ModalProvider`, which
every AppShell page has), `downloadBlob`, `formatSize`, kol-icons `Icon`.

## Recreation notes
- Tier: a variant of the existing molecules + a `CatalogPage` preset, not a new component.
- Build `app` ON `file` so the title-clears-actions fix (0.290.0) and tone (0.288.0) carry over.
- **The resolution answers three repos** — write a "For <repo>" block for each:
  - **kol-fxr** — Home (`AppLayout.jsx` `toCard`, ~L350) and `/library` (`LibraryPage.jsx`) onto
    `preset="app"` passing `verbs` · `download` · `date` · `size` · `media`; `FilePlate`, `FileMenu`, `FileThumb`,
    `FILE_TONE`, `fileDate`, `bytesOf` retire to `_tmp/`.
  - **kol-mirror** — `CatalogLibrary.jsx` `toCard` (L62–L80) swaps its grey Export / Thumb / Remove buttons
    for `verbs.remove` + `menuItems` (Export, Thumb) on `preset="app"`. Mirror is on component ^0.290.0 · shell 0.74.0.
  - **kol-monitor** — not updated: component ^0.283.0 · shell 0.73.0. Bump to the shipped versions first, then
    `LibraryPage.jsx` (`patchCard` / `moduleCard`, L154) onto `preset="app"`.

## Resolution — 2026-10-22 · kol-component 0.291.0 · kol-shell 0.75.0

- `molecules/AppItem.jsx`: `useAppItem` maps `verbs` · `download` · `menuItems` · `date` · `size` · `media` · `tone` onto the `file` card/row; `AppItemMenuProvider` holds the one menu (Rename · Duplicate · Delete + `menuItems`), dialogs via `useModal`. A verb not passed is not drawn. `file` untouched.
- `CatalogPage`: `preset="app"` (card + row `app`, 3 list columns); every CatalogPage mounts the provider, so a per-card `variant: "app"` works on any preset (fxr Home through AppHub).
- Verified in the showcase CatalogPage `app` variant: cards with download · cog · trash on `kol-tone-secondary`, placeholder when no thumb; right-click and cog open Rename · Duplicate · Delete · Export; Duplicate, Rename and trash-with-confirm all write; list rows carry cog · trash and the same menu.

**For kol-fxr** — Library: `preset="app"`, `toCard` returns `verbs` · `download` · `date` (ms) · `size` (bytes) · `media` (thumb src) · `onClick`. Home: `variant: "app"` per file card in AppHub `toCard` (CatalogPage mounts the menu). Retire `FilePlate` · `FileMenu` · `FileThumb` · `FILE_TONE` · `fileDate` · `bytesOf` to `_tmp/`.
**For kol-mirror** — `CatalogLibrary.jsx` `toCard` onto `preset="app"`: `verbs.remove` + `menuItems` (Export, Thumb) instead of the grey buttons; bump kol-component 0.291.0 · kol-shell 0.75.0.
**For kol-monitor** — bump kol-component 0.291.0 · kol-shell 0.75.0 first, then `LibraryPage.jsx` `patchCard` / `moduleCard` onto `preset="app"`.
