import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Foundations from './pages/Foundations'
import FoundationsColor from './pages/FoundationsColor'
import FoundationsTypography from './pages/FoundationsTypography'
import Icons from './pages/Icons'
import IconsV1 from './pages/IconsV1'
import ComponentPage from './pages/ComponentPage'
import Components from './pages/Components'
import Blocks from './pages/Blocks'
import BlockPage from './pages/BlockPage'
import BlockPreview from './pages/BlockPreview'
import Sets from './pages/Sets'
import SetPage from './pages/SetPage'
import SetPreview from './pages/SetPreview'
import DocsShellLayout from './pages/DocsShellLayout'
import DocsMenus from './pages/DocsMenus'
import DocsLoaders from './pages/DocsLoaders'
import WorkshopDocsPreview from './pages/WorkshopDocsPreview'
import Lobby from './pages/Lobby'
import Demo from './pages/Demo'

/**
 * One chrome everywhere: Home renders TopBar standalone (landing, no sidebar);
 * every docs page carries the shared DocLayout shell (TopBar + unified sidebar
 * + TOC) itself — no route-level shell wrapper.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/foundations" element={<Foundations />} />
      <Route path="/foundations/color" element={<FoundationsColor />} />
      <Route path="/foundations/typography" element={<FoundationsTypography />} />
      <Route path="/icons" element={<Icons />} />
      <Route path="/icons/v1" element={<IconsV1 />} />
      <Route path="/components" element={<Components />} />
      <Route path="/components/:slug" element={<ComponentPage />} />
      <Route path="/blocks" element={<Blocks />} />
      <Route path="/blocks/preview/:slug" element={<BlockPreview />} />
      <Route path="/blocks/:slug" element={<BlockPage />} />
      <Route path="/sets" element={<Sets />} />
      <Route path="/sets/preview/:slug" element={<SetPreview />} />
      <Route path="/sets/:slug" element={<SetPage />} />
      <Route path="/docs/shell-and-layout" element={<DocsShellLayout />} />
      <Route path="/docs/menus" element={<DocsMenus />} />
      <Route path="/docs/loaders" element={<DocsLoaders />} />
      {/* THE workshop route — live dogfood of @kolkrabbi/kol-workshop (shell +
          docs viewer). The vendored-shell /workshop-preview twin was deleted
          in the 2026-07-15 de-fork; one shell, consumed from the package. */}
      <Route path="/workshop-docs/*" element={<WorkshopDocsPreview />} />
      {/* Maintainer tooling — dev server only, never the deployed site
          (2026-07-15 audit P1-3): the repo-root lobby/ work queue and the
          chess-consumer mirror (1:1 stand-in for the kol-chess app). */}
      {import.meta.env.DEV && <Route path="/lobby/*" element={<Lobby />} />}
      {import.meta.env.DEV && <Route path="/demo" element={<Demo />} />}
    </Routes>
  )
}
