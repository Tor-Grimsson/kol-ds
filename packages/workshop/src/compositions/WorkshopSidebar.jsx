import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShellSidebar } from '../shell'
import { Icon } from '@kolkrabbi/kol-component'
import {
  extractDocNumber,
  cleanTitle,
  categoryLabels,
  groupDocsByMajor,
} from '../engine'

/**
 * WorkshopSidebar — EXAMPLE composition. This is the app-specific glue that
 * wires the KOL shell + docs engine into a product's primary navigation.
 * Consumers copy this file and adapt it; it is intentionally decoupled from
 * any app singleton via props:
 *
 *   routes    — nav tree (was `WORKSHOP_ROUTES`): [{ id, label, path, children }]
 *   inventory — parsed docs (was `documentationInventory`): [{ id, title, ... }]
 *   basePath  — mount point of the workshop (drives active-route detection)
 *   docHref   — builds a doc URL: docHref(id) → doc page; docHref() → docs index.
 *               Assumes docs are mounted under `${basePath}/docs/`.
 */

const DocsSidebar = ({ inventory = [], docHref, basePath, onNavigate, collapsed, onToggle }) => {
  const location = useLocation()
  const activeDocId = useMemo(() => {
    const prefix = `${basePath}/docs/`
    if (!location.pathname.startsWith(prefix)) return null
    const rest = location.pathname.slice(prefix.length)
    return rest.length > 0 ? rest : null
  }, [location.pathname, basePath])

  const groupedDocs = useMemo(() => groupDocsByMajor(inventory), [inventory])

  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    const initialState = {}
    Object.keys(groupedDocs).forEach((major) => {
      initialState[major] = true
    })
    return initialState
  })

  // Auto-expand the group containing the active doc
  useEffect(() => {
    if (!activeDocId) return
    for (const [major, docs] of Object.entries(groupedDocs)) {
      if (docs.some(d => d.id === activeDocId)) {
        setCollapsedGroups(prev => ({ ...prev, [major]: false }))
        break
      }
    }
  }, [activeDocId, groupedDocs])

  const toggleGroup = (major) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [major]: !prev[major]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="shell-sidebar-toggle shell-sidebar-label" style={{ justifyContent: 'space-between', paddingRight: '4px' }}>
        <Link to={docHref()} className="shell-sidebar-label" onClick={(e) => {
          if (collapsed && onToggle) onToggle()
          if (onNavigate) onNavigate(e)
        }}>
          Documentation
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand Documentation' : 'Collapse Documentation'}
          className="flex items-center justify-center"
          style={{ height: '16.5px', marginBottom: '8px' }}
        >
          <Icon
            name="chevron-down"
            size={10}
            className={`stroke-[2.5] transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {!collapsed && <div className="space-y-4">
        {Object.entries(groupedDocs)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([major, docs]) => {
            const isCollapsed = collapsedGroups[major]
            return (
              <div key={major} className="shell-nav-group">
                <button
                  type="button"
                  className="shell-nav-group-header w-full text-left"
                  onClick={() => toggleGroup(major)}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      name="chevron-right"
                      size={12}
                      className={`h-3 w-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                    />
                    {categoryLabels[major] || 'Other'}
                  </span>
                  <span className="shell-nav-group-count">({docs.length})</span>
                </button>
                {!isCollapsed && (
                  <div className="shell-nav-items">
                    {docs.map((d) => {
                      const isActive = d.id === activeDocId
                      return (
                        <Link
                          key={d.id}
                          to={docHref(d.id)}
                          className={`shell-nav-item shell-nav-item-doc ${isActive ? 'active' : ''}`}
                          onClick={onNavigate}
                        >
                          <span className="shell-nav-item-title">{cleanTitle(d.title, d.id)}</span>
                          <span className="shell-nav-item-id">{extractDocNumber(d.id)}</span>
                        </Link>
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

const WorkshopSidebar = ({
  routes = [],
  inventory = [],
  basePath = '/workshop',
  docHref = (id) => (id ? `${basePath}/docs/${id}` : `${basePath}/docs`),
  onNavigate,
}) => {
  const location = useLocation()
  const [workshopCollapsed, setWorkshopCollapsed] = useState(false)
  const [docsCollapsed, setDocsCollapsed] = useState(true)

  // Auto-expand Documentation section when on a docs route
  useEffect(() => {
    if (location.pathname.startsWith(`${basePath}/docs`)) {
      setDocsCollapsed(false)
    }
  }, [location.pathname, basePath])

  const workshopRoutes = useMemo(
    () => routes.filter(r => r.id !== 'docs'),
    [routes]
  )

  return (
    <div className="space-y-6">
      <ShellSidebar
        routes={workshopRoutes}
        basePath={basePath}
        onNavigate={onNavigate}
        label="Workshop"
        labelTo={basePath}
        collapsed={workshopCollapsed}
        onToggle={() => setWorkshopCollapsed(p => !p)}
      />
      <DocsSidebar
        inventory={inventory}
        docHref={docHref}
        basePath={basePath}
        onNavigate={onNavigate}
        collapsed={docsCollapsed}
        onToggle={() => setDocsCollapsed(p => !p)}
      />
    </div>
  )
}

export default WorkshopSidebar
