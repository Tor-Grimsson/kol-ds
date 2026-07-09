import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-component'

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
      <div className="shell-sidebar-toggle shell-sidebar-label" style={{ justifyContent: 'space-between', paddingRight: '4px' }}>
        {labelTo ? (
          <Link to={labelTo} className="shell-sidebar-label kol-helper-10" onClick={(e) => {
            if (navCollapsed && handleToggle) handleToggle()
            if (onNavigate) onNavigate(e)
          }}>
            {label}
          </Link>
        ) : (
          <button type="button" className="kol-helper-10" onClick={handleToggle}>{label}</button>
        )}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={navCollapsed ? `Expand ${label}` : `Collapse ${label}`}
          className="flex items-center justify-center"
          style={{ height: '16.5px', marginBottom: '8px' }}
        >
          <Icon
            name="chevron-down"
            size={10}
            className={`stroke-[2.5] transition-transform ${navCollapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {!navCollapsed && <div className="space-y-4">
        {routes.map((route) => {
          const isExpanded = !collapsedSections[route.id]

          return (
            <div key={route.id} className="shell-nav-group">
              <button
                type="button"
                className="shell-nav-group-header w-full text-left kol-helper-12"
                onClick={() => handleSectionClick(route)}
              >
                <span className="flex items-center gap-2">
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  {route.label}
                </span>
                {route.children?.length > 0 && (
                  <span className="shell-nav-group-count kol-helper-10">({route.children.length})</span>
                )}
              </button>

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
                          `shell-nav-item${isActive ? ' active' : ''}`
                        }
                        onClick={onNavigate}
                      >
                        <span className="shell-nav-item-title kol-helper-12">{child.label}</span>
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
