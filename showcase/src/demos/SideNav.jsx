import { SideNav } from '@kolkrabbi/kol-framework'

/* Two-level tree (2026-08-09 elder port): a category with `pages` is a
 * disclosure button; a row with `to` and no pages is a plain link. */
const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'home-01' },
  {
    id: 'library', label: 'Library', icon: 'book-open',
    pages: [
      { to: '/components/button', label: 'Button' },
      { to: '/components/badge', label: 'Badge' },
    ],
  },
  { id: 'icons', label: 'Icons', to: '/icons', icon: 'grid' },
]

/* The background prop, as the picker: `framed` is the default rail surface;
 * `chromeless` floats the rail over the host's media (brand-hero model). */
export const variants = ['framed', 'chromeless']

export default function SideNavDemo({ variant = 'framed' }) {
  const chromeless = variant === 'chromeless'
  // The real SideNav is sticky, full-height chrome (h-dvh) — frame it for
  // the preview and neutralise the viewport sizing. `relative` is load-bearing:
  // with the rail forced static, the absolute collapse toggle would otherwise
  // anchor to the viewport and poke past its edge.
  return (
    <div className={`relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 [&_.kol-sidenav]:static [&_.kol-sidenav]:h-full${chromeless ? ' bg-fg-08' : ''}`}>
      <SideNav navTree={NAV_TREE} background={!chromeless} />
    </div>
  )
}
