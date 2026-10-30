import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { Tooltip } from '../utilities/Popover.jsx'
import useDragResize from '../hooks/useDragResize.js'
import useScrollFade from '../hooks/useScrollFade.js'

/* taxonomy-ok: organism — NavRail's site variant; nests Tooltip (utility) + kol-icons' Icon.
 * Carried class-for-class from kol-framework's SideNav.jsx (2026-10-22, the one nav rail):
 * the router read and the theme toggle stay in kol-framework, which wraps this as `SideNav`.
 * ponytail: its box CSS still lives in kol-framework.css (`.kol-sidenav*`, the brand layout
 * grid), so a site on this variant loads kol-framework.css as SideNav always required; move
 * those rules to kol-theme when a consumer without kol-framework wants the site look. */

/**
 * NavRail variant="site" — the grouped navigation rail (kol-framework's SideNav until 2026-10-22).
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
 * THE FOLDERNOTE (user 2026-10-24, site-hub: "make a prop so you can choose if
 * you want to make the category a clickable page. this is how its set in
 * kol-branding"): a category with `to` AND `pages` is a page of its own — its
 * row is a link that opens the page and discloses the pages under it; the
 * caret alone toggles the disclosure without navigating. Lit by its own route
 * or any page beneath. No `to` = the disclosure button it always was.
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
 *   `footer`           the footer box's content: undefined or `false` = no footer
 *                      (OPT-IN since 0.307.0, user ruling 2026-10-28 — every site had
 *                      to remember `footer: false`, record.kolkrabbi.io didn't);
 *                      `'credit'` = the Kolkrabbi link (K / wordmark); a node =
 *                      that node (the shell's logomark → '/')
 *   `themeToggle`      `false` drops the theme slot (default `true`)
 *   `iconComponent`    the hop glyph's renderer, kol-shell's seam — `(props:
 *                      { name, size }) => element`; default the DS `Icon`
 *   `expandOnSelect`   `true` expands the rail when a row navigates, dispatches
 *                      or discloses from the collapsed state. Default `false`
 *                      (user 2026-10-24: "dont auto expand rail when you click an
 *                      icon when its collapsed" — reversing the 2026-08-09 brand
 *                      ruling "pressing any icon would expand the sidebar"): a
 *                      collapsed rail stays collapsed, the press does its job
 *   `defaultCollapsed` boots collapsed when nothing is stored (useDragResize)
 * THE RAIL'S BEHAVIOURS ARE PROPS (SiteRailTitleNavigatesOnly, kol-branding 2026-10-27 — user: "clicking on title
 * shouldnt also expand, that is what the chevron is for", and: a small rail behaviour should never need a ticket here —
 * a sensible default plus a prop the consumer sets in its own repo):
 *   `discloseOnTitle`  `true` lets a foldernote's TITLE also open its pages; default `false` — the title navigates, and
 *                      the rest of the row (everything right of the title, the chevron at its end) expands and collapses
 *                      (2026-10-28: "it should expand anywhere except the title")
 *   `fade`             `true` (default) — the tree fades out at its foot where the window clips it, as the app rail and
 *                      the workshop rail do (2026-10-28: "we also are missing a fade when list clips in navrail");
 *                      `false` draws it plain
 *   `defaultOpen`      category ids open on first render (default none — the rail loads closed, elder ruling 2026-08-06)
 *   `openOnRoute`      `true` opens the category holding the current route whenever the route changes (default `false`
 *                      — nothing auto-expands on arrival); it only adds, never closes what you opened
 * EVERY ROW IS OVERRIDABLE (NavRailRowProps, kol-website 2026-10-29 — user: "props are good. we use variants and presets
 * to define how things ship, but props make things flexible"). All opt-in; with none passed every rail renders as before:
 *   `case`             the label's case on every level — `as-written` · `upper` · `lower` · `title` · `sentence`;
 *                      `caseCategory` / `caseGroup` / `casePage` per level (defaults today's: upper, upper, as-written)
 *                      and a node's own `case` wins. CSS only (text-transform, `::first-letter` for sentence), so the
 *                      label stays the authored string for screen readers and search
 *   `icon`             on any node at any depth (page, group label, action row, nested child), through `iconComponent`
 *   `iconSize`         `{ category, group, page }` (defaults 16, 12, 12); a node's own `iconSize` wins
 *   `alignIcons`       `true` (default): a level where any row has an icon reserves the icon column for all its rows
 *   `collapsedIcons`   `'category'` (default) — the collapsed rail shows category glyphs only; `'all'` also shows the
 *                      icon-bearing pages of an open category under it
 *   per node           `trailing` (a count, badge or node, right-aligned), `className`, `title` (the tooltip when the
 *                      label truncates), `external: true` (the external-link glyph, opens a new tab)
 * `background` (2026-08-09, prop): `true` (default) paints the rail surface;
 * `false` renders chromeless so the rail can float over a consumer's media
 * (the brand-hero model — the consumer owns the plane). `hairline` (2026-08-26,
 * default `false`) paints the right-edge `border-r border-fg-08` — split out
 * of `background` so the line is a choice of its own.
 */

const pageBase =
  'kol-sidenav-link kol-helper-10 block relative py-[4px] pr-6 no-underline transition-colors duration-150'

/* The active-dot pseudo-element is positioned by `--kol-sidenav-dot-left`
 * (kol-components-atoms.css). The page row indents one step past the chrome inset
 * (`--kol-pad-chrome-x` + the icon column + the gap, 2026-10-24 — it was a literal
 * 3.5rem); the dot sits 0.875rem inside that, in the gutter the icon column leaves. */
/* ON THE TITLE COLUMN (user 2026-10-27: "that line doesnt align with the page titles"): a section's own pages start where
 * its title starts, the rail's gutter + the icon column + the gap (52), and 2px in, as a group's pages sit (user: "I would
 * have left it at 2px to the right") — they sat on --kol-pad-chrome-x, 4 right of the title.
 * A group's pages keep their step under the group label (below), as ruled 2026-10-24. */
/* inline, as the group's pages are: a new arbitrary utility in package source is never generated in a consumer */
const pageStyle = { paddingLeft: 'calc(var(--kol-sidenav-pad-x) + 2rem + 2px)', '--kol-sidenav-dot-left': 'calc(var(--kol-sidenav-pad-x) + 1.125rem + 2px)' }
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
const indentOf = (depth) => `calc(var(--kol-pad-chrome-x) + 2rem + ${depth} * var(--kol-spacing-3))`

/* the route leaf is always an `<a href>` handing the route to `onNavigate(event, to)` — the
 * router lives in the consumer (kol-framework's `SideNav` wraps this with react-router). A
 * modified click (cmd, ctrl, shift, middle) is left to the browser, as a NavLink left it.
 * Hoisted out of the component so its identity is stable across renders (see `leafProps`). */
function RouteLeaf({ to, href, active, onNavigate, className, style, title, children, onPress }) {
  return (
    <a href={href} style={style} title={title} className={className(active)} aria-current={active ? 'page' : undefined}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; e.preventDefault(); onPress?.(); onNavigate(e, to) }}>{children}</a>
  )
}

/* THE ROW PROPS (NavRailRowProps): a case resolves node → level → rail → the level's own look; the level's own look emits
 * NO class, so a rail without the props carries the classes it always did. Tailwind's case utilities — they outrank the
 * hop's `text-transform: uppercase` (kol-theme) from the utilities layer. */
const CASE_CLS = { 'as-written': 'normal-case', upper: 'uppercase', lower: 'lowercase', title: 'capitalize', sentence: 'lowercase first-letter:uppercase' }
const LEVEL_CASE = { category: 'upper', group: 'upper', page: 'as-written' }
const ICON_SIZE = { category: 16, group: 12, page: 12 }
const withCls = (...parts) => parts.filter(Boolean).join(' ')
/* `external`: a plain new-tab link, never the router's */
const ExternalLeaf = ({ to, className, style, title, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer" style={style} title={title} className={className}>{children}</a>
)

export default function NavRailSite({
  currentPath: pathname = '',
  /* `(to) => href` — the router's basename on the link a modified click opens (kol-framework's
   * SideNav passes it); the click itself still goes to `onNavigate` with the bare route */
  hrefFor,
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
  expandOnSelect = false,
  defaultCollapsed = false,
  discloseOnTitle = false,
  fade = true,
  defaultOpen = [],
  openOnRoute = false,
  case: railCase,
  caseCategory,
  caseGroup,
  casePage,
  iconSize: iconSizes,
  alignIcons = true,
  collapsedIcons = 'category',
}) {
  /* the row props' resolvers (NavRailRowProps) — '' at a level's own look, so the classes stay as they were */
  const caseCls = (node, level) => {
    const c = node.case ?? { category: caseCategory, group: caseGroup, page: casePage }[level] ?? railCase ?? LEVEL_CASE[level]
    return c === LEVEL_CASE[level] ? '' : (CASE_CLS[c] ?? '')
  }
  const sizeOf = (node, level) => node.iconSize ?? iconSizes?.[level] ?? ICON_SIZE[level]
  /* what rides a row's right end: its `trailing`, then the external glyph */
  const tailOf = (node) => (node.trailing != null || node.external) && (
    <>
      {node.trailing != null && <span className="shrink-0 text-subtle">{node.trailing}</span>}
      {node.external && <span className="shrink-0 inline-flex text-subtle" aria-hidden="true"><Icon name="external-link" size={10} /></span>}
    </>
  )
  /* the tree fades where it clips — the head once scrolled, the foot while more lies below (kol-theme `.kol-scroll-fade`;
   * TimeSetAndSiteRailFade, 2026-10-29) */
  const scrollRef = useRef(null)
  useScrollFade(scrollRef, fade)
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
  /* what a route leaf needs from this render — `RouteLeaf` itself is hoisted above the component
   * (2026-10-24): declared in here it was a NEW component type every render, so React threw every
   * row's DOM away and rebuilt it on each toggle, disclosure or route — the rail flashed and lost
   * hover and focus on the collapse. */
  const leafProps = (to) => ({ to, href: hrefFor ? hrefFor(to) : to, active: isPageActive(to), onNavigate: handleNavigate })

  /* Which categories are disclosed. INDEPENDENT per category (elder ruling
   * 2026-08-01) — arriving somewhere must not silently close wherever you
   * were. Loads closed, in-memory only (elder ruling 2026-08-06). */
  const [openCats, setOpenCats] = useState(() => new Set(defaultOpen))
  /* the ONE open panel leaf (by id) and where its panel sits */
  const [openPanel, setOpenPanel] = useState(null)
  const [panelBox, setPanelBox] = useState(null)
  const toggleCat = (id) => setOpenCats((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const discloseCat = (id) => setOpenCats((prev) => new Set(prev).add(id))
  /* `openOnRoute`: the category holding the route opens on arrival, adding to what is open */
  useEffect(() => {
    if (!openOnRoute) return
    const here = [...navTree, ...bottomItems].find((c) => c.id != null && (isActiveCat(c) || (c.to && isPageActive(c.to))))
    if (here) discloseCat(here.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOnRoute, pathname])

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

  /* Rows under a category: a leaf is a route link; a group is a non-routing
   * header over its own rows, one step further in (recursive). A group lights
   * up the way a category does — when one of its leaves is the current route. */
  const renderRows = (rows, depth) => {
    /* THE ICON COLUMN (NavRailRowProps): with `alignIcons`, a level where any row has an icon reserves the column for all
     * its rows, as wide as its widest glyph; a level with no icon draws exactly as before */
    const levelOf = (r) => (r.children ? 'group' : 'page')
    const iconW = rows.reduce((w, r) => (r.icon ? Math.max(w, sizeOf(r, levelOf(r))) : w), 0)
    const aligned = alignIcons && iconW > 0
    /* a row with an icon, a reserved column or a tail lays out as glyph · label · tail; its case rides the label span
     * (a flex item, so `::first-letter` applies). A plain row keeps its text bare and the case rides the row. */
    const body = (row, cc) => {
      const tail = tailOf(row)
      if (!row.icon && !aligned && !tail) return { rowCase: cc, content: row.label }
      const size = sizeOf(row, levelOf(row))
      return {
        rowCase: '',
        content: (
          <span className="flex items-center gap-2 min-w-0">
            {(row.icon || aligned) && (
              /* zero-height slot: the 12px glyph centres on the 10px line without growing the row */
              <span className="kol-sidenav-hop-icon inline-flex items-center justify-center shrink-0" style={{ width: aligned ? iconW : size, height: 0 }} aria-hidden="true">
                {row.icon && <Glyph name={row.icon} size={size} />}
              </span>
            )}
            <span className={withCls('flex-1 min-w-0 truncate', cc)}>{row.label}</span>
            {tail}
          </span>
        ),
      }
    }
    return rows.map((row, i) => {
    if (row.children) {
      const { rowCase, content } = body(row, caseCls(row, 'group'))
      return (
        <li key={row.id ?? `${row.label}-${i}`}>
          <div
            /* UPPERCASE (user 2026-10-24, the another-creation reference: "look at uppercase sections") — the fork's
             * `uppercase` utility returns, as the reference carries it; the group is a section label in the rows' voice.
             * ONE INK (user 2026-10-24: "just keep them same opacity"): the label never lights — the row's dot says
             * which row is active, and a label that brightened said it twice. `caseGroup` / a node's `case` swap the
             * utility (NavRailRowProps). */
            className={withCls('kol-sidenav-group kol-helper-10', rowCase || 'uppercase', 'text-subtle', row.className)}
            style={depth ? { paddingLeft: indentOf(depth) } : undefined}
            title={row.title}
          >
            {content}
          </div>
          <ul className="kol-sidenav-list">{renderRows(rowsOf(row.children), depth + 1)}</ul>
        </li>
      )
    }
    /* the dot keeps its 0.875rem lead on the text at every depth */
    /* a row under a group sits 2px further in than the step, dot and text together, so the dot's edge lines up under
     * the group label's first letter (user 2026-10-24: "just indent the dot+text by 2px to right") */
    const leafStyle = depth ? { paddingLeft: `calc(${indentOf(depth)} + 2px)`, '--kol-sidenav-dot-left': `calc(var(--kol-pad-chrome-x) + 1.125rem + 2px + ${depth} * var(--kol-spacing-3))` } : pageStyle
    const { rowCase, content } = body(row, caseCls(row, 'page'))
    if (row.onSelect) {
      return (
        <li key={row.id ?? `${row.label}-${i}`}>
          <button
            type="button"
            style={leafStyle}
            className={withCls(`${row.active ? pageActiveCls : pageCls} w-full bg-transparent border-0 cursor-pointer text-left truncate`, rowCase, row.className)}
            aria-pressed={!!row.active}
            title={row.title}
            onClick={(e) => handleSelect(e, row)}
          >
            {content}
          </button>
        </li>
      )
    }
    if (row.external) {
      return (
        <li key={row.to}>
          <ExternalLeaf to={row.to} style={leafStyle} title={row.title} className={withCls(pageCls, rowCase, row.className)}>{content}</ExternalLeaf>
        </li>
      )
    }
    return (
      <li key={row.to}>
        <RouteLeaf {...leafProps(row.to)} style={leafStyle} title={row.title} className={(active) => withCls(active ? pageActiveCls : pageCls, rowCase, row.className)}>
          {content}
        </RouteLeaf>
      </li>
    )
    })
  }

  /* a page as a collapsed glyph row (`collapsedIcons="all"`) — the hop's own classes, so the collapse geometry centres it */
  const renderIconLeaf = (leaf, i) => {
    const cls = 'kol-sidenav-hop kol-helper-12 text-emphasis no-underline'
    const inner = (
      <>
        <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true">
          <Glyph name={leaf.icon} size={sizeOf(leaf, 'page')} />
        </span>
        <span className="kol-sidenav-hop-label flex-1 min-w-0">{leaf.label}</span>
      </>
    )
    return (
      <li key={leaf.to ?? leaf.id ?? `${leaf.label}-${i}`}>
        <Tooltip label={leaf.label} placement="right" triggerClassName="block">
          {leaf.onSelect ? (
            <button type="button" className={`${cls} bg-transparent border-0 cursor-pointer text-left${leaf.active ? ' is-active' : ''}`} aria-pressed={!!leaf.active} onClick={(e) => handleSelect(e, leaf)}>{inner}</button>
          ) : leaf.external ? (
            <ExternalLeaf to={leaf.to} className={cls}>{inner}</ExternalLeaf>
          ) : (
            <RouteLeaf {...leafProps(leaf.to)} className={(active) => `${cls}${active ? ' is-active' : ''}`}>{inner}</RouteLeaf>
          )}
        </Tooltip>
      </li>
    )
  }

  /* one renderer for the tree and the pinned rows (RailSideNavPixelParity) */
  const renderCat = (cat, ci) => {
              const pages = pagesOf(cat)
              const isOpen = openCats.has(cat.id)
              const isLink = !pages.length && cat.to
              /* the FOLDERNOTE: a category that is a page of its own (`to` with `pages`) */
              const isFolder = pages.length > 0 && !!cat.to
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
              const rowCls = withCls('kol-sidenav-hop kol-helper-12 text-emphasis no-underline', cat.className)
              const glyph = (
                <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true">
                  <Glyph name={cat.icon} size={sizeOf(cat, 'category')} />
                </span>
              )
              /* the label slot: the case on it (the hop's uppercase is inherited, so a class here wins); with a tail it
               * lays out label · tail, the case moving onto the label's own span (NavRailRowProps) */
              const cc = caseCls(cat, 'category')
              const tail = tailOf(cat)
              const label = (inner) => (tail ? (
                <span className="kol-sidenav-hop-label flex-1 min-w-0 flex items-center gap-2">
                  <span className={withCls('flex-1 min-w-0 truncate', cc)}>{inner}</span>{tail}
                </span>
              ) : <span className={withCls('kol-sidenav-hop-label flex-1 min-w-0', cc)}>{inner}</span>)
              /* A category is a <button>, not a link — it has no route by
                 definition, and an <a href> would promise a page that does
                 not exist. Clicking it discloses its pages. */
              const head = isFolder ? (
                /* THE TITLE NAVIGATES, THE REST OF THE ROW EXPANDS (user 2026-10-28: *"it should expand anywhere except the
                 * title, so press title > get overview, press the row f.e. on right of the title, expand category"* — the
                 * 12px chevron was the only target). The link keeps the row's full box and wash but only its glyph and title
                 * take the pointer (`.kol-sidenav-hop--split`); the caret is a button under it filling the whole row
                 * (`.kol-sidenav-hop-caret--row`), the chevron at its end, so a press anywhere else on the row lands on it.
                 * `discloseOnTitle` still lets the title open its pages too. Collapsed, the link takes the whole row again. */
                <>
                  <button
                    type="button"
                    /* no display utility on the caret — it would outrank the collapsed rule's display:none (the 2026-08-09 defect; the
                     * box lives in .kol-sidenav-hop-caret, kol-framework.css) */
                    className="kol-sidenav-hop-caret kol-sidenav-hop-caret--row bg-transparent border-0 cursor-pointer pt-3 pr-4 pb-0 pl-0 text-emphasis"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Collapse ${cat.label}` : `Expand ${cat.label}`}
                    onClick={() => (collapsed ? (expandOnSelect && toggleCollapsed(), discloseCat(cat.id)) : toggleCat(cat.id))}
                  >
                    <span className={`kol-sidenav-hop-chevron${isOpen ? '' : ' -rotate-90'}`}><Icon name="chevron-down" size={12} /></span>
                  </button>
                  <RouteLeaf {...leafProps(cat.to)} title={cat.title} onPress={discloseOnTitle ? () => discloseCat(cat.id) : undefined} className={(active) => `${rowCls} kol-sidenav-hop--split${(active || isActiveCat(cat)) ? ' is-active' : ''}`}>
                    {glyph}
                    {label(<span className="kol-sidenav-hop-title">{cat.label}</span>)}
                  </RouteLeaf>
                </>
              ) : isLink && cat.external ? (
                <ExternalLeaf to={cat.to} title={cat.title} className={rowCls}>
                  {glyph}
                  {label(cat.label)}
                </ExternalLeaf>
              ) : isLink ? (
                <RouteLeaf {...leafProps(cat.to)} title={cat.title} className={(active) => `${rowCls}${active ? ' is-active' : ''}`}>
                  {glyph}
                  {label(cat.label)}
                </RouteLeaf>
              ) : isPanel ? (
                <button
                  type="button"
                  data-panel-trigger={cat.id}
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${openPanel === cat.id ? ' is-active' : ''}`}
                  aria-expanded={openPanel === cat.id}
                  title={cat.title}
                  onClick={() => setOpenPanel((o) => (o === cat.id ? null : cat.id))}
                >
                  {glyph}
                  {label(cat.label)}
                </button>
              ) : isAction ? (
                <button
                  type="button"
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${cat.active ? ' is-active' : ''}`}
                  aria-pressed={!!cat.active}
                  title={cat.title}
                  onClick={(e) => handleSelect(e, cat)}
                >
                  {glyph}
                  {label(cat.label)}
                </button>
              ) : (
                <button
                  type="button"
                  className={`${rowCls} bg-transparent border-0 cursor-pointer text-left${isActiveCat(cat) ? ' is-active' : ''}`}
                  aria-expanded={isOpen}
                  title={cat.title}
                  /* Collapsed rail: the click meant "open this" — expand the
                   * rail AND disclose the category, or the tap is wasted on
                   * an expand that lands on a closed tree. */
                  onClick={() => {
                    if (collapsed) {
                      if (expandOnSelect) toggleCollapsed()
                      discloseCat(cat.id)
                    } else {
                      toggleCat(cat.id)
                    }
                  }}
                >
                  {glyph}
                  {label(cat.label)}
                  {/* plain wrapper span — Icon stamps inline-flex on its own
                    * element, which would outrank the rail's display:none */}
                  <span
                    className={`kol-sidenav-hop-caret${isOpen ? '' : ' -rotate-90'}`}
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
                  {/* ONE TREE IN BOTH STATES (2026-10-24, the clip model): the Tooltip wraps the row expanded too,
                      disabled — wrapping only when collapsed rebuilt every row on the toggle, losing hover and
                      focus and flashing the rail. Portalled, so overflow can't clip it. */}
                  <Tooltip label={cat.label} placement="right" triggerClassName={isFolder ? 'block relative kol-sidenav-hop-split' : 'block'} disabled={!collapsed}>
                    {head}
                  </Tooltip>

                  {!isLink && !isAction && !isPanel && isOpen && (
                    <ul className="kol-sidenav-list">{renderRows(pages, 0)}</ul>
                  )}
                  {/* `collapsedIcons="all"` (NavRailRowProps): collapsed, an open category's icon-bearing pages show
                    * under it as glyph rows in the hop's geometry, each named by its tooltip; expanded they are the
                    * list's rows above. Only mounted collapsed, so the expanded tree is untouched. */}
                  {collapsed && collapsedIcons === 'all' && isOpen && pages.length > 0 && (
                    <ul className="kol-sidenav-tree flex flex-col gap-[2px]">{leavesOf(pages).filter((l) => l.icon).map(renderIconLeaf)}</ul>
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
       * viewport down on phones. Only color utilities ride the element. */
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
      <div ref={scrollRef} className={`kol-sidenav-scroll flex-1 overflow-y-auto pt-4 [scrollbar-width:thin] ${fade ? 'pb-12 kol-scroll-fade' : 'pb-4'}`}>
        <nav aria-label="Sections">
          <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
            {navTree.map(renderCat)}
          </ul>
        </nav>
      </div>

      {/* the theme slot holds a TREE ROW (kol-framework's SideNav passes `ThemeToggle variant="row"`,
          2026-10-24): it wears .kol-sidenav-hop and follows the collapse as the rows do. */}
      <div className="pb-4">
          {/* the theme slot is the consumer's: kol-component cannot import kol-framework's
            * toggle, so `themeToggle` is a render function `({ collapsed }) => node` (kol-framework's
            * SideNav passes its own); anything else renders no slot */}
          {typeof themeToggle === 'function' && (
            <div className="kol-sidenav-theme-slot flex">
              {themeToggle({ collapsed })}
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

      {footer != null && footer !== false && (
        <div className="kol-sidenav-footer flex items-center h-14 border-t border-fg-08 min-w-0">
          {footer !== 'credit' ? footer : (
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
