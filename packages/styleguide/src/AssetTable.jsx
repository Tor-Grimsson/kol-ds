import { useState } from 'react'
import { Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* Resolve a CSS custom property off the document root. The download seam is
 * handed a COLOUR, not a token — a consumer swapping `currentColor` in raw SVG
 * cannot use `var(--x)`, and resolving it at the call site is how two brand
 * apps ended up with the same four-line helper. SSR-safe: '' when no document. */
function resolveToken(token) {
  if (!token || typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim()
}

/**
 * AssetTable — mark / asset spec table.
 *
 * A thin composition of the DS `Table` (@kolkrabbi/kol-component) that renders
 * a download-oriented asset manifest: preview, name, format, dimensions, and a
 * download control per row. Rows are consumer-injected; the standard column set
 * is built here so a consumer only supplies data.
 *
 * Ported from the monorepo apps/brand styleguide AssetTable (2026-07). The
 * `import.meta.glob` harvesting, the mark loaders and the `Blob` recolour are
 * app code and stay out. **Three behaviours came back as seams in 0.4.0**
 * (`assettable-package-dropped-its-wiring`, kol-client-olina): the port had
 * dropped the ink toggle, the zoom preview and the recolour-aware download and
 * still read as a replacement, so its one consumer measured it and reverted.
 * The state is the table's; the `Blob` and the overlay stay the consumer's.
 *
 * - **`inkTokens`** — a `{ ink, surface }` token pair turns on the Color column
 *   and a per-row toggle dot: the row's preview paints in the live token, the
 *   column shows which one, the dot flips it. Unset, none of that renders.
 * - **`onPreviewZoom(row, resolvedInk)`** — makes the preview cell a zoom
 *   button. The consumer opens its own overlay (`FullscreenOverlay` in both
 *   brand apps) at the ink it is handed.
 * - **`row.onDownload(row, resolvedInk)`** — the second argument is the
 *   COMPUTED colour, not the token, so a consumer can swap `currentColor` for
 *   it and hand back a white mark that downloads white.
 *
 * Columns adapt to the data: Preview appears only when a row carries a
 * `preview` node, Path only when a row carries `path`, Color only under
 * `inkTokens`, and Download only when a row carries `href` or `onDownload`.
 * Name / format / dimensions always show, falling back to an em-dash (DS Table
 * behaviour) when a field is absent.
 *
 * Row shape:
 *   { id, name, preview?, previewWidth?, path?, format?, dimensions?, href?, filename?, onDownload? }
 *     id            React key (falls back to array index)
 *     name          asset name (string or node)
 *     preview       specimen node rendered in the Preview cell
 *     previewWidth  px width for the preview box — a wordmark is not a logomark
 *     path          source path, rendered in a <code> cell
 *     format        e.g. 'SVG' · 'PNG @2x'
 *     dimensions    e.g. '48 × 48'
 *     href          download URL → renders an <a download>
 *     filename      download filename for the <a download> attribute
 *     onDownload    click handler → renders a <button> (takes precedence over href)
 *
 * @param {Array<Object>} rows - The assets (required)
 * @param {string} caption - sr-only <caption> for the table (a11y)
 * @param {'default'|'simple'} variant - Forwarded to DS Table
 * @param {string} className - Extra classes on the table wrapper
 * @param {string} emptyLabel - Message shown when rows is empty (default 'No assets.')
 * @param {{ink: string, surface: string}} inkTokens - CSS custom-property pair the ink toggle swings between; unset disables the Color column and the toggle
 * @param {Function} onPreviewZoom - `(row, resolvedInk)` — supplied, the preview becomes a zoom button and the consumer owns the overlay
 */
export default function AssetTable({
  rows = [],
  caption,
  variant = 'default',
  className = '',
  emptyLabel = 'No assets.',
  inkTokens = null,
  onPreviewZoom,
}) {
  /* Per-row ink, keyed by row id. Hooks run before the empty-rows return so the
   * order never changes with the data. */
  const [inks, setInks] = useState({})

  if (!rows.length) {
    return <p className="kol-mono-14 text-fg-48">{emptyLabel}</p>
  }

  const withId = rows.map((row, i) => ({ ...row, id: row.id ?? i }))
  const hasPreview = withId.some((row) => row.preview != null)
  const hasPath = withId.some((row) => row.path != null)
  const hasDownload = withId.some((row) => row.href || row.onDownload)

  const tokenFor = (id) => (inkTokens ? inks[id] ?? inkTokens.ink : null)
  const toggleInk = (id) =>
    setInks((prev) => ({
      ...prev,
      [id]: (prev[id] ?? inkTokens.ink) === inkTokens.ink ? inkTokens.surface : inkTokens.ink,
    }))

  const columns = [
    hasPreview && {
      accessor: 'preview',
      header: 'Preview',
      /* Off-ink rows get a wash so a surface-coloured mark stays visible
         against the table's own ground — the consumer's behaviour, kept. */
      className: (row) =>
        `kol-table-cell-text${inkTokens && tokenFor(row.id) !== inkTokens.ink ? ' bg-fg-04' : ''}`,
      style: { minWidth: 160 },
      render: (row) => <PreviewCell row={row} token={tokenFor(row.id)} onZoom={onPreviewZoom} />,
    },
    {
      accessor: 'name',
      header: 'Name',
      className: 'kol-table-cell-text',
    },
    hasPath && {
      accessor: 'path',
      header: 'Path',
      className: 'kol-table-cell-meta',
      render: (row) => (row.path ? <code>{row.path}</code> : null),
    },
    {
      accessor: 'format',
      header: 'Format',
      className: 'kol-table-cell-meta',
    },
    {
      accessor: 'dimensions',
      header: 'Dimensions',
      className: 'kol-table-cell-meta',
    },
    inkTokens && {
      accessor: 'color',
      header: 'Color',
      className: 'kol-table-cell-meta',
      render: (row) => <code>{tokenFor(row.id)}</code>,
    },
    hasDownload && {
      accessor: 'download',
      header: 'Download',
      style: { width: 96 },
      render: (row) => (
        <DownloadControl
          row={row}
          token={tokenFor(row.id)}
          onToggleInk={inkTokens ? () => toggleInk(row.id) : null}
        />
      ),
    },
  ].filter(Boolean)

  return <Table caption={caption} columns={columns} rows={withId} variant={variant} className={className} />
}

/* Preview cell. With `onZoom` it is a zoom button; without, the bare node —
 * a table that only lists assets should not claim a click. `token` paints the
 * node through currentColor, which is what makes one SVG serve both inks. */
function PreviewCell({ row, token, onZoom }) {
  if (row.preview == null) return null

  const style = {
    ...(token ? { color: `var(${token})` } : {}),
    ...(row.previewWidth ? { width: row.previewWidth } : {}),
  }

  if (!onZoom) {
    return Object.keys(style).length ? <span className="inline-flex items-center" style={style}>{row.preview}</span> : row.preview
  }

  return (
    <button
      type="button"
      onClick={() => onZoom(row, resolveToken(token))}
      className="inline-flex items-center cursor-zoom-in"
      style={style}
      aria-label={`Open ${typeof row.name === 'string' ? row.name : 'asset'} overlay`}
    >
      {row.preview}
    </button>
  )
}

/* Per-row download affordance. onDownload → button; href → anchor; else nothing.
 * The DS `download` icon inherits currentColor; aria-label composes the asset
 * name for screen readers (an a11y string, not rendered content). Under
 * `inkTokens` a toggle dot rides beside it — the ink a download will carry is
 * chosen where the download is, not in a separate control. */
function DownloadControl({ row, token, onToggleInk }) {
  const label = `Download ${typeof row.name === 'string' ? row.name : 'asset'}`

  const control = row.onDownload ? (
    <button
      type="button"
      onClick={() => row.onDownload(row, resolveToken(token))}
      className="inline-flex items-center text-fg-64"
      aria-label={label}
      title="Download"
    >
      <Icon name="download" size={16} />
    </button>
  ) : row.href ? (
    <a
      href={row.href}
      download={row.filename ?? true}
      className="inline-flex items-center text-fg-64"
      aria-label={label}
      title="Download"
    >
      <Icon name="download" size={16} />
    </a>
  ) : null

  if (!control) return null
  if (!onToggleInk) return control

  return (
    <span className="inline-flex items-center gap-2">
      {control}
      <button
        type="button"
        onClick={onToggleInk}
        className="inline-flex items-center justify-center w-6 h-6"
        aria-label={`Toggle download color — current ${token}`}
        title={`Toggle (currently ${token})`}
      >
        <span
          className="inline-block rounded-full border border-fg-24"
          style={{ width: 8, height: 8, background: `var(${token})` }}
        />
      </button>
    </span>
  )
}
