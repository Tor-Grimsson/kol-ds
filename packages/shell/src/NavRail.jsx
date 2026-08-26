import { Button } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import Logomark from './Logomark.jsx'

/**
 * NavRail — the fixed 48px icon rail. Geometry/stacking live in kol-theme's
 * `.kol-shell-rail`; surface/border ride the theme utility classes.
 *
 * Items are flat `{ icon, path, label }` — deliberately NOT kol-framework
 * SideNav's two-level navTree; different component, not a variant.
 *
 * Active state (user ruling 2026-08-12, carried natively in kol-theme):
 * ink `--kol-oq-96` in every state, hover = the `--kol-oq-04` wash, active
 * route = that wash held on via `aria-current="page"` — never
 * `selected`/`pressed`; navigation is location, not a toggled tool.
 */

function RailItem({ icon, path, label, active, onNavigate, iconComponent }) {
  return (
    <Button
      iconOnly={icon}
      iconSize={20}
      variant="nav"
      size="md"
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate?.(path)}
      title={label}
      iconComponent={iconComponent}
    />
  )
}

export default function NavRail({
  items = [],
  bottomItems = [],
  logomark,
  currentPath = '',
  onNavigate,
  iconComponent,
  themeToggle = true,
  hidden = false,
}) {
  if (hidden) return null
  const isActive = (path) =>
    path === '/' ? currentPath === '/' : currentPath.startsWith(path)

  return (
    <div className="kol-shell-rail bg-surface-tertiary border-r border-fg-04">
      {logomark && (
        <div
          onClick={() => onNavigate?.('/')}
          className="text-oq-96"
          style={{ cursor: 'pointer', marginBottom: 16, paddingTop: 4 }}
          title={logomark.title}
        >
          <Logomark svgUrl={logomark.svgUrl} size={20} />
        </div>
      )}
      {items.map((item) => (
        <RailItem
          key={item.path}
          {...item}
          active={isActive(item.path)}
          onNavigate={onNavigate}
          iconComponent={iconComponent}
        />
      ))}
      <div style={{ flex: 1 }} />
      {themeToggle && <ThemeToggle label={false} style={{ color: 'var(--kol-oq-96)' }} />}
      {bottomItems.map((item) => (
        <RailItem
          key={item.path}
          {...item}
          active={isActive(item.path)}
          onNavigate={onNavigate}
          iconComponent={iconComponent}
        />
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
