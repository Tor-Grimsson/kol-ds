import { Suspense, useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppStudio, CatalogPage, RailSlotProvider, useNavHidden } from '@kolkrabbi/kol-shell'
import logomarkUrl from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { createFixtureClient } from 'media-fixture'
import { RackProvider } from '../../rack/src/hooks/useRackContext.jsx'
import { SHORTCUT_SECTIONS } from '../../rack/src/data/shortcuts.js'
import { MODULE_DEFS } from '../../rack/src/modules/registry'
import VideoModulo from '../../rack/src/rack/VideoModulo.jsx'
import { useHome, FILTER_GROUPS } from './pages/HomePage.jsx'
import { useShipped } from './pages/shipped.jsx'
import ModuleDetailPage from './pages/ModuleDetailPage.jsx'
import PatchDetailPage from './pages/PatchDetailPage.jsx'
import { settings, ABOUT, LINKS } from './pages/SettingsPage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StagePage from './pages/StagePage.jsx'

/* THE RACK ON THE STUDIO (2026-10-23 — user: *"editor mixer and rack hubs"* carry everything studio-hub has). kol-shell's
 * `AppStudio` with kol-monitor's pages in its slots, as mixer-hub and studio-hub are; it was monitor's own AppShell
 * layout with routes (that layout is in `_tmp/2026-10-23-rack-hub-appstudio/`). Shell + Hub + the same tool
 * (apps-tier naming D2): THE RACK ITSELF IS apps/rack's, imported from there, so the two cannot drift.
 *
 *   #/             Home        HubHome — the presets as files (HomePage's `useHome`)
 *   #/library      Library     the Hub's one CatalogPage, preset app — PATCHES (the presets as files, Home's) · MODULES (the
 *                              modules as parts); #/library/<module>, #/library/patch/<patch> their pages. No foot button
 *                              (user 2026-10-23: *"new file in library??? wrong card type"*) — the old page with its own
 *                              module and patch cards is in _tmp/2026-10-23-rack-hub-appstudio/
 *   #/create       Create      the case builder on `StudioCreate` (2026-10-24; its own page is in _tmp/2026-10-24-create-on-studiocreate/)
 *   #/rack         Rack        the tool, full-bleed; #/rack/preset/<name>, #/rack/patch/<name> load one
 *   #/stage        Stage       the stage, on its OWN RackProvider — loading a stage never replaces the rack
 *   #/settings     Settings    HubSettings — monitor's content, the Hub's shortcut rows, About, Repo
 *   Media · Sign in            the Hub's rows at the rail's foot (the fixture client, a dummy session)
 *   S · ⌘K · ⌥1…9              the Hub's sheet, search and page keys
 *
 * One `RackProvider` above the Studio, so a case being built on /create survives a trip to a module's page and
 * Back (2026-09-02). The rack's module catalog portals into the DS rail's own consumer slot (`RailSlotProvider`,
 * kol-shell's, as kol-monitor does) — the `RackRail` fork is retired to _tmp/2026-10-23-rack-hub-appstudio/. The rail
 * itself is AppStudio's preset. A HashRouter: apps are served under /apps/<slug>/ with no rewrites. */

const APP = {
  name: 'Monitor',
  subtitle: 'Video synthesis workstation',
  logomark: logomarkUrl,
  about: ABOUT,
  links: LINKS,
}

/* the Hub's sheet wants an id per row */
const SHORTCUTS = SHORTCUT_SECTIONS.map((s) => ({ ...s, items: s.items.map((it, i) => ({ id: `${s.section}-${i}`.toLowerCase(), ...it })) }))

/* the Media row's client — the media fixture, as studio-hub's (monitor's real client arrives with its bump) */
const fixtureClient = createFixtureClient()

/* THE LIBRARY IS WHAT THE APP SHIPS (user 2026-10-24: *"home now would only show USER saved patches, which are different
 * from LIBRARY saves, which are more like system saves. what app ships with"*): PATCHES are the shipped presets, MODULES
 * the module definitions — on THE ONE CARD, every field and icon (user 2026-10-24: *"EVERY CARD HAS THE SAME FIELDS AND
 * ICONS … NON NEGOTIABLE"*): title · date · size · cover with download · cog · trash, the verbs writing this device's
 * library (a deleted shipped item leaves the Library; the data is untouched). Home is the user's saves alone. A card
 * opens its page — `/library/patch/<id>` · `/library/module/<id>` — never the rack (3.2). It OPENS ON THE PATCHES. */
const MODULE_GROUPS = [
  { label: 'Category', key: 'category', values: ['control', 'math', 'generators', 'display', 'utility'] },
  { label: 'Size', key: 'u_label', values: ['1U', '3U'] },
]
function LibrarySheet({ flipped, backHover }) {
  const [view, setView] = useState('patches')
  const files = view === 'patches'
  const { patches, modules, card } = useShipped()
  return (
    <CatalogPage
      key={view}
      preset="app"
      header={{ title: 'Library', subtitle: 'Modules and patches' }}
      items={files ? patches : modules}
      views={[{ value: 'patches', label: 'PATCHES' }, { value: 'modules', label: 'MODULES' }]}
      view={view}
      onViewChange={setView}
      filtersTitle={files ? 'All Patches' : 'All Modules'}
      filterGroups={files ? FILTER_GROUPS.map(({ exclusive: _x, stack: _s, ...g }) => g) : MODULE_GROUPS}
      filtersProps={files ? undefined : { mutuallyExclusiveFilters: ['category', 'u_label'] }}
      searchKeys={['title', 'name', 'type']}
      toCard={card}
      flipped={flipped}
      backHover={backHover}
    />
  )
}

/* `/library/<id>` was a module's page before 3.2's slug scheme — it redirects, so nothing bookmarked breaks */
function LegacyModuleRedirect() {
  const { id } = useParams()
  return <Navigate to={`/library/module/${id}`} replace />
}

/* Publishes `--monitor-rail` — the rail's width, or 0 when hidden — so a page's FIXED layers (CreatePage's bottom bar)
 * keep clear of it; AppShell only offsets in-flow content. */
function RailFrame({ children }) {
  const nav = useNavHidden()
  return (
    <div className="contents" style={{ '--monitor-rail': !nav || nav.navHidden ? '0px' : 'var(--kol-shell-rail-width)' }}>
      {children}
    </div>
  )
}

function Studio() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { home, walkthrough } = useHome()
  /* the Sign in row — a dummy session, as studio-hub's; the reference accepts any password */
  const [signedIn, setSignedIn] = useState(false)
  /* THE CARDS' BACK (AppCardWholeFlip, 2026-10-24 — user: *"make the cards flip on a shortcut and disable the hover"* ·
   * *"hover flips card? default off"*): `F` turns every card on Home and Library; the Settings rail's Display switch opts
   * the hover in — monitor's `useHoverFlip`, as the twin wires it */
  const [flipped, setFlipped] = useState(false)
  const [hoverFlip, setHoverFlip] = useState(false)
  useEffect(() => {
    const on = (e) => {
      if (e.key !== 'f' && e.key !== 'F') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      setFlipped((v) => !v)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  /* the switch joins monitor's Display section (its own `useHoverFlip` lives there) */
  const hoverRow = { label: 'Hover flips card', type: 'switch', on: hoverFlip, onChange: setHoverFlip, hint: 'Off: the cards turn on F' }
  const liveSettings = { ...settings, sections: (settings.sections ?? []).map((s) => (s.label === 'Display' ? { ...s, rows: [...(s.rows ?? []), hoverRow] } : s)) }

  return (
    <RailSlotProvider>
      <RackProvider>
        <AppStudio
          app={APP}
          currentPath={pathname}
          onNavigate={navigate}
          shortcuts={SHORTCUTS}
          walkthrough={walkthrough}
          home={{ ...home, flipped, backHover: hoverFlip, backReveal: 'flip-card' }}
          library={{
            children: (
              <Routes>
                <Route path="/library" element={<LibrarySheet flipped={flipped} backHover={hoverFlip} />} />
                <Route path="/library/patch/:patchName" element={<PatchDetailPage />} />
                <Route path="/library/module/:moduleType" element={<ModuleDetailPage />} />
                <Route path="/library/:id" element={<LegacyModuleRedirect />} />
              </Routes>
            ),
          }}
          /* the case builder's own bottom bar owns the phone's bottom edge (the render gate caught the pill over it) */
          create={{ shell: false, bar: false, children: <RailFrame><CreatePage /></RailFrame> }}
          use={{
            path: '/rack', label: 'Rack', icon: 'nav-rack',
            children: (
              <RailFrame>
                <Routes>
                  <Route path="/rack" element={<VideoModulo />} />
                  <Route path="/rack/preset/:presetName" element={<VideoModulo />} />
                  <Route path="/rack/patch/:presetName" element={<VideoModulo />} />
                </Routes>
              </RailFrame>
            ),
          }}
          pages={[
            {
              path: '/stage', icon: 'video', label: 'Stage', bar: false,
              children: (
                <RackProvider initialRows={[]}>
                  <Routes>
                    <Route path="/stage" element={<StagePage />} />
                    <Route path="/stage/:stageName" element={<StagePage />} />
                  </Routes>
                </RackProvider>
              ),
            },
          ]}
          settings={liveSettings}
          /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24: "its not optional") */
          dev={{ tabs: [] }}
          media={{ client: fixtureClient }}
          signIn={{ signedIn, onPress: (password) => setSignedIn(password != null) }}
          /* the rail is AppStudio's preset — nothing to configure here; the Stage owns the phone's bottom edge */
        />
      </RackProvider>
    </RailSlotProvider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Studio />
      </Suspense>
    </HashRouter>
  )
}
