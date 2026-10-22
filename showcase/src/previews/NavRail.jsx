import { useState } from 'react'
import { NavRail } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const frame = 520

/* the two variants of the one rail (2026-10-22): `app` the flat rail, `site` the grouped site
 * sidebar that was kol-framework's SideNav */
export const variants = ['app', 'site']

const ITEMS = [
  { icon: 'grid', path: '/', label: 'Home' },
  { icon: 'layers', path: '/library', label: 'Library' },
  /* a FOLDER NOTE: `to` makes the label open /docs, the chevron folds its pages */
  { icon: 'book-open', path: '/docs', to: '/docs', label: 'Docs', sub: [
    { path: '/docs/start', label: 'Getting started' },
    { path: '/docs/rail', label: 'The rail' },
  ] },
  { icon: 'search', path: '/search', label: 'Search' },
]

/* site: a category with `pages` is a disclosure button; a row with `to` and no pages is a plain
 * link; a `{ label, children }` page is a group header; no icon = a section label over action rows */
const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'home-01' },
  {
    id: 'library', label: 'Library', icon: 'book-open',
    pages: [
      { to: '/components/button', label: 'Button' },
      { to: '/components/badge', label: 'Badge' },
      { label: 'Chrome', children: [
        { to: '/components/nav-rail', label: 'NavRail' },
        { to: '/components/theme-toggle', label: 'ThemeToggle' },
      ] },
    ],
  },
  { id: 'icons', label: 'Icons', to: '/icons', icon: 'grid' },
  { id: 'surface', label: 'Surface', pages: [] },
  { id: 'grid-on', label: 'Grid', icon: 'grid-horizontal', onSelect: () => {}, active: true },
  { id: 'rows-on', label: 'Rows', icon: 'rows', onSelect: () => {} },
]

export default function NavRailPreview({ variant = 'app' }) {
  const [path, setPath] = useState(variant === 'site' ? '/components/nav-rail' : '/')
  if (variant === 'site') {
    /* the real site rail is sticky, full-height chrome — framed and made static for the preview */
    return (
      <div className="relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 [&_.kol-sidenav]:static [&_.kol-sidenav]:h-full">
        <NavRail variant="site" navTree={NAV_TREE} currentPath={path} onNavigate={(e, to) => setPath(to)} />
      </div>
    )
  }
  return (
    <>
      <NavRail items={ITEMS} bottomItems={[{ icon: 'settings-01', path: '/settings', label: 'Settings' }]} currentPath={path} onNavigate={setPath} iconComponent={Icon} />
      <p className="kol-mono-14 text-meta" style={{ padding: '24px 24px 24px 88px' }}>{path}</p>
    </>
  )
}
