import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-component'
import RailSection from './RailSection.jsx'
import RailRow from './RailRow.jsx'

const getSectionRootPath = (route, basePath) => {
  if (route.path !== undefined && route.path !== null) {
    const p = route.path
    if (!p) return basePath
    return p.startsWith('/') ? p : `${basePath}/${p}`
  }
  if (route.children?.length > 0) {
    const cp = route.children[0].path
    if (!cp) return basePath
    return cp.startsWith('/') ? cp : `${basePath}/${cp}`
  }
  return basePath
}

const getChildPath = (child, basePath) => {
  const p = child.path
  if (p === undefined || p === null || p === '') return basePath
  return p.startsWith('/') ? p : `${basePath}/${p}`
}

export const RAIL_FOLD_EVENT = 'kol-rail-fold'

const ShellSidebar = ({ routes = [], basePath = '/', onNavigate, label = 'Navigation', labelTo, collapsed, onToggle, defaultCollapsed = false }) => {
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/$/, '')

  // Controlled mode: collapsed + onToggle from parent
  // Uncontrolled mode: internal state
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isControlled = collapsed !== undefined
  const navCollapsed = isControlled ? collapsed : internalCollapsed
  const handleToggle = isControlled ? onToggle : () => setInternalCollapsed(prev => !prev)

  /* THE RAIL FOLLOWS YOU — INTO A CHILD ONLY (2026-09-30, reversing the 2026-09-28 "open the
   * group you are in" on its landing page too). Landing on a page INSIDE a chapter opens that
   * chapter and folds the rest; a chapter's own home opens nothing. Every other chapter starts
   * folded — including ones this rail has never seen (a Group-by switch hands it new ids, and an
   * unknown id used to read as open, so every chapter sprang open). */
  const holdsPage = (route) => (route.children ?? []).some((c) => {
    const cp = getChildPath(c, basePath).replace(/\/$/, '')
    return normalizedPath === cp || normalizedPath.startsWith(cp + '/')
  })
  const followed = () => {
    const hit = routes.find(holdsPage)
    return hit ? Object.fromEntries(routes.map((r) => [r.id, r !== hit])) : null
  }
  const [collapsedSections, setCollapsedSections] = useState(() => followed() ?? {})
  useEffect(() => {
    const next = followed()
    if (next) setCollapsedSections(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedPath, routes, basePath])
  const isFolded = (route) => collapsedSections[route.id] ?? true

  /* FOLD ALL (2026-09-30, the names audit: *"shortcut collapse/expand the categories"*). The
   * shell's `C` key broadcasts one target state; every rail's chapters take it. */
  useEffect(() => {
    const onFold = (e) => setCollapsedSections(Object.fromEntries(routes.map((r) => [r.id, !!e.detail?.collapsed])))
    window.addEventListener(RAIL_FOLD_EVENT, onFold)
    return () => window.removeEventListener(RAIL_FOLD_EVENT, onFold)
  }, [routes])

  const handleSectionClick = (route) => {
    setCollapsedSections((prev) => ({ ...prev, [route.id]: !(prev[route.id] ?? true) }))
  }

  /* The L1 count is every leaf row under it — RailSection shows it only while
   * the section is folded (2026-09-28). */
  const leafCount = routes.reduce((n, r) => n + (r.children?.length ? r.children.length : 1), 0)
  return (
    /* One rail layout, one class (2026-08-01). This was `space-y-4` against the
     * right rail's `space-y-6` against the outer `flex flex-col gap-6` — three
     * spellings of the same stack, and `space-y` fights any child that owns a
     * margin, which the eyebrow box does. */
    <div className="shell-rail-stack-inner">
      <RailSection
        level={1}
        label={label}
        to={labelTo}
        count={leafCount}
        collapsed={navCollapsed}
        onToggle={handleToggle}
        onNavigate={onNavigate}
        icon={Icon}
      >
        <div className="shell-rail-stack-inner">
          {routes.map((route) => {
            /* A group with no children is not a group — it is a link. It used
             * to render as a header anyway: a chevron that rotated over an
             * empty body, no count, and no navigation, so clicking "Icons" or
             * "Components" in the tree did nothing at all while looking like
             * it should. `collapsible` is what that distinction is now. */
            const hasChildren = route.children?.length > 0

            /* A CHILDLESS ENTRY IS A ROW, not a chapter (2026-09-30): drawn at L2 it read as an
             * empty category with a blank caret slot. */
            if (!hasChildren) {
              return (
                <nav key={route.id} className="shell-nav-items">
                  <RailRow to={route.path ?? getSectionRootPath(route, basePath)} onNavigate={onNavigate}>
                    {route.label}
                  </RailRow>
                </nav>
              )
            }

            return (
              <div key={route.id} className="shell-nav-group">
                <RailSection
                  level={2}
                  label={route.label}
                  count={route.children.length}
                  /* THE HEADER ALWAYS LINKS (2026-08-02): the label opens the chapter's home,
                   * the chevron folds. */
                  to={route.path ?? getSectionRootPath(route, basePath)}
                  collapsed={isFolded(route)}
                  onToggle={() => handleSectionClick(route)}
                  onNavigate={onNavigate}
                  icon={Icon}
                >
                  <nav className="shell-nav-items">
                    {route.children.map((child) => (
                      <RailRow
                        key={child.id}
                        to={getChildPath(child, basePath)}
                        onNavigate={onNavigate}
                      >
                        {child.label}
                      </RailRow>
                    ))}
                  </nav>
                </RailSection>
              </div>
            )
          })}
        </div>
      </RailSection>
    </div>
  )
}

export default ShellSidebar
