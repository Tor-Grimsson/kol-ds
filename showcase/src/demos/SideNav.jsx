import { SideNav } from '@kolkrabbi/kol-framework'

/* A category with `pages` is a disclosure button; a row with `to` and no
 * pages is a plain link. A page row may be a `{ label, children }` GROUP — a
 * non-routing header over its own indented rows (sidenav-nested-groups,
 * 2026-08-26; the tree shape is the opt-in, there is no prop). The Chrome
 * group names this page, so it renders lit with its leaf active. */
const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'home-01' },
  {
    id: 'library', label: 'Library', icon: 'book-open',
    pages: [
      { to: '/components/button', label: 'Button' },
      { to: '/components/badge', label: 'Badge' },
      {
        label: 'Chrome',
        children: [
          { to: '/components/side-nav', label: 'SideNav' },
          { to: '/components/theme-toggle', label: 'ThemeToggle' },
        ],
      },
    ],
  },
  { id: 'icons', label: 'Icons', to: '/icons', icon: 'grid' },
  /* a LABEL over action rows — the workspace-rail shape (WorkspaceSidebarGeometry,
   * 2026-08-27): no icon = a section, hidden on collapse; the rows dispatch */
  { id: 'surface', label: 'Surface', pages: [] },
  { id: 'grid-on', label: 'Grid', icon: 'grid-horizontal', onSelect: () => {}, active: true },
  { id: 'rows-on', label: 'Rows', icon: 'rows', onSelect: () => {} },
]

/* The background prop, as the picker: `framed` is the default rail surface;
 * `chromeless` floats the rail over the host's media (brand-hero model). */
export const variants = ['framed', 'hairline', 'chromeless']

export default function SideNavDemo({ variant = 'framed' }) {
  const chromeless = variant === 'chromeless'
  // The real SideNav is sticky, full-height chrome (h-dvh) — frame it for
  // the preview and neutralise the viewport sizing. `relative` is load-bearing:
  // with the rail forced static, the absolute collapse toggle would otherwise
  // anchor to the viewport and poke past its edge.
  return (
    <div className={`relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 [&_.kol-sidenav]:static [&_.kol-sidenav]:h-full${chromeless ? ' bg-fg-08' : ''}`}>
      <SideNav navTree={NAV_TREE} background={!chromeless} hairline={variant === 'hairline'} />
    </div>
  )
}
