import { MemoryRouter } from 'react-router-dom'
import { SideNav } from '@kolkrabbi/kol-framework'

/* navTree shape (two-level, the 2026-08-09 elder port):
 *   { id, label, icon, pages: [{ label, to }] } — category (disclosure button)
 *   { id, label, icon, to }                     — link row (nothing to disclose) */
const navTree = [
  { id: 'home', label: 'Home', to: '/', icon: 'search' },
  {
    id: 'library', label: 'Library', icon: 'library',
    pages: [
      { label: 'Button', to: '/components/button' },
      { label: 'Icon', to: '/components/icon' },
      { label: 'Table', to: '/components/table' },
    ],
  },
  { id: 'icons', label: 'Icons', to: '/icons', icon: 'grid' },
]

/* Categories load closed; click a category to disclose its pages. */
export const Default = () => (
  <MemoryRouter initialEntries={['/']}>
    <SideNav navTree={navTree} />
  </MemoryRouter>
)

/* background={false} — the chromeless rail floating over consumer media
 * (the brand-hero model; the consumer owns the plane). */
export const Chromeless = () => (
  <MemoryRouter initialEntries={['/components/button']}>
    <div className="bg-fg-08 min-h-dvh">
      <SideNav navTree={navTree} background={false} />
    </div>
  </MemoryRouter>
)
