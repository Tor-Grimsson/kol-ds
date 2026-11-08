import { useState } from 'react'
import { NavRail, Menu, MenuTrigger } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'
/* importing kol-workshop registers the `workshop` preset (ShellRail) under NavRail */
import '@kolkrabbi/kol-workshop'

export const frame = 520

/* THE THREE PRESETS (2026-10-24, user: *"app = studio, site = brand, workshop"*): `app` the studio rail — the hubs;
 * `site` the brand rail — brand.kolkrabbi.io; `workshop` the workshop rail — ui.kolkrabbi.io. One rail, three names;
 * the picker here is the preset. The words: a section ENTERS and EXITS, or EXPANDS and COLLAPSES. */
export const variants = ['app', 'site', 'workshop', 'top', 'float']

/* float (W9 rows 122 · 127 · 128): the float sidebar, expanded 280 beside its collapsed 72 rail — one tree */
const FLOAT = [
  { heading: 'WORKSPACE' },
  { icon: 'home-01', label: 'Home', path: '/' },
  { icon: 'grid', label: 'Dashboard', path: '/dashboard', sub: [
    { icon: 'checklist', label: 'Tasks', path: '/dashboard/tasks', count: 5 },
    { icon: 'inbox', label: 'Capture', path: '/dashboard/capture', count: 3 },
    { icon: 'folder', label: 'Projects', path: '/dashboard/projects' },
    { icon: 'calendar', label: 'Calendar', path: '/dashboard/calendar' },
    { icon: 'bar-chart', label: 'Metrics', path: '/dashboard/metrics' },
    { icon: 'link', label: 'Links', path: '/dashboard/links' },
  ] },
  { icon: 'file', label: 'Documents', path: '/documents', sub: [{ icon: 'file', label: 'Founder', path: '/documents/founder' }] },
  { icon: 'book-open', label: 'Resume', path: '/resume' },
  { heading: 'STUDIO & LIBRARY' },
  { icon: 'folder', label: 'Studio', path: '/studio' },
  { icon: 'image', label: 'Prints', path: '/prints' },
  { icon: 'layers', label: 'Assets', path: '/assets' },
]
function FloatPreview() {
  const [path, setPath] = useState('/dashboard/tasks')
  return (
    <div className="flex h-[720px] items-stretch gap-6 p-4">
      <NavRail variant="float" items={FLOAT} currentPath={path} onNavigate={setPath} title="Studio" onSwitch={() => {}} onSearch={() => {}} defaultExpanded={['/dashboard']} />
      <NavRail variant="float" collapsed items={FLOAT} currentPath={path} onNavigate={setPath} onCollapsedChange={() => {}} onSearch={() => {}} onHide={() => {}} />
    </div>
  )
}

/* top: the Atlas /lab bar rebuilt from the rail's parts — the mark, the app name, the open entry's views on the right */
function TopPreview() {
  const [view, setView] = useState('Specimen')
  const views = ['Specimen', 'Grid', 'Sheet']
  return (
    <NavRail variant="top" logomark={{ svgUrl: '/favicon/favicon-kol-ds.svg', title: 'Lab' }} onNavigate={() => {}}
      actions={<Menu align="end" items={views.map((v) => ({ label: v, current: v === view, onClick: () => setView(v) }))}
        trigger={({ open, props }) => <MenuTrigger open={open} {...props}>{view}</MenuTrigger>} />} />
  )
}

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
  if (variant === 'top') return <TopPreview />
  if (variant === 'float') return <FloatPreview />
  if (variant === 'workshop') {
    /* the workshop rail — kol-workshop's ShellRail, registered as the preset; its routes, its own chrome */
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
      <NavRail preset="app" items={ITEMS} bottomItems={[{ icon: 'image', path: '#media', label: 'Media' }, { icon: 'user', path: '#sign-in', label: 'Sign in' }, { icon: 'settings-01', path: '/settings', label: 'Settings' }]} logomark={{ svgUrl: '/favicon/favicon-kol-ds.svg', title: 'Studio' }} currentPath={path} onNavigate={setPath} iconComponent={IconLoader} />
      <p className="kol-mono-14 text-meta" style={{ padding: '24px 24px 24px 88px' }}>{path}</p>
    </>
  )
}
