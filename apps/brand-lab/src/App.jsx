import { useEffect, useState } from 'react'
import { Button, CodeBlock, PageHeader, SegmentedToggle } from '@kolkrabbi/kol-component'
import { PageShell } from '@kolkrabbi/kol-shell'
import { Brand, ColorLab, DEFAULT_COLOR_LAB, LockupBuilder, TypeScaleLab, colorLabCss, deriveColorLab, typeScaleCss } from '@kolkrabbi/kol-styleguide'
import kolkrabbi from './drafts/kolkrabbi.js'

/* THE BRAND LAB (2026-10-20) — where a brand is MADE. apps/brand is the parts shelf and apps/brand-hub
 * shows a finished brand; this holds a draft and the generators that decide it: kol-styleguide's
 * ColorLab, TypeScaleLab and LockupBuilder (carried from kol-atlas's Assets pages), all over ONE draft.
 * Guide draws the draft's brand book in the draft's own colors and faces; Export prints the values and
 * the CSS. The draft is in memory with a reset, as every app's fixture is; its seed is drafts/*.js.
 *
 * THE TOOL FRAME, AS A REFERENCE PAGE (app anatomy § Tool frame): the title-only masthead with the page
 * switch on its right — it scrolls, because the color builder is a stack of sections. The page rides the
 * hash so a reload stays put. */

const PAGES = [
  { value: 'color', label: 'Color' },
  { value: 'type', label: 'Type' },
  { value: 'logo', label: 'Logo' },
  { value: 'guide', label: 'Guide' },
  { value: 'export', label: 'Export' },
]
const parse = () => PAGES.find((p) => `#${p.value}` === location.hash)?.value ?? 'color'
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/* the draft as a brand manifest, for the book: the lab's ramps in the manifest's ramp shape */
function manifest(draft) {
  const c = deriveColorLab(draft.color)
  const ten = (id, label, steps) => ({ id, label, anchor: 500, stops: steps.map((value, i) => ({ stop: (i + 1) * 100, value })) })
  return {
    meta: { name: draft.name },
    ramps: [
      ...c.ramps.map((h) => ({ id: slug(h.name), label: h.name, anchor: 300, stops: h.steps.map((value, i) => ({ stop: (i + 1) * 100, value })) })),
      ten('blue-grey', 'Blue-grey', c.blueGrey),
      ten('grey', 'Grey', c.grey),
    ],
    book: draft.book,
  }
}

/* the guide wears the draft: its faces, its 60/30/10 ground and ink, its primary as the accent */
function draftScope(draft) {
  const c = deriveColorLab(draft.color)
  const f = draft.faces
  return {
    '--kol-font-family-sans': f.text.family,
    '--kol-font-family-sans-narrow': f.display.family,
    '--kol-font-family-sans-compact': f.heading.family,
    '--kol-accent-primary': c.roles[0],
    background: c.mix[0],
    color: c.slots[0],
  }
}

const Mark = ({ svg }) => <span dangerouslySetInnerHTML={{ __html: svg }} />

export default function App() {
  const [page, setPage] = useState(parse)
  const [draft, setDraft] = useState(kolkrabbi)
  useEffect(() => {
    const on = () => setPage(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (v) => { location.hash = v === 'color' ? '' : v; setPage(v) }
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))
  const { lockup } = draft

  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader
        title="BRAND LAB"
        actions={(
          <div className="flex items-center gap-4">
            <SegmentedToggle value={page} onChange={go} options={PAGES} size="sm" />
            <Button size="sm" tone="ghost" onClick={() => setDraft(kolkrabbi)}>Reset</Button>
          </div>
        )}
      />
      {page === 'color' && <ColorLab value={{ ...DEFAULT_COLOR_LAB, ...draft.color }} onChange={set('color')} />}
      {page === 'type' && <TypeScaleLab value={draft.type} onChange={set('type')} faces={draft.faces} />}
      {page === 'logo' && <LockupBuilder parent={lockup.parent} mark={lockup.mark ? <Mark svg={lockup.mark} /> : undefined} font={draft.faces.display.family} presets={lockup.presets} />}
      {page === 'guide' && (
        <div className="rounded-lg p-6 md:p-12" style={draftScope(draft)}>
          <Brand brand={manifest(draft)} logoSources={{}} />
        </div>
      )}
      {page === 'export' && (
        <div className="flex flex-col gap-10">
          <CodeBlock filename="drafts/kolkrabbi.js" language="javascript" code={`export default ${JSON.stringify(draft, null, 2)}\n`} />
          <CodeBlock filename="brand-color.css" language="css" code={colorLabCss(draft.color)} />
          <CodeBlock filename="brand-type.css" language="css" code={typeScaleCss(draft.type)} />
        </div>
      )}
    </PageShell>
  )
}
