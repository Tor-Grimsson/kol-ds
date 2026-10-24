import { createContext, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideNav from './SideNav.jsx'
import { Button, ModalProvider } from '@kolkrabbi/kol-component'

/* Pages can register right-rail TOC content via this context.
 * Usage: const setTocContent = useContext(ShellTocContext)
 * useLayoutEffect(() => { setTocContent(<MyToc />); return () => setTocContent(null) }, [])
 * No page registered + no defaultTocContent prop → no rail, layout unchanged. */
export const ShellTocContext = createContext(null)

/* Pages can suppress the TOC rail (e.g. hide an app-level defaultTocContent).
 * Usage: const setTocCollapsed = useContext(ShellTocCollapsedContext)
 * useLayoutEffect(() => { setTocCollapsed(true); return () => setTocCollapsed(false) }, [setTocCollapsed]) */
export const ShellTocCollapsedContext = createContext(null)

/* `getActivePage` — inert since the 2026-08-09 SideNav port (the two-level
 * elder model derives the active category from the route). No longer
 * destructured: a prop nobody reads is not part of the signature (props gate
 * P2), and an unknown prop on a component is simply ignored, so no call site
 * breaks. */
/* `sideNav` — every SideNav prop AppShell does not own, spread onto the rail
 * (sidenav-rail-hairline, 2026-08-26): `background`, `hairline`, `isActive`,
 * `onNavigate` … the next rail option needs no AppShell release. */
/**
 * SiteLayout — The site frame. the frame every site on the site rail stands in: the `.kol-brand-layout`
 * grid with `NavRail variant="site"` (through `SideNav`) in its first track, the page plane in the
 * second, the phone drawer, the modal provider and the optional TOC rail. A site is this plus a nav
 * tree and routes — `apps/site-hub` is the reference.
 *
 * WAS `PageLayout` (user 2026-10-24: "why not SiteLayout instead? to at least name it with variant
 * 'site'") — the frame is named for the rail variant it frames, as `AppShell` is for the app rail.
 * `PageLayout` stays an alias on the retirements ledger, as `AppShell` already was.
 *
 * THE PHONE MODE IS THE APP RAIL'S DRAWER (user 2026-10-24: "I think we should use that hamburger
 * siderail"): below 768 the rail goes off-canvas and slides in from the left on the shell's 220ms
 * curve, a 32px nav Button pinned top-right swaps hamburger for × (`.kol-shell-drawer-trigger`,
 * kol-theme), a scrim BUTTON closes on tap (`.kol-shell-drawer-scrim`; iOS Safari does not bubble
 * taps from a div), Escape closes, and a tap on a destination closes. The round top-left hamburger
 * and the opacity backdrop this frame carried are in `_tmp/2026-10-24-site-drawer/`.
 *
 * BEFORE THAT it was `AppShell` (page-family-is-not-a-set, kol-client-olina 2026-09-03). The
 * ticket asked for a `PageLayout` to ship beside the fifteen `.kol-brand-layout`
 * rules kol-framework already owned — every consumer `BrandLayout.jsx` in the
 * estate is a copy of this file's markup. The component existed; the name did
 * not say so, and it collided with kol-shell's `AppShell` (the 48px app rail).
 * Renamed, `AppShell` aliased on the retirements ledger, and the two things the
 * forks carried that it lacked folded in:
 *
 *   pageWash  the plane's wash over the primary back — the SAME prop and
 *             variable as kol-shell's `AppShell` (`--kol-shell-page-wash`; there
 *             `PageShell` paints it, here the plane does), so a brand page and a
 *             monitor / mirror / fxr page step their lightness with one name
 *             (user 2026-08-27). A translucent `fg-*` over `surface-primary`,
 *             never an opaque swap. Unset = the plane IS the back.
 *   bare      the plane and the outlet only — no grid, no rail, no drawer. The
 *             forks' `?embed=1` branch, for iframing a page into another site.
 *
 * THE BACK IS `surface-primary` (BrandLayout's line, user rulings 2026-08-24 →
 * 08-27): the rail sits on it, the plane wears the wash. It was
 * `surface-tertiary` here (appshell-content-surface, kol-studio 2026-08-26) —
 * one component takes one model, and kol-studio passes its wash.
 *
 * @param {Array}     navTree            the sidenav's tree (see SideNav)
 * @param {ReactNode} header             above the outlet on the plane
 * @param {ReactNode} footer             below the outlet on the plane
 * @param {ReactNode} defaultTocContent  the TOC rail's content when no page registers one
 * @param {object}    sideNav            every SideNav prop this layout does not own, spread onto the rail
 * @param {string}    pageWash           the plane's wash, a CSS color (e.g. `'var(--kol-fg-02)'`)
 * @param {boolean}   bare               plane + outlet only (default false)
 */
const NARROW = '(max-width: 767px)'

export default function SiteLayout({ navTree = [], header, footer, defaultTocContent, sideNav, pageWash, bare = false }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  /* DRAWER MODE below 768 — a width query, as AppShell's `drawerBelow`; JS owns the breakpoint and
   * stamps `data-rail-drawer` on the root, the CSS only paints */
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW).matches)
  useEffect(() => {
    const mq = window.matchMedia(NARROW)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => { if (!narrow) setDrawerOpen(false) }, [narrow])
  const [tocContent, setTocContent] = useState(null)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const effectiveTocContent = tocContent ?? defaultTocContent
  const showToc = Boolean(effectiveTocContent) && !tocCollapsed

  /* ONE OWNER PER PIXEL (two-page-scaffolds-one-job, kol-client-olina
   * 2026-09-03). The plane paints the wash and hands `--kol-shell-page-wash:
   * transparent` down: the variable means WHAT IS LEFT TO PAINT, so a
   * PageShell — or any page root that reads it — inside this frame paints
   * nothing over the plane. BrandLayout's line set the wash on the plane AND
   * painted it, so a nested PageShell painted it again: `fg-02` rendered as two
   * 0.02 layers, measured on olina's /slide-deck, the one page beside twenty
   * `.kol-page` siblings that came out darker. kol-shell's AppShell keeps its
   * own model (the wrapper paints the back, PageShell paints the wash — one
   * paint there too). */
  const plane = {
    background: pageWash ?? 'var(--kol-surface-primary)',
    '--kol-shell-page-wash': 'transparent',
  }

  if (bare) {
    return (
      <ModalProvider>
        <ShellTocContext.Provider value={setTocContent}>
          <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
            <div className="min-h-dvh min-w-0" style={plane}>
              <Outlet />
            </div>
          </ShellTocCollapsedContext.Provider>
        </ShellTocContext.Provider>
      </ModalProvider>
    )
  }

  return (
    <ModalProvider>
      <ShellTocContext.Provider value={setTocContent}>
        <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
          <div
            /* TWO surfaces: the BACK is surface-primary, the rail sits on it,
             * and the PLANE wears `pageWash` over it (BrandLayout's line,
             * 2026-08-24 → 08-27). */
            className="kol-brand-layout bg-surface-primary min-h-dvh"
            data-rail-drawer={narrow ? (drawerOpen ? 'open' : 'closed') : undefined}
            data-toc={showToc ? 'true' : undefined}
          >
            {/* THE TRIGGER SHIPS HERE, as the app rail's does in AppShell — hamburger closed, × open; 32px clears the
              * 24px touch floor; pinned top-right so it never meets the left-hand panel */}
            {narrow && (
              <Button
                variant="nav"
                iconOnly={drawerOpen ? 'x' : 'hamburger'}
                aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={drawerOpen}
                className="kol-shell-drawer-trigger"
                onClick={() => setDrawerOpen((o) => !o)}
              />
            )}
            {narrow && drawerOpen && (
              /* A BUTTON, not a div: iOS Safari does not bubble tap-clicks from non-interactive elements */
              <button
                type="button"
                aria-label="Close navigation"
                className="kol-shell-drawer-scrim"
                onClick={() => setDrawerOpen(false)}
              />
            )}

            <SideNav navTree={navTree} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} {...sideNav} />
            <div className="min-w-0" style={plane}>
              {header}
              <Outlet />
              {footer}
            </div>

            {showToc && (
              <aside className="kol-toc-rail hidden xl:block min-w-0 sticky top-0 self-start h-dvh overflow-y-auto pt-8 pr-6">
                {effectiveTocContent}
              </aside>
            )}
          </div>
        </ShellTocCollapsedContext.Provider>
      </ShellTocContext.Provider>
    </ModalProvider>
  )
}
