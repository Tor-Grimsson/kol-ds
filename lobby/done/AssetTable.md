---
component: AssetTable
source: kol-client-kolkrabbi/src/components/styleguide/AssetTable.jsx
date: 2026-07-10
status: built
package: "@kolkrabbi/kol-styleguide"
deps: [Table, Icon]
---

# AssetTable

## Purpose
A mark / asset **spec-and-download table**: a thin composition of the DS `Table` that renders an asset manifest — preview, name, format, dimensions, and a per-row download control. Rows are consumer-injected; the standard column set is built here so a consumer supplies only data.

## Anatomy
- DS **`Table`** (@kolkrabbi/kol-component) fed a built column set + `rows`.
  - **Preview** — `row.preview` node. Included only when some row carries a preview. `minWidth: 160`.
  - **Name** — `row.name` (`kol-table-cell-text`).
  - **Format** — `row.format` (`kol-table-cell-meta`).
  - **Dimensions** — `row.dimensions` (`kol-table-cell-meta`).
  - **Download** — `<DownloadControl>` per row. Included only when some row carries `href` / `onDownload`. `width: 96`.
- **Empty state** — `rows` empty → `<p className="kol-mono-14 text-fg-48">{emptyLabel}</p>`.
- **`DownloadControl`** (local) — `onDownload` → `<button onClick>`; else `href` → `<a href download>`; else `null`. DS `Icon name="download" size={16}`, `inline-flex items-center text-fg-64`, `aria-label={\`Download ${name}\`}`.

## Variants
`variant` (`'default' | 'simple'`) is forwarded straight to DS Table. Columns adapt to the data (Preview / Download appear only when rows carry those fields).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| rows | `Array<row>` | `[]` | the manifest (see row shape) |
| caption | string | — | sr-only `<caption>` for a11y |
| variant | `'default'\|'simple'` | `'default'` | forwarded to DS Table |
| className | string | `''` | extra classes on the table wrapper |
| emptyLabel | string | `'No assets.'` | message when `rows` is empty |

**Row shape:** `{ id, name, preview?, format?, dimensions?, href?, filename?, onDownload? }` — `onDownload(row)` takes precedence over `href`; `filename` sets the `<a download>` attribute; absent name/format/dimensions fall back to an em-dash (DS Table behaviour).

## Styling
- **No new CSS.** DS Table owns its chrome (`kol-components-organisms.css`); cells reuse `kol-table-cell-text` / `-meta`; the control + empty state use existing utilities (`inline-flex`, `text-fg-64`, `text-fg-48`, `kol-mono-14`).
- Type inline per the fault line: wrapping empty-state copy → `kol-mono-14`; the icon control is single-line chrome with no visible text.

## States & interactions
Stateless. Download is a per-row seam (`href` / `onDownload`) invoked by the consumer's own wiring.

## Dependencies
- **Table** (@kolkrabbi/kol-component) — the composed data table.
- **Icon** (@kolkrabbi/kol-icons) — `download` glyph in the control.

## Recreation notes
- **Tier:** organism (composes a DS organism). Kept a thin adapter — columns + download seam only.
- **App-specific bits DROPPED:** `import.meta.glob` SVG harvesting, `KolLogo` / `Graphic` loaders, the ink-token toggle, the fullscreen overlay + Escape handler, and the `Blob` recolour-and-download (`downloadRecolored`). Preview is now a consumer node; download is `href` / `onDownload`.
- **Format / dimensions** replace the source's `path` / `color` (token) columns — this is a spec table, not the source's SVG-inspector table.
