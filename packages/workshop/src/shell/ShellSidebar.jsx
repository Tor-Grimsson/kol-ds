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

const ShellSidebar = ({ routes = [], basePath = '/', onNavigate, label = 'Navigation', labelTo, collapsed, onToggle }) => {
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/$/, '')

  // Controlled mode: collapsed + onToggle from parent
  // Uncontrolled mode: internal state
  const [internalCollapsed, setInternalCollapsed] = useState(false)
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

  useEffect(() => {
    routes.forEach((route) => {
      const sectionPath = getSectionRootPath(route, basePath)
      const isActive =
        sectionPath === basePath
          ? normalizedPath === basePath
          : normalizedPath === sectionPath || normalizedPath.startsWith(sectionPath + '/')
      if (isActive) {
        setCollapsedSections((prev) => ({ ...prev, [route.id]: false }))
      }
    })
  }, [normalizedPath, routes, basePath])

  const handleSectionClick = (route) => {
    setCollapsedSections((prev) => ({ ...prev, [route.id]: !prev[route.id] }))
  }

  /* No count at L1 — the eyebrow names a body of material and the tally lives
   * on the groups inside it (user ruling 2026-08-01). RailSection refuses one
   * at this rung, so there is nothing to compute here. */
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
        collapsed={navCollapsed}
        onToggle={handleToggle}
        onNavigate={onNavigate}
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
