import { Component as ReactComponent, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SiteLayout, WebsiteLayout, useWorkView } from '@kolkrabbi/kol-framework'
import { WorkViewToggle } from '@kolkrabbi/kol-content'
import { VariantsControl, useScrollSpy } from '@kolkrabbi/kol-component'
import { AppShell } from '@kolkrabbi/kol-shell'
import { ShellLayout } from '@kolkrabbi/kol-workshop'
import { VOYAGER } from 'voyager-fixture'
import { FRAMES, PAGE_INFO } from '../../../showcase/src/nav/placements.js'
import { loadPage, peekPage } from './pages.jsx'
import { frameOf, first, groupOf, siteTree, appItems, shellRoutes } from './nav.js'

/* THE LAYOUTS APP (LayoutsAndWebsiteLayout, kol-website 2026-10-28 — *"No one can see what fits where"*). The four frames
 * the system has, and in each one every page that fits it — the real package component on VOYAGER's fixture, inside the
 * real frame, the way the apps that run it show it. The list is showcase/src/nav/placements.js — the same one the frame
 * docs and `validate-placements` read. Nothing on screen is drawn here.
 *
 * THE CHOOSER IS THE VARIANTS CONTROL (OneVariantsControl · LayoutsAppPages, 2026-10-29 — user: *"the pages dont have to be
 * in the siderail, they just have to be in the action menu selector"* · *"or both"*): a Layout row, a row per group of the
 * layout's pages, and what the page is — always there, in every layout. Each layout's own nav lists the pages too, the way
 * its apps arrange them (nav.js). Switching layouts keeps the page where the next one holds it.
 *
 * Routing:  /<frame>/<Page>[#section]   e.g. /site/Brand#color · /app/HubHome · /shell/DocumentationReader */

/* where a frame's own chrome holds the top-right corner (the Hub's actions, the shell header's icons, the website's menu
   button), the control starts just below it; it can be dragged anywhere and remembers where */
const CORNER = {
  app: { top: 'calc(var(--kol-shell-page-pad, 24px) + 72px)' },
  /* the shell's right corner is its TOC rail's header — the control sits at the main column's edge, left of the rail */
  shell: { top: '128px', right: 'calc(var(--kol-shell-toc-w, 280px) + 24px)' },
  website: { top: 'calc(var(--kol-nav-h) + 16px)' },
}

/* WHAT THE PAGE IS — its name and package, what it is for, where it runs, the other layouts it fits */
function PageInfo({ frame, page }) {
  const info = PAGE_INFO[page]
  const others = FRAMES.filter((x) => x.id !== frame && x.pages.includes(page)).map((x) => x.name)
  if (!info) return null
  return (
    <div className="flex max-w-[34rem] flex-col gap-1.5">
      <p className="kol-mono-12 text-emphasis">{page} <span className="text-fg-48">· @kolkrabbi/{info.pkg}</span></p>
      <p className="kol-sans-body-03 text-body">{info.purpose}</p>
      <p className="kol-mono-10 text-fg-64">Runs in {info.runs}</p>
      {others.length > 0 && <p className="kol-mono-10 text-fg-64">Also fits {others.join(', ')}</p>}
    </div>
  )
}

function Chooser() {
  const { pathname } = useLocation()
  const [, frame, page] = pathname.split('/')
  const navigate = useNavigate()
  const f = frameOf(frame)
  if (!f) return null
  const group = groupOf(f, page)
  /* load the page first, so a layout or page opens on it, never on a blank */
  const go = (to) => loadPage(to.split('/')[2]).then(() => navigate(to))
  const onChange = (key, v) => {
    if (key === 'layout') {
      const next = frameOf(v)
      return go(next.pages.includes(page) ? `/${v}/${page}` : first(next))
    }
    return go(`/${frame}/${v}`)
  }
  return (
    <VariantsControl
      axes={[
        { key: 'layout', label: 'Layout', options: FRAMES.map((x) => ({ value: x.id, label: x.name })) },
        ...f.groups.map((g) => ({ key: g.id, label: g.label, options: g.pages.map((p) => ({ value: p, label: p })) })),
      ]}
      value={{ layout: frame, ...(group ? { [group.id]: page } : null) }}
      onChange={onChange}
      style={{ zIndex: 70, ...CORNER[frame] }}
      /* on a phone the site rail's menu button holds the corner — the control drops below it */
      className={frame === 'site' ? 'max-md:!top-[72px]' : ''}
    >
      <PageInfo frame={frame} page={page} />
    </VariantsControl>
  )
}

/* a page that throws shows its name and the error, never a white frame */
class Guard extends ReactComponent {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidUpdate(prev) { if (prev.name !== this.props.name && this.state.error) this.setState({ error: null }) }
  render() {
    return this.state.error
      ? <p className="kol-mono-12 text-meta p-8">{this.props.name} failed to render here: {String(this.state.error.message ?? this.state.error)}</p>
      : this.props.children
  }
}

/* THE PAGE — opens at its top (or its #section); the previous page stays on screen until the next one has loaded */
function Page() {
  const { frame, page } = useParams()
  const { hash } = useLocation()
  const f = frameOf(frame)
  const [shown, setShown] = useState(() => ({ name: page, entry: peekPage(page) }))
  useEffect(() => {
    let live = true
    const hit = peekPage(page)
    if (hit) setShown({ name: page, entry: hit })
    else loadPage(page).then((entry) => { if (live) setShown({ name: page, entry }) })
    return () => { live = false }
  }, [page])
  /* a new page opens at its top — the window, and the shell's own scroll region */
  useEffect(() => {
    if (shown.name !== page) return
    if (hash) { document.getElementById(hash.slice(1))?.scrollIntoView(); return }
    window.scrollTo(0, 0)
    document.querySelector('#shell-scroll')?.scrollTo(0, 0)
  }, [shown.name, page, hash])
  if (page?.startsWith('~')) { const g = f?.groups.find((x) => x.id === page.slice(1)); return <Navigate to={g ? `/${frame}/${g.pages[0]}` : first(FRAMES[0])} replace /> }
  if (!f?.pages.includes(page)) return <Navigate to={f ? first(f) : first(FRAMES[0])} replace />
  const { name, entry } = shown
  if (!entry) return <div className="min-h-dvh" />
  const { Component, note } = entry
  return (
    <Guard name={name}>
      <div data-layouts-page={name} data-frame={f.name}>
        {Component ? <Component /> : <p className="kol-sans-body-02 text-meta max-w-prose p-8">{note}</p>}
      </div>
    </Guard>
  )
}

/* ── the four frames, each wired the way its apps wire it ── */

function Site({ f }) {
  const { pathname } = useLocation()
  const tree = siteTree(f)
  /* the Brand page's chapters are rail rows lit by scroll, as brand's /brand#about (site-hub's spy) */
  const leaves = (rows) => rows.flatMap((r) => (r.children ? leaves(r.children) : [r]))
  const sectionIds = leaves(tree.flatMap((c) => c.pages ?? [])).map((p) => p.to.split('#')).filter(([path, h]) => path === pathname && h).map(([, h]) => h)
  const activeId = useScrollSpy(sectionIds)
  const isActive = (to) => {
    const [path, h] = to.split('#')
    return path === pathname && (h ? h === activeId : !activeId)
  }
  /* the landing owns its ground, no wash — as site-hub's Home */
  return <SiteLayout navTree={tree} sideNav={{ isActive, footer: false, openOnRoute: true }} pageWash={pathname.endsWith('/SiteHero') ? undefined : 'var(--kol-fg-02)'} />
}

function App_({ f }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <AppShell appName="Layouts" items={appItems(f)} currentPath={pathname} onNavigate={(p) => { if (!p.startsWith('#')) navigate(p) }}>
      <Outlet />
    </AppShell>
  )
}

function Shell({ f }) {
  /* the fixture's wordmark in the header, not the workshop's KOLKRABBI pair */
  const brand = <span className="shell-header-logo inline-flex items-center text-emphasis [&>svg]:h-5 [&>svg]:w-auto" role="img" aria-label={VOYAGER.brand.meta.name} dangerouslySetInnerHTML={{ __html: VOYAGER.logoSources.wordmark }} />
  return <ShellLayout routes={shellRoutes(f)} basePath="/" brand={brand} />
}

/* kolkrabbi.io's tools slot: its work page's view toggle and search, on the bar (the site's own wiring, passed in) */
function WorkTools() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useWorkView()
  return <WorkViewToggle className="max-sm:[&>:last-child]:hidden" view={viewMode} onView={setViewMode} query={searchQuery} onQuery={setSearchQuery} listIcon="view-list" />
}

function Website({ f }) {
  const { pathname } = useLocation()
  const name = VOYAGER.brand.meta.name
  return (
    <WebsiteLayout
      name={name}
      wordmark={VOYAGER.logoSources.wordmark}
      logomark={VOYAGER.logoSources.logomark}
      /* the takeover's links: a page per group, as a site's menu names its sections */
      navItems={f.groups.map((g) => ({ to: `/${f.id}/${g.pages[0]}`, label: g.label }))}
      takeover={{ lines: [name, 'Expeditions across the North Atlantic'], blurb: 'Routes, dates and kit lists for every trip.', social: { href: 'https://voyager.example', label: 'voyager.example', icon: 'globe' } }}
      owner={name}
      tools={{ routes: ['/website/ContentCollection'], node: <WorkTools /> }}
      cursor
    >
      {/* the bar is fixed and floats over the page: a full-bleed landing starts under it, every other page clears it —
          as kolkrabbi.io's pages do */}
      <main id="main" style={{ paddingTop: pathname.endsWith('/SiteHero') ? 0 : 'var(--kol-nav-h)' }}><Outlet /></main>
    </WebsiteLayout>
  )
}

const FRAME_OF = { site: Site, app: App_, shell: Shell, website: Website }

function Frame() {
  const { frame } = useParams()
  const f = frameOf(frame)
  /* the frame's pages load in the background once it opens — a click inside it never waits */
  useEffect(() => { if (f) f.pages.forEach((p) => loadPage(p).catch(() => {})) }, [f])
  if (!f) return <Navigate to={first(FRAMES[0])} replace />
  const F = FRAME_OF[f.id]
  return <F key={f.id} f={f} />
}

function Root() {
  return <><Frame /><Chooser /></>
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/:frame" element={<Root />}>
          <Route path=":page" element={<Page />} />
          <Route index element={<Page />} />
        </Route>
        <Route path="*" element={<Navigate to={first(FRAMES[0])} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
