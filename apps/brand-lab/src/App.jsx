import { useEffect, useState } from 'react'
import { Button, CodeBlock, PageHeader, TabsRow } from '@kolkrabbi/kol-component'
import { PageShell } from '@kolkrabbi/kol-shell'
import { BOOK_SECTIONS } from '@kolkrabbi/kol-styleguide'
import { ColorLab, ComboLab, LockupLab, TypeLab, blendRamp, colorLab, colorLabCss, comboLabCss, typeLabCss } from '@kolkrabbi/kol-styleguide/lab'
import { LayoutType, LayoutColor, LayoutLogo, LayoutText, LayoutGuide, LAYOUT_TYPE_VIEWS, LAYOUT_COLOR_VIEWS, LAYOUT_LOGO_VIEWS, LAYOUT_TEXT_VIEWS } from '@kolkrabbi/kol-styleguide/layout'
import { isImageType, listMedia, mediaUrl, proxied } from '@kolkrabbi/kol-media-client'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?raw'
import kolkrabbi from './drafts/kolkrabbi.js'
import voice from './drafts/kolkrabbi-voice.md?raw'

/* THE BRAND LAB (2026-10-20) — where a brand is MADE. apps/brand is the parts shelf and apps/brand-hub
 * shows a finished brand; this holds a draft and the generators that decide it: kol-styleguide's
 * lab — TypeLab · ColorLab · ComboLab · LockupLab, one name system from `kol-styleguide/lab` (2026-10-29) — all over ONE draft.
 * Export prints the values and the CSS. The draft is in memory with a reset, as every app's fixture is; its seed is drafts/*.js.
 *
 * TWO TAB GROUPS (LayoutGroup, kol-atlas 2026-10-31), singular words in the path: `/generator/color|type|combo|logo` — the
 * labs, the TOOLS that generate — and `/layout/type|color|logo|text|guide` — kol-styleguide's layouts, each drawn from the
 * draft (the guide is LayoutGuide, BrandGuide renamed, over the book's chapters). A layout with views takes a third segment
 * (`/layout/type/sheet`). Export stays apart, as the guide did (the user, 2026-10-30: *"its TOOLS that GENERATE styles"*).
 *
 * THE TOOL FRAME, AS A REFERENCE PAGE (app anatomy § Tool frame): the title-only masthead with the page
 * switch on its right — it scrolls, because the color builder is a stack of sections. The page rides the path. */

const GROUPS = [
  { value: 'generator', label: 'Generator' },
  { value: 'layout', label: 'Layout' },
  { value: 'export', label: 'Export' },
]
const TABS = {
  generator: [
    { value: 'color', label: 'Color' },
    { value: 'type', label: 'Type' },
    { value: 'combo', label: 'Combo' },
    { value: 'logo', label: 'Logo' },
  ],
  layout: [
    { value: 'type', label: 'Type' },
    { value: 'color', label: 'Color' },
    { value: 'logo', label: 'Logo' },
    { value: 'text', label: 'Text' },
    { value: 'guide', label: 'Guide' },
  ],
}
const VIEWS = { type: LAYOUT_TYPE_VIEWS, color: LAYOUT_COLOR_VIEWS, logo: LAYOUT_LOGO_VIEWS, text: LAYOUT_TEXT_VIEWS }
const cap = (s) => s[0].toUpperCase() + s.slice(1)

/* the path under the app's base: group / tab / view, each falling back to the first */
const BASE = import.meta.env.BASE_URL
/* the old hash pages (#type · #guide · #export, before 2026-10-31) land on their new paths */
const LEGACY = { color: 'generator/color', type: 'generator/type', combo: 'generator/combo', logo: 'generator/logo', guide: 'layout/guide', export: 'export' }
function parse() {
  const [g, t, v] = location.pathname.slice(BASE.length).split('/').filter(Boolean)
  const group = GROUPS.find((x) => x.value === g)?.value ?? 'generator'
  const tab = TABS[group]?.find((x) => x.value === t)?.value ?? TABS[group]?.[0].value
  const views = group === 'layout' ? VIEWS[tab] : null
  return { group, tab, view: views ? (views.includes(v) ? v : views[0]) : null }
}
const pathOf = ({ group, tab, view }) => `${BASE}${[group, group === 'export' ? null : tab, view].filter(Boolean).join('/')}`

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
  const [at, setAt] = useState(parse)
  const [draft, setDraft] = useState(kolkrabbi)
  /* THE BUCKET'S IMAGES for the Color Lab's Image tab (review 6, the user's idea — *"link to r2 bucket, and just say
   * Media:R2B2 | Images in bucket"*): the photos at the bucket's root, through the /media proxy so their pixels can be read.
   * The type layout's photos are the same images. */
  const [samples, setSamples] = useState([])
  useEffect(() => {
    listMedia('').then((objs) => setSamples(objs.filter((o) => isImageType(o.contentType) && !o.key.includes('/')).slice(0, 4).map((o) => ({ src: proxied(mediaUrl(o)), label: o.key })))).catch(() => {})
  }, [])
  useEffect(() => {
    const legacy = LEGACY[location.hash.slice(1)]
    if (legacy) { history.replaceState(null, '', `${BASE}${legacy}`); setAt(parse()) }
    const on = () => setAt(parse())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  const go = (next) => {
    const to = { ...at, ...next }
    if (next.group) { to.tab = TABS[to.group]?.[0].value ?? null; to.view = null }
    if (next.tab) to.view = null
    if (to.group === 'layout' && VIEWS[to.tab] && !to.view) to.view = VIEWS[to.tab][0]
    history.pushState(null, '', pathOf(to))
    setAt(parse())
    window.scrollTo(0, 0)
  }
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))
  const { lockup } = draft
  const { group, tab, view } = at
  const page = `${group}/${tab}`
  const palette = colorLab(draft.color)
  const views = group === 'layout' ? VIEWS[tab] : null

  return (
    <PageShell className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader
        title="BRAND LAB"
        actions={(
          <div className="flex items-center gap-10">
            {/* text tabs, not a toggle (review 1, 2026-10-29 — no border without his approval) */}
            <TabsRow variant="text" size={12} tracked tabs={GROUPS} value={group} onChange={(g) => go({ group: g })} ariaLabel="Groups" />
            <Button size="sm" tone="ghost" onClick={() => setDraft(kolkrabbi)}>Reset</Button>
          </div>
        )}
      />
      {TABS[group] && (
        <div className="flex flex-wrap items-center justify-between gap-6">
          <TabsRow variant="text" size={12} tracked tabs={TABS[group]} value={tab} onChange={(t) => go({ tab: t })} ariaLabel={cap(group)} />
          {views && <TabsRow variant="text" size={12} tracked tabs={views.map((v) => ({ value: v, label: cap(v) }))} value={view} onChange={(v) => go({ view: v })} ariaLabel="Views" />}
        </div>
      )}
      {page === 'generator/color' && <ColorLab value={draft.color} onChange={set('color')} samples={samples} library={{ label: 'Media: R2B2', href: 'https://media.kolkrabbi.io' }} />}
      {page === 'generator/type' && <TypeLab value={draft.type} onChange={set('type')} faces={draft.faces} />}
      {page === 'generator/combo' && <ComboLab color={draft.color} value={draft.combo} onChange={set('combo')} />}
      {page === 'generator/logo' && <LockupLab value={lockup.value} onChange={(v) => setDraft((d) => ({ ...d, lockup: { ...d.lockup, value: v } }))} mark={lockup.mark ? <Mark svg={lockup.mark} /> : undefined} font={draft.faces.display.family} presets={lockup.presets} />}
      {page === 'layout/type' && <LayoutType view={view} type={draft.type} faces={draft.faces} accent={palette.roles.accent} images={samples.map((s) => s.src)} sheet={{ faces: [{ face: 'display' }, { face: 'text' }] }} />}
      {page === 'layout/color' && <LayoutColor view={view} color={draft.color} font={draft.faces.text.family} />}
      {/* the draft has no mark of its own yet (lockup.mark), so the board shows the Kolkrabbi logomark on each palette colour */}
      {page === 'layout/logo' && <LayoutLogo view={view} marks={palette.swatches.map((s) => ({ id: s.index, svg: lockup.mark ?? logomark, label: s.roleLabel, ground: s.hex }))} wordmark={draft.name} font={draft.faces.display.family} />}
      {page === 'layout/text' && <LayoutText view={view} chapters={draft.text.chapters} markdown={voice} source={draft.text.source} lang="en" type={draft.type} faces={draft.faces} />}
      {page === 'layout/guide' && (
        <div style={draftScope(draft)}>
          <LayoutGuide brand={manifest(draft)} sections={BOOK_SECTIONS} logoSources={{}} />
        </div>
      )}
      {group === 'export' && (
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
