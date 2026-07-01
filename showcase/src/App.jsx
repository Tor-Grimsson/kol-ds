import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@kolkrabbi/kol-framework'
import { NAV_TREE, getActivePage } from './sidebars.config'
import Home from './pages/Home'
import Foundations from './pages/Foundations'
import Icons from './pages/Icons'
import IconsVariants from './pages/IconsVariants'
import ComponentPage from './pages/ComponentPage'
import Components from './pages/Components'

export default function App() {
  return (
    <Routes>
      {/* Home stands alone — top nav, no sidebar (shadcn-style landing). */}
      <Route path="/" element={<Home />} />
      {/* Every component page → the generic data-driven doc (own chrome via DocLayout). */}
      <Route path="/components/:slug" element={<ComponentPage />} />
      {/* Docs area keeps the sidebar chrome. */}
      <Route element={<AppShell navTree={NAV_TREE} getActivePage={getActivePage} />}>
        <Route path="/foundations" element={<Foundations />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/icons/variants" element={<IconsVariants />} />
        <Route path="/components" element={<Components />} />
      </Route>
    </Routes>
  )
}
