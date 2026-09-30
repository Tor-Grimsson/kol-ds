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

  const [collapsedSections, setCollapsedSections] = useState(() => {
    const initial = {}
    routes.forEach((route) => {
      const sectionPath = getSectionRootPath(route, basePath)
      const isActive =
        sectionPath === basePath
          ? normalizedPath === basePath
          : normalizedPath === sectionPath || normalizedPath.startsWith(sectionPath + '/')
      initial[route.id] = !isActive
    })
    return initial
  })

  /* THE RAIL FOLLOWS YOU (2026-09-28, user: "the sidebar doesnt highlight that
   * part, which it probably should by closing/collapsing other categories").
   * Arriving in a group opens it AND folds its siblings, so the open group is
   * the one you are in. Opening another by hand still works until you move. */
  const isRouteActive = (route) => {
    const sectionPath = getSectionRootPath(route, basePath)
    const own = sectionPath === basePath
      ? normalizedPath === basePath
      : normalizedPath === sectionPath || normalizedPath.startsWith(sectionPath + '/')
    return own || (route.children ?? []).some((c) => {
      const cp = getChildPath(c, basePath).replace(/\/$/, '')
      return normalizedPath === cp || normalizedPath.startsWith(cp + '/')
    })
  }
  useEffect(() => {
    const active = routes.filter(isRouteActive)
    if (!active.length) return
    setCollapsedSections(Object.fromEntries(routes.map((r) => [r.id, !active.includes(r)])))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedPath, routes, basePath])

  /* FOLD ALL (2026-09-30, the names audit: *"shortcut collapse/expand the categories"*). The
   * shell's `C` key broadcasts one target state; every rail's chapters take it. */
  useEffect(() => {
    const onFold = (e) => setCollapsedSections(Object.fromEntries(routes.map((r) => [r.id, !!e.detail?.collapsed])))
    window.addEventListener(RAIL_FOLD_EVENT, onFold)
    return () => window.removeEventListener(RAIL_FOLD_EVENT, onFold)
  }, [routes])

  const handleSectionClick = (route) => {
    setCollapsedSections((prev) => ({ ...prev, [route.id]: !prev[route.id] }))
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

            return (
              <div key={route.id} className="shell-nav-group">
                <RailSection
                  level={2}
                  label={route.label}
                  count={hasChildren ? route.children.length : undefined}
                  /* THE HEADER ALWAYS LINKS (2026-08-02). It used to link only
                   * when the group had NO children, so a chapter with pages had
                   * a dead header and its index had to ride as a row inside
                   * itself. RailSection already separates the two gestures —
                   * the label navigates, the rest of the row toggles — so a
                   * group can open its landing page and still collapse. */
                  to={route.path ?? getSectionRootPath(route, basePath)}
                  collapsible={hasChildren}
                  collapsed={!!collapsedSections[route.id]}
                  onToggle={() => handleSectionClick(route)}
                  onNavigate={onNavigate}
                  icon={Icon}
                >
                  <nav className="shell-nav-items">
                    {(route.children ?? []).map((child) => (
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
