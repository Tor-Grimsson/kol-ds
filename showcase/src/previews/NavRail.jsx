import { useState } from 'react'
import { NavRail } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
/* importing kol-workshop registers the `workshop` preset (ShellSidebar) under NavRail */
import '@kolkrabbi/kol-workshop'

export const frame = 520

/* THE THREE PRESETS (2026-10-24, user: *"app = studio, site = brand, workshop"*): `app` the studio rail — the hubs;
 * `site` the brand rail — brand.kolkrabbi.io; `workshop` the workshop rail — ui.kolkrabbi.io. One rail, three names;
 * the picker here is the preset. The words: a section ENTERS and EXITS, or EXPANDS and COLLAPSES. */
export const variants = ['app', 'site', 'workshop']

/* the studio rail's rows: Chrome ENTERS (its rows hold sections), Labs ENTERS, Effects EXPANDS (leaves) — the one rule */
const ITEMS = [
  { icon: 'layers', path: '/library', label: 'Library' },
  { icon: 'desktop', path: '/chrome', label: 'Chrome', sub: [
    { icon: 'desktop', path: '/editor', label: 'Editor' },
    { icon: 'globe', path: '/labs', label: 'Labs', sub: [
      { icon: 'filter', path: '/labs/effects', label: 'Effects', sub: [
        { icon: 'drop', path: '/labs/effects/halftone', label: 'Halftone' },
        { icon: 'brightness', path: '/labs/effects/scanline', label: 'Scanline' },
      ] },
      { icon: 'layers', path: '/labs/generative', label: 'Generative', sub: [{ icon: 'grid', path: '/labs/generative/noise', label: 'Noise' }] },
    ] },
    { icon: 'refresh', path: '/randomiser', label: 'Randomiser' },
  ] },
]
const WORKSHOP_ROUTES = [
  { path: '', label: 'Home', icon: 'home-01' },
  { path: 'library', label: 'Library', icon: 'book-open', children: [{ path: 'components', label: 'Components' }, { path: 'sets', label: 'Sets' }] },
  { path: 'docs', label: 'Docs', icon: 'file' },
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
  if (variant === 'workshop') {
    /* the workshop rail — kol-workshop's ShellSidebar, registered as the preset; its routes, its own chrome */
    return (
      <div className="relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12">
        <NavRail preset="workshop" routes={WORKSHOP_ROUTES} basePath="/workshop" label="Workshop" onNavigate={() => {}} />
      </div>
    )
  }
  if (variant === 'site') {
    /* the real site rail is sticky, full-height chrome — framed and made static for the preview */
    return (
      <div className="relative h-80 w-60 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 [&_.kol-sidenav]:static [&_.kol-sidenav]:h-full">
        <NavRail preset="site" navTree={NAV_TREE} currentPath={path} onNavigate={(e, to) => setPath(to)} />
      </div>
    )
  }
  return (
    <>
      <NavRail preset="app" items={ITEMS} bottomItems={[{ icon: 'image', path: '#media', label: 'Media' }, { icon: 'user', path: '#sign-in', label: 'Sign in' }, { icon: 'settings-01', path: '/settings', label: 'Settings' }]} logomark={{ svgUrl: '/favicon/favicon-kol-ds.svg', title: 'Studio' }} currentPath={path} onNavigate={setPath} iconComponent={Icon} />
      <p className="kol-mono-14 text-meta" style={{ padding: '24px 24px 24px 88px' }}>{path}</p>
    </>
  )
}
