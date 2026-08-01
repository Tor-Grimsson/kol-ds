import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShellSidebar, RailSection, RailRow } from '../shell'
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
      {/* L1 from RailSection — the same rung and the same box as every other
        * rail header. No count: the eyebrow names the material, the groups
        * inside carry the tally (user ruling 2026-08-01). */}
      <RailSection
        level={1}
        label="Documentation"
        to={docHref()}
        collapsed={collapsed}
        onToggle={onToggle}
        onNavigate={onNavigate}
      >
        <div className="space-y-4">
        {Object.entries(groupedDocs)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([major, docs]) => {
            const isCollapsed = collapsedGroups[major]
            return (
              <div key={major} className="shell-nav-group">
                <RailSection
                  level={2}
                  label={categoryLabels[major] || 'Other'}
                  count={docs.length}
                  collapsed={!!isCollapsed}
                  onToggle={() => toggleGroup(major)}
                  icon={Icon}
                >
                  <div className="shell-nav-items">
                    {docs.map((d) => (
                      <RailRow
                        key={d.id}
                        to={docHref(d.id)}
                        active={d.id === activeDocId}
                        trailing={extractDocNumber(d.id)}
                        onNavigate={onNavigate}
                      >
                        {cleanTitle(d.title, d.id)}
                      </RailRow>
                    ))}
                  </div>
                </RailSection>
              </div>
            )
          })}
        </div>
      </RailSection>
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
