import { Fragment, useMemo, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { INDICATOR } from '../hooks/glyphLadders.js'
import Button from '../atoms/Button.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'
import { fileAgo } from '../molecules/ContentCard.jsx'

/**
 * Table — data table.
 * Styles: src/styles/kol-components-organisms.css.
 *
 * Variants:
 *   default — bordered, column dividers, header bg
 *   simple  — borderless, flush, no column dividers
 *
 * SORTING (2026-08-01): a column opts in with `sortable: true`. Clicking its
 * header cycles asc → desc → none, and the glyph says which. The header is a
 * real <button> inside the <th>, so it is keyboard-reachable and screen
 * readers get `aria-sort` on the cell. Uncontrolled by design — a table that
 * sorts itself needs no state from the page. Pass `sortValue(row)` when the
 * rendered cell is not what should be compared (a chip, a link, a date
 * string).
 *
 * FLOAT (`variant="float"`, float-everything W8 rows 115 · 116, 2026-11-04 — kol-float--style 48:2780 analytics,
 * 48:3257 catalog): its own render, none of `.kol-table`'s rules. The head in mono (`kol-float-ruler`, 10, uppercase
 * by the table's role) on the emphasis ink; body cells in `kol-float-timecode` (mono 12) on fg-64, or the float sans
 * (`kol-float-hint`) for a column with `sans: true`; 12 · 16 in a cell, no rules between rows (the no-borders law —
 * rows lift fg-08 under the pointer instead). `align: 'right'` right-aligns a column (the numbers, the share). A cell's
 * `render` draws covers and status pills (`Pill variant="float"`) — the catalog's cover · title · status row.
 * `framed` sets it on a sheet (surface-secondary on `--kol-float-menu-r`, 8 in) — the catalog; unframed it sits on
 * whatever float holds it — the analytics card.
 */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/* WIDTH IS A CONTRACT, NOT A COMMENT (2026-08-01). A table used to be capped
 * by whatever div a page happened to wrap it in, and the gate policed that by
 * grepping the page for a token name — so a legitimate wide table needed a
 * magic `width-ok:` comment to buy clearance. The table declares its own width
 * now: `panel` (the default, prose tables) caps at the panel rung; `column`
 * runs the content column for a DATA table whose columns need the room. Both
 * are correct by construction, so the gate can assert the contract instead of
 * a string. */
const WIDTHS = {
  panel: 'max-w-[var(--kol-content-panel)]',
  column: '',
}

const TableDefault = ({ caption, columns, rows, variant = 'default', className = '', width = 'panel', rowClassName, compact = false, lastRule = false, framed = false }) => {
  const [sort, setSort] = useState({ key: null, dir: null })

  const cycle = (key) =>
    setSort((prev) =>
      prev.key !== key ? { key, dir: 'asc' }
      : prev.dir === 'asc' ? { key, dir: 'desc' }
      : { key: null, dir: null })

  const sorted = useMemo(() => {
    if (!sort.key || !sort.dir) return rows
    const col = columns.find((c) => c.accessor === sort.key)
    if (!col) return rows
    const val = (r) => (col.sortValue ? col.sortValue(r) : r[col.accessor])
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const x = val(a), y = val(b)
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign
      return collator.compare(String(x ?? ''), String(y ?? '')) * sign
    })
  }, [rows, columns, sort])

  if (variant === 'float') return <FloatTable caption={caption} columns={columns} rows={sorted} sort={sort} cycle={cycle} framed={framed} rowClassName={rowClassName} className={`${WIDTHS[width] ?? WIDTHS.panel} ${className}`.trim()} />

  const variantClass = variant === 'simple' ? 'kol-table--simple' : ''
  /* compact — record-surface density (RecordManager, 2026-08-09): the default
   * 12/16 cell box read as bloated rows against the reference table. */
  /* lastRule — `simple` only: the rule under the LAST row. Off by default (2026-10-01): the
   * table is usually followed by a divider of its own, and the two read as a double line. */
  const wrapperClass = ['kol-table-wrapper', variantClass, lastRule && 'kol-table--last-rule', compact && 'kol-table--compact', WIDTHS[width] ?? WIDTHS.panel, className].filter(Boolean).join(' ')
  return (
  <div className={wrapperClass}>
    <table className="kol-table">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead className="kol-table-thead">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              scope="col"
              className={column.headerClassName ?? 'kol-table-cell-title'}
              style={column.style}
              aria-sort={sort.key === column.accessor ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
            >
              {column.sortable ? (
                <button
                  type="button"
                  className="kol-table-sort"
                  onClick={() => cycle(column.accessor)}
                >
                  {column.header}
                  <IconLoader
                    name={sort.key === column.accessor && sort.dir === 'desc' ? 'chevron-down' : 'chevron-up'}
                    size={INDICATOR.sm}
                    className={sort.key === column.accessor ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}
                  />
                </button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, rowIndex) => (
          <tr key={row.id ?? row.token ?? rowIndex} className={`kol-table-row${rowClassName ? ` ${rowClassName(row, rowIndex)}` : ''}`}>
            {columns.map((column) => (
              /* a column's `wrap: true` is the body cell that wraps (TableWrapTextCell, kol-studio 2026-10-24) — the default
               * class with its `--wrap` modifier; a column naming its own className keeps it */
              <td key={column.accessor} className={(typeof column.className === 'function' ? column.className(row) : column.className) ?? (column.wrap ? 'kol-table-cell-text kol-table-cell-text--wrap' : 'kol-table-cell-text')} style={column.style}>
                {column.render ? column.render(row) : row[column.accessor] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

function FloatTable({ caption, columns, rows, sort, cycle, framed, rowClassName, className }) {
  const align = (c) => (c.align === 'right' ? 'text-right' : 'text-left')
  return (
    <div className={`w-full overflow-x-auto ${framed ? 'rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-2' : ''} ${className}`.trim()}>
      <table className="w-full border-collapse">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.accessor} scope="col" style={c.style} className={`kol-float-ruler whitespace-nowrap px-4 py-3 font-normal uppercase text-fg-emphasis first:pl-3 ${align(c)}`}
                aria-sort={sort.key === c.accessor ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.sortable ? (
                  <button type="button" onClick={() => cycle(c.accessor)} className="inline-flex items-center gap-1 uppercase cursor-pointer">
                    {c.header}
                    <IconLoader name={sort.key === c.accessor && sort.dir === 'desc' ? 'arrow-down' : 'arrow-up'} size={10} className={sort.key === c.accessor ? 'text-oq-96' : 'opacity-0'} />
                  </button>
                ) : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? row.token ?? i} className={`group${rowClassName ? ` ${rowClassName(row, i)}` : ''}`}>
              {columns.map((c) => (
                <td key={c.accessor} style={c.style}
                  className={`${c.sans ? 'kol-float-hint' : 'kol-float-timecode'} whitespace-nowrap px-4 py-3 text-fg-64 group-hover:bg-fg-08 group-hover:text-fg-emphasis first:rounded-l-[var(--kol-float-list-r)] first:pl-3 last:rounded-r-[var(--kol-float-list-r)] ${align(c)}`}>
                  {c.render ? c.render(row) : row[c.accessor] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * kolbox's FileList with its FileListHeader and FileListRow (Figma `FileList`), carried from apps/kolbox/src/home: 20
 * under the title row, the head row (39), then one row per file, 48 high, touching. Opens on a double click or Enter.
 * Table's words: `rows` (the files: { id, name, modified, created, size }), `sort` ('modified' | 'created' | 'name'; the
 * sorted column's name in the ink with its arrow). kolbox's own: `onOpen(file)`; `onSettings(file)`, `onRemove(file)`
 * (the cog and the trash; with either, the Size column and the actions gutter), `onMenu(file, event)` (right click).
 * Columns (Figma's file list, measured: plan-2026-11-23 W6): the star's 33, Name at half the row, then Last modified,
 * Created and Active in file (and Size) sharing the rest; the head 39, the cells full height; the row inset 32 at the
 * right as a margin, so its hover ends there; under 768 Created and Active in file give way. `onStar(file)`: the star, lit while
 * `file.starred`; absent, the column is empty. `file.icon` names the name's glyph (default `file`). */
const FILE_COLS_KOLBOX = 'grid grid-cols-[33px_50%_repeat(3,minmax(0,1fr))] mr-8 max-md:grid-cols-[33px_minmax(0,1fr)_104px] max-md:mr-4'
const FILE_COLS_ACTIONS_KOLBOX = 'grid grid-cols-[33px_50%_repeat(4,minmax(0,1fr))_64px] mr-8 max-md:grid-cols-[33px_minmax(0,1fr)_104px_64px_64px] max-md:mr-4'
const PHONE_HIDDEN_KOLBOX = 'max-md:hidden'

function TableHeadKolbox({ sort, actions = false }) {
  const col = (key, label, pad = 'pl-2', hide = '') => (
    <span role="columnheader" className={`flex items-center gap-1 whitespace-nowrap ${pad} ${sort === key ? 'is-sorted' : ''} ${hide}`}>
      {label}{sort === key && <KolboxGlyph name="arrow-down" size={12} />}
    </span>
  )
  return (
    <div role="row" className={`kol-table-head ${actions ? FILE_COLS_ACTIONS_KOLBOX : FILE_COLS_KOLBOX} h-[39px] shrink-0`} data-file-list-header>
      <span role="columnheader" aria-label="Star" className="self-center" />
      {col('name', 'Name', '')}
      {col('modified', 'Last modified')}
      {col('created', 'Created', 'pl-2', PHONE_HIDDEN_KOLBOX)}
      {col('active', 'Active in file', 'pl-2', PHONE_HIDDEN_KOLBOX)}
      {actions && col('size', 'Size')}
      {actions && <span role="columnheader" aria-label="Actions" />}
    </div>
  )
}

function TableRowKolbox({ file, onOpen, actions = false, onStar, onSettings, onRemove, onMenu }) {
  const stop = (fn) => (e) => { e.stopPropagation(); fn(file, e) }
  return (
    <div
      role="row"
      tabIndex={0}
      aria-label={file.name}
      onDoubleClick={() => onOpen?.(file)}
      onKeyDown={(e) => { if (e.key === 'Enter' && e.target === e.currentTarget) onOpen?.(file) }}
      onContextMenu={onMenu ? (e) => { e.preventDefault(); onMenu(file, e) } : undefined}
      className={`kol-table-row ${actions ? FILE_COLS_ACTIONS_KOLBOX : FILE_COLS_KOLBOX} h-12 shrink-0 cursor-default outline-none`}
      data-file-row={file.id}
    >
      <span role="cell" className="flex items-center justify-center">
        {onStar && <Tooltip variant="kolbox" label={file.starred ? 'Unstar' : 'Star'}><Button variant="kolbox" iconOnly="star" aria-label="Star" pressed={!!file.starred} onClick={stop(onStar)} onDoubleClick={(e) => e.stopPropagation()} /></Tooltip>}
      </span>
      <span role="cell" className="flex min-w-0 items-center gap-3 pl-2">
        <KolboxGlyph name={file.icon ?? 'file'} className="kol-table-icon" />
        <span className="kol-table-name truncate">{file.name}</span>
      </span>
      <span role="cell" className="flex min-w-0 items-center pl-2"><span className="truncate">{fileAgo(file.modified)}</span></span>
      <span role="cell" className={`flex min-w-0 items-center pl-2 ${PHONE_HIDDEN_KOLBOX}`}><span className="truncate">{fileAgo(file.created)}</span></span>
      <span role="cell" className={PHONE_HIDDEN_KOLBOX} />
      {actions && <span role="cell" className="kol-table-size flex items-center pl-2">{file.size}</span>}
      {actions && (
        <span role="cell" className="flex items-center justify-end" onDoubleClick={(e) => e.stopPropagation()}>
          {onSettings && <Tooltip variant="kolbox" label="Settings"><Button variant="kolbox" iconOnly="settings-01" aria-label="Settings" onClick={stop(onSettings)} /></Tooltip>}
          {onRemove && <Tooltip variant="kolbox" label="Delete"><Button variant="kolbox" iconOnly="trash" aria-label="Delete" onClick={stop(onRemove)} /></Tooltip>}
        </span>
      )}
    </div>
  )
}

/* Folio on kolbox (2026-11-22): `columns` ({ header, width?, phone?, render(row) }, Table folio's words) draws the
   caller's own columns in kolbox's head and rows: the same 40 head and 48 rows, the 33 gutter and the 32 inset, a column
   with no `width` taking the rest, `phone: false` giving way under 768. `rowKey(row)` keys a row (default `row.id`).
   Without `columns` the file list draws as before. */
function TableKolboxColumns({ columns, rows, rowKey = (r) => r.id, onOpen, className }) {
  const track = (list) => ['33px', ...list.map((c) => (c.width ? `${c.width}px` : 'minmax(0,1fr)'))].join(' ')
  const phone = columns.filter((c) => c.phone !== false)
  const grid = 'grid grid-cols-(--kol-table-cols) gap-x-2 pr-8 max-md:grid-cols-(--kol-table-cols-phone) max-md:pr-4'
  const hide = (c) => (c.phone === false ? 'max-md:hidden' : '')
  return (
    <div role="table" className={`kol-table--kolbox min-h-0 flex-1 overflow-y-auto pt-5 max-md:flex-none max-md:overflow-visible ${className}`.trim()} style={{ '--kol-table-cols': track(columns), '--kol-table-cols-phone': track(phone) }} data-file-list>
      <div role="row" className={`kol-table-head ${grid} h-10 shrink-0 items-center`} data-file-list-header>
        <span role="columnheader" aria-hidden />
        {columns.map((c, i) => <span key={i} role="columnheader" className={`truncate ${hide(c)}`}>{c.header}</span>)}
      </div>
      {rows.map((row) => (
        <div key={rowKey(row)} role="row" tabIndex={0} onDoubleClick={() => onOpen?.(row)} onKeyDown={(e) => { if (e.key === 'Enter' && e.target === e.currentTarget) onOpen?.(row) }}
          className={`kol-table-row ${grid} h-12 shrink-0 cursor-default items-center outline-none`} data-file-row={rowKey(row)}>
          <span role="cell" aria-hidden />
          {columns.map((c, i) => <span key={i} role="cell" className={`flex min-w-0 items-center ${hide(c)}`}>{c.render(row)}</span>)}
        </div>
      ))}
    </div>
  )
}

function TableKolbox({ rows = [], sort, columns, rowKey, onOpen, onStar, onSettings, onRemove, onMenu, className = '' }) {
  if (columns) return <TableKolboxColumns columns={columns} rows={rows} rowKey={rowKey} onOpen={onOpen} className={className} />
  const actions = !!(onSettings || onRemove)
  return (
    <div role="table" className={`kol-table--kolbox min-h-0 flex-1 overflow-y-auto pt-5 max-md:flex-none max-md:overflow-visible max-md:pb-28 ${className}`.trim()} data-file-list>
      <TableHeadKolbox sort={sort} actions={actions} />
      {rows.map((f) => <TableRowKolbox key={f.id} file={f} onOpen={onOpen} actions={actions} onStar={onStar} onSettings={onSettings} onRemove={onRemove} onMenu={onMenu} />)}
    </div>
  )
}

/* ── folio (Folio batch E, 2026-11-22) ─────────────────────────────────────────────────────────────────────────────
 * Folio's table of books, carried from apps/folio's FolioShelf ("All books"): the head row 34 high in Folio's label
 * type, muted, over a 2px rule in the ink; one row per book 70 high on a hairline, lit on hover, the whole row a link;
 * columns 20 apart and a trailing arrow. Table's words: `columns` ({ header, width?, render(row) }: a column with no
 * `width` takes the rest; `render` draws the whole cell, its own width with it) and `rows`. Folio's own: `rowKey(row)`,
 * `rowHref(row)` with `linkComponent` (a router's Link; default `a`), and `empty` (the node drawn when there are no
 * rows). */
function TableFolio({ columns = [], rows = [], rowKey = (r) => r.id, rowHref, linkComponent: L = 'a', empty, className = '' }) {
  return (
    <div className={`kol-table--folio flex flex-col ${className}`.trim()}>
      <div className="kol-folio-label kol-table-head flex h-[34px] items-center gap-[20px] border-b-2">
        {columns.map((c, i) => <p key={i} className={c.width ? 'shrink-0' : 'min-w-0 flex-1'} style={c.width ? { width: c.width } : undefined}>{c.header}</p>)}
        <span className="w-[18px] shrink-0" />
      </div>
      {rows.map((row) => {
        const href = rowHref?.(row)
        return (
          <L key={rowKey(row)} {...(L === 'a' ? { href } : { to: href })} className="kol-table-row group flex h-[70px] items-center gap-[20px] border-b">
            {columns.map((c, i) => <Fragment key={i}>{c.render(row)}</Fragment>)}
            <span className="kol-table-arrow shrink-0"><IconLoader name="arrow-right" size={18} /></span>
          </L>
        )
      })}
      {rows.length === 0 && empty}
    </div>
  )
}

const Table = (props) => (props.variant === 'folio' ? <TableFolio {...props} /> : props.variant === 'kolbox' ? <TableKolbox {...props} /> : <TableDefault {...props} />)

export default Table
