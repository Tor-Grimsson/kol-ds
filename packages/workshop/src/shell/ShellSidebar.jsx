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
   * unknown id used to read as open, so every chapter sprang open).
   *
   * ANY DEPTH (2026-09-30, the showcase review W1 — user: Library › Composition › Components ›
   * Atoms › Button). A chapter may hold chapters; every group at every depth is a fold of its own,
   * and the chain down to where you are opens and everything off it folds. */
  const isHere = (route) => {
    /* a pathless group is not a place — without this its basePath fallback matched every URL */
    if (!route.path) return false
    const cp = getChildPath(route, basePath).replace(/\/$/, '')
    return normalizedPath === cp || normalizedPath.startsWith(cp + '/')
  }
  const groupsOf = (list) => list.flatMap((r) => (r.children?.length ? [r, ...groupsOf(r.children)] : []))
  /* ONE PLACE YOU ARE (W4, 2026-09-30). A page can sit in more than one group — Button is an
   * atom AND a member of every set that uses it — and opening every group that holds it would
   * unfold half the rail. The first place in tree order wins: its chain opens, the rest fold. */
  const chainTo = (list, trail = []) => {
    for (const r of list) {
      if (!r.children?.length) continue
      /* deepest first: `/sets` holds `/sets/app-shell` by prefix, but the set's own row is the place */
      const deeper = chainTo(r.children, [...trail, r])
      if (deeper) return deeper
      if (r.children.some(isHere)) return [...trail, r]
    }
    return null
  }
  const followed = () => {
    const chain = chainTo(routes)
    if (!chain) return null
    const open = new Set(chain.map((g) => g.id))
    return Object.fromEntries(groupsOf(routes).map((g) => [g.id, !open.has(g.id)]))
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
    const onFold = (e) => setCollapsedSections(Object.fromEntries(groupsOf(routes).map((r) => [r.id, !!e.detail?.collapsed])))
    window.addEventListener(RAIL_FOLD_EVENT, onFold)
    return () => window.removeEventListener(RAIL_FOLD_EVENT, onFold)
  }, [routes])

  const handleSectionClick = (route) => {
    setCollapsedSections((prev) => ({ ...prev, [route.id]: !(prev[route.id] ?? true) }))
  }

  /* The L1 count is every leaf row under it — RailSection shows it only while
   * the section is folded (2026-09-28). At any depth: leaves, not groups. */
  const leavesOf = (list) => list.reduce((n, r) => n + (r.children?.length ? leavesOf(r.children) : 1), 0)
  const leafCount = leavesOf(routes)

  /* ONE GROUP, AT ANY DEPTH. A chapter's child with children of its own is a chapter again — the
   * same RailSection rung, the same count and chevron, stepped in one row-indent by `.shell-nav-nest`
   * so its caret sits on its siblings' text edge. A leaf is a RailRow wherever it lands. */
  const renderGroup = (route) => (
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
        {route.children.map((child) => (child.children?.length ? (
          <div key={child.id} className="shell-nav-nest">{renderGroup(child)}</div>
        ) : (
          <RailRow key={child.id} to={getChildPath(child, basePath)} onNavigate={onNavigate}>
            {child.label}
          </RailRow>
        )))}
      </nav>
    </RailSection>
  )
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
          {/* LOOSE ROWS SHARE ONE LIST (the showcase review W12, 2026-09-30 — user: "the spaces are
            * incorrect in the left sidebar"). Each childless entry rendered its own <nav>, and the
            * stack's 16px gap landed between every pair, so a rail of four rows (Search) read 46px
            * apart instead of a list's 26. Consecutive rows are one run now; a chapter breaks it. */}
          {routes.reduce((runs, route) => {
            const last = runs[runs.length - 1]
            if (!route.children?.length && last && !last.group) last.rows.push(route)
            else runs.push(route.children?.length ? { group: route } : { rows: [route] })
            return runs
          }, []).map((run) => (run.group ? (
            <div key={run.group.id} className="shell-nav-group">
              {renderGroup(run.group)}
            </div>
          ) : (
            /* A CHILDLESS ENTRY IS A ROW, not a chapter (2026-09-30): drawn at L2 it read as an
             * empty category with a blank caret slot. */
            <nav key={run.rows[0].id} className="shell-nav-items">
              {run.rows.map((route) => (
                <RailRow key={route.id} to={route.path ?? getSectionRootPath(route, basePath)} onNavigate={onNavigate}>
                  {route.label}
                </RailRow>
              ))}
            </nav>
          )))}
        </div>
      </RailSection>
    </div>
  )
}

export default ShellSidebar
