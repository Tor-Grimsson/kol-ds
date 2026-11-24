import { useMemo, useState } from 'react'
import { Input, LabeledControl, PageHeader, ToggleSwitch } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import { ROWS, STYLES } from './rows.jsx'

/* THE STYLES BOARD — one row per part, one column per style, each cell the style's real part on its own ground and
 * tokens; where a style has no such part the cell is a gap. The page's own chrome is KOL default. */

/* each style's home: its ground, its ink and the tokens it reads, carried by the wrapper so nothing crosses columns.
 * Default and float sit on the KOL dark surface; float over a mid-grey scene; Folio on its paper; minimal on black;
 * kolbox on its warm dark ground. */
const SCOPE = {
  default: { className: 'bg-[var(--kol-surface-primary)] text-fg', attrs: { 'data-theme': 'dark' }, ground: 'bg-[var(--kol-surface-primary)]', ink: 'bg-[var(--kol-surface-on-primary)]' },
  float: { className: 'bg-[var(--kol-neutral-259)] text-fg', attrs: { 'data-theme': 'dark' }, ground: 'bg-[var(--kol-neutral-259)]', ink: 'bg-[var(--kol-surface-on-primary)]' },
  folio: { className: 'kol-style-folio bg-folio-paper font-folio leading-[1.21] text-folio-ink', attrs: { 'data-folio-theme': 'light' }, ground: 'bg-folio-paper', ink: 'bg-folio-ink' },
  minimal: { className: 'kol-style-minimal bg-ground text-label text-fg', attrs: {}, ground: 'bg-ground', ink: 'bg-fg' },
  kolbox: { className: 'kol-style-kolbox bg-ground text-label text-text', attrs: {}, ground: 'bg-ground', ink: 'bg-text' },
}
const Scope = ({ id, className = '', children }) => (
  <div {...SCOPE[id].attrs} className={`${SCOPE[id].className} ${className}`}>{children}</div>
)

const COLS = 'grid grid-cols-[220px_repeat(5,minmax(0,1fr))] gap-2'
const isGap = (cell) => !cell.view
const hasGap = (row) => STYLES.some((s) => isGap(row.cells[s.id]))
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1)

function StyleCard({ style }) {
  const have = ROWS.filter((r) => !isGap(r.cells[style.id])).length
  return (
    <div className="flex flex-col gap-3 rounded-[var(--kol-radius-sm)] bg-surface-secondary p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="kol-doc-section-title">{style.name}</h2>
        <Scope id={style.id} className="!bg-transparent flex gap-1">
          <span title="Ground" className={`size-5 rounded-full shadow-[0_0_0_1px_var(--kol-fg-16)] ${SCOPE[style.id].ground}`} />
          <span title="Ink" className={`size-5 rounded-full shadow-[0_0_0_1px_var(--kol-fg-16)] ${SCOPE[style.id].ink}`} />
        </Scope>
      </div>
      <p className="kol-doc-caption text-fg-64">{style.about}</p>
      <p className="kol-helper-10 text-fg-48">{have} of {ROWS.length} parts</p>
    </div>
  )
}

function Gap({ part, style, near }) {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 p-6 text-center">
      <p className="kol-doc-caption text-fg-48">No {lower(part)} in {style}</p>
      {near && <p className="kol-helper-10 max-w-[240px] text-fg-32">{near}</p>}
    </div>
  )
}

function Row({ row }) {
  return (
    <div className={COLS} data-part={row.name}>
      <div className="sticky left-0 z-10 flex flex-col gap-2 bg-surface-primary py-4 pr-3">
        <h3 className="kol-doc-section-title">{row.name}</h3>
        <dl className="flex flex-col gap-1">
          {STYLES.map((s) => (
            <div key={s.id} className="flex gap-1.5">
              <dt className="kol-helper-10 shrink-0 text-fg-32">{s.id}</dt>
              <dd className="kol-mono-10 break-words text-fg-64">{row.cells[s.id].from ?? 'none'}</dd>
            </div>
          ))}
        </dl>
      </div>
      {STYLES.map((s) => {
        const cell = row.cells[s.id]
        if (isGap(cell)) return <Gap key={s.id} part={row.name} style={s.name} near={cell.near} />
        return (
          <Scope key={s.id} id={s.id} className={`flex min-h-[120px] min-w-0 items-center justify-center rounded-[var(--kol-radius-sm)] p-6 ${cell.wide ? 'overflow-x-auto' : ''}`}>
            {cell.view()}
          </Scope>
        )
      })}
    </div>
  )
}

export default function Board() {
  const [gapsOnly, setGapsOnly] = useState(false)
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return ROWS.filter((r) => (!gapsOnly || hasGap(r)) && (!n || r.name.toLowerCase().includes(n)))
  }, [gapsOnly, q])

  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="Styles" actions={<ThemeToggle fill="none" label={false} size="sm" />} />
      <div className="flex min-w-[1200px] flex-col gap-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="kol-doc-lede max-w-[720px] text-fg-64">Every part in each UI style, side by side, each the style’s own component. A dashed cell is a part that style does not have.</p>
          <div className="flex items-baseline gap-6">
            <a href="#/kolbox" className="kol-doc-caption text-fg-64 hover:text-fg-96">Kolbox stylesheet</a>
            <a href="#/pair" className="kol-doc-caption text-fg-64 hover:text-fg-96">Earlier round: default beside float</a>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">{STYLES.map((s) => <StyleCard key={s.id} style={s} />)}</div>

        <div className="flex flex-wrap items-center gap-6">
          <LabeledControl horizontal label="Gaps only" labelWidth="fit-content">
            <ToggleSwitch checked={gapsOnly} onChange={setGapsOnly} aria-label="Gaps only" />
          </LabeledControl>
          <div className="w-64"><Input placeholder="Filter parts" aria-label="Filter parts" value={q} onChange={(e) => setQ(e.target.value)} width="100%" /></div>
          <p className="kol-helper-10 text-fg-48">{rows.length} of {ROWS.length} rows</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className={`${COLS} sticky top-0 z-20 bg-surface-primary py-3`}>
            <span className="kol-helper-10 text-fg-48">Part</span>
            {STYLES.map((s) => <span key={s.id} className="kol-doc-section-title">{s.name}</span>)}
          </div>
          {rows.map((r) => <Row key={r.name} row={r} />)}
          {!rows.length && <p className="kol-doc-caption py-6 text-fg-48">No part matches “{q}”.</p>}
        </div>

        <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
          <h2 className="kol-sans-heading-05">Gaps</h2>
          <div className="grid grid-cols-5 gap-6">
            {STYLES.map((s) => {
              const missing = ROWS.filter((r) => isGap(r.cells[s.id]))
              return (
                <div key={s.id} className="flex flex-col gap-2">
                  <h3 className="kol-doc-section-title">{s.name} <span className="kol-helper-10 text-fg-48">{missing.length}</span></h3>
                  {missing.length
                    ? <ul className="flex flex-col gap-1">{missing.map((r) => <li key={r.name} className="kol-doc-body text-fg-64">{r.name}</li>)}</ul>
                    : <p className="kol-doc-body text-fg-48">None</p>}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
