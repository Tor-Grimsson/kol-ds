import { createContext, useContext, useMemo, useRef, useState, useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { ShellHeader } from '@kolkrabbi/kol-framework'
import ShellSidebar, { RAIL_FOLD_EVENT, ShellRailModeContext } from './ShellSidebar.jsx'
import { IconFrame, ShellDrawer, ShellSearchOverlay, ShortcutsOverlay, SettingsPanel, SettingsSections, SettingsSwitch, Tooltip, useDragResize } from '@kolkrabbi/kol-component'
import { createIndex, search } from '@kolkrabbi/kol-search'
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

// WIDTH IS THE PAGE'S DECISION (user, 2026-08-26 — "there isnt one size fits
// all … what I want is consistency, sometimes that is done by left align …
// sometimes its a different method"). Three settings:
//   'canvas' (default) — capped at --kol-content-canvas, LEFT against the nav:
//                        doc pages, where the constant gap to the rail is the
//                        consistency that matters, especially for narrow content
//   'shell'            — capped at --kol-content-shell and centred: the frame rung
//   'none'             — spans the main track: a landing page with a centred
//                        hero, a wall that should use the room it is given
// Usage: const setContentWidth = useContext(ShellContentWidthContext)
// useLayoutEffect(() => { setContentWidth('none') ; return () => setContentWidth('canvas') }, [setContentWidth])
export const ShellContentWidthContext = createContext(null)

// Pages can request the right sidebar to start collapsed.
// Usage: const setTocCollapsed = useContext(ShellTocCollapsedContext)
// useLayoutEffect(() => { setTocCollapsed(true) ; return () => setTocCollapsed(false) }, [setTocCollapsed])
export const ShellTocCollapsedContext = createContext(null)

// THE LEFT RAIL IS THE PAGE'S CALL TOO (2026-09-01). The TOC had this seam and
// the nav did not, so a landing page could shed one rail and not the other —
// the showcase home claimed "top nav (no sidebar)" in its docstring and rendered
// under both. Same shape as the TOC seam: set on mount, restore on unmount, and
// the header's own toggles keep working on top of it.
// Usage: const setNavCollapsed = useContext(ShellNavCollapsedContext)
// useLayoutEffect(() => { setNavCollapsed(true) ; return () => setNavCollapsed(false) }, [setNavCollapsed])
export const ShellNavCollapsedContext = createContext(null)

/* THE PAGE TELLS THE RAIL WHAT IT IS ABOUT (2026-09-28, user: "the purpose of
 * the right sidebar is to list that pages content and context"). The right
 * rail was handed `tags={[]}` and `related={[]}` on every route, so it showed
 * the same global block everywhere. A page now publishes its own context and
 * the rail reads it:
 *   usePageMeta({ tags, related: [{ label, to }] })   — in a page
 *   const meta = usePageMetaValue()                  — in a rail
 * Cleared on unmount, so a page that says nothing gets an empty context, never
 * the previous page's. */
const ShellPageMetaContext = createContext({ meta: null, setMeta: null })

export function usePageMeta(meta) {
  const { setMeta } = useContext(ShellPageMetaContext)
  const key = JSON.stringify(meta ?? null)
  useEffect(() => {
    if (!setMeta) return undefined
    setMeta(meta ?? null)
    return () => setMeta(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMeta, key])
}

export const usePageMetaValue = () => useContext(ShellPageMetaContext).meta

/* THE SCROLL ROOT. The region below the header scrolls as ONE, edge to edge
 * (2026-09-28) — it used to be #main, inset by the chrome padding, so its
 * scrollbar sat inside the frame. Anything that observes or resets scroll
 * inside the shell (useScrollSpy's `root`, a jump-to-top) reads this id. */
export const SHELL_SCROLL_ROOT = '#shell-scroll'

/* The rails are sticky inside the one scroll region and scroll their own
 * overflow (`.shell-rail`, kol-components-workshop.css): exactly one region
 * tall, a seam toward the page, the chrome inset inside the seam.
 * overflow-x-hidden (2026-07-30): long tree rows must not scroll sideways. */
/* RESIZABLE RAILS (2026-09-30) — THE DS GESTURE, not a local one: `useDragResize` (the grab edge
 * SideNav and EditorShell wear — drag resizes, a click or a drag under the snap collapses, arrows
 * step, release near the default snaps back) and the `.kol-rail-grab` pill. Each rail has its own
 * token family (`kol-shell-nav` · `kol-shell-toc`, tokens in kol-framework.css) so the two never
 * drag together; width lasts the session (persistWidth off, the 2026-09-03 ruling). A collapse
 * from the grab is the shell's own "hide the rail" — the same state `[` / `]` toggle. */
const useRailGrab = (token, side, hide) => {
  const ref = useRef(null)
  const { collapsed, toggleCollapsed, grabProps } = useDragResize(ref, { token, side })
  useEffect(() => {
    if (!collapsed) return
    hide()
    toggleCollapsed() // un-stamp the hook's collapse — the shell's own state now holds it
    document.documentElement.style.removeProperty(`--${token}-w`) // it returns at the stylesheet width
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])
  return { ref, grab: <div {...grabProps} className={`kol-rail-grab kol-rail-grab--${side} hidden lg:block`} /> }
}

/**
 * ShellNavColumn — The left rail's column. the frame the shell's left rail sits in: sticky, one
 * scroll region tall, a seam toward the page. It owns the rail's THREE STATES (user ruling
 * 2026-10-02) — `open`, `icons` and hidden, which is simply not mounting it.
 *
 * In `icons` the column is a narrow strip (the track is the framework's collapsed-rail width,
 * `--kol-sidenav-w-collapsed`) and every `ShellSidebar` inside draws one glyph per group. Hover
 * opens the whole rail OVER the page at its full width — the track does not move, so the page
 * never reflows — and leaving folds it back. A touch has no hover: there the glyphs are the nav.
 *
 * @param {'open'|'icons'} mode
 * @param {ReactNode|Function} children  the rail; a function gets the state it is drawn in
 *                                       (`open` while an icon rail is hovered), so a consumer can
 *                                       drop what does not fit a strip
 * @param {ReactNode} grip     the resize handle — not drawn on an icon rail
 * @param {Object}    railRef
 */
export function ShellNavColumn({ mode = 'open', children, grip, railRef }) {
  const [peek, setPeek] = useState(false)
  const icons = mode === 'icons'
  const shown = icons && !peek ? 'icons' : 'open'
  return (
    <aside
      ref={railRef}
      aria-label="Navigation"
      className={`shell-rail shell-rail--nav shell-sidebar-sticky hidden lg:block pt-6 md:pt-6 lg:pt-8 pb-14 ${icons ? `shell-rail--icons ${peek ? 'is-peek' : ''}` : ''}`.trim()}
      onMouseEnter={icons ? () => setPeek(true) : undefined}
      onMouseLeave={icons ? () => setPeek(false) : undefined}
    >
      <ShellRailModeContext.Provider value={shown}>
        {typeof children === 'function' ? children(shown) : children}
      </ShellRailModeContext.Provider>
      {!icons && grip}
    </aside>
  )
}

const MainColumn = ({ children, fullHeight, width = 'canvas', padStart, padEnd }) => {
  /* the map lives INSIDE MainColumn on purpose — validate:width W1 reads the
   * cap off this block and refuses a --kol-content-* cap anywhere else */
  const cap = {
    canvas: 'w-full max-w-[var(--kol-content-canvas)]',
    shell: 'w-full mx-auto max-w-[var(--kol-content-shell)]',
    none: 'w-full',
  }[width] ?? 'w-full max-w-[var(--kol-content-canvas)]'
  /* ONE space between a rail and the page: main pads the page ladder from a
   * rail's seam, only on a side that HAS a rail at this width. Pages never pad
   * themselves on x. */
  const pad = `${padStart ? 'lg:pl-[var(--kol-pad-section-x)]' : ''} ${padEnd ? 'xl:pr-[var(--kol-pad-section-x)]' : ''}`
  return (
  <main
    id="main"
    className={`shell-main w-full ${pad} ${fullHeight ? 'h-[100cqh] overflow-hidden flex flex-col' : ''}`}
  >
    {/* The cap lives HERE, on the CONTENT — not on the grid that holds the
      * rails. WHICH cap is the page's call — see ShellContentWidthContext.
      * Canvas stays left-anchored (never mx-auto — W4); shell is the frame rung
      * and centres; none spans the track. `fullHeight` stays uncapped — it IS
      * the fill-the-viewport escape hatch (iframe embeds). */}
    {fullHeight
      ? children
      : <div className={`${cap} pt-6 md:pt-6 lg:pt-8 pb-16`}>{children}</div>
    }
  </main>
  )
}

/* `xl`, not `lg` — the grid only declares a third column at xl (gridCols
 * below). The breakpoint here and the one in gridCols are one decision and
 * must not be stated twice differently. */
const TocColumn = ({ children, grip, railRef }) => (
  <aside ref={railRef} aria-label="Table of contents" className="shell-rail shell-rail--toc shell-sidebar-sticky hidden xl:block pt-6 md:pt-6 lg:pt-8 pb-14">
    {grip}
    {/* The width is the grid track (--kol-shell-toc-w). An empty rail still
      * holds its column (user ruling 2026-08-01): a rail that disappears
      * re-flows main and the same page ends up at two widths. */}
    <div className="w-full">{children}</div>
  </aside>
)

/* THE SHELL'S OWN SETTINGS, remembered per viewer (a convenience — a blocked
 * store just means the defaults). */
const SETTINGS_KEY = 'kol-workshop-settings'
const readSettings = () => {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') ?? {} } catch { return {} }
}
const writeSettings = (next) => {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { /* private window */ }
}

/* A search item in either shape — the kol-search item (`title · kind · space ·
 * category · tags · headings · keywords · description · href`) or the search modal's
 * older row (`label · sectionLabel · …`). Both keep working. */
const toSearchItem = (item, i) => ({
  ...item,
  id: item.id ?? item.href ?? `${item.label ?? item.title}-${i}`,
  title: item.title ?? item.label ?? '',
  category: item.category ?? item.sectionLabel ?? item.group,
})

/**
 * @param {string} [searchPath]  where Enter takes the query (`${searchPath}?q=…`) — the
 *                               shared results page (kol-workshop `SearchPage`). Omitted,
 *                               Enter keeps the older behaviour: the tag browser in place.
 * @param {Array}  [settings]    extra settings sections (`SettingsSections` shape) the
 *                               consumer adds to the shell's settings drawer
 * @param {string|Function} [brandLabel]  a TYPED label in the second wordmark slot instead of
 *                               the drawn WORKSHOP mark — a string, or `({ activeRoute }) => string`
 *                               so it names the space you are in
 * @param {Array}  [shortcuts]   the consumer's own keys, `{ id, label, combo, key, run }` — listed
 *                               in the `S` sheet and bound by the same handler (2026-09-30)
 * @param {Function} [renderSidebar]  `({ activeRoute, onNavigate, mode }) => node` — the space's
 *                               rail. `mode` is `open` or `icons` (the left rail's third state,
 *                               2026-10-02): every `ShellSidebar` reads it by itself, so `mode`
 *                               is only for what else the consumer puts in the rail
 */
const ShellLayout = ({ routes = [], basePath = '/', brand: brandProp, brandLogoSrc, brandLogoAlt = '', renderSidebar, searchItems, searchPath, settings = [], brandLabel, defaultTocContent, isActive: isActiveProp, actions, shortcuts = [] }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)
  const [prefs, setPrefs] = useState(readSettings)
  const setPref = (key, value) => setPrefs((p) => { const next = { ...p, [key]: value }; writeSettings(next); return next })
  const [navCollapsed, setNavCollapsed] = useState(() => readSettings().navHidden === true)
  /* the left rail's third state — a strip of icons that opens on hover (see ShellNavColumn) */
  const navIcons = prefs.navIcons === true

  const [tocCollapsed, setTocCollapsed] = useState(() => readSettings().tocHidden === true)
  const navGrab = useRailGrab('kol-shell-nav', 'left', () => { setNavCollapsed(true); writeSettings({ ...readSettings(), navHidden: true }) })
  const tocGrab = useRailGrab('kol-shell-toc', 'right', () => { setTocCollapsed(true); writeSettings({ ...readSettings(), tocHidden: true }) })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  /* ONE QUERY (user ruling 2026-08-01). The search modal's text used to live here
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
  /* CLOSE IS ONE CALL (WorkshopSearchCloseUndoneBySetText, kol-website
   * 2026-09-01). Close-and-clear was two: `setIsSearchOpen(false)` then
   * `setSearchQuery('')` — and on the provided path the second is
   * `tagMode.setText`, which force-opens, so both landed in one React batch
   * and the final state was OPEN. The scrim tap (and desktop click) was
   * undone in its own event; Escape only worked because the context's window
   * listener runs after and wins. `closeTagMode()` already resets `text`; the
   * trailing clear is only the local path's job. */
  const closeSearch = () => {
    if (tagMode.isProvided) {
      tagMode.closeTagMode()
    } else {
      setLocalOpen(false)
      setLocalQuery('')
    }
  }
  const [tocContent, setTocContent] = useState(null)
  const [pageMeta, setPageMeta] = useState(null)
  const [isFullHeight, setIsFullHeight] = useState(false)
  const [contentWidth, setContentWidth] = useState('canvas')
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  /* a new page starts at the top of the one scroll region; a hash is the
   * browser's to resolve */
  /* BACK RETURNS TO WHERE YOU WERE (2026-10-01 — user: "'back' loses the place vertically in the
   * scroll … now I have to scroll and find my place"). Each history entry remembers its own
   * scroll offset; Back/Forward (POP) restores it, a fresh navigation still starts at the top.
   * The page may still be laying out when the entry returns (lazy walls, async demos), so the
   * restore is retried for a moment until the region is tall enough to reach the offset. */
  const navigationType = useNavigationType()
  const scrollMemory = useRef(new Map())
  useEffect(() => {
    const el = document.getElementById('shell-scroll')
    if (!el) return undefined
    const key = location.key
    const save = () => scrollMemory.current.set(key, el.scrollTop)
    el.addEventListener('scroll', save, { passive: true })
    return () => el.removeEventListener('scroll', save)
  }, [location.key])
  useEffect(() => {
    if (location.hash) return undefined
    const el = document.getElementById('shell-scroll')
    if (!el) return undefined
    const saved = navigationType === 'POP' ? scrollMemory.current.get(location.key) : 0
    if (!saved) { el.scrollTo(0, 0); return undefined }
    let frame
    let tries = 60
    const restore = () => {
      el.scrollTo(0, saved)
      if (Math.abs(el.scrollTop - saved) > 1 && tries-- > 0) frame = requestAnimationFrame(restore)
    }
    restore()
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash, location.key])

  /* THE shortcut map. One list, rendered by the `S` sheet AND bound by the
   * handler below — a shortcut that isn't in this array doesn't exist, so the
   * sheet can never drift from the bindings. The sheet is kol-component's
   * ShortcutsOverlay (2026-09-28): the same sheet, on the same key, as every
   * app — it was a `?` sheet of its own here. `?` still opens it. */
  /* FEWEST WORDS (the showcase review W16, 2026-09-30 — user: "shortcuts overlay, too wordy"):
   * a label names the thing the key does, nothing more. `\\` hides or shows both rails at once. */
  const SHORTCUTS = [
    { section: 'Search', items: [
      { id: 'k', label: 'Search', combo: '⌘ K , /' },
      { id: 'enter', label: 'All results', combo: '↵' },
    ] },
    { section: 'Shell', items: [
      { id: 'sheet', label: 'Shortcuts', combo: 'S' },
      { id: 'settings', label: 'Settings', combo: ',' },
      { id: 'nav', label: 'Left rail', combo: '[' },
      { id: 'toc', label: 'Right rail', combo: ']' },
      { id: 'rails', label: 'Both rails', combo: '\\' },
      { id: 'fold', label: 'Fold / expand all', combo: 'C' },
      { id: 'esc', label: 'Close', combo: 'Esc' },
    ] },
    ...(shortcuts.length ? [{ section: 'Page', items: shortcuts.map(({ id, label, combo }) => ({ id, label, combo })) }] : []),
  ]
  /* the handler binds once; the consumer's list and the fold state are read through refs */
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts
  const foldedRef = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      /* never steal a key from a field the user is typing in */
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName ?? '')) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      /* `/` opens search — it used to fall through to the browser's find */
      if (e.key === '/') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === 's' || e.key === 'S' || e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen((v) => !v)
      } else if (e.key === ',') {
        e.preventDefault()
        setIsSettingsOpen((v) => !v)
      } else if (e.key === '[') {
        e.preventDefault()
        setNavCollapsed((v) => { writeSettings({ ...readSettings(), navHidden: !v }); return !v })
      } else if (e.key === ']') {
        e.preventDefault()
        setTocCollapsed((v) => { writeSettings({ ...readSettings(), tocHidden: !v }); return !v })
      } else if (e.key === '\\') {
        /* BOTH RAILS (W16): any rail showing → hide both; both hidden → show both */
        e.preventDefault()
        const s = readSettings()
        const hide = !(s.navHidden && s.tocHidden)
        setNavCollapsed(hide)
        setTocCollapsed(hide)
        writeSettings({ ...s, navHidden: hide, tocHidden: hide })
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        foldedRef.current = !foldedRef.current
        window.dispatchEvent(new CustomEvent(RAIL_FOLD_EVENT, { detail: { collapsed: foldedRef.current } }))
      } else if (shortcutsRef.current.some((s) => s.key === e.key)) {
        e.preventDefault()
        shortcutsRef.current.find((s) => s.key === e.key).run()
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isActive = isActiveProp ?? ((href) => location.pathname === href || location.pathname.startsWith(`${href}/`))
  const joinPath = (p) => `${basePath.replace(/\/$/, '')}/${String(p ?? '').replace(/^\//, '')}`
  /* THE SPACE YOU ARE IN (2026-09-28). The rails are per space now — the left
   * rail used to render one stack on every route. The consumer gets the active
   * route and draws that space's rail; the same object reaches the default
   * right rail when it is a function. */
  const activeRoute = routes.find((r) => r.path && isActive(joinPath(r.path))) ?? null
  const effectiveTocContent = tocContent ?? (typeof defaultTocContent === 'function' ? defaultTocContent({ activeRoute }) : defaultTocContent)
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

  /* FIXED tracks, not `auto` — `auto` let an empty rail measure zero. Both
   * rails are the workshop shell's own pair (--kol-shell-nav-w ·
   * --kol-shell-toc-w, 256px each since 2026-09-28): the left used to read
   * --kol-sidenav-w, the draggable app sidenav's 264/320 ladder. */
  /* an icon rail's track is the framework's collapsed-rail width — the same strip, one token */
  const gridCols = showNav && navIcons
    ? showToc
      ? 'lg:grid-cols-[var(--kol-sidenav-w-collapsed)_minmax(0,1fr)] xl:grid-cols-[var(--kol-sidenav-w-collapsed)_minmax(0,1fr)_var(--kol-shell-toc-w)]'
      : 'lg:grid-cols-[var(--kol-sidenav-w-collapsed)_minmax(0,1fr)]'
    : showNav
    ? showToc
      ? 'lg:grid-cols-[var(--kol-shell-nav-w)_minmax(0,1fr)] xl:grid-cols-[var(--kol-shell-nav-w)_minmax(0,1fr)_var(--kol-shell-toc-w)]'
      : 'lg:grid-cols-[var(--kol-shell-nav-w)_minmax(0,1fr)]'
    : showToc
      ? 'xl:grid-cols-[minmax(0,1fr)_var(--kol-shell-toc-w)]'
      : ''

  // Adapt the old flat `routes` + callbacks to the DS ShellHeader API
  // (brand node · nav[{label,href,icon}] · isActive · onNavigate · actions slot).
  const navItems = routes.map((r) => ({
    label: r.label,
    href: r.path ? joinPath(r.path) : basePath,
    icon: r.icon,
  }))
  /* Prefix matching is the default, but a consumer can override it: a tab whose
   * href targets a CHILD page (Docs → /docs/shell-and-layout) must still light
   * up across the whole /docs prefix, which self-matching can't express. */
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
    // Two wordmarks: KOLKRABBI holds the logo slot and links to the SITE home;
    // the second falls where the PAGE TEXT starts (the nav track + the page's
    // pad from the seam, less the header's 32px gap) and links to the shell root. The second is the drawn
    // WORKSHOP mark, or — with `brandLabel` (2026-09-28, user: "we might as well
    // just use right grotesk tight … when you land at ui.kolkrabbi.io … then it
    // could change with the site's navigation") — typed, naming the space.
    <>
      <Link to="/" className="shell-header-logo hidden md:flex shrink-0 items-center text-emphasis lg:w-[calc(var(--kol-shell-nav-w)_+_var(--kol-pad-section-x)_-_32px)]">
        <Asset name="kol-wordmark" title="Kolkrabbi" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
      <Link to={basePath} className="shell-header-logo flex items-center text-emphasis">
        {brandLabel
          ? <span className="shell-wordmark-label">{typeof brandLabel === 'function' ? brandLabel({ activeRoute }) : brandLabel}</span>
          : <Asset name="wordmark-workshop" title="Workshop" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />}
      </Link>
    </>
  ))
  /* Consumer `actions` sit BEFORE the search trigger in row 1 — a showcase
   * needs its own controls (repo link, etc.) beside the shell's. */
  const searchTrigger = (
    <>
      {actions}
      <Tooltip label="Search">
        {/* `md` + full-ink nav (user re-rule 2026-08-09; repeals the 2026-08-01
          * lg ruling). The row law is unchanged: every header glyph on ONE
          * rung, one variant — the rung is just md now. */}
        <IconFrame name="search" variant="nav" size="md" onClick={() => setIsSearchOpen(true)} aria-label="Search" />
      </Tooltip>
      <Tooltip label="Settings">
        <IconFrame name="settings-01" variant="nav" size="md" onClick={() => setIsSettingsOpen(true)} aria-label="Settings" />
      </Tooltip>
    </>
  )

  /* THE ENGINE IS kol-search (2026-09-28) — the search modal ran a first-substring
   * match, so `atom` ranked AppHub first on a word in its description and only
   * one row lit its match. Ranked now, every hit highlighted, and a word that
   * names a category (`atom`) filters by it. `limitToSpace` (settings) scopes
   * quick search to the space you are in. */
  const searchIndex = useMemo(() => createIndex((searchItems ?? []).map(toSearchItem)), [searchItems])
  const quickScope = prefs.limitToSpace && activeRoute ? { space: activeRoute.id } : {}
  const searchResults = searchQuery
    ? search(searchIndex, searchQuery, { scope: quickScope, limit: 12 }).results.map(({ item, reasons, highlights }) => {
      const titleHit = reasons.some((r) => r.field === 'title')
      const first = reasons.find((r) => r.hit)
      return {
        id: item.id,
        label: item.title,
        group: item.category,
        hint: titleHit ? item.hint : (first?.hit ?? item.description ?? item.hint),
        href: item.href,
        highlights: highlights.title,
        /* `action` survives the reshape — a row may run a closure instead of going somewhere */
        action: item.action,
      }
    })
    : []
  const openResultsPage = () => {
    const q = searchQuery.trim()
    closeSearch()
    navigate(q ? `${searchPath}?q=${encodeURIComponent(q)}` : searchPath)
  }

  const settingsSections = [
    { label: 'Layout', rows: [
      { id: 'nav', label: 'Left rail', render: () => <SettingsSwitch on={!navCollapsed} onChange={(on) => { setNavCollapsed(!on); setPref('navHidden', !on) }} /> },
      { id: 'nav-icons', label: 'Icons only', render: () => <SettingsSwitch on={navIcons} onChange={(on) => setPref('navIcons', on)} /> },
      { id: 'toc', label: 'Right rail', render: () => <SettingsSwitch on={!tocCollapsed} onChange={(on) => { setTocCollapsed(!on); setPref('tocHidden', !on) }} /> },
    ] },
    { label: 'Search', rows: [
      { id: 'scope', label: 'This space only', render: () => <SettingsSwitch on={!!prefs.limitToSpace} onChange={(on) => setPref('limitToSpace', on)} /> },
    ] },
    ...settings,
    { label: 'Keys', rowGap: 1, rows: SHORTCUTS.flatMap((sec) => sec.items).map((k) => ({
      id: `key-${k.id}`, label: k.label, labelWidth: 'auto', align: 'fill',
      value: <span className="kol-helper-12 text-fg-48 whitespace-nowrap">{k.combo}</span>,
    })) },
  ]

  return (
    <ShellPageMetaContext.Provider value={{ meta: pageMeta, setMeta: setPageMeta }}>
    <ShellTocContext.Provider value={setTocContent}>
      <ShellFullHeightContext.Provider value={setIsFullHeight}>
        <ShellContentWidthContext.Provider value={setContentWidth}>
        <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
        <ShellNavCollapsedContext.Provider value={setNavCollapsed}>
        <div className="fixed inset-0 flex flex-col bg-surface-primary text-auto">
          <ShellHeader
            brand={brand}
            nav={navItems}
            isActive={isActive}
            onNavigate={handleNavigate}
            actions={searchTrigger}
            menuBelowLg
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

          {/* ONE scroll region, edge to edge (see SHELL_SCROLL_ROOT). The chrome
            * inset pads the grid INSIDE it, so the scrollbar sits at the window
            * edge. A full-height page (embeds) locks it and fills it instead. */}
          <div
            id="shell-scroll"
            className={`shell-scroll flex-1 min-h-0 ${isFullHeight ? 'overflow-hidden' : 'overflow-y-auto'}`}
          >
              <div className={`shell-content-grid grid ${gridCols}`} data-layout={layoutType} style={{ paddingInline: 'var(--kol-pad-chrome-x)' }}>
                  {showNav && (
                    <ShellNavColumn mode={navIcons ? 'icons' : 'open'} railRef={navGrab.ref} grip={navGrab.grab}>
                      {(mode) => (renderSidebar ? renderSidebar({ activeRoute, mode }) : <ShellSidebar routes={routes} basePath={basePath} />)}
                    </ShellNavColumn>
                  )}

                  <MainColumn fullHeight={isFullHeight} width={contentWidth} padStart={showNav} padEnd={showToc}>
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
                    <TocColumn railRef={tocGrab.ref} grip={tocGrab.grab}>
                      {effectiveTocContent}
                    </TocColumn>
                  )}
              </div>
          </div>

          {/* `open`, not `isOpen` — the old prop name silently kept the drawer
            * shut, so there was no navigation at all below lg. */}
          <ShellDrawer
            open={isNavDrawerOpen}
            onClose={() => setIsNavDrawerOpen(false)}
          >
            {renderSidebar
              ? renderSidebar({ activeRoute, onNavigate: () => setIsNavDrawerOpen(false) })
              : <ShellSidebar routes={routes} basePath={basePath} onNavigate={() => setIsNavDrawerOpen(false)} />
            }
          </ShellDrawer>

          {/* The overlay owns no filtering — the shell holds the query and
            * feeds it results (the pre-0.12 API `isOpen/routes/items` matched
            * nothing, so ⌘K rendered an empty box and searchItems was dead).
            * Selecting routes to item.href; matchSearchItems is the engine's. */}
          <ShellSearchOverlay
            open={isSearchOpen}
            onClose={closeSearch}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            /* an empty search modal opens on the space table, not a blank box */
            suggestions={navItems.map((n) => ({ id: `space:${n.href}`, label: n.label, href: n.href, icon: 'arrow-right', group: 'Spaces' }))}
            /* THE EXPANDED BODY (user ruling 2026-08-01). The tag browser is
             * not a sibling overlay — it is this search modal's second state. Enter
             * commits the query and swaps the result rows for the full body;
             * committed tags ride along as chips on the same query. */
            expanded={tagMode.isProvided && tagMode.expanded}
            /* ENTER OPENS THE RESULTS PAGE (2026-09-28, user: "you would then have
             * the option of pressing enter … which would take you to the shared
             * index search results page … instead of another weird nested
             * overlay"). The page keeps the query in its URL, so Back returns to
             * it. Without a `searchPath` Enter keeps the older in-place browser. */
            onExpand={searchPath ? openResultsPage : () => tagMode.setExpanded?.(true)}
            enterLabel={searchPath ? `All results for “${searchQuery.trim()}”` : undefined}
            /* ⌘ENTER AND THE FOOTER LINK open the results page (2026-10-01); plain Enter opens
             * the highlighted row and only falls through to the page when nothing matched. */
            onOpenResults={searchPath ? openResultsPage : undefined}
            resultsLabel={`All results for “${searchQuery.trim()}”`}
            chips={tagMode.isProvided ? tagMode.activeTags : []}
            onRemoveChip={tagMode.removeTag}
            placeholder="Search…"
            onSelect={(item) => {
              /* `action` before `href`: not every hit is a destination. A tag
               * row FILTERS the same query and the search modal STAYS OPEN — closing
               * it was the behaviour that forced tags into a second overlay.
               * Only a destination dismisses. */
              if (typeof item?.action === 'function') {
                item.action()
                setSearchQuery('')
                return
              }
              closeSearch()
              if (item?.href) navigate(item.href)
            }}
          >
            {tagMode.isProvided && tagMode.expanded ? <TagModeOverlay /> : null}
          </ShellSearchOverlay>

          {isShortcutsOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setIsShortcutsOpen(false)} />}

          {/* THE SHELL'S SETTINGS (2026-09-28, user: "might we also want to utilize a
            * settings page or settings sidebar … to offload some functional
            * settings, search settings, sidenav settings"). A right drawer over
            * the page, the same rows the apps' settings use (SettingsSections). */}
          {/* THE APPROVED DRAWER (2026-09-30): kol-component's `SettingsPanel` — the composition locked
            * 2026-08-27 that media's Display settings and Trash already wear: title header, divided
            * sections. This was a hand-built ShellDrawer + eyebrow + undivided sections. */}
          <SettingsPanel open={isSettingsOpen} variant="drawer" title="Settings" onClose={() => setIsSettingsOpen(false)}>
            <SettingsSections sections={settingsSections} divided />
          </SettingsPanel>
        </div>
        </ShellNavCollapsedContext.Provider>
        </ShellTocCollapsedContext.Provider>
        </ShellContentWidthContext.Provider>
      </ShellFullHeightContext.Provider>
    </ShellTocContext.Provider>
    </ShellPageMetaContext.Provider>
  )
}

export default ShellLayout
