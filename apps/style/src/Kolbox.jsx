import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DocsToc, PageHeader } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import { OverlayMeasure, measure, readTokens, scopeOf, tokensOf, useForcedStates, useTick } from './kolbox-measure.js'
import { SHEETS } from './kolbox-sheets.jsx'

/* THE KOLBOX STYLESHEET (#/kolbox, plan-2026-11-18-kolbox-round-3 11.1) — the whole kolbox style on one page, laid out
 * on his Figma reference sheets: per sheet a header (title, note, resources), the specimen panel in kolbox's scope with
 * each part as a row (name at the left, its states across, each captioned), and its measures under it, read from the
 * rendered parts. The page's own chrome is KOL default, as the styles board's. */

const sheetId = (s) => `kolbox-${s.id}`
const two = (n) => String(n).padStart(2, '0')

/* ── one state of a part: its caption, then the live part; `force` holds it in hover or focus ── */
function State({ state, kind, col }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = state.target ? ref.current?.querySelector(state.target) : ref.current?.firstElementChild
    if (!el) return
    el.setAttribute('data-measure', '')
    if (state.force) el.classList.add(`kol-force-${state.force}`)
  })
  return (
    <div data-state={state.label} data-kind={kind} data-target={state.target} className={`flex shrink-0 flex-col gap-3 ${col}`}>
      <span className="h-4 truncate text-help text-muted">{state.label}</span>
      <div ref={ref} data-specimen className={`flex min-h-control items-center ${state.tall ? 'pt-9' : ''}`}>{state.view()}</div>
    </div>
  )
}

function PartRow({ row, source }) {
  const name = (
    <div className={`flex flex-col gap-1 ${row.stack ? '' : 'pt-7'}`}>
      <span className="flex min-h-control items-center text-label text-text">{row.part}</span>
      {row.sub && <span className="-mt-1.5 text-help text-muted">{row.sub}</span>}
    </div>
  )
  const col = row.col ?? (row.stack ? 'w-full' : 'w-40')
  const states = row.states.map((s, i) => (
    <State key={s.label} state={s} col={col} kind={s.kind ?? s.force ?? (s.opens ? 'none' : i === 0 ? 'rest' : 'other')} />
  ))
  return (
    <div data-part={row.part} data-also={row.also} data-source={source} data-row={`${row.part}${row.sub ? ` ${row.sub}` : ''}`} className={row.stack ? 'flex flex-col gap-4' : 'grid grid-cols-[160px_minmax(0,1fr)] gap-x-8'}>
      {name}
      <div className={row.stack ? 'flex flex-col gap-8' : 'flex flex-wrap gap-x-8 gap-y-6'}>{states}</div>
    </div>
  )
}

/* ── the token sheets ── */
function Tok({ name, map }) {
  const t = map?.tokens[name]
  return (
    <span data-token={name} data-value={t?.value ?? ''} className="flex min-w-0 flex-wrap gap-x-2 font-mono text-meta">
      <span className="text-muted">{name}</span>
      <span className="text-text">{t?.value}</span>
    </span>
  )
}
/* a token whose value is another token or a mix says so under its value */
const derived = (src) => /var\(|color-mix/.test(src)

function Colors({ map }) {
  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-8">
      {tokensOf(/^--color-/).map((t) => (
        <div key={t.name} className="flex min-w-0 flex-col gap-2">
          <div className="kol-kolbox-checker h-16 rounded-control">
            <div className="size-full rounded-control ring-1 ring-border ring-inset" style={{ background: `var(${scopeOf(t.name).v})` }} />
          </div>
          <span className="text-label text-text">{t.name.slice(8)}</span>
          <Tok name={t.name} map={map} />
          {derived(t.source) && <span className="font-mono text-meta break-words text-muted">{t.source}</span>}
        </div>
      ))}
    </div>
  )
}

const STEPS = [
  ['title', 'text-title', 'Flow study'],
  ['section', 'text-section', 'Appearance'],
  ['label', 'text-label', 'Opacity'],
  ['help', 'text-help', 'Updates as you adjust settings.'],
  ['meta', 'font-mono text-meta', '⌘K 2s 4.12 s'],
  ['value', 'font-mono text-value', '120 px 0.08 #FABD2F'],
]
const Group = ({ title, children }) => (
  <div className="flex flex-col gap-6">
    <h4 className="text-section text-text">{title}</h4>
    {children}
  </div>
)
function Type({ map }) {
  const line = 'grid grid-cols-[180px_minmax(0,1fr)_340px] items-center gap-x-8'
  return (
    <div className="flex flex-col gap-12">
      <Group title="Faces">
        {tokensOf(/^--font-/).map((t) => (
          <div key={t.name} className={line} data-type-row={t.name}>
            <span className="text-label text-text">{t.name.slice(7)}</span>
            <span className="truncate text-title text-text" style={{ fontFamily: `var(${t.name})` }}>Aa Bb Gg 0123 ⌘K</span>
            <Tok name={t.name} map={map} />
          </div>
        ))}
      </Group>
      <Group title="Steps">
        {STEPS.map(([step, cls, sample]) => (
          <div key={step} className={line} data-type-row={step}>
            <span className="text-label text-text">{step}</span>
            <span className={`truncate text-text ${cls}`}>{sample}</span>
            <div className="flex flex-col gap-1">{tokensOf(new RegExp(`^--text-${step}(--|$)`)).map((t) => <Tok key={t.name} name={t.name} map={map} />)}</div>
          </div>
        ))}
      </Group>
    </div>
  )
}

function Space({ map }) {
  const row = 'grid grid-cols-[220px_minmax(0,1fr)] items-center gap-x-6'
  const bar = (t) => (
    <div key={t.name} className={row} data-space-row={t.name}>
      <div className="flex flex-col gap-1">
        <span className="text-label text-text">{t.name.replace(/^--spacing-/, '')}</span>
        <Tok name={t.name} map={map} />
      </div>
      {/* a space step is drawn as its square, a size as a bar of its length */}
      <div className="bg-accent" style={/^--spacing-\d+$/.test(t.name) ? { width: `var(${scopeOf(t.name).v})`, height: `var(${scopeOf(t.name).v})` } : { width: `var(${scopeOf(t.name).v})`, height: 'var(--spacing-2)' }} />
    </div>
  )
  return (
    <div className="flex flex-col gap-12">
      <Group title="Space"><div className="flex flex-col gap-4">{tokensOf(/^--spacing-\d+$/).map(bar)}</div></Group>
      <Group title="Sizes"><div className="flex flex-col gap-4">{tokensOf(/^--spacing-\D/).map(bar)}</div></Group>
      <Group title="Radius">
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {tokensOf(/^--radius-/).map((t) => (
            <div key={t.name} className="flex w-40 flex-col gap-2">
              <div className="size-16 bg-field" style={{ borderRadius: `var(${scopeOf(t.name).v})` }} />
              <span className="text-label text-text">{t.name.slice(9)}</span>
              <Tok name={t.name} map={map} />
            </div>
          ))}
        </div>
      </Group>
      <Group title="Shadow">
        {tokensOf(/^--shadow-/).map((t) => (
          <div key={t.name} className="flex flex-col gap-3">
            <div className="h-16 w-60 rounded-menu bg-menu shadow-menu" />
            <span className="text-label text-text">{t.name.slice(9)}</span>
            <Tok name={t.name} map={map} />
          </div>
        ))}
      </Group>
    </div>
  )
}
const TOKEN_VIEW = { color: Colors, type: Type, space: Space }

/* ── the measures under a panel ── */
const COLS = ['Part', 'Size', 'Type', 'Padding', 'Radius', 'Rest', 'Hover', 'Focus', 'Other states']
function readRows(panel, overlay, map) {
  return [...panel.querySelectorAll('[data-row]')].filter((r) => r.dataset.source !== 'screen').map((r) => {
    const name = r.dataset.row
    const cells = [...r.querySelectorAll('[data-state]')]
    const restCell = cells.find((s) => s.dataset.kind === 'rest')
    const states = cells.map((s) => ({
      label: s.dataset.state, kind: s.dataset.kind, el: s.querySelector('[data-measure]'),
      base: s.dataset.target ? restCell?.querySelector(`[data-specimen] ${s.dataset.target}`) : null,
    }))
    const rest = restCell?.querySelector('[data-measure]')
    if (rest) return { name, ...measure(rest, states, map) }
    return { name, ...(overlay[r.dataset.part] ?? { open: true }) }
  })
}
function Measures({ rows }) {
  if (!rows.length) return null
  return (
    <div className="flex flex-col gap-3">
      <p className="kol-doc-caption">Measured from the parts as they render</p>
      <table className="kol-doc-table" data-measures>
        <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="kol-doc-table-copy">{r.name}</td>
              {r.open
                ? <td className="kol-doc-table-copy text-fg-48" colSpan={8}>Opens from its trigger: open it to read it</td>
                : [r.size, r.type, r.padding, r.radius, r.rest, r.hover, r.focus, r.other?.join('; ')].map((v, i) => <td key={i} className="kol-doc-table-copy">{v || ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── one sheet ── */
function Sheet({ sheet, n, map, overlay, tick }) {
  const panel = useRef(null)
  const [rows, setRows] = useState([])
  const source = sheet.id === 'browser' ? 'home' : sheet.id === 'screens' ? 'screen' : 'ui'
  useEffect(() => { if (map && sheet.rows && panel.current) setRows(readRows(panel.current, overlay, map)) }, [map, overlay, tick, sheet.rows])
  const Tokens = TOKEN_VIEW[sheet.tokens]
  return (
    <section id={sheetId(sheet)} data-sheet={sheet.id} className="flex scroll-mt-8 flex-col gap-8">
      <header className="flex items-start justify-between gap-12">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="kol-doc-caption">Kolbox / Sheet {two(n)}</p>
          <h2 className="kol-doc-heading">{sheet.title}</h2>
          <p className="kol-doc-body text-fg-64">{sheet.note}</p>
        </div>
        <div className="flex w-72 shrink-0 flex-col gap-2">
          <p className="kol-doc-caption">Resources</p>
          {sheet.resources.map((r) => <code key={r} className="kol-doc-caption text-fg-80">{r}</code>)}
        </div>
      </header>
      <div ref={panel} className={`kol-style-kolbox flex flex-col gap-12 rounded-[var(--kol-radius-sm)] p-10 text-label text-text ${sheet.ground ?? 'bg-panel'}`}>
        <div className="flex flex-col gap-1">
          <h3 className="text-title text-text">{sheet.title}</h3>
          {sheet.panelNote && <p className="text-help text-muted">{sheet.panelNote}</p>}
        </div>
        {Tokens ? <Tokens map={map} /> : <div className="flex flex-col gap-10">{sheet.rows.map((r) => <PartRow key={`${r.part} ${r.sub ?? ''}`} row={r} source={source} />)}</div>}
      </div>
      <Measures rows={rows} />
    </section>
  )
}

export default function Kolbox() {
  useForcedStates()
  const tick = useTick()
  const scope = useRef(null)
  const [map, setMap] = useState(null)
  useEffect(() => { if (scope.current) setMap(readTokens(scope.current)) }, [tick])

  /* an overlay part is measured while its trigger holds it open */
  const mapRef = useRef(map); mapRef.current = map
  const [overlay, setOverlay] = useState({})
  const register = useCallback((part, el) => { if (mapRef.current) setOverlay((o) => ({ ...o, [part]: measure(el, [], mapRef.current) })) }, [])
  const ctx = useMemo(() => ({ register }), [register])

  const toc = SHEETS.map((s) => ({ id: sheetId(s), label: s.title }))
  const go = (e) => {
    e.preventDefault()
    document.getElementById(e.currentTarget.getAttribute('href').slice(1))?.scrollIntoView({ block: 'start' })
  }

  return (
    <OverlayMeasure.Provider value={ctx}>
      <PageShell className="gap-10 [--kol-page-header-mb:0]">
        <PageHeader title="Kolbox" actions={<ThemeToggle fill="none" label={false} size="sm" />} />
        <div ref={scope} aria-hidden className="kol-style-kolbox pointer-events-none invisible absolute" />
        <div className="flex min-w-[1200px] flex-col gap-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="kol-doc-lede max-w-[720px] text-fg-64">The kolbox style, one sheet per group: its own parts, live, in their states, and their values read from the page as it runs.</p>
            <a href="#/" className="kol-doc-caption text-fg-64 hover:text-fg-96">Styles board</a>
          </div>
          <div className="grid grid-cols-[200px_minmax(0,1fr)] items-start gap-12">
            <aside className="sticky top-8 flex flex-col gap-4" data-contents>
              <p className="kol-doc-eyebrow pl-[var(--kol-pad-rail-row-x)]">Sheets</p>
              <DocsToc toc={toc} onNavigate={go} />
            </aside>
            <div className="flex min-w-0 flex-col gap-32">
              {SHEETS.map((s, i) => <Sheet key={s.id} sheet={s} n={i + 1} map={map} overlay={overlay} tick={tick} />)}
            </div>
          </div>
        </div>
      </PageShell>
    </OverlayMeasure.Provider>
  )
}
