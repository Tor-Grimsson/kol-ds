import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell, PageShell } from '@kolkrabbi/kol-shell'
import { SiteLayout } from '@kolkrabbi/kol-framework'
import { PageHeader, VariantsControl } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE SHELL'S REFERENCE APP (apps review 2026-09-29) — the frame ALONE around ten placeholder pages, under
 * EITHER RAIL (user 2026-10-24: "is there a apps/* for the siderails? with an action button like in catalog to
 * see both?"): the Variants button in the top-right corner, catalog's, with one axis — Rail: app · site.
 *   app   kol-shell's AppShell: the 48px rail, the layout root, the nav keys and, below 768, the phone bar;
 *         ten pages on purpose — past five the bar shows four and More, and this is where that overflow is
 *         always on screen. No Hub (that is apps/hub).
 *   site  kol-framework's SiteLayout: the grouped site rail, the grab edge, the phone drawer.
 * The same pages, the same hash routes (#/one … #/ten · #/settings), so a switch keeps the page. */

const PAGES = [
  { icon: 'folder', path: '/one', label: 'One' },
  { icon: 'layers', path: '/two', label: 'Two' },
  { icon: 'edit', path: '/three', label: 'Three' },
  { icon: 'rectangle', path: '/four', label: 'Four' },
  { icon: 'book-open', path: '/five', label: 'Five' },
  { icon: 'grid', path: '/six', label: 'Six' },
  { icon: 'code', path: '/seven', label: 'Seven' },
  { icon: 'music-note', path: '/eight', label: 'Eight' },
  { icon: 'image', path: '/nine', label: 'Nine' },
  { icon: 'hash-01', path: '/ten', label: 'Ten' },
]
const SETTINGS = [{ icon: 'nav-settings', path: '/settings', label: 'Settings' }]
const ALL = [...PAGES, ...SETTINGS]

/* the site rail's tree from the same rows — link categories; Settings pinned at the foot */
const TREE = PAGES.map((p) => ({ id: p.path.slice(1), label: p.label, icon: p.icon, to: p.path }))
const BOTTOM = SETTINGS.map((p) => ({ id: p.path.slice(1), label: p.label, icon: p.icon, to: p.path }))

const AXES = [{ key: 'rail', label: 'Rail', values: ['app', 'site'] }]
const RAIL_KEY = 'shell:rail'
const loadRail = () => { try { return localStorage.getItem(RAIL_KEY) === 'site' ? 'site' : 'app' } catch { return 'app' } }

/* the placeholder page — the tool frame, the title, a dashed stage */
function Page({ label }) {
  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title={label.toUpperCase()} />
      <div className="flex-1 min-h-0 rounded border border-dashed border-oq-12" />
    </PageShell>
  )
}


/* ── the app rail: AppShell on the hash, as it always was ── */
const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'
function AppRail() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const page = ALL.find((p) => p.path === path)
  return (
    <AppShell
      items={PAGES}
      bottomItems={SETTINGS}
      logomark={{ svgUrl: logomark, title: 'Shell' }}
      currentPath={path}
      onNavigate={navigate}
      railToggleKey={'\\'}
      settingsPath="/settings"
      settingsKey=","
      navKeys
      touch="bar"
    >
      <Page label={page?.label ?? 'Shell'} />
    </AppShell>
  )
}

/* ── the site rail: SiteLayout on the same hash routes ── */
function SitePage() {
  const { pathname } = useLocation()
  return <Page label={ALL.find((p) => p.path === pathname)?.label ?? 'Shell'} />
}
function SiteRail() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout navTree={TREE} sideNav={{ bottomItems: BOTTOM }} pageWash="var(--kol-fg-02)" />}>
          {ALL.map((p) => <Route key={p.path} path={p.path} element={<SitePage />} />)}
          <Route path="*" element={<Navigate to="/one" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default function App() {
  const [axes, setAxes] = useState(() => ({ rail: loadRail() }))
  const onChange = (key, value) => {
    setAxes((a) => ({ ...a, [key]: value }))
    if (key === 'rail') { try { localStorage.setItem(RAIL_KEY, value) } catch { /* storage blocked */ } }
  }
  return (
    <>
      {axes.rail === 'site' ? <SiteRail /> : <AppRail />}
      <VariantsControl axes={AXES} value={axes} onChange={onChange} />
    </>
  )
}
