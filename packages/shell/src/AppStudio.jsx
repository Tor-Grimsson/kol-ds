import { PageHeader } from '@kolkrabbi/kol-component'
import AppHub from './AppHub.jsx'
import CatalogPage from './CatalogPage.jsx'
import PageShell from './PageShell.jsx'

/* taxonomy-ok: organism — nests AppHub / CatalogPage / PageShell (relative) + kol-component's PageHeader */

/**
 * AppStudio — The studio workstation. the WORKSTATION: the Hub plus a fixed page set (apps review §6c-4, 2026-09-29).
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
 * @param {Object} home         HubHome's props — the landing Catalog's DATA (`files` · `template` · handlers;
 *                              required: a Studio opens on Home)
 * @param {Object} [library]    CatalogPage's props — or `children` (a router, for pages under the
 *                              slot: `/library/:id`), which renders in place of the CatalogPage —
 *                              plus `{ path, label, icon }`
 * @param {Object} [create]     `{ header (PageHeader props), children, path, label, icon, bar? }` (`bar: false` as `pages`);
 *                              `shell: false` renders `children` bare — for a Create that owns its
 *                              PageShell (a fixed canvas beside a scrolling list)
 * @param {Object} [use]        `{ children, path, label, icon }` — the tool
 * @param {Array}  [pages]      `[{ path, icon, label, children, sub?, bar? }]` — opt-in pages, after Use; `bar: false` on a page
 *                              (or a sub row) that owns the phone's bottom edge hides the bar there, as Use does; a page with `sub`
 *                              is a SECTION whose rows (each `{ path, icon, label, children, sub? }`) open under it
 *                              (rows that hold sections enter under a Back row; leaf rows expand in place)
 * @param {Object} [settings]   HubSettings' props
 * @param {Object} [media]      AppHub's `media` — the Media row at the rail's foot, the DS modal library over a client
 * @param {Object} [signIn]     AppHub's `signIn` — the user row at the rail's foot; the press is the consumer's
 * @param {Object} [dev]        HubDev's props — AppHub's `dev`: a dev server's `code` page at `/dev`
 * @param {Object} [phoneNav]   AppHub's `phoneNav` — `{ more: (defaults) => rows }`, the phone's More sheet as the app edits it.
 *                              Forwarded since HubSignedOutGutterAndSeams (kol-fxr 2026-10-29): it was not, so a Studio app
 *                              could not reach the phone's rows at all
 * @param {'mono'|'display'} [masthead='mono']
 * @param {Object} [shell]      any AppShell prop, spread last. The rail is `NavRail preset="app"` (AppHub's), so an app
 *                              passes nothing about it; the Studio adds `barHiddenOn` — Use and every `bar: false` page
 */
/* a rail row and its `sub` rows, every level deep (Chrome → Labs → Effects → its groups); a page's `children` stay here */
const railRow = ({ path, icon, label, sub, to }) => ({ path, icon, label, ...(sub && { sub: sub.map(railRow) }), ...(to && { to }) }) // `bar`, `children` stay here

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
  media,
  signIn,
  dev,
  phoneNav,
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
  /* THE BAR STEPS ASIDE on the tool and on any page that owns the phone's bottom edge (mirror's bottom sheet, the rack's
   * chrome, fxr's chromes). The rail itself is NavRail's `app` preset, through AppHub; `shell` still overrides, deliberately. */
  const flatPages = (list) => list.flatMap((p) => [...flatPages(p.sub ?? []), p])
  const barHiddenOn = [tool?.path, make?.bar === false ? make.path : null, ...flatPages(pages).filter((p) => p.bar === false).map((p) => p.path)].filter(Boolean)

  let page = null
  if (lib && at(lib.path)) {
    /* `key` is React's, lifted out so a consumer can remount the Catalog per view (a chip from one view must not
     * survive into the other and filter everything out — mixer-hub's `key={props.view}`) */
    const { path: _p, label: _l, icon: _i, children, key, ...props } = lib
    page = children ?? <CatalogPage key={key} {...props} />
  } else if (make && at(make.path)) {
    page = make.shell === false ? make.children : (
      <PageShell>
        {make.header && <PageHeader level="app" {...make.header} />}
        {make.children}
      </PageShell>
    )
  } else if (tool && at(tool.path)) {
    page = tool.children
  } else {
    /* a page may be a SECTION — `sub` rows under it (plan-2026-10-23 § 3.5: the Chrome section that enters to
     * Editor, Labs, Randomiser, Morph; Effects expands its leaves) — so the walk reads every level, the deepest match first */
    const flat = (list) => list.flatMap((p) => [...flat(p.sub ?? []), p])
    page = flat(pages).find((p) => at(p.path))?.children ?? null
  }

  return (
    <AppHub
      app={app}
      items={rows.map(railRow)}
      currentPath={currentPath}
      onNavigate={onNavigate}
      iconComponent={iconComponent}
      home={home}
      walkthrough={walkthrough}
      settings={settings}
      media={media}
      signIn={signIn}
      dev={dev}
      phoneNav={phoneNav}
      shortcuts={shortcuts}
      themeToggle={themeToggle}
      shortcutsKey={shortcutsKey}
      masthead={masthead}
      /* the tool sits on bare surface-primary, full-bleed; every other page keeps the Hub's wash */
      shell={{ barHiddenOn, ...(tool && at(tool.path) ? { pageWash: null } : null), ...shell }}
    >
      {page}
    </AppHub>
  )
}
