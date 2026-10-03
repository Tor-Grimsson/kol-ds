import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Icon, Tooltip } from '@kolkrabbi/kol-component'
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

/* THE RAIL'S THIRD STATE (user ruling 2026-10-02: *"I wanted that icon state on the rails. even if
 * we dont use it, I want to see it"*). Beside visible and hidden: `icons` — the rail is a narrow
 * strip, one glyph per group, and opens on hover. The column that holds the rail (`ShellNavColumn`)
 * provides the state; every ShellSidebar inside it reads it, so a consumer's rail takes the state
 * without passing a prop. Outside a provider a rail is `open`, as it always was. A third value,
 * `full`, is the whole-tree sheet's: an open rail with every fold open. */
export const ShellRailModeContext = createContext('open')

const ShellSidebar = ({ routes = [], basePath = '/', onNavigate, label = 'Navigation', labelTo, collapsed, onToggle, defaultCollapsed = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = useContext(ShellRailModeContext)
  const normalizedPath = location.pathname.replace(/\/$/, '')

  // Controlled mode: collapsed + onToggle from parent
  // Uncontrolled mode: internal state
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isControlled = collapsed !== undefined
  const navCollapsed = isControlled ? collapsed : internalCollapsed
  const handleToggle = isControlled ? onToggle : () => setInternalCollapsed(prev => !prev)

  /* THE RAIL FOLLOWS YOU — INTO A CHILD ONLY (2026-09-30, reversing the 2026-09-28 "open the
   * group you are in" on its landing page too). Landing on a page INSIDE a chapter opens that
   * chapter and folds the rest; a chapter's own home leaves that chapter's fold alone (2026-10-02,
   * see `chainTo`). Every other chapter starts
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
      /* A GROUP'S OWN HOME LEAVES ITS FOLD AS IT WAS (user 2026-10-02, said many times: *"just
       * clicking a title opens the home, if I want to expand then I fucking click the expand
       * chevron"*). The 2026-10-01 reading opened the group on its own home, so a title click
       * expanded its children; the 2026-09-30 one folded it. Neither: the way down to it opens,
       * the group itself stays as the chevron left it — open stays open, folded stays folded.
       * Checked BEFORE the children: a vault chapter's home is also its `About` row, and reading
       * that as "a child is here" opened every Docs chapter on a title click.
       * `validate:rail-pages` P5 holds it. */
      if (r.path && getChildPath(r, basePath).replace(/\/$/, '') === normalizedPath) return { open: trail, keep: r.id }
      if (r.children.some(isHere)) return { open: [...trail, r] }
    }
    return null
  }
  const followed = (prev = {}) => {
    const at = chainTo(routes)
    if (!at) return null
    const open = new Set(at.open.map((g) => g.id))
    return Object.fromEntries(groupsOf(routes).map((g) => [g.id, g.id === at.keep ? (prev[g.id] ?? true) : !open.has(g.id)]))
  }
  const [collapsedSections, setCollapsedSections] = useState(() => followed() ?? {})
  useEffect(() => {
    setCollapsedSections((prev) => followed(prev) ?? prev)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedPath, routes, basePath])
  /* `full` — the whole-tree sheet (`T`, 2026-10-02): every fold open, nothing to follow */
  const isFolded = (route) => (mode === 'full' ? false : collapsedSections[route.id] ?? true)

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
  /* A PAGE THAT LISTS ITS SECTIONS IS STILL ONE PAGE (2026-10-01): `section: true` children are
   * `#` anchors on their parent's page, not leaves of the tree. */
  const isPage = (r) => !r.children?.length || r.children.every((c) => c.section)
  const leavesOf = (list) => list.reduce((n, r) => n + (isPage(r) ? 1 : leavesOf(r.children)), 0)
  const leafCount = leavesOf(routes)

  /* ONE GROUP, AT ANY DEPTH. A chapter's child with children of its own is a chapter again — the
   * same RailSection rung, the same count and chevron, stepped in one row-indent by `.shell-nav-nest`
   * so its caret sits on its siblings' text edge. A leaf is a RailRow wherever it lands. */
  /* A ROUTE MAY CARRY A GLYPH (rail icons, open-questions Round 6, ruled 2026-10-01): `icon` is an
   * icon name, drawn on the row or beside the group's label. The consumer decides which routes. */
  const glyphOf = (route) => (route.icon ? <Icon name={route.icon} size={14} className="shrink-0" /> : undefined)
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
      glyph={glyphOf(route)}
    >
      {/* a group that wears a glyph steps its children in by the glyph (14 + the 8 gap), so they
        * still hang under its LABEL — without it they sat left of the word they belong to */}
      <nav className={`shell-nav-items ${route.icon ? 'pl-[22px]' : ''}`.trim()}>
        {route.children.map((child) => (child.children?.length ? (
          <div key={child.id} className="shell-nav-nest">{renderGroup(child)}</div>
        ) : (
          <RailRow key={child.id} to={getChildPath(child, basePath)} onNavigate={onNavigate}
            icon={glyphOf(child)}
            active={child.section ? `${location.pathname}${location.hash}` === child.path : undefined}>
            {child.label}
          </RailRow>
        )))}
      </nav>
    </RailSection>
  )
  /* ICONS ONLY — one glyph per group (a group's own, else the folder; a page's, else the file), no
   * eyebrow, no rows. The DS nav button on the control ladder's `md` rung, the same rung the header
   * glyphs stand on; the group you are in holds the rail's active wash (`.shell-rail-icons`). */
  if (mode === 'icons') {
    const holds = (r) => isHere(r) || (r.children ?? []).some(holds)
    return (
      <nav className="shell-rail-icons" aria-label={label ?? undefined}>
        {routes.map((route) => (
          <Tooltip key={route.id} label={route.label} placement="right">
            <Button variant="nav" size="md" iconOnly={route.icon ?? (route.children?.length ? 'folder' : 'file')}
              aria-label={route.label} aria-current={holds(route) ? 'page' : undefined}
              onClick={(e) => { navigate(getSectionRootPath(route, basePath)); onNavigate?.(e) }} />
          </Tooltip>
        ))}
      </nav>
    )
  }

  /* `label={null}` draws the tree with no L1 section over it (2026-10-01) — a space whose rail is
   * its pages, not a category of them (Search: user ruling, the space does not list itself). */
  const body = (
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
            <RailRow key={route.id} to={route.path ?? getSectionRootPath(route, basePath)} onNavigate={onNavigate} icon={glyphOf(route)}>
              {route.label}
            </RailRow>
          ))}
        </nav>
      )))}
    </div>
  )
  return (
    /* One rail layout, one class (2026-08-01). This was `space-y-4` against the
     * right rail's `space-y-6` against the outer `flex flex-col gap-6` — three
     * spellings of the same stack, and `space-y` fights any child that owns a
     * margin, which the eyebrow box does. */
    <div className="shell-rail-stack-inner">
      {label === null ? body : (
        <RailSection
          level={1}
          label={label}
          to={labelTo}
          count={leafCount}
          collapsed={mode === 'full' ? false : navCollapsed}
          onToggle={handleToggle}
          onNavigate={onNavigate}
          icon={Icon}
        >
          {body}
        </RailSection>
      )}
    </div>
  )
}

export default ShellSidebar
