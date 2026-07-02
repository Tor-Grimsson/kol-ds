import { createContext, useState, useEffect, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import ShellHeader from './ShellHeader.jsx'
import ShellSidebar from './ShellSidebar.jsx'
import ShellDrawer from './ShellDrawer.jsx'
import ShellSearchOverlay from './ShellSearchOverlay.jsx'

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

const NavColumn = ({ children }) => (
  <aside className="hidden lg:block shrink-0 pt-6 md:pt-6 lg:pt-8">
    <div className="shell-sidebar-sticky sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {children}
    </div>
  </aside>
)

const MainColumn = ({ children, fullHeight }) => (
  <main className={`w-full min-w-0${fullHeight ? ' h-full flex flex-col' : ''}`}>
    {fullHeight
      ? children
      : <div className="pt-6 md:pt-6 lg:pt-8 pb-8">{children}</div>
    }
  </main>
)

const TocColumn = ({ children }) => (
  <aside className="hidden lg:block shrink-0 pt-6 md:pt-6 lg:pt-8">
    <div className="sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {children}
    </div>
  </aside>
)

const ShellLayout = ({ routes = [], basePath = '/', brandLogoSrc, brandLogoAlt = '', renderSidebar, searchItems, defaultTocContent }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tocContent, setTocContent] = useState(null)
  const [isFullHeight, setIsFullHeight] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if ((e.altKey) && e.key === 'b') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const effectiveTocContent = tocContent ?? defaultTocContent
  const hasToc = Boolean(effectiveTocContent)
  const showNav = !navCollapsed
  const showToc = hasToc && !tocCollapsed

  const layoutType = showNav && showToc ? 'nav-toc' : showNav ? 'nav' : showToc ? 'toc' : 'none'

  const gridCols = showNav
    ? showToc
      ? 'lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)_160px]'
      : 'lg:grid-cols-[256px_minmax(0,1fr)]'
    : showToc
      ? 'xl:grid-cols-[minmax(0,1fr)_160px]'
      : ''

  return (
    <ShellTocContext.Provider value={setTocContent}>
      <ShellFullHeightContext.Provider value={setIsFullHeight}>
        <ShellTocCollapsedContext.Provider value={setTocCollapsed}>
        <div className="fixed inset-0 flex flex-col bg-surface-primary text-auto">
          <ShellHeader
            brandLogoSrc={brandLogoSrc}
            brandLogoAlt={brandLogoAlt}
            routes={routes}
            basePath={basePath}
            onSearchOpen={() => setIsSearchOpen(true)}
            onMenuOpen={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) {
                setNavCollapsed((p) => !p)
                setTocCollapsed((p) => !p)
              } else {
                setIsNavDrawerOpen(true)
              }
            }}
            onNavToggle={() => setNavCollapsed((p) => !p)}
            onTocToggle={hasToc ? () => setTocCollapsed((p) => !p) : null}
            navCollapsed={navCollapsed}
            tocCollapsed={tocCollapsed}
          />

          <div className="flex-1 overflow-hidden">
            <div className={`h-full ${isFullHeight ? 'overflow-hidden' : 'overflow-y-auto'}`} style={{ scrollbarGutter: 'stable' }}>
              <div className={`mx-auto w-full max-w-[1800px] px-4 md:px-5 lg:px-6${isFullHeight ? ' h-full' : ' pb-16'}`}>
                <div className={`shell-content-grid grid gap-8 ${gridCols}${isFullHeight ? ' h-full' : ''}`} data-layout={layoutType}>
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
          </div>

          <ShellDrawer
            isOpen={isNavDrawerOpen}
            onClose={() => setIsNavDrawerOpen(false)}
          >
            {renderSidebar
              ? renderSidebar({ onNavigate: () => setIsNavDrawerOpen(false) })
              : <ShellSidebar routes={routes} basePath={basePath} onNavigate={() => setIsNavDrawerOpen(false)} />
            }
          </ShellDrawer>

          <ShellSearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            routes={routes}
            basePath={basePath}
            items={searchItems}
          />
        </div>
        </ShellTocCollapsedContext.Provider>
      </ShellFullHeightContext.Provider>
    </ShellTocContext.Provider>
  )
}

export default ShellLayout
