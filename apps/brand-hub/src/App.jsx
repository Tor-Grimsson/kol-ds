import { useEffect, useState } from 'react'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { Button, MEDIA_SETTINGS_BASE, PageHeader, SettingsSwitch } from '@kolkrabbi/kol-component'
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary'
import { Brand } from '@kolkrabbi/kol-styleguide'
import { Notes, NEW_NOTE } from '@kolkrabbi/kol-notes'
import { Decks, NEW_DECK } from '@kolkrabbi/kol-deck'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { createFixtureClient } from 'media-fixture'
import { useFixtureMedia, useMediaTool, useNotesTool, useDecksTool, DEFAULTS } from 'media-fixture/wiring'
import { VOYAGER } from 'voyager-fixture'

/* THE CLIENT'S HOME, ON VOYAGER (apps review §6c-8, 2026-09-29). What apps/brand used to show — a
 * client's brand walked through, kol-styleguide's `Brand` — moved here and onto VOYAGER, the fake
 * client. apps/brand is the catalogue of building blocks now; this is a client's home made of them.
 *
 *   Brand    /                 the book (BrandBook) — the landing, the mark goes here
 *   Assets   /assets           the files (BrandAssets)
 *   Notes    /notes            opt-in TOOL — kol-notes on the fixture bucket
 *   Decks    /decks            opt-in TOOL — kol-deck
 *   Media    /media            opt-in TOOL — MediaLibrary
 *   Editor   (link)            opt-in APP — the design editor opens as its own app
 *   Settings /settings         which opt-ins this client has, and the theme
 *
 * A home, not a Studio: brand-hub is read far more than it is made in, so it stays on `AppHub`
 * (16-app-anatomy § The Studio). The opt-ins persist in this browser. Routing is the hash. */

const client = createFixtureClient()
const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const OPT_INS = [
  { id: 'notes', label: 'Notes', icon: 'edit', kind: 'tool' },
  { id: 'decks', label: 'Decks', icon: 'rectangle', kind: 'tool' },
  { id: 'media', label: 'Media', icon: 'folder', kind: 'tool' },
  { id: 'editor', label: 'Editor', icon: 'desktop', kind: 'app' },
]
const OPT_KEY = 'brand-hub:opt-ins'
const loadOpts = () => {
  try { return { notes: true, decks: true, media: true, editor: true, ...JSON.parse(localStorage.getItem(OPT_KEY) ?? '{}') } } catch { return { notes: true, decks: true, media: true, editor: true } }
}
/* the editor is an APP beside this one, not a page inside it — built at /apps/editor/ */
const EDITOR_URL = `${import.meta.env.BASE_URL.replace(/brand-hub\/$/, '')}editor/`

const SHORTCUTS = [
  { section: 'Navigate', items: [
    { id: 'home', label: 'Brand, then the rail', combo: '⌥ 1–9' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'rail', label: 'Hide the rail', combo: '\\' },
  ] },
  { section: 'Help', items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }] },
]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const [opts, setOpts] = useState(loadOpts)
  const setOpt = (id) => (on) => setOpts((o) => {
    const next = { ...o, [id]: on }
    try { localStorage.setItem(OPT_KEY, JSON.stringify(next)) } catch { /* storage blocked */ }
    return next
  })

  const items = [
    { icon: 'book-open', path: '/', label: 'Brand' },
    { icon: 'download', path: '/assets', label: 'Assets' },
    ...OPT_INS.filter((o) => opts[o.id]).map((o) => ({ icon: o.icon, path: `/${o.id}`, label: o.label })),
  ]
  const section = `/${path.split('/')[1] ?? ''}`
  const on = (id) => opts[id] && section === `/${id}`

  const brand = (
    <Brand
      brand={VOYAGER.brand}
      logoSources={VOYAGER.logoSources}
      view={section === '/assets' ? 'assets' : 'brand'}
      onViewChange={(v) => navigate(v === 'assets' ? '/assets' : '/')}
    />
  )

  const settings = {
    sections: [
      { label: 'Tools', rows: OPT_INS.filter((o) => o.kind === 'tool').map((o) => ({ label: o.label, render: () => <SettingsSwitch on={opts[o.id]} onChange={setOpt(o.id)} /> })) },
      { label: 'Apps', rows: OPT_INS.filter((o) => o.kind === 'app').map((o) => ({ label: o.label, render: () => <SettingsSwitch on={opts[o.id]} onChange={setOpt(o.id)} /> })) },
    ],
    tone: 'secondary',
    themeIn: 'drawer',
  }

  return (
    <AppHub
      app={{
        name: VOYAGER.brand.meta.name,
        subtitle: VOYAGER.business.BRAND_INFO.labels.manifesto,
        about: VOYAGER.business.BIO.companyBio,
        links: [
          { label: 'Site', url: VOYAGER.brand.meta.url },
          { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
        ],
      }}
      items={items}
      currentPath={section}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      themeToggle={<ThemeToggle fill="none" label={false} size="sm" />}
      settings={settings}
    >
      {section === '/' || section === '/assets' ? brand
        : on('notes') ? <NotesTool path={path} navigate={navigate} />
        : on('decks') ? <DecksTool path={path} navigate={navigate} />
        : on('media') ? <MediaTool />
        : on('editor') ? <EditorDoor />
        : brand}
    </AppHub>
  )
}

function NotesTool({ path, navigate }) {
  const notes = useNotesTool({ client })
  const slug = path.match(/^\/notes\/(.+)$/)?.[1]
  const open = slug === 'new' ? NEW_NOTE : slug ? decodeURIComponent(slug) : null
  return <Notes {...notes.props} open={open} onOpenChange={(s) => navigate(s === NEW_NOTE ? '/notes/new' : s ? `/notes/${encodeURIComponent(s)}` : '/notes')} />
}

function DecksTool({ path, navigate }) {
  const decks = useDecksTool({ client })
  const slug = path.match(/^\/decks\/(.+)$/)?.[1]
  const open = slug === 'new' ? NEW_DECK : slug ? decodeURIComponent(slug) : null
  return <Decks {...decks.props} open={open} onOpenChange={(s) => navigate(s === NEW_DECK ? '/decks/new' : s ? `/decks/${encodeURIComponent(s)}` : '/decks')} railLeft="var(--kol-shell-rail-width, 48px)" />
}

function MediaTool() {
  const [prefix, setPrefix] = useState('')
  const media = useFixtureMedia({ client, title: 'MEDIA', setPrefix })
  const tool = useMediaTool({ client, media })
  const [view, setView] = useState({ ...MEDIA_SETTINGS_BASE, ...(DEFAULTS[media.bucketId] ?? {}) })
  return (
    <PageShell mode="fixed">
      <MediaLibrary variant="explorer" {...media.props} {...tool.props} settings={view} onSettingsChange={setView} prefix={prefix} onPrefix={setPrefix} className="gap-10" />
      {tool.overlay}
    </PageShell>
  )
}

function EditorDoor() {
  return (
    <PageShell>
      <PageHeader title="Editor" subtitle="The design editor is an app of its own — it opens beside this one, on the same fixture bucket." size="sm" voice="mono" />
      <Button variant="primary" size="md" onClick={() => window.open(EDITOR_URL, '_blank', 'noopener')}>Open the editor</Button>
    </PageShell>
  )
}
