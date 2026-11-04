/* StatTiles — a row of number tiles (DashboardCardSet, 2026-11-03; metric's Numbers and its TopStats colour row, carried
 * verbatim — one thing at two sizes).
 *
 * `items`: `[{ key?, label, value, color?, note?, delta?, spark? }]` — a dot in `color` before the label, the value in mono,
 * `delta` (a node, e.g. a change) beside the value, `note` under it. Any count.
 *   - `size="sm"` (default) — inside a Card's body: tiles 2 across under sm, as many as fit (160 min) from sm; the row's
 *     ends carry no padding of their own, the card's is the edge.
 *   - `size="lg"` — the head of a card section: each tile padded as a card, a rule under the row; 2 · 3 from md · 6 from
 *     xl across.
 * `columns` replaces the grid-cols classes. With `onSelect(key)` the tiles are buttons and `selected` is lit (oq-08 and
 * a 2px rule under it in its colour); without, they are static.
 * Every tile draws its left rule and the grid sits that far left inside a clipping wrapper, so the first tile of every
 * row is flush with the edge and its rule is clipped, at any count and any width. Values 20 under md, 24 from md.
 *
 * `variant="float"` (float-everything W7 rows 96 · 97 + W10 row 154, 2026-11-04): every tile its own float sheet (20
 * round, Inter), 12 apart. `size="lg"` is the stat tile — label in body, the value in mono 32, then `delta` ("↗ 19.8%",
 * mono) and `note` ("from 10,740") on one line with a `Sparkline` of `spark` (an array of numbers) at the right.
 * `size="sm"` is the small metric tile — label left, the value in Inter 24 at the right, `note` (the window: "15–28
 * Oct · 14 days") in mono under. `selected` + `onSelect` lift the tile to fg-16 (W0.3). */
import { Button } from '@kolkrabbi/kol-component'
import Sparkline from '../charts/Sparkline.jsx'
import { SHEET, PRESS } from './_shared/float.js'

const COLS = {
  sm: 'grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))]',
  lg: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6',
}
const FRAME = {
  sm: '-ml-[17px] w-[calc(100%+17px)] [--n-size:20px] md:[--n-size:24px]',
  lg: 'border-b border-fg-08 -ml-px w-[calc(100%+1px)]',
}

export default function StatTiles({ items = [], variant, size = 'sm', columns, selected, onSelect, className = '' }) {
  const lg = size === 'lg'
  if (variant === 'float') {
    return (
      <div className={`grid gap-3 ${columns ?? (lg ? 'grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]' : 'grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]')} ${className}`.trim()}>
        {items.map((t) => <FloatTile key={t.key ?? t.label} t={t} lg={lg} on={onSelect ? (t.key ?? t.label) === selected : false} onSelect={onSelect} />)}
      </div>
    )
  }
  return (
    <div className={`${lg ? '' : 'pt-4 '}overflow-hidden ${className}`.trim()}>
      <div className={`grid ${columns ?? COLS[size]} ${FRAME[size]}`} style={lg ? { borderColor: 'var(--kol-oq-08)' } : undefined}>
        {items.map((t) => <Tile key={t.key ?? t.label} t={t} lg={lg} on={onSelect ? (t.key ?? t.label) === selected : false} onSelect={onSelect} />)}
      </div>
    </div>
  )
}

function Tile({ t, lg, on, onSelect }) {
  const value = <span className="kol-mono-20" style={{ fontSize: 'var(--n-size)', fontWeight: 500, lineHeight: 1, color: 'var(--kol-surface-on-primary)' }}>{t.value}</span>
  const body = (
    <>
      <span className={`kol-helper-12 flex items-center gap-2 uppercase whitespace-nowrap${lg ? ' overflow-hidden text-ellipsis' : ''}`}
        style={lg ? { letterSpacing: '0.06em' } : { letterSpacing: '0.06em', color: on ? 'var(--kol-fg-emphasis)' : 'var(--kol-fg-meta)' }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.color }} />{t.label}
      </span>
      {lg || t.delta != null ? <span className="flex flex-wrap items-baseline whitespace-nowrap" style={{ gap: '4px 8px' }}>{value}{t.delta}</span> : value}
      {t.note && <span className="kol-helper-12 text-fg-48">{t.note}</span>}
    </>
  )
  const lit = onSelect ? { background: on ? 'var(--kol-oq-08)' : 'transparent' } : {}
  if (lg) {
    const cls = 'text-left flex flex-col gap-2 md:gap-3 transition-colors [--n-size:20px] md:[--n-size:24px]'
    const style = {
      padding: 'var(--kol-pad-card-lg)',
      color: on ? 'var(--kol-fg-emphasis)' : 'var(--kol-fg-meta)', marginBottom: -1,
      background: 'transparent', ...lit,
      boxShadow: `inset 0 -2px 0 ${on ? t.color : 'transparent'}, inset 1px 0 0 var(--kol-oq-08)`,
    }
    return onSelect
      ? <Button variant="bare" onClick={() => onSelect(t.key ?? t.label)} className={cls} style={style}>{body}</Button>
      : <div className={cls} style={style}>{body}</div>
  }
  const cls = 'flex flex-col gap-2 py-2 md:gap-3 md:py-3 pl-[17px] pr-4 min-w-0 shadow-[inset_1px_0_0_var(--kol-oq-08)]'
  return onSelect
    ? <Button variant="bare" onClick={() => onSelect(t.key ?? t.label)} className={`text-left ${cls}`}
        style={{ ...lit, boxShadow: `inset 0 -2px 0 ${on ? t.color : 'transparent'}, inset 1px 0 0 var(--kol-oq-08)` }}>{body}</Button>
    : <div className={cls}>{body}</div>
}

/* the float tile — lg: label · value 32 mono · delta + note with the sparkline; sm: label · value 24 right · window */
function FloatTile({ t, lg, on, onSelect }) {
  const body = lg ? (
    <>
      <span className="kol-float-body text-fg-64 truncate">{t.label}</span>
      <span className="font-[family-name:var(--kol-font-family-mono)] text-[32px] font-medium leading-[1.1] text-fg-96 tabular-nums mt-2">{t.value}</span>
      {(t.delta != null || t.note || t.spark) && (
        <span className="flex items-end justify-between gap-4 mt-3 min-h-[26px]">
          <span className="flex items-baseline gap-2 whitespace-nowrap min-w-0">
            {t.delta != null && <span className="kol-float-timecode text-fg-96">{t.delta}</span>}
            {t.note && <span className="kol-float-hint text-fg-64 truncate">{t.note}</span>}
          </span>
          {t.spark && <span className="block w-[192px] max-w-[48%] shrink"><Sparkline data={t.spark} height={26} strokeWidth={1.5} /></span>}
        </span>
      )}
    </>
  ) : (
    <>
      <span className="flex items-center justify-between gap-4 min-w-0">
        <span className="kol-float-body text-fg-72 truncate">{t.label}</span>
        <span className="kol-float-section text-fg-96 tabular-nums shrink-0">{t.value}</span>
      </span>
      {t.note && <span className="kol-float-ruler text-fg-64 mt-2">{t.note}</span>}
    </>
  )
  const cls = `${SHEET} text-left flex flex-col ${lg ? 'px-6 py-5' : 'p-4'} ${onSelect ? PRESS : ''}`
  const style = on ? { background: 'var(--kol-fg-16)' } : undefined
  return onSelect
    ? <Button variant="bare" onClick={() => onSelect(t.key ?? t.label)} aria-pressed={on} className={cls} style={style}>{body}</Button>
    : <div className={cls} style={style}>{body}</div>
}
