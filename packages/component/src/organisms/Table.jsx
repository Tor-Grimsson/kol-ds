import { useMemo, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { INDICATOR } from '../hooks/glyphLadders.js'

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

const Table = ({ caption, columns, rows, variant = 'default', className = '', width = 'panel', rowClassName, compact = false, lastRule = false, framed = false }) => {
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

export default Table
