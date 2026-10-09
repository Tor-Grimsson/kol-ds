import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AppStudio, CatalogPage, PageShell } from '@kolkrabbi/kol-shell'
import { PageHeader } from '@kolkrabbi/kol-component'
import { EnvelopeGenerator, EnvelopeModeToggle, useEnvelopeGenerator } from '@kolkrabbi/kol-hardware'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { registerIcons } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import MirrorPlayground from '../../mixer/src/pages/MirrorPlayground.jsx'
import { StudioKeys } from '../../mixer/src/Standalone.jsx'
import { KEYBOARD_SHORTCUTS } from '../../mixer/src/data/shortcuts.js'
import { useLibrary, addToLibrary } from '../../mixer/src/hooks/useLibraryStore.js'
import { CreateDeskProvider } from './hooks/useCreateDesk.jsx'
import CreatePage from './pages/CreatePage.jsx'
import ModuleDetailPage from './pages/ModuleDetailPage.jsx'
import TapePage from './pages/TapePage.jsx'
import FrontsPage from './pages/FrontsPage.jsx'
import IconsPage from './pages/IconsPage.jsx'
import WideOnly from '../../mixer/src/components/WideOnly.jsx'
import { useHome } from './pages/HomePage.jsx'
import { useLibraryCatalog } from './pages/LibraryPage.jsx'
import { useMixerCatalog } from './pages/MixerPage.jsx'
import { ABOUT, LINKS, settings } from './pages/SettingsPage.jsx'

/* THE MIXER ON THE STUDIO (2026-10-03). kol-shell's `AppStudio` — the workstation fxr · mirror ·
 * monitor each hand-build — with kol-mirror in its slots. Shell + Hub + the same tool (apps-tier
 * naming D2): the tool is apps/mixer's studio, imported from there, so the two cannot drift.
 *
 *   #/             Home        HubHome — mirror's Empty Studio and its saved memory slots
 *   #/library      Library     CatalogPage — mirror's variants · effects · expressions
 *   #/create       Create      mirror's desk builder
 *   #/studio       Studio      the tool, full-bleed (apps/mixer)
 *   #/studio-b     Studio B    the same tool, float arrangement — to compare (2026-10-03)
 *   #/expressions  Expression  kol-hardware's EnvelopeGenerator — NOT a copy of mirror's page:
 *                              the same math, one engine (kol-hardware ./signal)
 *   #/mixer        Mixer       CatalogPage — the desk's modules · patches; #/mixer/<id> one module
 *   #/tape · #/fronts · #/icons   mirror's three sketchbook tabs, its own pages as they are
 *   #/settings     Settings    HubSettings — mirror's Memory, its Performance tab, About, Repo
 *
 * Not here: mirror's own shell (`App.jsx`).
 * The pages are mirror's files with their page chrome handed to the Hub; each says so at its top.
 * A HashRouter, because mirror's pages navigate with router state and apps are served under
 * /apps/<slug>/ with no rewrites. */

/* Mirror's own glyphs, handed to the DS resolver once at boot — as mirror's `App.jsx` does. */
registerIcons(import.meta.glob('../../mixer/src/components/icons/svg/**/*.svg', { eager: true, query: '?raw', import: 'default' }))

const APP = {
  name: 'Hall of Mirrors',
  subtitle: 'Interactive image distortion playground',
  logomark,
  about: ABOUT,
  links: LINKS,
}

/* A Library card's expression arrives as router state (mirror's deep link); Save files the equation
 * in mirror's library, where the Library's Expressions view lists it. */
function Expression() {
  const expr = useLocation().state?.expr
  const saved = useLibrary('expression')
  const g = useEnvelopeGenerator({
    defaultExpr: expr,
    saved: saved.map((e) => [e.data.expr, e.name]),
    onSave: ({ mode, code }) => { if (mode === 'equation') addToLibrary({ kind: 'expression', name: code, data: { expr: code } }) },
  })
  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader size="sm" title="Expressions" subtitle="Oscilloscope and expression reference" actions={<EnvelopeModeToggle generator={g} />} />
      <div className="min-h-0 flex-1">
        <EnvelopeGenerator generator={g} reference="panel" />
      </div>
    </PageShell>
  )
}

/* `key`: a chip from one view must not survive into the other and filter everything out (mirror's) */
function MixerSheet() {
  const props = useMixerCatalog()
  return <CatalogPage key={props.view} {...props} />
}

function Studio() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { home, walkthrough } = useHome()
  const library = useLibraryCatalog()

  return (
    /* the desk under construction, held above the pages so it survives Create → a module → Back */
    <CreateDeskProvider>
      <AppStudio
        app={APP}
        currentPath={pathname}
        onNavigate={navigate}
        shortcuts={KEYBOARD_SHORTCUTS}
        walkthrough={walkthrough}
        themeToggle={<ThemeToggle fill="none" label={false} size="sm" />}
        home={home}
        library={library}
        create={{ children: <CreatePage /> }}
        use={{ path: '/studio', label: 'Studio', icon: 'nav-studio', children: <MirrorPlayground /> }}
        pages={[
          /* STUDIO B (2026-10-03, the user's idea, beside Studio to compare): the same tool in its
             float arrangement — the desk takes the whole view, the monitor is a window over it,
             the tape deck is a desk module. Studio is untouched. */
          { path: '/studio-b', icon: 'layers', label: 'Studio B', children: <MirrorPlayground arrangement="float" /> },
          { path: '/expressions', icon: 'frequency', label: 'Expression', children: <Expression key={state?.expr ?? ''} /> },
          {
            path: '/mixer', icon: 'rack-v', label: 'Mixer',
            children: (
              <Routes>
                <Route path="/mixer" element={<MixerSheet />} />
                <Route path="/mixer/:id" element={<ModuleDetailPage />} />
              </Routes>
            ),
          },
          /* mirror's three sketchbook tabs, as they are — two of them wide-only, as in mirror */
          { path: '/tape', icon: 'dith-radial', label: 'Tape', children: <TapePage /> },
          { path: '/fronts', icon: 'component', label: 'Fronts', children: <WideOnly what="The front sketchbook"><FrontsPage /></WideOnly> },
          { path: '/icons', icon: 'grid-02', label: 'Icons', children: <WideOnly what="The icon sheet"><IconsPage /></WideOnly> },
        ]}
        settings={settings}
        /* Studio B is the tool too: bare primary and full-bleed, as AppStudio gives the Studio */
        shell={pathname === '/studio-b' ? { pageWash: null } : undefined}
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
