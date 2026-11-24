import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AppShell, useNavHidden } from '@kolkrabbi/kol-shell'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { fixtureClient } from 'media-fixture'

/* THE EDITOR, ALONE — every chrome the package exports, reachable (apps review §6c-1, 2026-09-29).
 * @kolkrabbi/design-editor from its source, browsing the fixture bucket instead of the Kolkrabbi
 * CDN, with its preferences in the fake D1's `tool_settings` row for `editor`.
 *
 *   /             the editor (the compositor)       — `DesignEditor` (a phone lands on /randomiser)
 *   /editor       the editor, on any device
 *   /labs         one source under a params rail    — `LabsView`
 *   /randomiser   Generator + Effects, touch-first  — `MobileView`
 *   /core         the editor with NO packs          — `@kolkrabbi/design-editor/core`
 *   /output       the chromeless output window      — `OutputView`, no rail
 *
 * The rail is kol-fxr's (its AppLayout is the reference host): labs publishes its category rows
 * into the package's railExtras store and they ride the rail under Labs; on a phone the rail folds
 * into the drawer, which is where labs' rows live there too.
 *
 * `/core` is a FULL LOAD, in and out: packs register module-globally when an entry is imported, so
 * an SPA hop from any other chrome would reach /core with every pack already registered — the
 * route would lie about what a consumer of `/core` gets.
 *
 * Routing is the path under Vite's base (`/apps/editor/` when built — vercel.json rewrites it), and
 * the router is these twenty lines: the package's `setNavigator` gets a pushState, so every
 * in-package hop (the modes menu, the randomiser's Labs door) is an SPA transition. */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const here = () => '/' + location.pathname.slice(BASE.length).replace(/^\/+|\/+$/g, '')

const settingsStore = {
  load: () => fixtureClient.loadToolSettings('editor'),
  save: (s) => fixtureClient.saveToolSettings('editor', s),
}

/* every chrome browses the fixture — LabsView and MobileView never pass through DesignEditor's
 * props, so the host configures the package once, as the entry loads */
const full = () => import('@kolkrabbi/design-editor').then((m) => {
  m.setMediaClient(fixtureClient)
  m.setSettingsStore(settingsStore)
  return m
})
/* THE STYLE (plan-2026-11-19-kolbox-whats-left C3): the editor's Style row, the app setting `style`, read once at boot from
 * the package's local cache of that row (the store's copy, the fake D1's `editor`, lands after and is the same; if it
 * differs, StyleWatch reloads once). A change reloads the page
 * (StyleWatch): the kolbox sheet stays in the page once loaded. Never the theme. */
const bootStyle = () => {
  let s = null
  try { s = JSON.parse(localStorage.getItem('kol-editor-settings') || '{}').style } catch { /* storage blocked */ }
  return s === 'kolbox' ? 'kolbox' : 'default'
}
const STYLE = bootStyle()
/* the page's one sheet (main.jsx): the kolbox style's alone, as apps/kolbox loads it, on every route but /core (R1: with
 * index.css under it, KOL's whole theme and the framework chrome sat beside kolbox's and the shell drew apart) */
export const KOLBOX_SHEET = STYLE === 'kolbox' && here() !== '/core'

/* the kolbox sheet before the screens: loaded once, under the kolbox style only; /labs and /randomiser open their
 * screens on the mode track */
const KolboxSheet = lazy(() => import('./kolbox.css').then(() => {
  if (!location.hash && (here() === '/labs' || here() === '/randomiser')) history.replaceState(null, '', location.pathname + location.search + '#' + here())
  return { default: ({ children }) => children }
}))
/* Home and Library under the kolbox style (C3 batch 7): this app's host pages, never the engine's; apps/kolbox uses
 * these same files. Handed to the editor as `pages`, drawn in its kolbox frame on #/home and #/library */
const KOLBOX_PAGES = {
  '/home': lazy(() => import('./kolbox/pages/Home.jsx')),
  '/library': lazy(() => import('./kolbox/pages/Library.jsx')),
}

const Editor = lazy(() => full().then((m) => ({
  default: () => <m.DesignEditor mediaClient={fixtureClient} settingsStore={settingsStore} variant={STYLE} pages={STYLE === 'kolbox' ? KOLBOX_PAGES : undefined} />,
})))
const Core = lazy(() => import('@kolkrabbi/design-editor/core').then((m) => ({
  default: () => <m.DesignEditor mediaClient={fixtureClient} settingsStore={settingsStore} />,
})))
const Labs = lazy(() => full().then((m) => ({ default: m.LabsView })))
const Randomiser = lazy(() => full().then((m) => ({ default: m.MobileView })))
const Output = lazy(() => full().then((m) => ({ default: m.OutputView })))

const ROUTES = { '/': Editor, '/editor': Editor, '/labs': STYLE === 'kolbox' ? Editor : Labs, '/randomiser': STYLE === 'kolbox' ? Editor : Randomiser, '/core': Core }

const ITEMS = [
  { icon: 'desktop', path: '/', label: 'Editor' },
  { icon: 'globe', path: '/labs', label: 'Labs' },
  { icon: 'refresh', path: '/randomiser', label: 'Randomiser' },
  { icon: 'square', path: '/core', label: 'Core' },
]

/* the packages' shared stores load with the full entry — never on /core */
const CORE = here() === '/core'
const packageApi = CORE ? null : full()

/* `--fxr-rail`: the rail's width, 0 when hidden — the randomiser's FIXED layers keep clear of it
 * (the name is the package's; kol-fxr defined it first) */
function RailFrame({ children }) {
  const nav = useNavHidden()
  return (
    <div className="contents" style={{ '--fxr-rail': !nav || nav.navHidden ? '0px' : 'var(--kol-shell-rail-width)' }}>
      {children}
    </div>
  )
}

export default function App() {
  /* THE DEVICE GATE, at `/` only (kol-fxr's HomeRoute): a touch-primary device that has not opted
   * into desktop lands on the randomiser — the compositor wants a fine pointer. Every other path
   * is honoured as asked, `/editor` included. Read from localStorage + matchMedia directly: the
   * package's `isMobileDevice` / `wantsDesktop` are the same two checks, and the gate must decide
   * before the lazy entry has loaded. */
  const [path, setPath] = useState(() => {
    const p = here()
    let desk = false
    try { desk = localStorage.getItem('kol-desktop') === '1' } catch { /* storage blocked */ }
    if (p === '/' && matchMedia('(pointer: coarse)').matches && navigator.maxTouchPoints > 0 && !desk) {
      history.replaceState(null, '', BASE + '/randomiser')
      return '/randomiser'
    }
    return p
  })
  const [api, setApi] = useState(null)
  const [extras, setExtras] = useState({ items: [] })

  const go = (p) => {
    if (p === path) return
    /* into or out of /core is a full load (see the note above) */
    if (p === '/core' || path === '/core') { location.assign(BASE + p); return }
    history.pushState(null, '', BASE + (p === '/' ? '/' : p))
    setPath(p)
  }
  const goRef = useRef(go)
  goRef.current = go

  useEffect(() => {
    const on = () => setPath(here())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])

  /* the package's router bridge and its rail-extras store — the PACKAGE's copies, never local ones */
  useEffect(() => {
    if (!packageApi) return
    let live = true
    packageApi.then((m) => {
      if (!live) return
      m.setNavigator((p) => goRef.current(p === '/editor' ? '/' : p))
      setApi(m)
    })
    return () => { live = false }
  }, [])

  const Page = ROUTES[path] ?? Editor
  /* ONE element per route: labs republishes its rail rows on render, and those rows re-render
   * this component — a fresh <Page/> each time was a loop. A stable element is skipped by React,
   * which is what the router's <Outlet/> gives kol-fxr for free. */
  const page = useMemo(() => <Page />, [Page])

  if (path === '/output') {
    return <Suspense fallback={null}><Output /></Suspense>
  }

  /* THE KOLBOX STYLE: the editor's own screens fill the page, its mode track in place of this rail (Home, Library,
   * Editor, Labs, Morph and the Randomiser on the hash); /core keeps the default chrome. */
  if (STYLE === 'kolbox' && path !== '/core') {
    return (
      <>
        {api && <StyleWatch useAppSettings={api.useAppSettings} />}
        <Suspense fallback={null}><KolboxSheet>{page}</KolboxSheet></Suspense>
      </>
    )
  }

  const railPath = path === '/editor' || !ROUTES[path] ? '/' : path

  return (
    <AppShell
      items={extras.items.length ? ITEMS.flatMap((n) => (n.path === '/labs' ? [n, ...extras.items] : [n])) : ITEMS}
      logomark={{ svgUrl: logomark, title: 'KOL editor' }}
      currentPath={railPath}
      onNavigate={(p) => {
        if (api && p?.startsWith(api.RAIL_EXTRA_PREFIX)) {
          /* a labs pick swaps the layer without a route change; the drawer closes only on
           * `currentPath`, so press its own scrim (kol-fxr's AppLayout does the same) */
          if (extras.dispatch?.(p)) document.querySelector('.kol-shell-drawer-scrim')?.click()
          return
        }
        go(p)
      }}
      touch="drawer"
      pageWash="var(--kol-fg-02)"
    >
      {api && <ExtrasBridge useRailExtras={api.useRailExtras} onChange={setExtras} />}
      {api && <StyleWatch useAppSettings={api.useAppSettings} />}
      <RailFrame>
        <Suspense fallback={null}>
          {page}
        </Suspense>
      </RailFrame>
    </AppShell>
  )
}

/* reads the package's railExtras hook and lifts it into App's state — a hook from a lazily loaded
 * module can only be called from a component that mounts after the module is in */
function ExtrasBridge({ useRailExtras, onChange }) {
  const extras = useRailExtras()
  useEffect(() => { onChange(extras) }, [extras, onChange])
  return null
}

/* reloads when the Style row changes the style this page booted with (see STYLE) */
function StyleWatch({ useAppSettings }) {
  const { style } = useAppSettings()
  useEffect(() => { if ((style === 'kolbox' ? 'kolbox' : 'default') !== STYLE) location.reload() }, [style])
  return null
}
