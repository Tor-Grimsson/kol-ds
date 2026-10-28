import { useState, useSyncExternalStore } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SiteLayout } from '@kolkrabbi/kol-framework'
import { PageShell } from '@kolkrabbi/kol-shell'
import { Button, MEDIA_SETTINGS_BASE, PageHeader, SettingsSections } from '@kolkrabbi/kol-component'
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary'
import { Brand, BrandGuide } from '@kolkrabbi/kol-styleguide'
import { GUIDE_SECTIONS, GUIDE_TEMPLATE } from '@kolkrabbi/kol-brand-template'
import { Notes, NEW_NOTE } from '@kolkrabbi/kol-notes'
import { Decks, NEW_DECK } from '@kolkrabbi/kol-deck'
import { createFixtureClient } from 'media-fixture'
import { useFixtureMedia, useMediaTool, useNotesTool, useDecksTool, DEFAULTS } from 'media-fixture/wiring'
import { VOYAGER, VOYAGER_GUIDE } from 'voyager-fixture'

/* THE CLIENT'S HOME, ON VOYAGER (apps review §6c-8, 2026-09-29). What apps/brand used to show — a
 * client's brand walked through, kol-styleguide's `Brand` — moved here and onto VOYAGER, the fake
 * client. apps/brand is the catalogue of building blocks now; this is a client's home made of them.
 *
 *   Brand    /                 the book (BrandBook) — the landing, the mark goes here
 *   Assets   /assets           the files (BrandAssets)
 *   Guide    /guide/blank      the brand guide outline, blank (kol-brand-template's GUIDE_TEMPLATE)
 *            /guide/voyager    the same chapters, filled with VOYAGER (voyager-fixture's VOYAGER_GUIDE)
 *   Notes    /notes            opt-in TOOL — kol-notes on the fixture bucket
 *   Decks    /decks            opt-in TOOL — kol-deck
 *   Media    /media            opt-in TOOL — MediaLibrary
 *   Editor   /editor           opt-in APP — the design editor opens as its own app
 *   Settings /settings         which opt-ins this client has
 *
 * A home, not a Studio, and a SITE (2026-10-27): brand runs the site rail (`SiteLayout`), as kol-branding and every
 * brand.client.* does; the app rail is studio-hub's. The opt-ins persist in this browser. Routing is the browser's. */

const client = createFixtureClient()

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

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Frame />}>
          <Route path="/" element={<BrandPage view="brand" />} />
          <Route path="/assets" element={<BrandPage view="assets" />} />
          <Route path="/guide" element={<Navigate to="/guide/blank" replace />} />
          <Route path="/guide/blank" element={<BrandGuide key="blank" brand={GUIDE_TEMPLATE} sections={GUIDE_SECTIONS} />} />
          <Route path="/guide/voyager" element={<BrandGuide key="voyager" brand={VOYAGER_GUIDE} sections={GUIDE_SECTIONS} logoSources={VOYAGER.logoSources} />} />
          <Route path="/notes/*" element={<OptIn id="notes"><NotesTool /></OptIn>} />
          <Route path="/decks/*" element={<OptIn id="decks"><DecksTool /></OptIn>} />
          <Route path="/media" element={<OptIn id="media"><MediaTool /></OptIn>} />
          <Route path="/editor" element={<OptIn id="editor"><EditorDoor /></OptIn>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

/* the opt-ins, shared by the rail and the Settings page — one store, persisted in this browser */
let optsState = loadOpts()
const listeners = new Set()
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l) }
const setOpt = (id) => (on) => {
  optsState = { ...optsState, [id]: on }
  try { localStorage.setItem(OPT_KEY, JSON.stringify(optsState)) } catch { /* storage blocked */ }
  listeners.forEach((l) => l())
}
const useOpts = () => [useSyncExternalStore(subscribe, () => optsState), setOpt]

/* THE SITE RAIL (BrandHubOnSiteRail, kol-hq 2026-10-27): brand is a site type, so brand-hub runs `SiteLayout` with the
   site rail as kol-branding does; the app rail is studio-hub's. The plane wears the sites' wash. The guide outline's two
   versions — blank and VOYAGER — are one category; the opt-ins are rows; Settings sits under the theme row. */
function Frame() {
  const [opts] = useOpts()
  const NAV = [
    { id: 'brand', label: 'Brand', icon: 'book-open', to: '/' },
    { id: 'assets', label: 'Assets', icon: 'download', to: '/assets' },
    { id: 'guide', label: 'Guide', icon: 'bookmark', pages: [{ to: '/guide/blank', label: 'Blank' }, { to: '/guide/voyager', label: VOYAGER.brand.meta.name }] },
    ...OPT_INS.filter((o) => opts[o.id]).map((o) => ({ id: o.id, label: o.label, icon: o.icon, to: `/${o.id}` })),
  ]
  const BOTTOM = [{ id: 'settings', label: 'Settings', icon: 'nav-settings', to: '/settings' }]
  return <SiteLayout navTree={NAV} sideNav={{ bottomItems: BOTTOM, footer: false }} pageWash="var(--kol-fg-02)" />
}

/* the book and the assets — kol-styleguide's `Brand`, its view switch routed */
function BrandPage({ view }) {
  const navigate = useNavigate()
  return <Brand brand={VOYAGER.brand} logoSources={VOYAGER.logoSources} view={view} onViewChange={(v) => navigate(v === 'assets' ? '/assets' : '/')} />
}

/* an opt-in that is off is not a page */
function OptIn({ id, children }) {
  const [opts] = useOpts()
  return opts[id] ? children : <Navigate to="/" replace />
}

function Settings() {
  const [opts, setOpt] = useOpts()
  const rows = (kind) => OPT_INS.filter((o) => o.kind === kind).map((o) => ({ label: o.label, type: 'switch', on: opts[o.id], onChange: setOpt(o.id) }))
  return (
    <div className="kol-page">
      <PageHeader title="Settings" subtitle="Which tools and apps this client has." size="sm" voice="mono" />
      <SettingsSections sections={[{ label: 'Tools', rows: rows('tool') }, { label: 'Apps', rows: rows('app') }]} className="max-w-panel" />
    </div>
  )
}

function NotesTool() {
  const { pathname: path } = useLocation()
  const navigate = useNavigate()
  const notes = useNotesTool({ client })
  const slug = path.match(/^\/notes\/(.+)$/)?.[1]
  const open = slug === 'new' ? NEW_NOTE : slug ? decodeURIComponent(slug) : null
  return <Notes {...notes.props} open={open} onOpenChange={(s) => navigate(s === NEW_NOTE ? '/notes/new' : s ? `/notes/${encodeURIComponent(s)}` : '/notes')} />
}

function DecksTool() {
  const { pathname: path } = useLocation()
  const navigate = useNavigate()
  const decks = useDecksTool({ client })
  const slug = path.match(/^\/decks\/(.+)$/)?.[1]
  const open = slug === 'new' ? NEW_DECK : slug ? decodeURIComponent(slug) : null
  return <Decks {...decks.props} open={open} onOpenChange={(s) => navigate(s === NEW_DECK ? '/decks/new' : s ? `/decks/${encodeURIComponent(s)}` : '/decks')} railLeft="var(--kol-sidenav-w)" />
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
      <Button tone="primary" size="md" onClick={() => window.open(EDITOR_URL, '_blank', 'noopener')}>Open the editor</Button>
    </PageShell>
  )
}
