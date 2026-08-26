import { NavLink, useLocation } from 'react-router-dom'
import { useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Tooltip } from '@kolkrabbi/kol-component'
import ThemeToggle from './ThemeToggle'
import useDragResize from './useDragResize'

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
 * Collapse: the pill-marked grab edge is THE single control (user build
 * order 2026-08-09, completing SideNavGrabResize — the chip Button is gone
 * in both states). Click toggles expand↔collapse, drag resizes with
 * snap-collapse and snap-to-default, keyboard on the separator: arrows /
 * Home / Enter / Space. One contract: `:root[data-sidenav="collapsed"]` +
 * the `kol-sidenav` storage schema, owned by useDragResize. Collapsed rows
 * get a DS Tooltip — the glyph is otherwise the only thing naming them.
 *
 * `background` (2026-08-09, prop): `true` (default) paints the rail surface +
 * right hairline; `false` renders chromeless so the rail can float over a
 * consumer's media (the brand-hero model — the consumer owns the plane).
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
const rowsOf = (nodes) => nodes.filter((c) => c.to || c.children)
const pagesOf = (cat) => rowsOf(cat.pages ?? cat.children ?? [])
/* Every route leaf under a set of rows, through any depth of groups. */
const leavesOf = (rows) => rows.flatMap((r) => (r.children ? leavesOf(rowsOf(r.children)) : [r]))
/* A nested row sits one --kol-spacing-3 step further in per depth. Inline,
 * not a rule: `pl-14` rides the leaf as a utility and outranks anything in
 * this layer. Depth 0 carries no indent so a flat tree renders unchanged. */
const indentOf = (depth) => `calc(3.5rem + ${depth} * var(--kol-spacing-3))`

export default function SideNav({
  drawerOpen = false,
  onCloseDrawer,
  navTree = [],
  onNavigate,
  isActive,
  background = true,
}) {
  const { pathname } = useLocation()
  const isPageActive = (to) => (isActive ? isActive(to) : pathname === to)
  const isActiveCat = (cat) => leavesOf(pagesOf(cat)).some((p) => isPageActive(p.to))

  /* Every navigation closes the mobile drawer — the prop sat accepted-but-
   * unread until the kol-website session flagged it (2026-08-09) — and, from
   * the collapsed rail, expands the sidebar ("pressing any icon would expand
   * the sidebar", same ruling as the chip removal). */
  const handleNavigate = (e) => {
    onNavigate?.(e)
    onCloseDrawer?.()
    if (collapsed) toggleCollapsed()
  }

  /* Which categories are disclosed. INDEPENDENT per category (elder ruling
   * 2026-08-01) — arriving somewhere must not silently close wherever you
   * were. Loads closed, in-memory only (elder ruling 2026-08-06). */
  const [openCats, setOpenCats] = useState(() => new Set())
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
  const { collapsed, toggleCollapsed, grabProps } = useDragResize(asideRef)

  /* Rows under a category: a leaf is a NavLink; a group is a non-routing
   * header over its own rows, one step further in (recursive). A group lights
   * up the way a category does — when one of its leaves is the current route. */
  const renderRows = (rows, depth) => rows.map((row, i) => {
    if (row.children) {
      const lit = leavesOf(rowsOf(row.children)).some((l) => isPageActive(l.to))
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
    return (
      <li key={row.to}>
        <NavLink
          to={row.to}
          end
          /* the dot keeps its 0.875rem lead on the text at every depth */
          style={depth ? { paddingLeft: indentOf(depth), '--kol-sidenav-dot-left': `calc(2.625rem + ${depth} * var(--kol-spacing-3))` } : pageStyle}
          className={({ isActive: navActive }) => ((isActive ? isActive(row.to) : navActive) ? pageActiveCls : pageCls)}
          onClick={handleNavigate}
        >
          {row.label}
        </NavLink>
      </li>
    )
  })

  return (
    <aside
      ref={asideRef}
      /* Box utilities deliberately absent (SideNavMobilePosition, 2026-08-25):
       * the aside's position/height/stack live in .kol-sidenav
       * (kol-framework.css). `sticky … h-dvh z-20` here outranked the 767px
       * drawer rule's `position: fixed`, so every consumer page opened one
       * viewport down on phones. Only colour utilities ride the element. */
      className={`kol-sidenav${background ? ' bg-surface-primary border-r border-fg-08' : ''}${collapsed ? ' is-collapsed' : ''}${drawerOpen ? ' is-drawer-open' : ''}`}
    >
      {/* NO chip Button in either state (user build order 2026-08-09 — "MAKE
        * IT"; supersedes the elder A/B): the pill-marked grab edge below is
        * THE single collapse/resize control — click toggles, drag resizes,
        * snap-to-default on release, Home/Enter/Space on the keyboard. */}

      <div className="kol-sidenav-scroll flex-1 flex flex-col justify-between overflow-y-auto pt-4 pb-4 [scrollbar-width:thin]">
        <nav aria-label="Sections">
          <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
            {navTree.map((cat) => {
              const pages = pagesOf(cat)
              const isOpen = openCats.has(cat.id)
              const isLink = !pages.length && cat.to
              /* Box utilities deliberately absent — the hop's layout lives in
               * .kol-sidenav-hop (kol-framework.css): a utility here would
               * outrank the collapsed-state overrides (2026-08-09 defect). */
              const rowCls = 'kol-sidenav-hop kol-helper-12 text-emphasis no-underline'
              const glyph = (
                <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true">
                  <Icon name={cat.icon} size={16} />
                </span>
              )
              /* A category is a <button>, not a link — it has no route by
                 definition, and an <a href> would promise a page that does
                 not exist. Clicking it discloses its pages. */
              const head = isLink ? (
                <NavLink
                  to={cat.to}
                  end
                  className={({ isActive: navActive }) => `${rowCls}${(isActive ? isActive(cat.to) : navActive) ? ' is-active' : ''}`}
                  onClick={handleNavigate}
                >
                  {glyph}
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{cat.label}</span>
                </NavLink>
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

                  {!isLink && isOpen && (
                    <ul className="kol-sidenav-list">{renderRows(pages, 0)}</ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* hop-bare carries its own gutter padding; collapsed falls back to
            `icon` — a full-width label can't sit in the collapsed rail. */}
        <div className="kol-sidenav-theme-slot flex">
          <ThemeToggle variant={collapsed ? 'icon' : 'hop-bare'} size="md" />
        </div>
      </div>

      <div className="kol-sidenav-footer flex items-center h-14 border-t border-fg-08 min-w-0">
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
      </div>

      {/* Grab edge — width/cursor/focus chrome in kol-framework.css
        * (.kol-sidenav-grab); hidden below lg by the narrow-mode block. */}
      <div className="kol-sidenav-grab absolute top-0 right-0 bottom-0 z-[1]" {...grabProps} />
    </aside>
  )
}
