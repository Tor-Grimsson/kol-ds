/* The report card (8.9), Plausible's anatomy: a tab header (a tab with ⌄ opens a choice inside it), an expand button
 * and an optional ⋮ on the right; under it a column head and up to nine rows — a bar behind the label sized by share,
 * the value right, a trend arrow when Compare is on. Hover shows the share in a tooltip; a click filters the page. */
import { useNine, useTen } from './nine.js'
import { useEffect, useMemo, useState } from 'react'
import { Button, Menu, SearchInput, FullscreenOverlay, CloseButton, Divider } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { Dialog } from '@kolkrabbi/kol-component'
import { fmtNum } from './data.js'

/* ── header ───────────────────────────────────────────────────────────── */
export function Card({ tabs, tab, setTab, onExpand, menu, children, className = '' }) {
  /* /demo-9 (11.3): the tabs sit on the header's foot, so the active underline lands ON the rule — they were centred
   * against the taller expand/⋮ group and floated a few px above it */
  const nine = useNine()
  /* /demo-10 (13.8): every card's header one height — the right group is always the control row, empty or not */
  const ten = useTen()
  return (
    <section className={`bg-surface-secondary rounded flex flex-col min-w-0 ${className}`} style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <header className="flex items-center gap-4 border-b border-fg-08 min-w-0">
        <div className={`flex items-end gap-5 flex-1 min-w-0 overflow-x-auto ${nine ? 'self-stretch' : ''}`} style={{ scrollbarWidth: 'none' }}>
          {tabs.map((t) => {
            if (!t.options) return <TabButton key={t.key} active={t.key === tab} onClick={() => setTab(t.key)}>{t.label}</TabButton>
            /* a tab that opens a list (Campaigns, Properties, Funnels): a KOL `Menu` whose trigger is this card's tab with
             * a caret; Properties / Funnels search it, as Plausible's (Round 4, 2026-10-31) */
            const active = t.options.some((o) => o.key === tab)
            return (
              <Menu key={t.key} minWidth={t.search ? 280 : undefined} search={t.search ? { empty: t.empty } : undefined}
                trigger={({ open, props }) => (
                  <TabButton active={active} open={open} {...props}>
                    {(t.search ? t : t.options.find((o) => o.key === tab) || t).label}
                    <Icon name="chevron-down" size={10} className="ml-2" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }} />
                  </TabButton>
                )}
                items={t.options.map((o) => ({ key: o.key, label: o.label, current: o.key === tab, checked: o.key === tab, onClick: () => setTab(o.key) }))} />
            )
          })}
        </div>
        <div className="flex items-center gap-1 pb-2 shrink-0 box-content" style={ten ? { height: 'var(--kol-ctl-sm)' } : undefined}>
          {onExpand && <Button tone="ghost" size="sm" iconOnly="maximize" aria-label="Expand" onClick={onExpand} />}
          {menu}
        </div>
      </header>
      {children}
    </section>
  )
}

/* /demo-10 (13.8): the card header alone — one title as the active tab on the rule, controls at the right — for a card
 * that is not a Report Card (the chart under the stat tiles) */
export const CardHead = ({ title, right, rightPad = 'pb-2' }) => (
  <header className="flex items-center gap-4 border-b border-fg-08 min-w-0">
    <div className="hidden md:flex items-end gap-5 flex-1 min-w-0 self-stretch"><TabButton active>{title}</TabButton></div>
    <div className={`flex items-center gap-4 ${rightPad} shrink-0 box-content ml-auto`} style={{ height: 'var(--kol-ctl-sm)' }}>{right}</div>
  </header>
)

const TabButton = ({ active, open, children, ...rest }) => (
  <Button
    variant="bare"
    {...rest}
    style={{ height: 'var(--kol-ctl-sm)' }}
    className={`relative inline-flex items-start kol-helper-12 uppercase tracking-wide whitespace-nowrap transition-colors ${active || open ? 'text-fg-96' : 'text-fg-48 hover:text-fg-80'}`}
  >
    {children}
    {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-fg-96" />}
  </Button>
)

/* ── rows ─────────────────────────────────────────────────────────────── */
export const ROWS = 9

export function List({ rows, total, prev, column, valueLabel = 'Visitors', onFilter, loading, empty = 'No data yet', limit = ROWS }) {
  const shown = (rows || []).slice(0, limit)
  const max = Math.max(1, ...shown.map((r) => r.value))
  return (
    <div className="flex flex-col flex-1 pt-4 min-h-0">
      <div className="flex items-center justify-between kol-helper-12 text-fg-48 pb-2">
        <span>{column}</span>
        <span>{valueLabel}</span>
      </div>
      {loading && !rows ? (
        <div className="flex-1 flex items-center justify-center kol-helper-12 text-fg-48 py-16">Loading…</div>
      ) : !shown.length ? (
        <div className="flex-1 flex items-center justify-center kol-helper-12 text-fg-48 py-16">{empty}</div>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--kol-gap-wall-list)' }}>
          {shown.map((r) => (
            <Row key={r.key ?? r.label} r={r} max={max} total={total} prev={prev?.get(r.key ?? r.label)} onFilter={r.filter && onFilter ? () => onFilter(r.filter) : null} />
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ r, max, total, prev, onFilter }) {
  /* plausible.io: no tooltip — hovering a row brings in its share of the total beside the count */
  const pct = total ? Math.round((r.value / total) * 1000) / 10 : null
  return (
    <div className="group grid items-center gap-4" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
      <Button
        variant="bare"
        disabled={!onFilter}
        onClick={onFilter || undefined}
        className={`relative h-8 min-w-0 text-left ${onFilter ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span
          className="absolute inset-y-0 left-0 rounded bg-fg-08 group-hover:bg-fg-12 transition-colors"
          style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%` }}
        />
        <span className="relative flex items-center gap-2 h-full px-2 kol-helper-12 text-fg-88 min-w-0">
          {r.icon}
          <span className="truncate">{r.label}</span>
        </span>
      </Button>
      <span className="flex items-center gap-1.5 kol-helper-12 text-fg-96 tabular-nums justify-end" style={{ minWidth: '7ch' }}>
        {pct != null && <span className="text-fg-56 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">{pct}%</span>}
        {r.display ?? fmtNum(r.value)}
        {prev !== undefined && <Trend now={r.value} then={prev} />}
      </span>
    </div>
  )
}

const Trend = ({ now, then }) => {
  if (!then && !now) return null
  const up = now >= (then || 0)
  if (now === then) return <span className="w-3" />
  return <Icon name={up ? 'arrow-upright' : 'arrow-downright'} size={12} style={{ color: up ? 'var(--ui-success)' : 'var(--ui-error)' }} />
}

const OverlayShell = ({ open, onClose, children }) => (
  <FullscreenOverlay open={open} scrim closeButton={false} onClose={onClose}>
    <div className="kol-overlay-panel flex flex-col p-[var(--kol-pad-overlay)]" style={{ width: 'min(960px, calc(100vw - 32px))', maxHeight: '85vh' }}>{children}</div>
  </FullscreenOverlay>
)
const DialogShell = ({ open, onClose, title, children }) => <Dialog open={open} onClose={onClose} title={title} width={960}>{children}</Dialog>

/* ── the expanded view: every row and the extra columns, sortable, searchable ── */
export function Details({ open, onClose, title, columns, rows, loading }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ key: columns[1]?.key, dir: -1 })
  useEffect(() => { setSort({ key: columns[1]?.key, dir: -1 }); setQ('') }, [title])
  const shown = useMemo(() => {
    const s = (rows || []).filter((r) => String(r.label).toLowerCase().includes(q.toLowerCase()))
    return s.sort((a, b) => ((a[sort.key] ?? 0) > (b[sort.key] ?? 0) ? 1 : -1) * sort.dir)
  }, [rows, q, sort])
  const nine = useNine()
  /* /demo-9 (12.8): KOL's own overlay — FullscreenOverlay's scrim, which dims and locks the page and traps focus, and
   * its `kol-overlay-panel` sheet with the × on the header line and a Divider under it, as SettingsPanel's overlay
   * wears them. /demo-7 and /demo-8 keep the local Dialog. */
  const Shell = nine ? OverlayShell : DialogShell
  if (nine && !open) return null
  return (
    <Shell open={open} onClose={onClose} title={title}>
      <div className="flex flex-col max-h-[85vh] min-h-0" style={nine ? undefined : { padding: 'var(--kol-pad-card-lg)' }}>
        <div className={`flex items-center gap-4 ${nine ? 'pb-4' : 'pb-4'}`}>
          {/* /demo-9: plausible's order — the search beside the title, the × alone at the right */}
          <h2 className={`kol-helper-14 uppercase tracking-wide text-fg-96 ${nine ? '' : 'flex-1'}`}>{title}</h2>
          <SearchInput variant="outline" size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder="Search" />
          {nine && <span className="flex-1" />}
          {nine ? <CloseButton onClick={onClose} hover={false} className="shrink-0" /> : <Button tone="ghost" size="sm" iconOnly="x" aria-label="Close" onClick={onClose} />}
        </div>
        {nine && <div className="pb-2"><Divider /></div>}
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
                <tr key={r.key ?? r.label} className={nine ? 'odd:bg-fg-04 hover:bg-fg-08 [&>td:first-child]:rounded-l [&>td:last-child]:rounded-r [&>td:first-child]:pl-2 [&>td:last-child]:pr-2' : 'border-t border-fg-08 hover:bg-fg-04'}>
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
    </Shell>
  )
}
