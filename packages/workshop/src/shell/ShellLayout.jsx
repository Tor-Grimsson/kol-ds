import { createContext, useState, useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ShellHeader, HEADER_ICON } from '@kolkrabbi/kol-framework'
import ShellSidebar from './ShellSidebar.jsx'
import { Button, ShellDrawer, ShellSearchOverlay, Tooltip } from '@kolkrabbi/kol-component'
import { matchSearchItems } from '../engine/search.js'
import { useTagMode } from '../tags/TagModeContext.jsx'
import TagModeOverlay from '../tags/TagModeOverlay.jsx'
import { Asset } from '@kolkrabbi/kol-brand/svg'

// Pages can register right-rail TOC content via this context.
// Usage: const setTocContent = useContext(ShellTocContext)
// useLayoutEffect(() => { setTocContent(<MyToc />) ; return () => setTocContent(null) }, [])
export const ShellTocContext = createContext(null)

// Pages that need to fill the viewport (e.g. iframe embeds) can opt into full-height mode.
// Usage: const setFullHeight = useContext(ShellFullHeightContext)
// useLayoutEffect(() => { setFullHeight(true) ; return () => setFullHeight(false) }, [setFullHeight])
export const ShellFullHeightContext = createContext(null)

// Pages can request the right sidebar to start collapsed.
// Usage: const setTocCollapsed = useContext(ShellTocCollapsedContext)
// useLayoutEffect(() => { setTocCollapsed(true) ; return () => setTocCollapsed(false) }, [setTocCollapsed])
export const ShellTocCollapsedContext = createContext(null)

/* overflow-x-hidden (2026-07-30): long tree rows (component names + counters)
 * overflowed the 256px rail into an internal horizontal scroll — with the
 * scrollbar hidden it read as content silently walking off, and the pan
 * gesture shoved the whole grid sideways exposing the outer padding. */
const NavColumn = ({ children }) => (
  <aside aria-label="Navigation" className="shell-sidebar-sticky hidden lg:block shrink-0 h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-none pt-6 md:pt-6 lg:pt-8 pb-8">
    {children}
  </aside>
)

const MainColumn = ({ children, fullHeight }) => (
  <main
    id="main"
    className={`w-full min-w-0 h-full min-h-0 ${fullHeight ? 'overflow-hidden flex flex-col' : 'overflow-y-auto overscroll-none'}`}
    style={fullHeight ? undefined : { scrollbarGutter: 'stable' }}
  >
    {/* THE cap lives HERE (2026-07-31), on the CONTENT — not on the grid that
      * holds the rails. The theme's law is written about a page ("content
      * LEFT-ANCHORED inside"), and the rails are chrome, not page. Capping the
      * grid centred all three columns and pulled both rails inward off the
      * viewport edge; the rails now sit flush at the chrome inset and only the
      * main column carries a cap.
      *
      * It caps at CANVAS, not shell (user ruling 2026-07-31). Shell is the
      * frame token and the middle grid track can never reach it — after both
      * rails, gutters and inset there is ~1516 of room at a 2200 window — so a
      * shell cap here was real code that could never fire, and every page just
      * inherited whatever the window gave it. Canvas is the rung that binds.
      * One decision, made once: 14 pages needed no per-page cap.
      * `fullHeight` stays uncapped on purpose — it IS the fill-the-viewport
      * escape hatch (iframe embeds).
      *
      * LEFT-ANCHORED, not centred (user ruling 2026-08-01). The capped div
      * below carried `mx-auto`, which centres the column inside the main
      * track — so above the canvas width the content drifted away from the
      * rail it is supposed to line up with. The one-frame law has said
      * "content LEFT-ANCHORED inside" since 2026-07-28 (kol-theme.css content
      * block; docs/documentation/01-foundations/05-layout-systems.md): the
      * FRAME centres in the viewport, the CONTENT does not centre in the
      * frame. `validate:width` W4 asserts it now. */}
    {fullHeight
      ? children
      : <div className="w-full max-w-[var(--kol-content-canvas)] pt-6 md:pt-6 lg:pt-8 pb-16">{children}</div>
    }
  </main>
)

/* `xl`, not `lg` — the grid only declares a third column at xl (gridCols
 * below). Rendering this at lg put THREE children in a TWO-column grid between
 * 1024 and 1279px: the rail wrapped to an implicit second row and `h-full`
 * split the height between them, so main got ~373px of a 900px window and the
 * page read as empty. The breakpoint here and the one in gridCols are one
 * decision and must not be stated twice differently. */
const TocColumn = ({ children }) => (
  <aside aria-label="Table of contents" className="shell-sidebar-sticky hidden xl:block shrink-0 h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-none pt-6 md:pt-6 lg:pt-8 pb-8">
    {/* The WIDTH IS THE GRID TRACK now (--kol-shell-toc-w, see gridCols), not
      * an inner wrapper. It used to be `w-56 empty:hidden` here precisely so a
      * rail whose content rendered null would measure zero and let the main
      * column reclaim the space — REVERSED by user ruling 2026-08-01: an empty
      * rail still holds its column, because a rail that disappears re-flows
      * main and the same page ends up at two different widths. */}
    <div className="w-full">{children}</div>
  </aside>
)

const ShellLayout = ({ routes = [], basePath = '/', brand: brandProp, brandLogoSrc, brandLogoAlt = '', renderSidebar, searchItems, defaultTocContent, isActive: isActiveProp, actions }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  /* ONE QUERY (user ruling 2026-08-01). The palette's text used to live here
   * while tags lived in TagModeContext — two states, and therefore two
   * surfaces. Both facets are the context's now. The local pair survives ONLY
   * for a consumer mounting the shell without a TagModeProvider, where the
   * context is the inert fallback and every keystroke would no-op. */
  const tagMode = useTagMode()
  const [localOpen, setLocalOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState('')

  const isSearchOpen = tagMode.isProvided ? tagMode.isOpen : localOpen
  const searchQuery = tagMode.isProvided ? tagMode.text : localQuery
  const setSearchQuery = tagMode.isProvided ? tagMode.setText : setLocalQuery
  const setIsSearchOpen = tagMode.isProvided
    ? (v) => (v ? tagMode.openTagMode() : tagMode.closeTagMode())
    : setLocalOpen
  const [tocContent, setTocContent] = useState(null)
  const [isFullHeight, setIsFullHeight] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  /* THE shortcut map. One list, rendered by the `?` overlay AND bound by the
   * handler below — a shortcut that isn't in this array doesn't exist, so the
   * help sheet can never drift from the bindings. Before this there was no
   * help UI at all: ⌘K was an unlabelled icon button and Alt+B was a duplicate
   * nobody had written down anywhere. */
  const SHORTCUTS = [
    { keys: ['⌘', 'K'], label: 'Search everything', match: (e) => (e.metaKey || e.ctrlKey) && e.key === 'k' },
    { keys: ['?'], label: 'This list', match: (e) => e.key === '?' },
    { keys: ['Esc'], label: 'Close what is open', match: () => false, note: 'handled per surface' },
  ]

  useEffect(() => {
    const handleKeyDown = (e) => {
      /* never steal a key from a field the user is typing in */
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName ?? '')) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const effectiveTocContent = tocContent ?? defaultTocContent
  /* THE RAIL HOLDS ITS COLUMN, EMPTY OR NOT (user ruling 2026-08-01).
   *
   * This used to hunt for a way to tell whether the rail had real content, so
   * an empty one could collapse and hand its space back to main. That whole
   * question is now moot — and it was the wrong question. A rail that vanishes
   * on content-less routes means / renders at one main width and /foundations
   * at another: the layout becomes a property of the page's content instead of
   * the shell. The user caught it on the home page, where the TOC has no
   * headings to show.
   *
   * So the track is RESERVED whenever the viewport is wide enough and the user
   * has not collapsed it by hand. `hasToc` survives for ONE job — whether the
   * header offers a toggle at all — because a control that collapses an
   * already-empty rail is noise. Collapsing is still a user action, and a user
   * action is allowed to change the layout; content appearing is not. */
  const hasToc = Boolean(effectiveTocContent)
  const showNav = !navCollapsed
  const showToc = !tocCollapsed

  const layoutType = showNav && showToc ? 'nav-toc' : showNav ? 'nav' : showToc ? 'toc' : 'none'

  /* A FIXED track (--kol-shell-toc-w), not `auto`. `auto` sized the column to
   * its content, which is exactly what let an empty rail measure zero. Both
   * rail widths are tokens: the left is --kol-sidenav-w (the one number every
   * grid track that lines up with it already reads), the right is
   * --kol-shell-toc-w. */
  const gridCols = showNav
    ? showToc
      ? 'lg:grid-cols-[var(--kol-sidenav-w)_minmax(0,1fr)] xl:grid-cols-[var(--kol-sidenav-w)_minmax(0,1fr)_var(--kol-shell-toc-w)]'
      : 'lg:grid-cols-[var(--kol-sidenav-w)_minmax(0,1fr)]'
    : showToc
      ? 'xl:grid-cols-[minmax(0,1fr)_var(--kol-shell-toc-w)]'
      : ''

  // Adapt the old flat `routes` + callbacks to the DS ShellHeader API
  // (brand node · nav[{label,href,icon}] · isActive · onNavigate · actions slot).
  const joinPath = (p) => `${basePath.replace(/\/$/, '')}/${String(p ?? '').replace(/^\//, '')}`
  const navItems = routes.map((r) => ({
    label: r.label,
    href: r.path ? joinPath(r.path) : basePath,
    icon: r.icon,
  }))
  /* Prefix matching is the default, but a consumer can override it: a tab whose
   * href targets a CHILD page (Docs → /docs/shell-and-layout) must still light
   * up across the whole /docs prefix, which self-matching can't express. */
  const isActive = isActiveProp ?? ((href) => location.pathname === href || location.pathname.startsWith(`${href}/`))
  const handleNavigate = (event, item) => {
    if (item.href) {
      event.preventDefault()
      navigate(item.href)
    }
  }
  /* `brand` takes any node — a consumer that isn't the workshop needs its own
   * wordmark, and brandLogoSrc only ever accepted an <img>. Falls back to the
   * logo-src form, then to the KOLKRABBI + WORKSHOP pair. */
  const brand = brandProp ?? (brandLogoSrc ? (
    <Link to={basePath} className="shell-header-logo flex items-center text-emphasis">
      <img src={brandLogoSrc} alt={brandLogoAlt} className="h-6 w-auto" />
    </Link>
  ) : (
    // Two separate wordmarks: KOLKRABBI holds the logo slot (reserves the 256px
    // nav column at lg+) and links to the SITE home; WORKSHOP falls at the
    // content-column edge and links to the shell root. Both h-6.
    <>
      <Link to="/" className="shell-header-logo hidden md:flex shrink-0 items-center text-emphasis lg:w-64">
        <Asset name="kol-wordmark" title="Kolkrabbi" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
      <Link to={basePath} className="shell-header-logo flex items-center text-emphasis">
        <Asset name="wordmark-workshop" title="Workshop" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
    </>
  ))
  /* Consumer `actions` sit BEFORE the search trigger in row 1 — a showcase
   * needs its own controls (repo link, etc.) beside the shell's. */
  const searchTrigger = (
    <>
      {actions}
      <Tooltip label="Search">
        <Button variant="ghost" quiet iconOnly="search" iconSize={HEADER_ICON} onClick={() => setIsSearchOpen(true)} aria-label="Search" />
      </Tooltip>
    </>
  )

  /* searchItems ({ id, label, href, sectionLabel?, tags?, headings?, keywords? })
   * → the overlay's row shape ({ id, label, group?, hint? }), matched by the
   * engine. hint surfaces WHY a row matched when the label didn't. */
  const searchResults = matchSearchItems(searchItems ?? [], searchQuery).map((item, i) => ({
    id: item.id ?? item.href ?? `${item.label}-${i}`,
    label: item.label,
    group: item.sectionLabel ?? item.group,
    hint: item.matchedHeading ?? item.matchedKeyword ?? item.hint,
    href: item.href,
    /* `action` must survive this reshape. It didn't: the map rebuilt every row
     * as a fixed five-field object, so a consumer's action closure was dropped
     * between the engine and onSelect and the row silently did nothing. The
     * engine spreads `...item` and the overlay passes rows through untouched —
     * this projection was the only lossy step in the chain. */
    action: item.action,
  }))

  return (
    <ShellTocContext.Provider value={setTocContent}>
      <ShellFullHeightContext.Provider value={setIsFullHeight}>
        <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
        <div className="fixed inset-0 flex flex-col bg-surface-primary text-auto">
          <ShellHeader
            brand={brand}
            nav={navItems}
            isActive={isActive}
            onNavigate={handleNavigate}
            actions={searchTrigger}
            onMenuClick={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) {
                /* Both rails to ONE target state — independent `!p` flips made
                 * them oppose each other once the dock buttons had diverged
                 * them. Collapse if anything is open, else reopen both. */
                const collapse = !navCollapsed || !tocCollapsed
                setNavCollapsed(collapse)
                setTocCollapsed(collapse)
              } else {
                setIsNavDrawerOpen(true)
              }
            }}
            onNavToggle={() => setNavCollapsed((p) => !p)}
            onTocToggle={hasToc ? () => setTocCollapsed((p) => !p) : null}
            navCollapsed={navCollapsed}
            tocCollapsed={tocCollapsed}
          />

          {/* Three independent scroll regions: each rail scrolls its own overflow,
            * main scrolls unless a page locks it (ShellFullHeightContext — embeds).
            * overscroll-none stops chaining between regions and the edge bounce. */}
          <div className="flex-1 overflow-hidden">
            {/* THE frame (kol-theme "Content widths"): ONE cap at the shell
              * token, centred, on the framework padding ramp. This wrapper
              * carried `w-full px-4 md:px-5 lg:px-6` — no cap at all, and
              * Tailwind's 16/20/24 steps instead of the ramp's 20/32/48 — so
              * every consumer page inherited the raw viewport (measured 2152px
              * of frame at a 2200px window against an 1800px law). Every
              * page-level width fix is downstream of this line.
              *
              * CORRECTED 2026-07-31: that fix capped THIS element, which holds
              * all three columns — so the whole chrome centred and both rails
              * were dragged inward off the viewport edge. The chrome frame
              * takes the full available width and the rails justify to it; the
              * cap moved one level down onto MainColumn's content, which is
              * what the theme's law is written about. Same disease as
              * --kol-container-max stopping at 1600 under an 1800 law: one
              * element, two answers. */}
            <div
              className="h-full w-full"
              style={{ paddingInline: 'var(--kol-pad-chrome-x)' }}
            >
              {/* gap lives in .shell-content-grid (theme) — a gap-8 utility here
                * outranks the layered theme rule at every width and killed the
                * 48px wide step (ARCHITECTURE §5: component geometry in its own
                * rule, never a utility racing it). */}
              <div className={`shell-content-grid grid ${gridCols} h-full min-h-0`} data-layout={layoutType}>
                  {showNav && (
                    <NavColumn>
                      {renderSidebar ? renderSidebar({}) : <ShellSidebar routes={routes} basePath={basePath} />}
                    </NavColumn>
                  )}

                  <MainColumn fullHeight={isFullHeight}>
                    <div className={isFullHeight ? 'flex flex-col flex-1 min-h-0 [&>*]:flex-1 [&>*]:flex [&>*]:flex-col [&>*]:min-h-0' : ''}>
                      <Suspense fallback={<div className="flex items-center justify-center p-12 text-fg-48">Loading…</div>}>
                        <Outlet />
                      </Suspense>
                    </div>
                  </MainColumn>

                  {/* Mounted on showToc alone — NOT on whether there is content
                    * to put in it. An empty TocColumn is the point: it holds
                    * the grid's third track so main keeps one width across
                    * every route (user ruling 2026-08-01). */}
                  {showToc && (
                    <TocColumn>
                      {effectiveTocContent}
                    </TocColumn>
                  )}
                </div>
              </div>
            </div>

          {/* `open`, not `isOpen` — the old prop name silently kept the drawer
            * shut, so there was no navigation at all below lg. */}
          <ShellDrawer
            open={isNavDrawerOpen}
            onClose={() => setIsNavDrawerOpen(false)}
          >
            {renderSidebar
              ? renderSidebar({ onNavigate: () => setIsNavDrawerOpen(false) })
              : <ShellSidebar routes={routes} basePath={basePath} onNavigate={() => setIsNavDrawerOpen(false)} />
            }
          </ShellDrawer>

          {/* The overlay owns no filtering — the shell holds the query and
            * feeds it results (the pre-0.12 API `isOpen/routes/items` matched
            * nothing, so ⌘K rendered an empty box and searchItems was dead).
            * Selecting routes to item.href; matchSearchItems is the engine's. */}
          <ShellSearchOverlay
            open={isSearchOpen}
            onClose={() => { setIsSearchOpen(false); setSearchQuery('') }}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            /* THE EXPANDED BODY (user ruling 2026-08-01). The tag browser is
             * not a sibling overlay — it is this palette's second state. Enter
             * commits the query and swaps the result rows for the full body;
             * committed tags ride along as chips on the same query. */
            expanded={tagMode.isProvided && tagMode.expanded}
            onExpand={() => tagMode.setExpanded?.(true)}
            chips={tagMode.isProvided ? tagMode.activeTags : []}
            onRemoveChip={tagMode.removeTag}
            placeholder="Search…"
            onSelect={(item) => {
              /* `action` before `href`: not every hit is a destination. A tag
               * row FILTERS the same query and the palette STAYS OPEN — closing
               * it was the behaviour that forced tags into a second overlay.
               * Only a destination dismisses. */
              if (typeof item?.action === 'function') {
                item.action()
                setSearchQuery('')
                return
              }
              setIsSearchOpen(false)
              setSearchQuery('')
              if (item?.href) navigate(item.href)
            }}
          >
            {tagMode.isProvided && tagMode.expanded ? <TagModeOverlay /> : null}
          </ShellSearchOverlay>

          {/* The `?` sheet. Rendered FROM the SHORTCUTS array above, so the help
            * and the bindings are one source — a shortcut can't be documented
            * and unbound, or bound and undocumented, which is how Alt+B lived
            * for months. */}
          {isShortcutsOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-fg-48"
              onClick={() => setIsShortcutsOpen(false)}
              role="presentation"
            >
              <div
                className="kol-doc-figure w-[min(28rem,90vw)] bg-surface-primary"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Keyboard shortcuts"
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{ borderBottomColor: 'var(--kol-oq-08)' }}
                >
                  <span className="kol-doc-eyebrow text-meta">Keyboard shortcuts</span>
                  <Button variant="outline" quiet size="sm" iconOnly="x"
                    aria-label="Close" onClick={() => setIsShortcutsOpen(false)} />
                </div>
                <ul className="flex flex-col px-4 py-3">
                  {SHORTCUTS.map((s) => (
                    <li key={s.label} className="flex items-center justify-between gap-6 py-1.5">
                      <span className="kol-mono-14 text-body">
                        {s.label}
                        {s.note && <span className="kol-helper-12 text-subtle"> · {s.note}</span>}
                      </span>
                      <span className="flex items-center gap-1">
                        {s.keys.map((k) => (
                          <kbd key={k} className="kol-helper-12 rounded-[var(--kol-radius-sm)] bg-fg-08 px-1.5 py-0.5 text-emphasis">{k}</kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        </ShellTocCollapsedContext.Provider>
      </ShellFullHeightContext.Provider>
    </ShellTocContext.Provider>
  )
}

export default ShellLayout
