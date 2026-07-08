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
import WorkshopPreview from './pages/WorkshopPreview'

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
      {/* Ported workshop shell — standalone chrome, splat so sidebar child
          paths resolve inside its own layout route. */}
      <Route path="/workshop-preview/*" element={<WorkshopPreview />} />
    </Routes>
  )
}
