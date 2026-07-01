import { MemoryRouter } from 'react-router-dom'
import { ScrollToTop } from '@kolkrabbi/kol-framework'

/* Behaviour-only utility: renders null, scrolls to top (or to #hash) on route
 * change. Needs router context (useLocation), so wrap in MemoryRouter. */
export const Default = () => (
  <MemoryRouter initialEntries={['/']}>
    <ScrollToTop />
    <p className="kol-sans-body-01 text-body">
      ScrollToTop renders nothing — it scrolls the window to top on every route
      change, or smooth-scrolls to an element when the location has a #hash.
    </p>
  </MemoryRouter>
)
