import { createContext, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideNav from './SideNav.jsx'
import { Icon } from '@kolkrabbi/kol-loader'
import { ModalProvider } from '@kolkrabbi/kol-component'

/* Pages can register right-rail TOC content via this context.
 * Usage: const setTocContent = useContext(ShellTocContext)
 * useLayoutEffect(() => { setTocContent(<MyToc />); return () => setTocContent(null) }, [])
 * No page registered + no defaultTocContent prop → no rail, layout unchanged. */
export const ShellTocContext = createContext(null)

/* Pages can suppress the TOC rail (e.g. hide an app-level defaultTocContent).
 * Usage: const setTocCollapsed = useContext(ShellTocCollapsedContext)
 * useLayoutEffect(() => { setTocCollapsed(true); return () => setTocCollapsed(false) }, [setTocCollapsed]) */
export const ShellTocCollapsedContext = createContext(null)

export default function AppShell({ navTree = [], getActivePage, header, footer, defaultTocContent }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  return (
    <ModalProvider>
      <ShellTocContext.Provider value={setTocContent}>
        <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
          <div
            className="kol-brand-layout"
            data-drawer-open={drawerOpen ? 'true' : undefined}
            data-toc={showToc ? 'true' : undefined}
          >
            <button
              type="button"
              className="kol-sidenav-hamburger md:hidden fixed top-3 left-3 z-30 w-10 h-10 inline-flex items-center justify-center rounded-full bg-surface-primary border border-fg-08 text-emphasis"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <Icon name={drawerOpen ? 'x' : 'menu'} size={18} />
            </button>

            <div
              className="kol-sidenav-backdrop fixed inset-0 z-20 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />

            <SideNav navTree={navTree} getActivePage={getActivePage} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
            <div className="min-w-0">
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
