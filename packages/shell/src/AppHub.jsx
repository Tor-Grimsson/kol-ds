import { useEffect, useState } from 'react'
import AppShell from './AppShell.jsx'
import HubHome from './HubHome.jsx'
import HubSettings from './HubSettings.jsx'
import { ShortcutsOverlay } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — nests AppShell / HubHome / HubSettings / ShortcutsOverlay (relative) */

/**
 * AppHub — An app's shell and hub in one. Shell + Hub in one call; the app passes its Tool as children (the app anatomy,
 * `docs/documentation/04-compositions/16-app-anatomy.md`, 2026-09-26).
 *
 * monitor, mirror and fxr each assembled this by hand: the same AppShell props, the same
 * Home on CatalogPage, the same Settings on SettingsScaffold, a local ⌥-digit handler
 * apiece and a local shortcuts-sheet key — so their small things drifted. The Hub is
 * those decisions made once. An app describes itself and supplies its tool.
 *
 * ROUTES: `homePath` (default `/`) is Home, `settingsPath` is Settings, every other path renders
 * `children` — the tool. A tool that should be what LOADS moves Home off `/` (media-hub, user
 * 2026-09-26: "the point of this is not to bury media, the column browser is what we want loaded"):
 * `homePath="/library"`, a rail row for it, and the mark still goes to `/` — the tool.
 * Router-agnostic like AppShell: pass `currentPath` + `onNavigate`, and your router's element
 * (`<Outlet/>`) as children.
 *
 * KEYS: `,` toggles Settings · `S` toggles the shortcuts sheet · `\` hides the rail ·
 * ⌥1…9 walks the rail top to bottom, mark first, Settings last. None fire while typing.
 *
 * @param {Object}   app        `{ name, subtitle, logomark (svg url), about (node), links [{label,url}] }`
 * @param {Array}    items      the tool's rail rows `{ icon, path, label }` — Home is the mark, Settings is pinned
 * @param {string}   currentPath · {Function} onNavigate · {ElementType} iconComponent   as AppShell
 * @param {string}   homePath   where Home lives (default `/`); anything else puts the tool at `/`
 * @param {Object}   home       HubHome's props (`items`, `toCard`, `views`, `actions`, `filterGroups`, …).
 *                              OPT-IN (apps review 2026-09-29): no `home`, no Home page — `homePath` renders the
 *                              tool and the mark goes there (media-hub: the column browser IS the app)
 * @param {Array}    walkthrough  the steps Home's Walkthrough button opens
 * @param {Object}   settings   HubSettings' props (`content`, `tabs`, `picker`, `onOpenSettings`, `comboLabel`).
 *                              OPT-IN like AppShell's `bottomItems` (apps review 2026-09-29: *"not sure it makes sense
 *                              to neccessarily have settings manditory part of the rail"*) — no `settings`, no rail
 *                              row, no route, no `,` key. It was pinned whether the app had settings or not.
 * @param {Array}    shortcuts  `[{ section, items: [{ id, label, combo }] }]` — the sheet AND Settings
 * @param {ReactNode} themeToggle  Settings' masthead toggle (a node — kol-framework is not a peer)
 * @param {string}   shortcutsKey  default `s`; `null` turns the sheet key off (a tool that owns S)
 * @param {'display'|'mono'} masthead  the app's one masthead (AppShell's) — set, Home and Settings follow it; unset
 *                              (the default), they keep the Hub's mono title (2026-09-29)
 * @param {Object}   shell      any AppShell prop, spread last (`touch`, `pageWash`, `drawerOpenOn`, `railComponent`, …)
 */
const SETTINGS_ROW = (path) => [{ icon: 'nav-settings', path, label: 'Settings' }]

export default function AppHub({
  app = {},
  items = [],
  currentPath,
  onNavigate,
  iconComponent,
  home,
  walkthrough,
  settings,
  shortcuts = [],
  themeToggle,
  settingsPath = '/settings',
  homePath = '/',
  shortcutsKey = 's',
  masthead,
  shell,
  children,
}) {
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (!shortcutsKey) return undefined
    const onKey = (e) => {
      if (e.key.toLowerCase() !== shortcutsKey || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      setSheet((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcutsKey])

  const page = home && currentPath === homePath
    ? <HubHome app={app} iconComponent={iconComponent} walkthrough={walkthrough} {...home} />
    : settings && currentPath === settingsPath
      ? <HubSettings app={app} shortcuts={shortcuts} themeToggle={themeToggle} {...settings} />
      : children
  const bottom = settings ? SETTINGS_ROW(settingsPath) : []
  /* the phone bar lists Home as a tab — the rail draws it as the mark, the bar has no mark */
  const barItems = [...(home ? [{ icon: 'home-01', path: homePath, label: 'Home' }] : []), ...items, ...bottom]

  return (
    <AppShell
      items={items}
      bottomItems={bottom}
      barItems={barItems}
      logomark={app.logomark ? { svgUrl: app.logomark, title: app.name } : undefined}
      currentPath={currentPath}
      onNavigate={onNavigate}
      iconComponent={iconComponent}
      appName={app.name}
      railToggleKey={'\\'}
      settingsPath={settings ? settingsPath : undefined}
      settingsKey={settings ? ',' : undefined}
      navKeys
      /* THE PHONE BAR, not the drawer (apps review 2026-09-29): the drawer's hamburger is fixed
       * top-right, over the masthead's own controls — validate:render caught it on every Hub page
       * with a gear. `shell={{ touch: 'drawer' }}` still gets the drawer. */
      touch="bar"
      masthead={masthead}
      pageWash="var(--kol-fg-02)"
      {...shell}
    >
      {page}
      {sheet && <ShortcutsOverlay shortcuts={shortcuts} onClose={() => setSheet(false)} />}
    </AppShell>
  )
}
