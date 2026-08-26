import { useState } from 'react'
import NavRail from './NavRail.jsx'
import { NavHiddenContext } from './navHidden.js'

/**
 * AppShell — layout root: fixed NavRail + content offset by the rail width.
 * No header, no footer. Router-agnostic: render your router's element (e.g.
 * `<Outlet/>`) as children and wire `currentPath`/`onNavigate` from your
 * router at the call site.
 *
 * Rail width is `--kol-shell-rail-width` (kol-theme) — read by both the rail
 * and the offset so they can never disagree.
 *
 * @param {Array}  props.items         nav items `{ icon, path, label }`
 * @param {Array}  props.bottomItems   items pinned below the theme toggle
 * @param {Object} props.logomark      `{ svgUrl, title }` — top mark, navigates to '/'
 * @param {string} props.currentPath   the router's current pathname
 * @param {Function} props.onNavigate  `(path) => void`
 * @param {ElementType} props.iconComponent  icon renderer seam (see Button)
 * @param {boolean} props.themeToggle  render the ThemeToggle above bottomItems (default true)
 */
export default function AppShell({
  items,
  bottomItems,
  logomark,
  currentPath,
  onNavigate,
  iconComponent,
  themeToggle,
  children,
}) {
  const [navHidden, setNavHidden] = useState(false)

  return (
    <NavHiddenContext.Provider value={{ navHidden, setNavHidden }}>
      {!navHidden && (
        <NavRail
          items={items}
          bottomItems={bottomItems}
          logomark={logomark}
          currentPath={currentPath}
          onNavigate={onNavigate}
          iconComponent={iconComponent}
          themeToggle={themeToggle}
        />
      )}
      <div style={{ marginLeft: navHidden ? 0 : 'var(--kol-shell-rail-width)' }}>
        {children}
      </div>
    </NavHiddenContext.Provider>
  )
}
