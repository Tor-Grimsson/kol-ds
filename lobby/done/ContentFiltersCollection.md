---
component: ContentFiltersCollection
source: kol-r2b2/src/FileList.jsx (whole listing surface) + local DS edits in packages/component (linked working tree)
staged: 2026-08-27
status: draft
deps: [ContentFilters, ContentCard, ContentRow, ActionButton, ToggleCheckbox, ViewToggle, Divider, Icon]
---

# ContentFiltersCollection — kol-r2b2 adopts the collection; the gaps it found

## Purpose
kol-r2b2 replaced every local alias — bespoke toolbar, `MediaCard`, `MediaRow`, `SortControls`, `SelectIndicator` — with the ContentFilters collection (`ContentFilters` + `ContentCard`/`ContentRow` **default**). The result was built and ruled by the user **on a pnpm-linked copy of `packages/component`**, so the DS edits below are **already in that working tree, unpublished**. This ticket is: ship those edits, add the three missing pieces, and publish — so that the consumer JSX at the bottom renders **exactly** as it does on the link today. The user will not diff by hand: if the published package needs the consumer to change anything beyond the version bump, the ticket is not closed.

## 1 · DS edits already in the working tree (ship as-is, unless the DS renames)

**`organisms/ContentFilters.jsx`**
- `layout` + `onLayoutChange` — controlled LIST/GRID (mirrors `viewMode`/`onViewModeChange`).
- Strip items (`layoutOptions[]`) may carry `onClick`, `active`, `title` — an item with `onClick` is its own toggle; `active` overrides `layout === value` for the lit state.
- `trailingActions` — header RIGHT group, rendered **before** the strip. When both a `trailingActions` node and a header-placed strip exist, the organism renders `<Divider variant="vertical" />` between them (as it does on the left between title and icons). Right group is `gap-6` to mirror the left.
- `leadingActions` — below-divider row, LEFT half (before filter groups).
- `belowActions` — below-divider row, RIGHT half (after the count / below-placed strip).
- The below row shows when expanded **or** a below strip **or** `leadingActions` **or** `belowActions` is present.

**`molecules/ContentCard.jsx`**
- `controlStart` — second frame-corner slot, TOP-LEFT. Currently inline `style={{ right: 'auto', left: 'var(--kol-spacing-3)' }}` on a `.kol-frame-control` div; **port to `.kol-frame-control--start` in kol-theme** and drop the inline style.

## 2 · New pieces (not in the DS today)

1. **`SortHeader` atom** — one sortable field: label + direction arrow. Strip chrome exactly: `kol-helper-12`, uppercase label, `letterSpacing: 1`, `select-none`; active `text-oq-96`, rest `text-oq-48 hover:text-oq-64`; the arrow is `<Icon name={dir === 'asc' ? 'arrow-down' : 'arrow-up'} size={10} />` and renders **only on the active field**, `gap-1` after the label.
2. **`SortControls` molecule** — the group: `flex items-center gap-4` of `SortHeader`s; props `options [{ value, label }]`, `sortBy`, `sortDir`, `onSort(field)`. Semantics: click an inactive field → it becomes active **ascending**; click the active field → direction flips. One state write, never two (the consumer's two-write bug is in the code below as the fixed reference).
3. **`SizeOrDownload`** — promote verbatim from `showcase/src/sets/content-card-comparison.jsx` (`const SizeOrDownload`, the docblock above it is the spec) into the package as an atom. Add a real `href` (the demo hard-codes `#` + `preventDefault`); keep the 2s "Downloaded" confirm. It is the card's `size` slot: the size at rest, a download link on hover.
4. **`ToggleCheckbox` on-media variant** — the unchecked state is a hairline over a photo and nearly vanishes (user, 2026-08-27, screenshot in `_assets/`); the checked state (solid white plate, black check) is fine. Add a variant for use in a media frame whose **unchecked** state carries a solid backing (the download chip's dark plate is the reference) so it reads over any image. Checked stays as is.

## 3 · Rulings the consumer's JSX encodes (do not re-decide)
- Header: title · divider · funnel · search on the left (DS default); right = icon `ViewToggle` grid/list · **DS divider** · the strip.
- The strip (header-placed) is **SELECT / FLAT** at `kol-helper-14` (the title's class, via `layoutClassName`). Labels swap to **CANCEL** / **TREE** while on. Lit = off state (SELECT, TREE bright); dimmed = on state.
- Below the divider: LEFT = the selection bar (`N selected · Select all (N) | Move to folder… · Download · Delete`), **always mounted, `invisible` when select is off** so toggling moves nothing; no Cancel button (the strip item is the toggle). RIGHT = `SortControls` (NAME · DATE ↓ · SIZE · KIND).
- Card = `ContentCard variant="default"`: `media` thumb; `control` = `ActionButton chrome="media" icon="download"` (top-right); `controlStart` = `ToggleCheckbox` **only in select mode** (top-left); `title` = the plain name string (the DS sets the type — passing a styled node was the bug); `date`; `size` (→ `SizeOrDownload` once it exists); `actions` = `ActionButton chrome="inline" size="sm"` column: **copy outside select mode; rename + delete inside select mode — never three glyphs**; `selected`; `onClick` toggles selection in select mode only.
- Row = `ContentRow variant="default"`, same slots, `actions` as the row layout (`flex translate-y-[2px] items-center gap-2`).
- No local overrides of DS look seams except `layoutClassName="kol-helper-14"` on the strip (user ruling). `titleUppercase` / `labelUppercase` stay default (uppercase).

## 4 · The consumer, verbatim (what must keep rendering identically)

**"Identically" means the pixels, not the code** (user, 2026-08-27). Restructure, rename, collapse — whatever makes the DS side right. The consumer will rewrite its call site to whatever API ships; it only must not have to re-derive a visual decision by hand.

```jsx
### SORT_OPTIONS + SortControls (FileList.jsx)
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
  { value: 'kind', label: 'Kind' },
];

// Sortable-header pattern: click a field to sort by it (ascending); click the
// active field again to flip direction. Arrow-down = ascending (1→N, A→Z,
// oldest→newest); arrow-up = descending.
function SortControls({ sortBy, sortDir, onSort }) {
  return (
    <div className="flex items-center gap-4">
      {SORT_OPTIONS.map((opt) => {
        const active = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSort(opt.value)}
            className={`kol-helper-12 flex items-center gap-1 select-none transition-colors ${active ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`}
            style={{ letterSpacing: 1 }}
          >
            {opt.label.toUpperCase()}
            {active && <Icon name={sortDir === 'asc' ? 'arrow-down' : 'arrow-up'} size={10} />}
          </button>
        );
      })}
    </div>
  );
}

### handleSort
  // One write: two setter calls each spread the same stale `settings`, so the
  // second clobbered the first and the field never changed — only the arrow.
  const handleSort = (field) => onSettings(
    sortBy === field
      ? { ...settings, sortDir: sortDir === 'asc' ? 'desc' : 'asc' }
      : { ...settings, sortBy: field, sortDir: 'asc' },
  );

### renderActions
  const renderActions = (o, row = false) => {
    const isEditing = editingKey === o.key;
    if (isEditing) {
      return (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={commitRename} disabled={renaming}>{renaming ? 'Saving…' : 'Save'}</Button>
          <Button variant="ghost" size="sm" onClick={cancelRename} disabled={renaming}>Cancel</Button>
        </div>
      );
    }
    return (
      <div className={row ? 'flex translate-y-[2px] items-center gap-2' : 'flex h-full flex-col items-center justify-between'}>
        {!selectMode && (
          <ActionButton chrome="inline" size="sm" icon="copy" confirmIcon="check" label="Copy URL" confirmLabel="Copied" onAction={() => handleCopy(o.key)} />
        )}
        {bucket.writable && selectMode && (
          <>
            <ActionButton chrome="inline" size="sm" icon="edit" label="Rename" onAction={() => startRename(o.key)} />
            <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={() => handleDelete(o.key)} />
          </>
        )}
      </div>
    );
  };

### ContentFilters usage → end of component
      {/* DS ContentFilters owns search, the kind chips and the N-of-M count;
          the strips are Tree/Flat (view) and Grid/List (layout), sort rides
          headerActions. Everything that depends on the filtered list — sort,
          paging, the selection bar, the lightbox — renders inside renderItem. */}
      {rawFiles.length > 0 && (
        <ContentFilters
          items={files}
          title="Files"
          totalCount={files.length}
          searchKeys={['displayKey']}
          filterGroups={[{ label: 'Kind', key: 'kind', values: chipKinds }]}
          mutuallyExclusiveFilters={['kind']}
          leadingActions={
            /* Always mounted, hidden when off — so toggling SELECT moves nothing. */
            <div className={`flex items-center gap-4 kol-mono-12 text-fg-48 ${selectMode ? '' : 'invisible'}`} aria-hidden={!selectMode}>
              <span className="text-fg-default">{selected.size} selected</span>
              <button type="button" onClick={selectAll} className="hover:text-fg-default transition-colors">Select all ({files.length})</button>
              <Divider variant="vertical" />
              <button type="button" disabled={!selected.size || busy} onClick={batchMove} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Move to folder…</button>
              <button type="button" disabled={!selected.size || busy} onClick={batchDownload} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Download</button>
              <button type="button" disabled={!selected.size || busy} onClick={batchDelete} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Delete</button>
              {busy && <span>working…</span>}
            </div>
          }
          layoutPlacement="header"
          layoutClassName="kol-helper-14"
          layoutOptions={[
            { value: 'grid', label: selectMode ? 'CANCEL' : 'SELECT', active: !selectMode, title: 'Select multiple files', onClick: () => (selectMode ? exitSelect() : setSelectMode(true)) },
            { value: 'list', label: flat ? 'TREE' : 'FLAT', active: flat, title: 'Show all files recursively', onClick: () => setFlat(!flat) },
          ]}
          layout={layout}
          onLayoutChange={setLayout}
          trailingActions={
            <div className="flex items-center gap-6">
              <ViewToggle viewMode={layout} onViewChange={setLayout} variant="icon" options={LAYOUT_OPTIONS} />
            </div>
          }
          belowActions={<SortControls sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />}
          renderItem={(filtered) => {
            const sorted = sortFiles(filtered, sortBy, sortDir);
            // ponytail: written during render so the select handlers outside see
            // this order on their next event; a shared FileGrid component is the upgrade.
            sortedRef.current = sorted;
            const shown = sorted.slice(0, visible);
            const more = sorted.length - shown.length;
            return (
              <div className="flex flex-col gap-3">
                {sorted.length === 0 ? (
                  <p className="kol-mono-12 text-fg-48">No files match.</p>
                ) : layout !== 'grid' ? (
                  <div className="flex flex-col">
                    {shown.map((o, idx) => (
                      <ContentRow
                        key={o.key}
                        variant="default"
                        media={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))}
                        title={renderNameCell(o)}
                        date={formatDate(o.uploaded)}
                        size={formatSize(o.size)}
                        actions={renderActions(o, true)}
                        selected={selected.has(o.key)}
                        onClick={selectMode ? (e) => toggleSelect(idx, o.key, e.shiftKey) : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                    {shown.map((o, idx) => (
                      <ContentCard
                        key={o.key}
                        variant="default"
                        media={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))}
                        control={<ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={downloadUrl(o.key)} />}
                        controlStart={selectMode ? (
                          <ToggleCheckbox
                            checked={selected.has(o.key)}
                            onChange={() => toggleSelect(idx, o.key, false)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select ${o.key}`}
                          />
                        ) : undefined}
                        title={renderNameCell(o)}
                        date={formatDate(o.uploaded)}
                        size={formatSize(o.size)}
                        actions={renderActions(o)}
                        selected={selected.has(o.key)}
                        onClick={selectMode ? (e) => toggleSelect(idx, o.key, e.shiftKey) : undefined}
                      />
                    ))}
                  </div>
                )}

                {more > 0 && (
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE)}
                    className="kol-mono-12 text-fg-48 hover:text-fg-default transition-colors self-start py-2"
                  >
                    Show {Math.min(more, PAGE)} more · {more} remaining
                  </button>
                )}

                {lightboxIndex !== null && (
                  <MediaLightbox
                    files={sorted}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex((i) => (i - 1 + sorted.length) % sorted.length)}
                    onNext={() => setLightboxIndex((i) => (i + 1) % sorted.length)}
                  />
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
```

## Recreation notes
- Tier: `SortHeader` atom · `SortControls` molecule · `SizeOrDownload` atom · `ToggleCheckbox` variant (atom) · slots on the `ContentFilters` organism and `ContentCard` molecule.
- Publish `kol-component` (+ `kol-theme` for `.kol-frame-control--start`). The consumer then: bump, replace its local `SortControls`/`SORT_OPTIONS` with the DS pair, swap `size={formatSize(o.size)}` for `size={<SizeOrDownload href={downloadUrl(o.key)}>{formatSize(o.size)}</SizeOrDownload>}`, swap `ToggleCheckbox` for the on-media variant, stop importing `MediaCard`/`MediaRow`. Nothing else may need to change.
- Reference screenshots: `lobby/_assets/2026-08-27-content-filters-collection/` (card unchecked vs checked, header, below row).

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.62.0 · kol-component 0.93.0

The linked working-tree edits were already in the tree and have shipped in every kol-component since 0.86.0 (ContentFilters layout/onLayoutChange, strip items with onClick/active/title, trailingActions + Divider, leadingActions, belowActions; ContentCard controlStart) — controlStart now rides the theme's existing .kol-frame-control--top-left (same rule you asked for as --start), no inline style. New: SortHeader atom + SortControls molecule (click inactive → asc, click active → flip, one onSort per click; measured: one arrow on the active field, asc ≠ desc, rest desc == flipped desc), SizeOrDownload atom promoted verbatim with a real href (measured: size 1/label 0 at rest → 0/1 on hover, glyph 20px, 2s confirm kept), ToggleCheckbox variant=media (unchecked box on the media control's oq-12 plate, border transparent; checked unchanged — measured).

**Remainder here:** none — kol-r2b2 bump kol-theme 0.62.0 + kol-component 0.93.0; replace the local SortControls/SORT_OPTIONS with the DS pair (SORT_OPTIONS becomes the options prop); size={<SizeOrDownload href={downloadUrl(o.key)}>{formatSize(o.size)}</SizeOrDownload>}; ToggleCheckbox variant="media"; stop importing MediaCard/MediaRow; nothing else changes.

