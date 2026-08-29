# ColumnBrowserWidthsPersist — the width drags report but cannot be restored

**Staged:** 2026-08-27 · from **kol-r2b2** (the remainder `ColumnBrowserResize` left; adopted on component 0.113.0 the same day)
**Change:** kol-component `ColumnBrowser` — a controlled counterpart to `onColumnResize`

## The gap

`ColumnBrowserResize` (0.113.0) gave height a full controlled pair — `height` in, `onHeightChange(px)` out — so kol-r2b2 persists it per bucket (`columnHeight`, `src/lib/settings.js`). Widths got only half:

- **in:** `columnWidth` — ONE number seeding every column (260; preview 320).
- **out:** `onColumnResize(index | 'preview', px)` — per column.

So a consumer is told each column's new width and has no way to hand them back. Drag three columns, reload, and all three snap to 260. kol-r2b2 stores nothing rather than write a setting nothing can read.

## The ask

`columnWidths` — the controlled counterpart, same shape the callback reports: a map keyed by column index plus `'preview'` (`{ 0: 300, 2: 190, preview: 420 }`), or an array with a separate `previewWidth`, whichever reads better DS-side. Unset = today's behaviour (every column from `columnWidth`). A key with no column (the user navigated elsewhere, fewer columns now) is ignored, not an error — prefixes come and go, and a stale map must never throw.

## Recreation notes

The organism already holds widths in internal state seeded from `columnWidth`; this is the same controlled-or-uncontrolled seam `height` / `defaultHeight` got. `columnWidth` stays as the default for any column the map does not name. No render change.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.115.0

`columnWidths` — the controlled counterpart to `onColumnResize`: a map keyed by column index plus `'preview'` (`{ 0: 300, 2: 190, preview: 420 }`), the shape the callback reports; a key with no column is ignored, an unnamed column falls back to the drag state, then `columnWidth`. Unset = 0.113.0's behaviour; no render change. 21 gates clean; verified in source.

**Remainder here:** none — kol-r2b2: bump kol-component 0.115.0; store the `onColumnResize` map per bucket beside `columnHeight` and pass it back as `columnWidths`.
