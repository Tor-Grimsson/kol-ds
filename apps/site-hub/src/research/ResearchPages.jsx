import { useContext, useLayoutEffect, useState } from 'react'
import { PageHero, ShellTocContext } from '@kolkrabbi/kol-framework'
import { ContentCollection, DocsToc, PageControls } from '@kolkrabbi/kol-component'
import { AssetCard, Swatch } from '@kolkrabbi/kol-styleguide'
import { VOYAGER } from 'voyager-fixture'
import sheetHtml from './sheet.html?raw'

/* THE RESEARCH CATEGORY — three shapes of a research page on the site rail (plan-2026-10-24-site-hub W4, the
 * shapes kol-branding carries): COMPARE — the page's controls strip over columns; SHEET — the document voice,
 * the Research-Spec shown on itself with its headings on the TOC rail; BOARDS — a board gallery by set. Real
 * data only: VOYAGER's ramps and boards, the spec's own text. The shape is the product. */

const { brand, assets } = VOYAGER

/* ── Compare: VOYAGER's ramps side by side ──────────────────────────────────────────────── */
const RAMPS = brand.ramps
const anchorOf = (r) => r.stops.find((s) => s.stop === r.anchor)?.value
const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'stops', label: 'Stops' },
  { id: 'anchors', label: 'Anchors' },
  { id: 'notes', label: 'Notes' },
]

const Columns = ({ n, children }) => (
  <div className="grid grid-cols-1 gap-4 xl:[grid-template-columns:var(--cols)]" style={{ '--cols': `repeat(${n}, minmax(0, 1fr))` }}>{children}</div>
)

function RampColumn({ ramp, section, detail }) {
  const anchor = anchorOf(ramp)
  const stops = detail === 'anchors' ? ramp.stops.filter((s) => s.stop === ramp.anchor) : ramp.stops
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {section === 'overview' && (
        <>
          <Swatch hex={anchor} name={ramp.label} anchor height={120} />
          <p className="kol-mono-12 text-fg-64">{ramp.stops.length} stops, anchor {ramp.anchor}</p>
        </>
      )}
      {section === 'stops' && (
        <div className="flex flex-col gap-2">
          {stops.map((s) => <Swatch key={s.stop} hex={s.value} name={`${ramp.id}-${s.stop}`} anchor={s.stop === ramp.anchor} height={40} />)}
        </div>
      )}
      {section === 'anchors' && <Swatch hex={anchor} name={`${ramp.id}-${ramp.anchor}`} anchor height={200} />}
      {section === 'notes' && <p className="kol-sans-body-02 text-fg-88">{ramp.note}</p>}
    </div>
  )
}

export function Compare() {
  const [hidden, setHidden] = useState(() => new Set())
  const [detail, setDetail] = useState('full')
  const [jump, setJump] = useState('overview')
  const toggle = (id) => setHidden((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const list = RAMPS.filter((r) => !hidden.has(r.id))
  const go = (id) => { setJump(id); document.getElementById(id)?.scrollIntoView({ block: 'start' }) }
  return (
    <div className="kol-page flex flex-col gap-10">
      <PageHero label="Research" title="Ramps side by side" lede={`${RAMPS.length} ramps, one fixed stop set. Pick any combination to line them up.`} />
      <PageControls
        toggles={{ label: 'Ramps', items: RAMPS.map((r) => ({ id: r.id, label: r.label, active: !hidden.has(r.id) })), onToggle: toggle }}
        views={[{ label: 'Detail', value: detail, onChange: setDetail, options: [{ value: 'full', label: 'Every stop' }, { value: 'anchors', label: 'Anchors only' }] }]}
        count={`${list.length} / ${RAMPS.length}`}
        jump={{ label: 'Jump to', value: jump, onChange: go, tabs: SECTIONS }}
        legend={list.map((r) => ({ id: r.id, label: r.label, color: anchorOf(r) }))}
      />
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="flex flex-col gap-4 scroll-mt-32">
          <h2 className="kol-sans-heading-04">{s.label}</h2>
          {list.length > 0
            ? <Columns n={list.length}>{list.map((r) => <RampColumn key={r.id} ramp={r} section={s.id} detail={detail} />)}</Columns>
            : <p className="kol-mono-12 text-fg-48">No ramp showing.</p>}
        </section>
      ))}
    </div>
  )
}

/* ── Sheet: the Research-Spec on itself, its headings on the TOC rail ───────────────────── */
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const SHEET = (() => {
  const toc = []
  const html = sheetHtml.replace(/<(h[123])([^>]*)>(.*?)<\/\1>/g, (m, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const id = `s-${toc.length}-${slug(text)}`
    toc.push({ id, label: text })
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`
  })
  return { html, toc }
})()
const jumpTo = (e) => {
  const id = e?.currentTarget?.getAttribute?.('href')?.slice(1)
  if (!id) return
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

export function Sheet() {
  const setToc = useContext(ShellTocContext)
  useLayoutEffect(() => {
    setToc?.(<DocsToc toc={SHEET.toc} onNavigate={jumpTo} />)
    return () => setToc?.(null)
  }, [setToc])
  return (
    <div className="kol-page">
      {/* the spec's own markup, under the sheet voice; its inline styles are the spec's */}
      <article className="kol-sheet" style={{ maxWidth: 980 }} dangerouslySetInnerHTML={{ __html: SHEET.html }} />
    </div>
  )
}

/* ── Boards: VOYAGER's boards by set ───────────────────────────────────────────────────── */
const SETS = [
  { id: 'mood', label: 'Mood', files: assets.MOOD },
  { id: 'stationery', label: 'Stationery', files: assets.STATIONERY },
  { id: 'deck', label: 'Deck', files: assets.DECK },
]
const COLS = { two: '480px', three: '320px', four: '240px' }

export function Boards() {
  const [cols, setCols] = useState('three')
  const [jump, setJump] = useState('mood')
  const count = SETS.reduce((n, s) => n + s.files.length, 0)
  const go = (id) => { setJump(id); document.getElementById(id)?.scrollIntoView({ block: 'start' }) }
  return (
    <div className="kol-page flex flex-col gap-10">
      <PageHero label="Research" title="Boards" lede={`${count} boards in three sets, each at its own aspect.`} />
      <PageControls
        views={[{ label: 'Columns', value: cols, onChange: setCols, options: [{ value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }, { value: 'four', label: 'Four' }] }]}
        count={`${count} boards`}
        jump={{ label: 'Jump to', value: jump, onChange: go, tabs: SETS.map((s) => ({ id: s.id, label: s.label })) }}
      />
      {SETS.map((s) => (
        <section key={s.id} id={s.id} className="flex flex-col gap-4 scroll-mt-32">
          <h2 className="kol-sans-heading-04">{s.label}</h2>
          <ContentCollection min={COLS[cols]}>
            {s.files.map((f) => (
              <AssetCard key={f.url} caption={f.id}>
                <img src={f.url} alt={f.id} loading="lazy" className="w-full h-auto" />
              </AssetCard>
            ))}
          </ContentCollection>
        </section>
      ))}
    </div>
  )
}

/* the category's cards on its overview (CategoryPage reads them from the nav tree) */
const ramp = RAMPS[0]
export const RESEARCH_CARDS = {
  compare: {
    eyebrow: 'Compare',
    body: `${RAMPS.length} ramps on one stop set, lined up by the page's own controls.`,
    meta: `${RAMPS.length} ramps`,
    media: <div className="flex size-full">{ramp.stops.map((s) => <span key={s.stop} className="flex-1" style={{ background: s.value }} />)}</div>,
  },
  sheet: {
    eyebrow: 'Document',
    body: 'The document voice, shown on itself: headings, meta lines, footnotes, the outline, the numbered margin.',
    meta: `${SHEET.toc.length} headings`,
    media: (
      <div className="flex size-full flex-col justify-center gap-1 px-6 kol-mono-12 text-fg-64">
        {SHEET.toc.slice(0, 4).map((t) => <span key={t.id}>{t.label}</span>)}
      </div>
    ),
  },
  boards: {
    eyebrow: 'Gallery',
    body: 'Every board the brand carries, by set, at its own aspect.',
    meta: `${SETS.reduce((n, s) => n + s.files.length, 0)} boards`,
    media: assets.MOOD[1]?.url ?? assets.MOOD[0]?.url,
  },
}
