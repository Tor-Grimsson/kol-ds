import { createContext, useState, useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ShellHeader } from '@kolkrabbi/kol-framework'
import ShellSidebar from './ShellSidebar.jsx'
import { Button, ShellDrawer, ShellSearchOverlay, Tooltip } from '@kolkrabbi/kol-component'
import { matchSearchItems } from '../engine/search.js'
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
    {fullHeight
      ? children
      : <div className="pt-6 md:pt-6 lg:pt-8 pb-16">{children}</div>
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
    {/* The 224px lives HERE, not on the grid track (see gridCols). An inner
      * wrapper with a width means a rail whose content renders null measures
      * zero and the column collapses — the page gets the space back instead of
      * staring at a reserved empty gutter. */}
    <div className="w-56 empty:hidden">{children}</div>
  </aside>
)

const ShellLayout = ({ routes = [], basePath = '/', brand: brandProp, brandLogoSrc, brandLogoAlt = '', renderSidebar, searchItems, defaultTocContent, isActive: isActiveProp, actions }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
  /* An element is truthy even when the component inside it renders nothing, so
   * this alone reserved a 224px rail on every route — including ones with no
   * headings. Three fixes were rejected before this one: measuring the mounted
   * column DEADLOCKS (once the column unmounts the probe is gone and can never
   * report content again); calling a render-prop inline makes the consumer's
   * hooks belong to THIS component, one refactor away from a crash; and a
   * boolean prop puts the answer in the consumer, which doesn't know either.
   *
   * The column decides for itself instead. The track is `auto`, not a fixed
   * 224px, and the width lives on the rail's CONTENT — so a rail that renders
   * nothing collapses to zero and the main column takes the space back. No
   * signal to keep in sync, nothing to deadlock. */
  const hasToc = Boolean(effectiveTocContent)
  const showNav = !navCollapsed
  const showToc = hasToc && !tocCollapsed

  const layoutType = showNav && showToc ? 'nav-toc' : showNav ? 'nav' : showToc ? 'toc' : 'none'

  /* `auto`, not `224px` — see hasToc above. The width is declared on the rail's
   * content (TocColumn's inner wrapper), so a rail with nothing in it measures
   * zero and the main column reclaims the space. */
  const gridCols = showNav
    ? showToc
      ? 'lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)_auto]'
      : 'lg:grid-cols-[256px_minmax(0,1fr)]'
    : showToc
      ? 'xl:grid-cols-[minmax(0,1fr)_auto]'
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
        <Button variant="ghost" quiet iconOnly="search" iconSize={18} onClick={() => setIsSearchOpen(true)} aria-label="Search" />
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
              * page-level width fix is downstream of this line. */}
            <div
              className="mx-auto h-full w-full max-w-[var(--kol-content-shell)]"
              style={{ paddingInline: 'var(--kol-pad-section-x)' }}
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
            onSelect={(item) => {
              setIsSearchOpen(false)
              setSearchQuery('')
              /* `action` before `href`: not every hit is a destination. A tag
               * row toggles state rather than navigating, and without this the
               * palette could only ever hold things that live at a URL — which
               * is why the tag search had to be a second, separate search box
               * that knew nothing about this one. The consumer supplies the
               * closure; the shell stays ignorant of what it does. */
              if (typeof item?.action === 'function') item.action()
              else if (item?.href) navigate(item.href)
            }}
            placeholder="Search…"
          />

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
