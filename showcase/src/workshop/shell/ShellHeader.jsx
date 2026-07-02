import { Link, NavLink } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-loader'
import SearchInput from '../vendor/SearchInput.jsx'
import { useTheme } from '../vendor/useTheme.js'
import KolWordmark from '../vendor/Wordmark.jsx'
import KolLogomark from '../vendor/KolLogomark.jsx'

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

const hamburgerSvg = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="3.75" width="14" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="2" y="12.75" width="14" height="1.5" rx="0.75" fill="currentColor"/>
  </svg>
)

const ShellHeader = ({
  brandLogoSrc,
  brandLogoAlt = '',
  routes = [],
  basePath = '/',
  onMenuOpen,
  onNavToggle,
  onTocToggle,
  navCollapsed,
  tocCollapsed,
  onSearchOpen,
  onSearch,
  searchQuery,
}) => {
  const { toggleTheme } = useTheme()

  return (
    <div className="sticky top-0 z-50 shrink-0 bg-surface-primary">
      {/* Row 1: Wordmark + brand logo + controls */}
      <div className="border-b border-fg-08">
        <div className="mx-auto max-w-[1800px] px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: wordmark + brand logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="shell-header-logo mt-[2px] flex items-center transition-opacity hover:opacity-80 w-auto lg:w-[256px]"
              >
                <KolLogomark className="h-6 w-6 md:hidden" />
                <KolWordmark className="h-6 w-auto hidden md:block" />
              </Link>
              {brandLogoSrc && (
                <Link to={basePath} className="flex items-center transition-opacity hover:opacity-80">
                  <img
                    src={brandLogoSrc}
                    alt={brandLogoAlt}
                    className="wordmarkBrand h-6 w-auto"
                  />
                </Link>
              )}
            </div>

            {/* Right: search icon + theme toggle + hamburger / sidebar toggle */}
            <div className="flex items-center gap-1">
              {onSearchOpen && (
                <SearchInput iconOnly onClick={onSearchOpen} />
              )}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-md text-fg-64 transition-colors hover:bg-fg-08 hover:text-fg"
              >
                <Icon name="theme-toggle" size={18} />
              </button>
              {onMenuOpen && (
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-fg-64 transition-colors hover:bg-fg-08 hover:text-fg"
                  onClick={onMenuOpen}
                  aria-label="Open navigation menu"
                >
                  {hamburgerSvg}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Section tabs */}
      <div className="border-b border-fg-08">
        <div className="mx-auto max-w-[1800px] px-4 md:px-5 lg:px-6">
          <div className="shell-tabrow-items">
            <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
              {routes.map((route) => {
                const to = getSectionRootPath(route, basePath)
                const isRoot = to === basePath
                return (
                  <NavLink
                    key={route.id}
                    to={to}
                    end={isRoot}
                    className="shell-tab"
                  >
                    {route.icon && <Icon name={route.icon} size={14} />}
                    {route.label}
                  </NavLink>
                )
              })}
            </div>
            {onSearch && (
              <SearchInput
                value={searchQuery || ''}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search..."
              />
            )}
            <div className="hidden lg:flex items-center gap-1" style={{ paddingBottom: '8px' }}>
              {onNavToggle && (
                <button
                  type="button"
                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-fg-08 hover:text-fg ${navCollapsed ? 'text-fg-32' : 'text-fg-64'}`}
                  onClick={onNavToggle}
                  aria-label="Toggle navigation sidebar"
                >
                  <Icon name="dock-left" size={18} />
                </button>
              )}
              {onTocToggle && (
                <button
                  type="button"
                  className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-fg-08 hover:text-fg ${tocCollapsed ? 'text-fg-32' : 'text-fg-64'}`}
                  onClick={onTocToggle}
                  aria-label="Toggle table of contents sidebar"
                >
                  <Icon name="dock-right" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShellHeader
