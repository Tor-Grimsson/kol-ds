import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppShell, PageSection } from '@kolkrabbi/kol-framework'

/* Realistic nav tree (lifted from showcase/src/sidebars.config.js shape):
 *   { id, to, label, icon, children } — top-level page
 *   { id, label }                     — section anchor leaf (#id)
 *   { to, label }                     — sub-route leaf
 *   { label, children }               — group */
const navTree = [
  {
    id: 'home', label: 'Home', to: '/', icon: 'search',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'principles', label: 'Principles' },
      {
        label: 'Foundations',
        children: [
          { id: 'color', label: 'Color' },
          { id: 'type', label: 'Typography' },
        ],
      },
    ],
  },
  {
    id: 'components', label: 'Components', to: '/components', icon: 'settings-01',
    children: [
      {
        label: 'Atoms',
        children: [
          { to: '/components/button', label: 'Button' },
          { to: '/components/icon', label: 'Icon' },
        ],
      },
      {
        label: 'Molecules',
        children: [{ to: '/components/table', label: 'Table' }],
      },
    ],
  },
]

function getActivePage(pathname) {
  if (pathname === '/') return navTree.find((n) => n.to === '/')
  return navTree.find((n) => n.to !== '/' && pathname.startsWith(n.to))
}

/* AppShell renders an <Outlet/>, so it must sit in a layout <Route>. */
const Page = ({ title }) => (
  <div style={{ padding: 32 }}>
    <PageSection
      id="overview"
      label="01 — overview"
      title={title}
      body="Sample page content rendered through the AppShell Outlet."
    />
  </div>
)

export const Default = () => (
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route element={<AppShell navTree={navTree} getActivePage={getActivePage} />}>
        <Route path="/" element={<Page title="Home" />} />
        <Route path="/components" element={<Page title="Components" />} />
      </Route>
    </Routes>
  </MemoryRouter>
)
