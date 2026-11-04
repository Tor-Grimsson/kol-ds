/* DetailsOverlay — a card's expanded view (DashboardCardSet, 2026-11-03; metric's Report Details, carried verbatim).
 *
 * KOL's own overlay: FullscreenOverlay's scrim (dims and locks the page, traps focus) and its `kol-overlay-panel` sheet.
 * The title, a search beside it, the × alone at the right, a Divider; then every row as a table — the first column the
 * row's `icon` + `label`, the rest `columns[i].key` read off the row (`fmt` formats one), each sortable from its head.
 * `columns` is `[{ key, label, fmt? }]`, the first one the label column; it opens sorted by the second, descending.
 * `rows` are `{ key?, label, icon?, ...values }`; `loading` with no rows says so. Renders nothing while `open` is false. */
import { useEffect, useMemo, useState } from 'react'
import { Button, SearchInput, FullscreenOverlay, CloseButton, Divider } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export default function DetailsOverlay({ open, onClose, title, columns, rows, loading }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ key: columns[1]?.key, dir: -1 })
  useEffect(() => { setSort({ key: columns[1]?.key, dir: -1 }); setQ('') }, [title])
  const shown = useMemo(() => {
    const s = (rows || []).filter((r) => String(r.label).toLowerCase().includes(q.toLowerCase()))
    return s.sort((a, b) => ((a[sort.key] ?? 0) > (b[sort.key] ?? 0) ? 1 : -1) * sort.dir)
  }, [rows, q, sort])
  if (!open) return null
  return (
    <FullscreenOverlay open={open} scrim closeButton={false} onClose={onClose}>
      <div className="kol-overlay-panel flex flex-col p-[var(--kol-pad-overlay)]" style={{ width: 'min(960px, calc(100vw - 32px))', maxHeight: '85vh' }}>
        <div className="flex flex-col max-h-[85vh] min-h-0">
          <div className="flex items-center gap-4 pb-4">
            <h2 className="kol-helper-14 uppercase tracking-wide text-fg-96">{title}</h2>
            <SearchInput variant="outline" size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder="Search" />
            <span className="flex-1" />
            <CloseButton onClick={onClose} hover={false} className="shrink-0" />
          </div>
          <div className="pb-2"><Divider /></div>
          <div className="overflow-auto min-h-0">
            <table className="w-full kol-helper-12 tabular-nums">
              <thead className="sticky top-0 bg-surface-secondary">
                <tr>
                  {columns.map((c, i) => (
                    <th key={c.key} className={`py-2 font-normal text-fg-48 ${i ? 'text-right pl-4' : 'text-left'}`}>
                      {i ? (
                        <Button variant="bare" className="hover:text-fg-88 inline-flex items-center gap-1" onClick={() => setSort({ key: c.key, dir: sort.key === c.key ? -sort.dir : -1 })}>
                          {c.label}
                          {sort.key === c.key && <Icon name={sort.dir < 0 ? 'chevron-down' : 'chevron-up'} size={10} />}
                        </Button>
                      ) : c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.key ?? r.label} className="odd:bg-fg-04 hover:bg-fg-08 [&>td:first-child]:rounded-l [&>td:last-child]:rounded-r [&>td:first-child]:pl-2 [&>td:last-child]:pr-2">
                    {columns.map((c, i) => (
                      <td key={c.key} className={`py-2 ${i ? 'text-right pl-4 text-fg-96' : 'text-fg-88'}`}>
                        {i ? (c.fmt ? c.fmt(r[c.key]) : r[c.key]) : <span className="flex items-center gap-2">{r.icon}{r.label}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && !rows && <div className="py-10 text-center text-fg-48">Loading…</div>}
            {rows && !shown.length && <div className="py-10 text-center text-fg-48">No data yet</div>}
          </div>
        </div>
      </div>
    </FullscreenOverlay>
  )
}
