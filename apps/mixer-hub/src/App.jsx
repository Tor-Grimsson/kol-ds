import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppStudio, CatalogPage } from '@kolkrabbi/kol-shell'
import { createFixtureClient } from 'media-fixture'
import { registerIcons } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import MirrorPlayground from '../../mixer/src/pages/MirrorPlayground.jsx'
import { StudioKeys } from '../../mixer/src/Standalone.jsx'
import { KEYBOARD_SHORTCUTS } from '../../mixer/src/data/shortcuts.js'
import { CreateDeskProvider } from './hooks/useCreateDesk.jsx'
import CreatePage from './pages/CreatePage.jsx'
import ModuleDetailPage from './pages/ModuleDetailPage.jsx'
import PatchDetailPage from './pages/PatchDetailPage.jsx'
import { useHome } from './pages/HomePage.jsx'
import { useShipped, MODULE_GROUP_VALUES } from './pages/shipped.jsx'
import { ABOUT, LINKS, useSettings } from './pages/SettingsPage.jsx'

/* THE MIXER ON THE STUDIO (2026-10-03; kol-mirror's current shape 2026-10-23 — user: *"mirror has way too many tabs,
 * it's been solved in kol-mirror since"*). kol-shell's `AppStudio` with kol-mirror in its slots, the rail as mirror
 * has it now: Mirror · Library · Create · Studio · Dev · Settings.
 *
 *   #/             Home        HubHome — mirror's Empty Studio and its saved memory slots
 *   #/library      Library     the Hub's one CatalogPage, preset app — PATCHES (Home's files) · MODULES (the desk's modules as
 *                              parts); #/library/<id> one module's page. No foot button (the old sheet with its own card
 *                              is in _tmp/2026-10-23-mixer-hub-library/)
 *   #/create       Create      the desk builder on `StudioCreate` (2026-10-24; its own page is in _tmp/2026-10-24-create-on-studiocreate/)
 *   #/studio       Studio      the tool, full-bleed, the float arrangement (apps/mixer)
 *   #/settings     Settings    HubSettings — mirror's Memory, its Performance tab, About, Repo
 *   Media · Sign in            the Hub's rows at the rail's foot (the fixture client, a dummy session)
 *
 * Gone from the rail with mirror: Studio B, Expression (a module on the desk), the Mixer sheet (it is the Library),
 * and the three sketchbook rows. Dev STAYS — the Hub's row, on every rail on a dev server even when empty (user
 * 2026-10-24: "its not optional"). Not here: mirror's own shell (`App.jsx`). The rail is AppStudio's preset.
 * A HashRouter, because mirror's pages navigate with router state and apps are served under /apps/<slug>/. */

/* Mirror's own glyphs, handed to the DS resolver once at boot — as mirror's `App.jsx` does. */
const HUB_GLYPHS = /\/(user|image|settings-01|settings-02|cloud)\.svg$/
registerIcons(Object.fromEntries(Object.entries(import.meta.glob('../../mixer/src/components/icons/svg/**/*.svg', { eager: true, query: '?raw', import: 'default' })).filter(([k]) => !HUB_GLYPHS.test(k))))

const APP = {
  name: 'Mirror',
  subtitle: 'Interactive image distortion playground',
  logomark,
  about: ABOUT,
  links: LINKS,
}

/* THE LIBRARY IS WHAT THE APP SHIPS (user 2026-10-24: Home is the user's saves, Library the system saves): PATCHES are
 * the shipped presets and the registry's one-tap patches, MODULES the desk's modules — on THE ONE CARD with every field
 * and icon (`shipped.jsx`). No FX view: expressions are the studio's, not library content. A card opens its page —
 * `/library/patch/<id>` · `/library/module/<slug>` — never the studio (3.2). It OPENS ON THE PATCHES. */
function LibrarySheet() {
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
      filterGroups={files ? undefined : [{ label: 'Modules', key: 'group', values: MODULE_GROUP_VALUES }]}
      searchKeys={['title', 'name', 'group']}
      toCard={card}
    />
  )
}

/* `/library/<id>` was a module's page before 3.2's slug scheme — it redirects, so nothing bookmarked breaks */
function LegacyModuleRedirect() {
  const { id } = useParams()
  return <Navigate to={`/library/module/${id}`} replace />
}

/* the Media row's client — the media fixture, as studio-hub's (mirror's real client arrives with its bump) */
const fixtureClient = createFixtureClient()

function Studio() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { home, walkthrough } = useHome()
  const settings = useSettings()
  /* the Sign in row — a dummy session, as studio-hub's; the reference accepts any password */
  const [signedIn, setSignedIn] = useState(false)

  return (
    /* the desk under construction, held above the pages so it survives Create → a module → Back */
    <CreateDeskProvider>
      <AppStudio
        app={APP}
        currentPath={pathname}
        onNavigate={navigate}
        shortcuts={KEYBOARD_SHORTCUTS}
        walkthrough={walkthrough}
        home={home}
        library={{
          children: (
            <Routes>
              <Route path="/library" element={<LibrarySheet />} />
              <Route path="/library/patch/:id" element={<PatchDetailPage />} />
              <Route path="/library/module/:id" element={<ModuleDetailPage />} />
              <Route path="/library/:id" element={<LegacyModuleRedirect />} />
            </Routes>
          ),
        }}
        /* the desk builder's own bottom chrome owns the phone's bottom edge (the render gate caught the pill over it) */
        /* `shell: false` — StudioCreate owns its PageShell (a fixed canvas beside a scrolling list); without it the page
           sat inside a second shell, 96px narrower than studio-hub's (the pass, 2026-10-24) */
        create={{ shell: false, bar: false, children: <CreatePage /> }}
        use={{ path: '/studio', label: 'Studio', icon: 'nav-studio', children: <MirrorPlayground arrangement="float" /> }}
        settings={settings}
        /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24: "its not optional") */
        dev={{ tabs: [] }}
        media={{ client: fixtureClient }}
        signIn={{ signedIn, onPress: (password) => setSignedIn(password != null) }}
        /* the rail is AppStudio's preset; the Studio owns the phone's bottom edge, so the bar steps aside there */
      />
      {/* Space, F and adaptive quality on every page, as in mirror; S is the Hub's sheet */}
      <StudioKeys sheet={false} />
    </CreateDeskProvider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Studio />
    </HashRouter>
  )
}
