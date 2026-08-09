import { useMemo, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
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

const Table = ({ caption, columns, rows, variant = 'default', className = '', width = 'panel', rowClassName, compact = false }) => {
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

  const variantClass = variant === 'simple' ? 'kol-table--simple' : ''
  /* compact — record-surface density (RecordManager, 2026-08-09): the default
   * 12/16 cell box read as bloated rows against the reference table. */
  const wrapperClass = ['kol-table-wrapper', variantClass, compact && 'kol-table--compact', WIDTHS[width] ?? WIDTHS.panel, className].filter(Boolean).join(' ')
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
                  <Icon
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
              <td key={column.accessor} className={(typeof column.className === 'function' ? column.className(row) : column.className) ?? 'kol-table-cell-text'} style={column.style}>
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

export default Table
