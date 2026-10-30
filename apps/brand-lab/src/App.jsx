import { useEffect, useState } from 'react'
import { Button, CodeBlock, PageHeader, TabsRow } from '@kolkrabbi/kol-component'
import { PageShell } from '@kolkrabbi/kol-shell'
import { Brand } from '@kolkrabbi/kol-styleguide'
import { ColorLab, ComboLab, LockupLab, TypeLab, blendRamp, colorLab, colorLabCss, comboLabCss, typeLabCss } from '@kolkrabbi/kol-styleguide/lab'
import { isImageType, listMedia, mediaUrl, proxied } from '@kolkrabbi/kol-media-client'
import kolkrabbi from './drafts/kolkrabbi.js'

/* THE BRAND LAB (2026-10-20) — where a brand is MADE. apps/brand is the parts shelf and apps/brand-hub
 * shows a finished brand; this holds a draft and the generators that decide it: kol-styleguide's
 * lab — TypeLab · ColorLab · ComboLab · LockupLab, one name system from `kol-styleguide/lab` (2026-10-29) — all over ONE draft.
 * Guide draws the draft's brand book in the draft's faces; Export prints the values and
 * the CSS. The draft is in memory with a reset, as every app's fixture is; its seed is drafts/*.js.
 *
 * THE TOOL FRAME, AS A REFERENCE PAGE (app anatomy § Tool frame): the title-only masthead with the page
 * switch on its right — it scrolls, because the color builder is a stack of sections. The page rides the
 * hash so a reload stays put. */

/* TWO GROUPS IN THE HEADER (the user, 2026-10-30: *"its TOOLS that GENERATE styles … Brand guide doesn't group with the tools"*):
 * the four generators, then the book and the export, apart */
const TOOLS = [
  { value: 'color', label: 'Color' },
  { value: 'type', label: 'Type' },
  { value: 'combo', label: 'Combo' },
  { value: 'logo', label: 'Logo' },
]
const BOOK = [
  { value: 'guide', label: 'Guide' },
  { value: 'export', label: 'Export' },
]
const PAGES = [...TOOLS, ...BOOK]
const parse = () => PAGES.find((p) => `#${p.value}` === location.hash)?.value ?? 'color'
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/* the draft as a brand manifest, for the book: each palette colour as a five-step blend ramp, named by its job */
function manifest(draft) {
  const c = colorLab(draft.color)
  return {
    meta: { name: draft.name },
    ramps: c.swatches.map((s) => ({ id: slug(`${s.index + 1}-${s.roleLabel}`), label: s.roleLabel, anchor: 300, stops: blendRamp(s.hex).map((value, i) => ({ stop: (i + 1) * 100, value })) })),
    book: draft.book,
  }
}

/* the guide wears the draft's FACES only — the page stays in the app's own theme (the user, 2026-10-30: *"the guide is not
 * part of this set, so stop making it look like it is"*; it had worn the palette's Ink as paper and Background as type) */
function draftScope(draft) {
  const f = draft.faces
  return {
    '--kol-font-family-sans': f.text.family,
    '--kol-font-family-sans-narrow': f.display.family,
    '--kol-font-family-sans-compact': f.heading.family,
  }
}

const Mark = ({ svg }) => <span dangerouslySetInnerHTML={{ __html: svg }} />

export default function App() {
  const [page, setPage] = useState(parse)
  const [draft, setDraft] = useState(kolkrabbi)
  /* THE BUCKET'S IMAGES for the Color Lab's Image tab (review 6, the user's idea — *"link to r2 bucket, and just say
   * Media:R2B2 | Images in bucket"*): the photos at the bucket's root, through the /media proxy so their pixels can be read */
  const [samples, setSamples] = useState([])
  useEffect(() => {
    listMedia('').then((objs) => setSamples(objs.filter((o) => isImageType(o.contentType) && !o.key.includes('/')).slice(0, 4).map((o) => ({ src: proxied(mediaUrl(o)), label: o.key })))).catch(() => {})
  }, [])
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
          <div className="flex items-center gap-10">
            {/* text tabs, not a toggle (review 1, 2026-10-29 — no border without his approval) */}
            <TabsRow variant="text" size={12} tracked tabs={TOOLS} value={page} onChange={go} ariaLabel="Generators" />
            <TabsRow variant="text" size={12} tracked tabs={BOOK} value={page} onChange={go} ariaLabel="Book" />
            <Button size="sm" tone="ghost" onClick={() => setDraft(kolkrabbi)}>Reset</Button>
          </div>
        )}
      />
      {page === 'color' && <ColorLab value={draft.color} onChange={set('color')} samples={samples} library={{ label: 'Media: R2B2', href: 'https://media.kolkrabbi.io' }} />}
      {page === 'type' && <TypeLab value={draft.type} onChange={set('type')} faces={draft.faces} />}
      {page === 'combo' && <ComboLab color={draft.color} value={draft.combo} onChange={set('combo')} />}
      {page === 'logo' && <LockupLab value={lockup.value} onChange={(v) => setDraft((d) => ({ ...d, lockup: { ...d.lockup, value: v } }))} mark={lockup.mark ? <Mark svg={lockup.mark} /> : undefined} font={draft.faces.display.family} presets={lockup.presets} />}
      {page === 'guide' && (
        <div style={draftScope(draft)}>
          <Brand brand={manifest(draft)} logoSources={{}} />
        </div>
      )}
      {page === 'export' && (
        <div className="flex flex-col gap-10">
          <CodeBlock filename="drafts/kolkrabbi.js" language="javascript" code={`export default ${JSON.stringify(draft, null, 2)}\n`} />
          <CodeBlock filename="brand-color.css" language="css" code={colorLabCss(draft.color)} />
          <CodeBlock filename="brand-type.css" language="css" code={typeLabCss(draft.type, { faces: draft.faces })} />
          <CodeBlock filename="brand-combo.css" language="css" code={comboLabCss(draft.combo, draft.color)} />
        </div>
      )}
    </PageShell>
  )
}
