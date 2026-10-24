import { useCallback, useRef, useState } from 'react'

/**
 * CatalogGrid — The catalog's measured card grid. the grid every catalog draws its cards and rows on, lifted out of
 * `CatalogPage` so a second page draws the same one (studio-hub review 2, § 3.1 — user, on Create's parts: *"a new
 * set of card and row … different card, layout, padding, text … there are 8 columns per row"*: StudioCreate had drawn
 * its own `auto-fill minmax(160px)` grid and its own list).
 *
 * GRID: `.kol-catalog-grid` over a MEASURED track count (CatalogFilterFirstGroupTrackCount, 2026-09-03) — up to
 * `maxColumns` (6, the ruling) tracks, none narrower than `minColumn` (160), gap 24:
 * `min(maxColumns, floor((W + 24) / (minColumn + 24)))`, in JS because the CSS form is Chromium-only. The count is set
 * as `--kol-catalog-n` on the grid and reported through `onColumns`, so a page can set it where its filter row's
 * `.kol-filters-first` reads it too. LIST: rows `listColumns` across (never under 240, gap 8), or `stack` — one per line.
 *
 * @param {'grid'|'list'} layout   which of the two (default `grid`)
 * @param {number}   minColumn      the grid track's floor in px (default 160)
 * @param {number}   maxColumns     the grid's ceiling (default 6)
 * @param {number}   listColumns    the list's column ceiling (default 4)
 * @param {'grid'|'stack'} listLayout  the list's container (default `grid`)
 * @param {Function} onColumns      `(n) => void` — the measured track count, whenever it changes
 * @param {ReactNode} children      the cards (grid) or rows (list)
 */
export default function CatalogGrid({ layout = 'grid', minColumn = 160, maxColumns = 6, listColumns = 4, listLayout = 'grid', onColumns, children, className, style }) {
  const [cols, setCols] = useState(null)
  const observer = useRef(null)
  const report = useRef(onColumns)
  report.current = onColumns
  /* a CALLBACK ref: the grid mounts and unmounts with the layout toggle, and a callback ref sees both */
  const gridRef = useCallback((el) => {
    observer.current?.disconnect()
    observer.current = null
    if (!el) return
    const measure = (W) => {
      const n = Math.max(1, Math.min(maxColumns, Math.floor((W + 24) / (minColumn + 24))))
      setCols((c) => (c === n ? c : n))
      report.current?.(n)
    }
    measure(el.getBoundingClientRect().width)
    const ro = new ResizeObserver(([entry]) => measure(entry.contentRect.width))
    ro.observe(el)
    observer.current = ro
  }, [minColumn, maxColumns])

  if (layout === 'list') {
    return (
      <div className={className} style={{ ...(listLayout === 'stack' ? { display: 'flex', flexDirection: 'column', gap: 8 } : { display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, max(240px, calc((100% - ${listColumns - 1} * 8px) / ${listColumns}))), 1fr))`, gap: 8 }), ...style }}>
        {children}
      </div>
    )
  }
  return (
    <div ref={gridRef} className={`kol-catalog-grid ${className ?? ''}`.trim()} style={{ '--kol-catalog-n': cols ?? undefined, ...style }}>
      {children}
    </div>
  )
}
