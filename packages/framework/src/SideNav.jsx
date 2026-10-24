import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { NavRail } from '@kolkrabbi/kol-component'
import ThemeToggle from './ThemeToggle'

/**
 * SideNav — The grouped navigation rail. `NavRail variant="site"` under its old name (2026-10-22, the one nav rail).
 *
 * @deprecated — use `NavRail variant="site"` from `@kolkrabbi/kol-component`. This name is on the
 * retirement ledger; it stays so every site keeps resolving.
 *
 * The drawing moved to kol-component class-for-class (`organisms/NavRailSite.jsx`; the 479-line
 * original is in kol-ds-ui `_tmp/2026-10-22-rail-to-component/`). Two things stay here because
 * kol-component cannot carry them: the ROUTER read and the THEME TOGGLE.
 *
 * Router: without `currentPath` this reads react-router (`useLocation`) and navigates with
 * `useNavigate` — the NavLink rail it always was, `onNavigate(event, to)` still called first. With
 * `currentPath` the router is never touched (kol-shell's agnostic contract).
 *
 * Theme: `themeToggle` (default `true`) renders kol-framework's `ThemeToggle` in the rail's slot;
 * `false` drops it.
 */
export default function SideNav(props) {
  if (props.currentPath != null) return <NavRail variant="site" {...props} themeToggle={themeSlot(props.themeToggle)} />
  return <RouterSideNav {...props} />
}

function RouterSideNav({ onNavigate, ...props }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const base = useHref('/').replace(/\/$/, '')
  return (
    <NavRail
      variant="site"
      {...props}
      currentPath={pathname}
      hrefFor={(to) => `${base}${to}`}
      onNavigate={(e, to) => { onNavigate?.(e, to); navigate(to) }}
      themeToggle={themeSlot(props.themeToggle)}
    />
  )
}

/* the theme is a TREE ROW (user 2026-10-24, site-hub): `ThemeToggle variant="row"` wears the rail's hop
 * box and follows the collapse as every row does, so there is no `icon` fallback; collapsed it carries the
 * toggle's own tooltip, as the rows carry theirs */
const themeSlot = (on = true) => (on === false ? false : ({ collapsed }) => (
  <ThemeToggle variant="row" tooltip={collapsed} />
))
