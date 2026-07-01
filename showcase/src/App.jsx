import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@kolkrabbi/kol-framework'
import { NAV_TREE, getActivePage } from './sidebars.config'
import Home from './pages/Home'
import Components from './pages/Components'
import ComponentDoc from './pages/ComponentDoc'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell navTree={NAV_TREE} getActivePage={getActivePage} />}>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/:slug" element={<ComponentDoc />} />
      </Route>
    </Routes>
  )
}
