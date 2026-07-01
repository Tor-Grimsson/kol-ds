import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Layout, PageSection } from '@kolkrabbi/kol-framework'

/* Layout renders ScrollToTop + an <Outlet/>, so it must sit in a layout <Route>. */
const Page = () => (
  <div style={{ padding: 32 }}>
    <PageSection
      id="overview"
      label="layout"
      title="Routed page body"
      body="Layout wraps every route: min-height column, ScrollToTop on navigation, and an ExitPreview banner on /site routes."
    />
  </div>
)

export const Default = () => (
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Page />} />
      </Route>
    </Routes>
  </MemoryRouter>
)
