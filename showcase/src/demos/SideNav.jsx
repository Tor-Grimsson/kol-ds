import { SideNav } from '@kolkrabbi/kol-framework'

const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'book-open' },
  {
    id: 'library', label: 'Library', to: '/components', icon: 'library',
    children: [
      { to: '/components/button', label: 'Button' },
      { to: '/components/badge', label: 'Badge' },
    ],
  },
  { id: 'icons', label: 'Icons', to: '/icons', icon: 'grid-02' },
]

const getActivePage = (pathname) =>
  NAV_TREE.find((n) => n.to !== '/' && pathname.startsWith(n.to)) ?? NAV_TREE[0]

export default function SideNavDemo() {
  // The real SideNav is sticky, full-height chrome (h-dvh) — frame it for
  // the preview and neutralise the viewport sizing. `relative` is load-bearing:
  // with the rail forced static, the absolute collapse toggle (right-[-12px])
  // would otherwise anchor to the viewport and poke past its edge.
  return (
    <div className="relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 [&_.kol-sidenav]:static [&_.kol-sidenav]:h-full">
      <SideNav navTree={NAV_TREE} getActivePage={getActivePage} />
    </div>
  )
}
