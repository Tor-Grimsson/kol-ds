import { PageHeader } from '@kolkrabbi/kol-component'
import AppHub from './AppHub.jsx'
import CatalogPage from './CatalogPage.jsx'
import PageShell from './PageShell.jsx'

/* taxonomy-ok: organism — nests AppHub / CatalogPage / PageShell (relative) + kol-component's PageHeader */

/**
 * AppStudio — the WORKSTATION: the Hub plus a fixed page set (apps review §6c-4, 2026-09-29).
 *
 * fxr, mirror and monitor each hand-build the same shape — a landing Catalog, a Library of what the
 * tool makes, a page that composes a new one, the tool itself full-bleed, a page or two of their own,
 * Settings. monitor.kolkrabbi.io is the reference: Home · Library (patches, modules) · Create (CASE ·
 * MODULES) · Rack · Stage · Settings. The Studio is that order, those keys, that masthead and that
 * phone bar made once; an app passes the pages and nothing about how they sit.
 *
 *   Home      /              `home`     — HubHome: RECENT · SAVED, New ‹thing›, Walkthrough; the mark goes here
 *   Library   /library       `library`  — a CatalogPage of the content
 *   Create    /create        `create`   — a Catalog-headed editor page: `header` + the editor as `children`
 *   Use       /use           `use`      — the tool, full-bleed: `children`, no page padding, no wash
 *   …         pages[].path   `pages`    — opt-in pages (monitor: Stage), each `{ path, icon, label, children }`
 *   Settings  /settings      `settings` — HubSettings, pinned at the rail's foot
 *
 * Library, Create and Use each take `{ path, label, icon }` to rename a slot (monitor calls Use
 * "Rack" at /rack) — the ORDER is the Studio's, not the app's. Omit one and it is not there.
 * MONO by default (fxr · mirror · monitor are mono by ruling); `masthead="display"` overrides.
 * Router-agnostic like AppShell: `currentPath` + `onNavigate`. Everything else is AppHub's.
 *
 * @param {Object} app          AppHub's `{ name, subtitle, logomark, about, links }`
 * @param {Object} home         HubHome's props — the landing Catalog (required: a Studio opens on Home)
 * @param {Object} [library]    CatalogPage's props, plus `{ path, label, icon }`
 * @param {Object} [create]     `{ header (PageHeader props), children, path, label, icon }`
 * @param {Object} [use]        `{ children, path, label, icon }` — the tool
 * @param {Array}  [pages]      `[{ path, icon, label, children }]` — opt-in pages, after Use
 * @param {Object} [settings]   HubSettings' props
 * @param {'mono'|'display'} [masthead='mono']
 * @param {Object} [shell]      any AppShell prop, spread last
 */
export default function AppStudio({
  app,
  currentPath,
  onNavigate,
  iconComponent,
  home,
  library,
  create,
  use,
  pages = [],
  settings,
  walkthrough,
  shortcuts,
  themeToggle,
  shortcutsKey,
  masthead = 'mono',
  shell,
}) {
  const slot = (cfg, path, label, icon) => cfg && { ...cfg, path: cfg.path ?? path, label: cfg.label ?? label, icon: cfg.icon ?? icon }
  const lib = slot(library, '/library', 'Library', 'nav-library')
  const make = slot(create, '/create', 'Create', 'nav-create')
  const tool = slot(use, '/use', 'Use', 'nav-rack')
  const rows = [lib, make, tool, ...pages].filter(Boolean)
  const at = (p) => currentPath === p || currentPath.startsWith(`${p}/`)

  let page = null
  if (lib && at(lib.path)) {
    const { path: _p, label: _l, icon: _i, ...props } = lib
    page = <CatalogPage {...props} />
  } else if (make && at(make.path)) {
    page = (
      <PageShell>
        {make.header && <PageHeader size="sm" {...make.header} />}
        {make.children}
      </PageShell>
    )
  } else if (tool && at(tool.path)) {
    page = tool.children
  } else {
    page = pages.find((p) => at(p.path))?.children ?? null
  }

  return (
    <AppHub
      app={app}
      items={rows.map(({ path, icon, label }) => ({ path, icon, label }))}
      currentPath={currentPath}
      onNavigate={onNavigate}
      iconComponent={iconComponent}
      home={home}
      walkthrough={walkthrough}
      settings={settings}
      shortcuts={shortcuts}
      themeToggle={themeToggle}
      shortcutsKey={shortcutsKey}
      masthead={masthead}
      /* the tool sits on bare surface-primary, full-bleed; every other page keeps the Hub's wash */
      shell={{ ...(tool && at(tool.path) ? { pageWash: null } : null), ...shell }}
    >
      {page}
    </AppHub>
  )
}
