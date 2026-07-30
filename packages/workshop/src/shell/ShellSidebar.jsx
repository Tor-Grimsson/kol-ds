import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Icon, Tooltip } from '@kolkrabbi/kol-component'

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

  return (
    <div className="space-y-4">
      {/* kol-helper-10 types the wrapper box itself (was an untyped 16px box) */}
      <div className="shell-sidebar-toggle shell-sidebar-label kol-doc-eyebrow" style={{ justifyContent: 'space-between', paddingRight: '4px' }}>
        {labelTo ? (
          <Link to={labelTo} className="shell-sidebar-label kol-doc-eyebrow" onClick={(e) => {
            if (navCollapsed && handleToggle) handleToggle()
            if (onNavigate) onNavigate(e)
          }}>
            {label}
          </Link>
        ) : (
          /* Same voice as the labelTo branch. This read `kol-helper-10
           * text-meta`, so the one rail mounted without a labelTo (the vault's
           * "Documentation") rendered its label at a different size and colour
           * from its two siblings — a type fork caused purely by which props
           * the consumer happened to pass. */
          <button type="button" className="shell-sidebar-label kol-doc-eyebrow" onClick={handleToggle}>{label}</button>
        )}
        <Tooltip label={navCollapsed ? `Expand ${label}` : `Collapse ${label}`}>
          <button
            type="button"
            onClick={handleToggle}
            aria-label={navCollapsed ? `Expand ${label}` : `Collapse ${label}`}
            aria-expanded={!navCollapsed}
            className="flex items-center justify-center"
            style={{ height: '16.5px', marginBottom: '8px' }}
          >
            <Icon
              name="chevron-down"
              size={10}
              className={`stroke-[2.5] transition-transform ${navCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </Tooltip>
      </div>

      {!navCollapsed && <div className="space-y-4">
        {routes.map((route) => {
          const isExpanded = !collapsedSections[route.id]

          /* A group with no children is not a group — it is a link. It used to
           * render as a header anyway: a chevron that rotated over an empty
           * body, no count, and no navigation, so clicking "Icons" or
           * "Components" in the tree did nothing at all while looking like it
           * should. Now the chevron and the toggle only appear when there is
           * something to expand, and a childless row goes where it says. */
          const hasChildren = route.children?.length > 0
          const headerClass = 'shell-nav-group-header w-full text-left kol-mono-14 text-body'

          return (
            <div key={route.id} className="shell-nav-group">
              {hasChildren ? (
                <button
                  type="button"
                  className={headerClass}
                  onClick={() => handleSectionClick(route)}
                  aria-expanded={isExpanded}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      name="chevron-right"
                      size={12}
                      className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                    {route.label}
                  </span>
                  <span className="kol-mono-14 text-subtle">({route.children.length})</span>
                </button>
              ) : (
                <Link
                  to={getSectionRootPath(route, basePath)}
                  className={headerClass}
                  onClick={onNavigate}
                >
                  {/* aligned with the expandable rows' label column — the
                    * chevron's width, kept as space so the two kinds of row
                    * share a left edge */}
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" style={{ width: 12 }} />
                    {route.label}
                  </span>
                </Link>
              )}

              {isExpanded && route.children?.length > 0 && (
                <div className="shell-nav-items">
                  {route.children.map((child) => {
                    const childPath = getChildPath(child, basePath)
                    return (
                      <NavLink
                        key={child.id}
                        to={childPath}
                        end
                        className={({ isActive }) =>
                          `shell-nav-item kol-mono-14 ${isActive ? 'text-emphasis' : 'text-body'}`
                        }
                        onClick={onNavigate}
                      >
                        <span className="shell-nav-item-title">{child.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default ShellSidebar
