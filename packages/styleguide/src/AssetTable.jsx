import { Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/**
 * AssetTable — mark / asset spec table.
 *
 * A thin composition of the DS `Table` (@kolkrabbi/kol-component) that renders
 * a download-oriented asset manifest: preview, name, format, dimensions, and a
 * download control per row. Rows are consumer-injected; the standard column set
 * is built here so a consumer only supplies data.
 *
 * Ported from the monorepo apps/brand styleguide AssetTable (2026-07). All
 * app-specific wiring is dropped: the `import.meta.glob` SVG harvesting, the
 * KolLogo / Graphic loaders, the ink-token toggle, the fullscreen overlay, and
 * the `Blob` recolour-and-download. Download is now a plain per-row seam —
 * pass `href` (a download link) OR `onDownload` (a callback). Preview is a
 * consumer-supplied node.
 *
 * Columns adapt to the data: the Preview column appears only when a row carries
 * a `preview` node, and the Download column only when a row carries `href` or
 * `onDownload`. Name / format / dimensions always show, falling back to an
 * em-dash (DS Table behaviour) when a field is absent.
 *
 * Row shape:
 *   { id, name, preview?, format?, dimensions?, href?, filename?, onDownload? }
 *     id          React key (falls back to array index)
 *     name        asset name (string or node)
 *     preview     specimen node rendered in the Preview cell
 *     format      e.g. 'SVG' · 'PNG @2x'
 *     dimensions  e.g. '48 × 48'
 *     href        download URL → renders an <a download>
 *     filename    download filename for the <a download> attribute
 *     onDownload  click handler → renders a <button> (takes precedence over href)
 *
 * Props:
 *   rows        Array<row>  (required)
 *   caption     sr-only <caption> for the table (a11y)
 *   variant     'default' | 'simple'  → forwarded to DS Table
 *   className   extra classes on the table wrapper
 *   emptyLabel  message shown when rows is empty (default 'No assets.')
 */
export default function AssetTable({
  rows = [],
  caption,
  variant = 'default',
  className = '',
  emptyLabel = 'No assets.',
}) {
  if (!rows.length) {
    return <p className="kol-mono-14 text-fg-48">{emptyLabel}</p>
  }

  const withId = rows.map((row, i) => ({ ...row, id: row.id ?? i }))
  const hasPreview = withId.some((row) => row.preview != null)
  const hasDownload = withId.some((row) => row.href || row.onDownload)

  const columns = [
    hasPreview && {
      accessor: 'preview',
      header: 'Preview',
      className: 'kol-table-cell-text',
      style: { minWidth: 160 },
      render: (row) => row.preview ?? null,
    },
    {
      accessor: 'name',
      header: 'Name',
      className: 'kol-table-cell-text',
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
    hasDownload && {
      accessor: 'download',
      header: 'Download',
      style: { width: 96 },
      render: (row) => <DownloadControl row={row} />,
    },
  ].filter(Boolean)

  return <Table caption={caption} columns={columns} rows={withId} variant={variant} className={className} />
}

/* Per-row download affordance. onDownload → button; href → anchor; else nothing.
 * The DS `download` icon inherits currentColor; aria-label composes the asset
 * name for screen readers (an a11y string, not rendered content). */
function DownloadControl({ row }) {
  const label = `Download ${typeof row.name === 'string' ? row.name : 'asset'}`

  if (row.onDownload) {
    return (
      <button
        type="button"
        onClick={() => row.onDownload(row)}
        className="inline-flex items-center text-fg-64"
        aria-label={label}
        title="Download"
      >
        <Icon name="download" size={16} />
      </button>
    )
  }

  if (row.href) {
    return (
      <a
        href={row.href}
        download={row.filename ?? true}
        className="inline-flex items-center text-fg-64"
        aria-label={label}
        title="Download"
      >
        <Icon name="download" size={16} />
      </a>
    )
  }

  return null
}
