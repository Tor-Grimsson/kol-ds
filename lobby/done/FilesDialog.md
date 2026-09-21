---
component: FilesDialog
source: kol-ds-ui/packages/design-editor/src/editor/compose/useComposeFile.js + editor/library/LibraryProvider.jsx
staged: 2026-09-04
status: draft
deps: [FullscreenOverlay, ContentFilters, ContentCard, ContentRow, MediaViewer, Button, ActionButton, Input, ViewToggle, EmptyState]
---

# FilesDialog

## Purpose

The editor can save, load, import, export and delete — as **five unrelated surfaces, none of which is a files dialog.** A user who wants to see what they have saved, rename one, duplicate it, or delete it has no single place to go.

Asked for by kol-fxr's user directly: *"a proper save load import export delete files dialog"*.

**Unusual for this queue: the source is the DS's own package, not a consumer fork.** `design-editor` moved here 2026-09-03, so kol-fxr cannot build this itself — it has no seam to reach editor state (`<DesignEditor>` accepts exactly one prop, `mediaProxyBase`). This is a request to build, not a component to recreate.

## What already exists (read 2026-09-04, do not rebuild)

| verb | today | where |
|---|---|---|
| save | `onSave` / `onSaveAs` → `addItem('preset', spec)`, name via `modal.prompt` | `compose/useComposeFile.js` |
| load | `loadPreset(spec)` | `compose/state.jsx` |
| import | `onLoadSettings(file)` — validates the `{page,version,spec}` envelope, rejects foreign files | `compose/useComposeFile.js` |
| export | `onSaveSettings()` — `downloadBlob`, filename **hardcoded** to `kol-design-editor.json` | `compose/useComposeFile.js` |
| delete | `removeItem(slot, id)` | `library/LibraryProvider.jsx:291` |

The context already exposes full CRUD — `addItem · removeItem · updateItem · clearSlot · clearAll · replaceAll` (`LibraryProvider.jsx:345`) over four slots (`preset · palette · pattern · type`) in `kol.editor.library.v3`.

**Only three things are genuinely new: rename, duplicate, and a name on export.** Everything else is plumbing that works, wearing no UI.

## The precedent — build it as MediaLibrary's twin

`organisms/MediaLibrary.jsx` is already this exact shape: a browser over a store, in two views over one headless core, composed rather than built. Its own docstring lists the five members — `ContentCard` (grid tile, `variant="default"`), `ContentRow` (list row, same variant), `MediaViewer` (lightbox via its `actions` slot), `ContentFilters` (search · kind filter · view toggle · N-of-M), `FullscreenOverlay` (scrim, dismissal, close).

**FilesDialog is that organism over the generator library instead of a bucket.** Same members, same chrome, same two views. If a difference appears between the two, it is a defect in this spec, not a variant.

### Pre-empting the obvious objection

MediaLibrary's docstring says: *"Read-only by design. Upload / rename / delete / select stay in kol-r2b2 — write auth does not belong in a browser-shipped package."*

**That reasoning does not transfer.** It is about remote bucket writes needing credentials. This store is `localStorage`, owned by this package, already mutated by this package on every save. There is no auth boundary to cross. The write verbs belong here.

## Anatomy

    FullscreenOverlay
      └── ContentFilters                  ← search · kind chips · ViewToggle · N of M
      └── list | grid
            ├── ContentRow variant="default"    (list)  thumb · name · kind · updated · actions
            └── ContentCard variant="default"   (grid)  same fields, tile form
      └── footer bar
            ├── Import .json      (hidden file input)
            ├── Export selected   (name field + download)
            └── New

Empty store → `EmptyState`.

## Variants

Two **views**, not variants — `list` and `grid`, via `ViewToggle`, exactly as MediaLibrary carries them. One dialog otherwise.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `open` | bool | `false` | mounted/visible |
| `onClose` | fn | — | dismissal (scrim, Esc, close button) |
| `kinds` | string[] | all four slots | which filter chips show |
| `initialKind` | string | `'preset'` | chip selected on open |
| `onOpenItem` | fn(item) | — | the load verb — host calls `loadPreset` |
| `view` / `onViewChange` | 'list' \| 'grid' | `'list'` | controlled view, uncontrolled if omitted |

Reads the library through `useGeneratorLibrary()` rather than taking items as a prop — it lives in the same package as the provider, so injection would be ceremony.

## Styling

Take every value from MediaLibrary rather than re-deriving it — that organism is the measured one. Specifically:

- `ContentFilters`: **the first group is one catalog column wide, not a hug** (bulletin 2026-08-27), labels are eyebrows, the rest flow.
- Rows and tiles: `variant="default"` on both `ContentRow` and `ContentCard`; `media={false}` where an item has no preview (kol-component 0.210.0 — an absent cover must not draw a MISSING plate; the library's palette/pattern/type slots have no thumbnail).
- Mono on the fault line: wrapping text `kol-mono-*`, single-line chrome `kol-helper-*`.
- Icons: opaque ink, never alpha `fg-*`.

**Nothing app-specific to drop** — there is no consumer fork here.

## States & interactions

- **row hover** — actions reveal; halve the hover so *selected* has somewhere to go (the two-state budget ruling, `oq-ab-04` / `oq-ab-08`).
- **selected** — one row at a time; drives the footer's Export.
- **open** — double-click a row, or the row's Open action. Loads and closes.
- **rename** — inline edit on the row, not a modal prompt. Enter commits, Esc cancels.
- **duplicate** — copies the spec under `<name> copy`, selects the new row.
- **delete** — confirm through the existing `useModal` confirm, never a bare `window.confirm`.
- **empty** — `EmptyState`, with Import as its action.

## Dependencies

`FullscreenOverlay` · `ContentFilters` · `ContentCard` · `ContentRow` · `Button` · `ActionButton` · `Input` · `ViewToggle` · `EmptyState`, plus `useGeneratorLibrary` and `useModal` from inside the package.

Two additions to `LibraryProvider`'s context, which is where they belong rather than in the dialog:

    renameItem(slot, id, name)
    duplicateItem(slot, id) → newId

Both are one-liners over the existing `updateItem` / `addItem`.

## Recreation notes

- **Tier: organism**, in `packages/design-editor` beside the editor chrome — not `kol-component`. It is bound to `useGeneratorLibrary`, which is editor-tier. If a second consumer ever wants it, that is when it earns a move and an injected store.
- **Fix the hardcoded export filename** while here — `onSaveSettings()` always writes `kol-design-editor.json`. It should take a name.
- The four slots are one list with `kind` as a filter, **not four tabs.** The user asked for a files dialog, not a slot browser.
- Wire the existing File menu / `EditorFooter` File tab to open this instead of `modal.prompt`. Save-with-a-current-id keeps writing through silently; Save As opens the dialog with the name field focused.
- Do **not** make the library API async. kol-fxr is scoping a D1 sync layer behind it as write-behind precisely so this stays synchronous (`kol-fxr/.kol/llm-plan/03-files-and-environment.md`). A `backend` prop on `LibraryProvider` is a separate, later ask — it is not needed for this dialog and should not be built into it.

---

## RESOLUTION

**Closed 2026-09-04 — `@kolkrabbi/design-editor@0.10.0` + `@kolkrabbi/kol-component@0.212.0`.**

Built as MediaLibrary's twin per the spec: `FullscreenOverlay` · `ContentFilters` · `ContentRow`/`ContentCard` at `default` · `EmptyState`, one list over all four slots with `kind` as a filter. Rename inline, duplicate off the stored item, delete through `useModal`. `renameItem` / `duplicateItem` landed on the provider as pure exported transforms (`applyRename` / `applyDuplicate`, 16 assertions) — rename deliberately skips the slot validator, since a rename must not be able to fail validation. The hardcoded `kol-design-editor.json` export filename is fixed.

**Two accepted deviations from the spec.** A **Save current frame** row: the spec's anatomy listed Import · Export · New and its recreation notes routed Save As into the dialog, and those two do not meet — nothing in the dialog could SAVE, so `modal.prompt` would have survived, which is the thing the ticket existed to kill. And **`initialFilters` on `ContentFilters`**, which the DS added because the filter set was internal with no seed, making `initialKind` unreachable. Initial, not controlled.

**Verified in a browser by the consumer (kol-fxr, 2026-09-04)** — not on a build, and not on the strength of the return message. Both tarballs fetched before the bump; `/editor` → File → Files… against a real store: empty state, save, duplicate, inline rename persisted to `kol.editor.library.v3`, open, delete through the confirm. **0 console errors.** Identity-on-open confirmed: after opening a file the menu item reads `Save` rather than `Save…` and a plain save wrote through, count unchanged — the silent duplicate this dialog exists to expose.

### Two findings from the running dialog

1. **Save As does not focus the name field.** It routes into the dialog correctly and `modal.prompt` is gone, but focus lands on `.kol-overlay-sheet` — `FullscreenOverlay` takes focus on mount and the name field's autofocus does not win. Measured twice with real user-gesture clicks, 900 ms settle. The return states the row is "focused when opened that way"; it is not.
2. **A duplicate renders above its original, not after it.** In storage the copy lands directly after (`[Alpha, Alpha copy]`) exactly as the return says, but the list sorts newest-first, so on screen it appears above. Cosmetic.

Neither reopens the ticket — the user closed it with both known. Finding 1 is a one-line focus fix whenever the dialog is next touched.
