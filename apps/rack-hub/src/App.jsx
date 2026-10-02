import { Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { RackProvider } from '../../rack/src/hooks/useRackContext.jsx'
import VideoModulo from '../../rack/src/rack/VideoModulo.jsx'
import HomePage from './pages/HomePage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import ModuleDetailPage from './pages/ModuleDetailPage.jsx'
import PatchDetailPage from './pages/PatchDetailPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StagePage from './pages/StagePage.jsx'

/* kol-monitor's App on this repo's packages — the rehearsal for its bump (2026-10-02). Shell + Hub
 * + the same tool (apps-tier naming D2): the shell, Home, Library, Create, Stage and Settings are
 * here, monitor's files, copied; THE RACK ITSELF IS apps/rack's and is imported from there, so the
 * two apps cannot drift. What differs from monitor is listed in
 * `.kol/llm-context/backlog/2026-10-02-monitor-bump-notes.md`; in this file: a HashRouter (apps
 * are served under /apps/<slug>/ with no rewrites) and no dev-only pages. */
function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route element={<RackProvider />}>
              <Route path="/rack" element={<VideoModulo />} />
              <Route path="/rack/preset/:presetName" element={<VideoModulo />} />
              <Route path="/rack/patch/:presetName" element={<VideoModulo />} />
              <Route path="/create" element={<CreatePage />} />
              {/* the library lives INSIDE the rack's provider so a case being built
                  on /create survives a trip to a module's page and Back (2026-09-02) */}
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/library/:moduleType" element={<ModuleDetailPage />} />
              <Route path="/library/patch/:patchName" element={<PatchDetailPage />} />
            </Route>
            {/* the stage gets its OWN RackProvider — sharing the rack's would
                mean loading a stage silently replaces whatever is in the rack */}
            <Route element={<RackProvider initialRows={[]} />}>
              <Route path="/stage" element={<StagePage />} />
              <Route path="/stage/:stageName" element={<StagePage />} />
            </Route>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
