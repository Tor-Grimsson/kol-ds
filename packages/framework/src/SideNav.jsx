import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { Tooltip } from '@kolkrabbi/kol-component'
import ThemeToggle from './ThemeToggle'
import { useDragResize } from '@kolkrabbi/kol-component'

/**
 * SideNav — the grouped navigation rail.
 *
 * REPLICATED from the elder reference (kol-website/apps/brand
 * src/components/framework/SideNav.jsx, 2026-08-09 user mandate: "there is a
 * better version in kol-website apps:brand") — the brand app's evolved fork
 * folded back into the package, generic seams kept.
 *
 * A category is a grouping LABEL — a disclosure <button> with a trailing
 * caret, no route. A page is a route. The ONE exception: a category with `to`
 * and no `pages` (Home) renders as a plain link row — it has nothing to
 * disclose.
 *
 * The 2026-08-01 "TWO LEVELS ONLY" ruling was the BRAND APP's, about its
 * scroll-spied `#anchor` section layer — that layer stays dead (an `{ id }`
 * leaf is dropped). It was inscribed here as a law for every consumer, and
 * kol-studio lost two groups and six routes from its rail on adopting 0.23.0.
 * User, 2026-08-26, verbatim: "ok that is such a problem, sometimes Im
 * talking about a specific thing and it gets applied as a literal fit-all
 * rule, which isnt the case. its very hard to work in such uncertainty."
 * Re-scoped (sidenav-nested-groups, 0.24.0): nested ROUTE groups are
 * supported. A `{ label, children }` node inside a category renders as a
 * non-routing group header with its rows indented one step under it,
 * recursively. The tree shape is the opt-in — there is no prop — and a tree
 * with no group nodes renders byte-for-byte as before.
 *
 * navTree: [{ id, label, icon, to?, pages?: [{ label, to } | { label, children }] }]
 * (legacy `children` on a category is read as `pages`; section anchors are not.)
 *
 * WORKSPACE RAILS (WorkspaceSidebarGeometry, kol-fxr 2026-08-27 — user: "I see
 * these 3 as very similar things … I would rather all use the same geometry
 * layout"; three forks, ~1,370 lines, wearing this component's classes):
 *
 *   ACTION LEAVES — `{ label, onSelect, active? }` beside `{ label, to }`, at
 *   any depth and as a category (`{ id, label, icon, onSelect, active? }`): a
 *   rail that DISPATCHES (labs swaps an effect, monitor picks a module, mirror
 *   selects a surface) instead of navigating. A <button>, lit by `active`;
 *   never a route, so no history is walked (labs' `?preset=` replace-not-push
 *   stays what it is).
 *
 *   ROUTER-AGNOSTIC — pass `currentPath` and the component never touches
 *   react-router: route leaves render `<a href>` and call `onNavigate(event,
 *   to)` (kol-shell's contract); a router-free app can mount it. Without
 *   `currentPath` it is the NavLink rail it always was.
 *
 *   THE COLLAPSE RULE — a row that can survive collapse HAS AN ICON; one that
 *   cannot is not a row, it is a LABEL. A top-level node with no `icon` (and no
 *   `to` / `onSelect`) renders `.kol-sidenav-section` — the eyebrow voice, hidden
 *   on collapse — over its `pages`; the icon rows beneath stay, so the rail
 *   reads as one thing narrowing, the brand sidebar's model.
 *
 * Collapse: the pill-marked grab edge is THE single control (user build
 * order 2026-08-09, completing SideNavGrabResize — the chip Button is gone
 * in both states). Click toggles expand↔collapse, drag resizes with
 * snap-collapse and snap-to-default, keyboard on the separator: arrows /
 * Home / Enter / Space. One contract: `:root[data-sidenav="collapsed"]` +
 * the `kol-sidenav` storage schema, owned by useDragResize. Collapsed rows
 * get a DS Tooltip — the glyph is otherwise the only thing naming them.
 *
 * THE SHELL RAIL IS THIS COMPONENT (RailSideNavPixelParity, kol-fxr 2026-08-28
 * — user, on the brand sidebar's drag: "same component both states super
 * nice"): kol-shell's `AppShell` mounts a SideNav — collapsed by default, the
 * drag opens it — so an app rail and the brand sidebar are one geometry to the
 * pixel (fxr measured 48 vs 56 wide, 20 vs 16px glyphs, 40 vs 38 pitch, first
 * glyph at y 76 vs 26 between the old NavRail and this rail collapsed). The
 * seams the shell needed, all opt-in, a tree with none of them renders as before:
 *   `header`           a node ABOVE the tree, outside the scroll region, in the
 *                      hop's geometry (`.kol-sidenav-header`, kol-framework.css)
 *                      — the app's logomark (RailLogomarkAtTop, 2026-08-28 —
 *                      user: "why did you move the logo from top to bottom?").
 *                      Give it a `.kol-sidenav-hop-icon` span (20px mark on the
 *                      icon column) and, optionally, a `.kol-sidenav-hop-label`;
 *                      both follow the collapse. Same node in every consumer =
 *                      the first tree glyph at one y — the parity contract
 *   PANEL LEAF        `{ id, label, icon, panel }` — a top-level node (tree or
 *                      `bottomItems`) whose row is a DISCLOSURE: click opens,
 *                      click again closes, lit while open (RailSettingsDisclosure,
 *                      kol-fxr 2026-08-28 — user: "sidebar setting should open
 *                      close on click and click again" · "put the theme toggle in
 *                      the settings and out of the sidebar"). `panel` is a node or
 *                      `({ collapsed, close }) => node`, PORTALLED to <body>
 *                      directly above the row at the rail's own width (left/width
 *                      from the aside, bottom = viewport − the row's top,
 *                      `--kol-z-tooltip`), so it works collapsed (icon column)
 *                      and expanded (rows) alike. Escape closes; any navigation
 *                      or dispatch closes. fxr's RailSettings.jsx, promoted.
 *   `bottomItems`      top-level nodes pinned BELOW the theme slot, above the
 *                      footer (the shell pins theme → Settings; a Settings row in
 *                      the tree landed above the theme instead — "same rail, two
 *                      bottoms")
 *   `footer`           the footer box's content: undefined = the Kolkrabbi link
 *                      (K / wordmark, as ever); `false` = no footer; a node =
 *                      that node (the shell's logomark → '/')
 *   `themeToggle`      `false` drops the theme slot (default `true`)
 *   `iconComponent`    the hop glyph's renderer, kol-shell's seam — `(props:
 *                      { name, size }) => element`; default the DS `Icon`
 *   `expandOnSelect`   `false` keeps the rail collapsed when a row navigates or
 *                      dispatches — an app rail stays a rail. Default `true`, the
 *                      brand ruling ("pressing any icon would expand the sidebar")
 *   `defaultCollapsed` boots collapsed when nothing is stored (useDragResize)
 * `background` (2026-08-09, prop): `true` (default) paints the rail surface;
 * `false` renders chromeless so the rail can float over a consumer's media
 * (the brand-hero model — the consumer owns the plane). `hairline` (2026-08-26,
 * default `false`) paints the right-edge `border-r border-fg-08` — split out
 * of `background` so the line is a choice of its own.
 */

const pageBase =
  'kol-sidenav-link kol-helper-10 block relative py-[4px] pl-14 pr-6 no-underline transition-colors duration-150'

/* The active-dot pseudo-element is positioned by `--kol-sidenav-dot-left`
 * (kol-components-atoms.css). The page row indents 3.5rem (pl-14); the dot
 * sits 0.875rem inside that, in the gutter the icon column leaves. */
const pageStyle = { '--kol-sidenav-dot-left': '2.625rem' }
/* Category and page must not share a stop: category `emphasis`, page `strong`
 * — two rungs of one ladder, so the tree reads as hierarchy (elder ruling). */
const pageCls = `${pageBase} text-strong hover:text-emphasis`
const pageActiveCls = `${pageBase} is-active`

/* A category's rows: route leaves (`to`) and route groups (`children`).
 * `#anchor` leaves (`id` only) are dropped — that layer died with the brand
 * app's 2026-08-01 ruling and is not reopened here. */
const rowsOf = (nodes) => nodes.filter((c) => c.to || c.children || c.onSelect)
const pagesOf = (cat) => rowsOf(cat.pages ?? cat.children ?? [])
/* Every route leaf under a set of rows, through any depth of groups. */
const leavesOf = (rows) => rows.flatMap((r) => (r.children ? leavesOf(rowsOf(r.children)) : [r]))
/* A nested row sits one --kol-spacing-3 step further in per depth. Inline,
 * not a rule: `pl-14` rides the leaf as a utility and outranks anything in
 * this layer. Depth 0 carries no indent so a flat tree renders unchanged. */
const indentOf = (depth) => `calc(3.5rem + ${depth} * var(--kol-spacing-3))`

/* Router-agnostic seam: with `currentPath` the rail never calls react-router
 * (a hook cannot be conditional, so the router read lives in its own wrapper
 * that mounts only when the prop is absent). */
export default function SideNav(props) {
  if (props.currentPath != null) return <SideNavInner {...props} pathname={props.currentPath} router={false} />
  return <RouterSideNav {...props} />
}
function RouterSideNav(props) {
  const { pathname } = useLocation()
  return <SideNavInner {...props} pathname={pathname} router />
}

function SideNavInner({
  pathname,
  router,
  drawerOpen = false,
  onCloseDrawer,
  navTree = [],
  onNavigate,
  isActive,
  background = true,
  /* the right-edge hairline is OPT-IN (sidenav-rail-hairline, kol-studio
   * 2026-08-26 — user: the footer's border-t is right, the border-r is wrong
   * as a default). It used to ride `background` — two decisions under one
   * name; a rail floating over media and a rail without a line are different
   * choices. */
  hairline = false,
  header,
  bottomItems = [],
  footer,
  themeToggle = true,
  iconComponent,
  expandOnSelect = true,
  defaultCollapsed = false,
}) {
  const Glyph = iconComponent ?? Icon
  const isPageActive = (to) => (isActive ? isActive(to) : pathname === to)
  /* a leaf is lit by its route, or — an action leaf — by its own `active` */
  const isLeafActive = (leaf) => (leaf.onSelect ? !!leaf.active : isPageActive(leaf.to))
  const isActiveCat = (cat) => (cat.onSelect ? !!cat.active : leavesOf(pagesOf(cat)).some(isLeafActive))

  /* Every navigation closes the mobile drawer — the prop sat accepted-but-
   * unread until the kol-website session flagged it (2026-08-09) — and, from
   * the collapsed rail, expands the sidebar ("pressing any icon would expand
   * the sidebar", same ruling as the chip removal). */
  const handleNavigate = (e, to) => {
    onNavigate?.(e, to)
    onCloseDrawer?.()
    setOpenPanel(null)
    if (collapsed && expandOnSelect) toggleCollapsed()
  }
  /* an action leaf dispatches — same drawer / rail behaviour as a navigation */
  const handleSelect = (e, row) => {
    row.onSelect(e)
    onCloseDrawer?.()
    setOpenPanel(null)
    if (collapsed && expandOnSelect) toggleCollapsed()
  }
  /* the route leaf: NavLink under a router, `<a href>` on the agnostic seam */
  const RouteLeaf = ({ to, className, style, children }) => router ? (
    <NavLink to={to} end style={style} className={({ isActive: navActive }) => className(isActive ? isActive(to) : navActive)} onClick={(e) => handleNavigate(e, to)}>{children}</NavLink>
  ) : (
    <a href={to} style={style} className={className(isPageActive(to))} onClick={(e) => { e.preventDefault(); handleNavigate(e, to) }}>{children}</a>
  )

  /* Which categories are disclosed. INDEPENDENT per category (elder ruling
   * 2026-08-01) — arriving somewhere must not silently close wherever you
   * were. Loads closed, in-memory only (elder ruling 2026-08-06). */
  const [openCats, setOpenCats] = useState(() => new Set())
  /* the ONE open panel leaf (by id) and where its panel sits */
  const [openPanel, setOpenPanel] = useState(null)
  const [panelBox, setPanelBox] = useState(null)
  const toggleCat = (id) => setOpenCats((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const discloseCat = (id) => setOpenCats((prev) => new Set(prev).add(id))

  /* One collapse contract, two gestures — the hook owns the stamp, the
   * storage schema and the state; the chip Button and the grab edge both
   * drive it. */
  const asideRef = useRef(null)
  const { collapsed, toggleCollapsed, grabProps } = useDragResize(asideRef, { defaultCollapsed })

  /* the panel's anchor: its row — the panel's bottom edge meets the row's top
   * edge, its width is the rail's; re-placed on resize and on collapse */
  useLayoutEffect(() => {
    if (!openPanel) { setPanelBox(null); return undefined }
    const place = () => {
      const rail = asideRef.current
      const row = rail?.querySelector(`[data-panel-trigger="${CSS.escape(String(openPanel))}"]`)
      if (!rail || !row) return
      const rr = rail.getBoundingClientRect(), tr = row.getBoundingClientRect()
      setPanelBox({ left: rr.left, width: rr.width, bottom: window.innerHeight - tr.top })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [openPanel, collapsed])
  useEffect(() => {
    if (!openPanel) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpenPanel(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openPanel])
  const panelNode = openPanel != null ? [...navTree, ...bottomItems].find((c) => c.id === openPanel) : null

  /* Rows under a category: a leaf is a NavLink; a group is a non-routing
   * header over its own rows, one step further in (recursive). A group lights
   * up the way a category does — when one of its leaves is the current route. */
  const renderRows = (rows, depth) => rows.map((row, i) => {
    if (row.children) {
      const lit = leavesOf(rowsOf(row.children)).some(isLeafActive)
      return (
        <li key={row.id ?? `${row.label}-${i}`}>
          <div
            className={`kol-sidenav-group kol-helper-10${lit ? ' text-emphasis' : ' text-subtle'}`}
            style={depth ? { paddingLeft: indentOf(depth) } : undefined}
          >
            {row.label}
          </div>
          <ul className="kol-sidenav-list">{renderRows(rowsOf(row.children), depth + 1)}</ul>
        </li>
      )
    }
    /* the dot keeps its 0.875rem lead on the text at every depth */
    const leafStyle = depth ? { paddingLeft: indentOf(depth), '--kol-sidenav-dot-left': `calc(2.625rem + ${depth} * var(--kol-spacing-3))` } : pageStyle
    if (row.onSelect) {
      return (
        <li key={row.id ?? `${row.label}-${i}`}>
          <button
            type="button"
            style={leafStyle}
            className={`${row.active ? pageActiveCls : pageCls} w-full bg-transparent border-0 cursor-pointer text-left truncate`}
            aria-pressed={!!row.active}
            onClick={(e) => handleSelect(e, row)}
          >
            {row.label}
          </button>
        </li>
      )
    }
    return (
      <li key={row.to}>
        <RouteLeaf to={row.to} style={leafStyle} className={(active) => (active ? pageActiveCls : pageCls)}>
          {row.label}
        </RouteLeaf>
      </li>
    )
  })

  /* one renderer for the tree and the pinned rows (RailSideNavPixelParity) */
  const renderCat = (cat, ci) => {
              const pages = pagesOf(cat)
              const isOpen = openCats.has(cat.id)
              const isLink = !pages.length && cat.to
              const isPanel = !pages.length && !cat.to && !!cat.panel
              const isAction = !pages.length && !cat.to && !isPanel && cat.onSelect
              /* THE COLLAPSE RULE: no icon, no route, no action = a LABEL over
               * its rows, not a row — `.kol-sidenav-section` hides on collapse
               * and the icon rows beneath it stay */
              if (!cat.icon && !cat.to && !cat.onSelect && !cat.panel) {
                return (
                  <li key={cat.id ?? `${cat.label}-${ci}`} className="relative">
                    <div className="kol-sidenav-section kol-eyebrow text-strong">{cat.label}</div>
                    {pages.length > 0 && <ul className="kol-sidenav-list">{renderRows(pages, 0)}</ul>}
                  </li>
                )
              }
              /* Box utilities deliberately absent — the hop's layout lives in
               * .kol-sidenav-hop (kol-framework.css): a utility here would
               * outrank the collapsed-state overrides (2026-08-09 defect). */
              const rowCls = 'kol-sidenav-hop kol-helper-12 text-emphasis no-underline'
              const glyph = (
                <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true">
                  <Glyph name={cat.icon} size={16} />
                </span>
              )
              /* A category is a <button>, not a link — it has no route by
                 definition, and an <a href> would promise a page that does
                 not exist. Clicking it discloses its pages. */
              const head = isLink ? (
                <RouteLeaf to={cat.to} className={(active) => `${rowCls}${active ? ' is-active' : ''}`}>
                  {glyph}
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{cat.label}</span>
                </RouteLeaf>
              ) : isPanel ? (
                <button
                  type="button"
                  data-panel-trigger={cat.id}
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${openPanel === cat.id ? ' is-active' : ''}`}
                  aria-expanded={openPanel === cat.id}
                  onClick={() => setOpenPanel((o) => (o === cat.id ? null : cat.id))}
                >
                  {glyph}
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{cat.label}</span>
                </button>
              ) : isAction ? (
                <button
                  type="button"
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${cat.active ? ' is-active' : ''}`}
                  aria-pressed={!!cat.active}
                  onClick={(e) => handleSelect(e, cat)}
                >
                  {glyph}
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{cat.label}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${isActiveCat(cat) ? ' is-active' : ''}`}
                  aria-expanded={isOpen}
                  /* Collapsed rail: the click meant "open this" — expand the
                   * rail AND disclose the category, or the tap is wasted on
                   * an expand that lands on a closed tree. */
                  onClick={() => {
                    if (collapsed) {
                      toggleCollapsed()
                      discloseCat(cat.id)
                    } else {
                      toggleCat(cat.id)
                    }
                  }}
                >
                  {glyph}
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{cat.label}</span>
                  {/* plain wrapper span — Icon stamps inline-flex on its own
                    * element, which would outrank the rail's display:none */}
                  <span
                    className={`kol-sidenav-hop-caret transition-transform duration-150${isOpen ? '' : ' -rotate-90'}`}
                    aria-hidden="true"
                  >
                    <Icon name="chevron-down" size={12} />
                  </span>
                </button>
              )
              return (
                <li key={cat.id} className="relative">
                  {/* Collapsed rail hides the label — the tooltip is the only
                      thing naming the row. Portalled, so overflow can't clip it. */}
                  {collapsed ? (
                    <Tooltip label={cat.label} placement="right" triggerClassName="block">
                      {head}
                    </Tooltip>
                  ) : head}

                  {!isLink && !isAction && !isPanel && isOpen && (
                    <ul className="kol-sidenav-list">{renderRows(pages, 0)}</ul>
                  )}
                </li>
              )
  }

  return (
    <aside
      ref={asideRef}
      /* Box utilities deliberately absent (SideNavMobilePosition, 2026-08-25):
       * the aside's position/height/stack live in .kol-sidenav
       * (kol-framework.css). `sticky … h-dvh z-20` here outranked the 767px
       * drawer rule's `position: fixed`, so every consumer page opened one
       * viewport down on phones. Only colour utilities ride the element. */
      className={`kol-sidenav${background ? ' bg-surface-primary' : ''}${hairline ? ' border-r border-fg-08' : ''}${collapsed ? ' is-collapsed' : ''}${drawerOpen ? ' is-drawer-open' : ''}`}
    >
      {/* NO chip Button in either state (user build order 2026-08-09 — "MAKE
        * IT"; supersedes the elder A/B): the pill-marked grab edge below is
        * THE single collapse/resize control — click toggles, drag resizes,
        * snap-to-default on release, Home/Enter/Space on the keyboard. */}

      {header && <div className="kol-sidenav-header">{header}</div>}

      {/* ONLY the tree scrolls (fxr's re-measure, 2026-08-28): the theme slot
        * and the pinned rows used to sit inside this region, so on a 26-row
        * collapsed tree they scrolled off below the footer — "pinned" only
        * held while the tree was shorter than the rail. They are the block
        * after it now, above the footer, the tree scrolling underneath. */}
      <div className="kol-sidenav-scroll flex-1 overflow-y-auto pt-4 pb-4 [scrollbar-width:thin]">
        <nav aria-label="Sections">
          <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
            {navTree.map(renderCat)}
          </ul>
        </nav>
      </div>

      {/* hop-bare carries its own gutter padding; collapsed falls back to
          `icon` — a full-width label can't sit in the collapsed rail. */}
      <div className="pb-4">
          {themeToggle && (
            <div className="kol-sidenav-theme-slot flex">
              <ThemeToggle variant={collapsed ? 'icon' : 'hop-bare'} size="md" />
            </div>
          )}
          {/* pinned rows — BELOW the theme, above the footer: the shell's bottom
            * pair (theme → Settings), specified once */}
          {bottomItems.length > 0 && (
            <nav aria-label="Pinned">
              <ul className="kol-sidenav-tree flex flex-col gap-[2px]">{bottomItems.map(renderCat)}</ul>
            </nav>
          )}
      </div>

      {footer !== false && footer !== null && (
        <div className="kol-sidenav-footer flex items-center h-14 border-t border-fg-08 min-w-0">
          {footer !== undefined ? footer : (
            <a
              href="https://kolkrabbi.io"
              target="_blank"
              rel="noopener"
              className="kol-helper-10 !font-normal no-underline group whitespace-nowrap overflow-hidden text-ellipsis min-w-0"
            >
              {/* Collapsed rail shows the initial alone; the full wordmark
                  overflows it. Both live in one <a> so the link survives either
                  state (CSS swaps them on the data-sidenav stamp). */}
              <span className="kol-sidenav-footer-mark text-body group-hover:text-emphasis">K</span>
              <span className="kol-sidenav-footer-full">
                <span className="text-body group-hover:text-emphasis">Kolkrabbi Vinnustofa</span>
                <span className="text-meta group-hover:text-emphasis"> · {new Date().getFullYear()}</span>
              </span>
            </a>
          )}
        </div>
      )}

      {/* the open panel leaf's panel — a portal above its row, the rail's width */}
      {panelNode && panelBox && createPortal(
        <div
          className="kol-sidenav-panel fixed flex flex-col gap-[2px] py-2 bg-surface-primary border-t border-r border-fg-08"
          style={{ left: panelBox.left, width: panelBox.width, bottom: panelBox.bottom, zIndex: 'var(--kol-z-tooltip)' }}
        >
          {typeof panelNode.panel === 'function' ? panelNode.panel({ collapsed, close: () => setOpenPanel(null) }) : panelNode.panel}
        </div>,
        document.body,
      )}

      {/* Grab edge — width/cursor/focus chrome in kol-framework.css
        * (.kol-sidenav-grab); hidden below lg by the narrow-mode block. */}
      <div className="kol-sidenav-grab absolute top-0 right-0 bottom-0 z-[1]" {...grabProps} />
    </aside>
  )
}
