import { Icon } from '@kolkrabbi/kol-icons'
import { SearchInput, Tooltip } from '@kolkrabbi/kol-component'
import ThemeToggle from './ThemeToggle.jsx'

/**
 * ShellHeader — the shell's sticky two-row top chrome.
 *
 * Row 1 is the brand block (consumer-supplied `brand` node — logo, wordmark,
 * link element, whatever the app wants) plus right-side controls: an `actions`
 * slot, the framework ThemeToggle, and an optional hamburger. Row 2 is a
 * horizontal section-tab strip plus an optional inline search and the
 * dock-left / dock-right rail toggles. The bar is stateless — every action is
 * delegated up via callbacks; only ThemeToggle owns state (its own).
 *
 * Router-agnostic: tabs are plain anchors built from `nav` items
 * (`{ label, href, icon? }`). Active styling keys on `aria-current="page"`,
 * set by the `isActive(href)` predicate; `onNavigate(event, item)` is the
 * client-routing seam (preventDefault + push in the consumer).
 *
 * Row 2 renders only when it has content (tabs, search, or a rail toggle).
 * Tab-strip chrome (mono type, active underline, hidden scrollbar, wide-
 * viewport bumps) lives in kol-framework.css under kol-shell-header-*.
 *
 * Every icon-only control is Tooltip-wrapped and aria-labelled, the bar is a
 * real `<header>` landmark, and the theme toggle steps up a rung at lg+ —
 * folded in from the kol-website workshop fork (2026-07-30), which existed
 * only to add these. Consumers get ONE header; the fork is retired.
 *
 * @param {ReactNode} brand          Row-1 left slot — logo/wordmark + link, consumer-supplied
 * @param {Array}     nav            section tabs: [{ label, href, icon? }]
 * @param {Function}  isActive       (href) => boolean — marks the active tab
 * @param {Function}  onNavigate     (event, item) => void — tab click seam for client routing
 * @param {boolean|Object} search    Row-2 inline search; object spreads onto SearchInput
 *                                   ({ value, onChange, onFocus, placeholder, shortcutHint, onClear, … })
 * @param {ReactNode} actions        Row-1 trailing slot before the theme toggle (e.g. a search-overlay trigger)
 * @param {boolean}   showThemeToggle render the framework ThemeToggle (default true)
 * @param {Function}  onMenuClick    hamburger click; button renders only when set
 * @param {Function}  onNavToggle    dock-left click → toggle left nav; button renders only when set (lg+)
 * @param {Function}  onTocToggle    dock-right click → toggle TOC rail; button renders only when set (lg+)
 * @param {boolean}   navCollapsed   tints the dock-left button
 * @param {boolean}   tocCollapsed   tints the dock-right button
 * @param {string}    className      extra classes on the outer bar
 */

/* ONE header-action glyph size (user 2026-08-01: "icon in navbar is small and
 * wrong"). The row mixed sizes: the ThemeToggle draws its solo glyph at 24 on
 * the `lg` rung while search, GitHub and the hamburger sat at 18 — four
 * controls, two scales, in a row eight inches wide. Named once here so a new
 * control cannot pick its own. */
export const HEADER_ICON = 24

const iconBtnCls =
  'flex h-9 w-9 items-center justify-center rounded p-0 bg-transparent border-0 cursor-pointer transition-colors hover:bg-fg-08 hover:text-emphasis'

export default function ShellHeader({
  brand,
  nav = [],
  isActive,
  onNavigate,
  search,
  actions,
  showThemeToggle = true,
  onMenuClick,
  onNavToggle,
  onTocToggle,
  navCollapsed,
  tocCollapsed,
  className = '',
}) {
  const hasTabRow = nav.length > 0 || Boolean(search) || Boolean(onNavToggle) || Boolean(onTocToggle)

  return (
    <header className={`kol-shell-header sticky top-0 z-50 shrink-0 bg-surface-primary ${className}`.trim()}>
      {/* Row 1: brand block + controls */}
      <div className="border-b border-fg-08">
        {/* Chrome inset from --kol-pad-chrome-x, not Tailwind steps
          * (2026-07-31): the header sat on its own improvised steps while the
          * shell content frame sat on the page ramp, so the sidebar hung right
          * of the wordmark above it. One token, both surfaces. */}
        <div className="w-full py-4" style={{ paddingInline: 'var(--kol-pad-chrome-x)' }}>
          <div className="flex items-center justify-between">
            {/* kol-shell-header-brand reserves the nav-column width at lg+ so
             * the Row-2 tabs align to the shell grid. */}
            <div className="kol-shell-header-brand flex min-w-0 items-center gap-8">
              {brand}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {actions}
              {showThemeToggle && (
                <Tooltip label="Toggle theme">
                  {/* one rung up at lg+ — the bar has room, and the toggle is
                    * the most-used control in the row. New spec API (0.9.0):
                    * quiet square = button geometry + fill none + no label
                    * (was the old `icon` variant default). */}
                  <span className="hidden lg:inline-flex"><ThemeToggle fill="none" label={false} size="lg" /></span>
                  <span className="lg:hidden"><ThemeToggle fill="none" label={false} /></span>
                </Tooltip>
              )}
              {onMenuClick && (
                <Tooltip label="Open navigation menu">
                  <button
                    type="button"
                    className={`${iconBtnCls} text-fg-64`}
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                  >
                    <Icon name="hamburger" size={HEADER_ICON} />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: section tabs + inline search + rail toggles */}
      {hasTabRow && (
        <div className="border-b border-fg-08">
          <div className="w-full" style={{ paddingInline: 'var(--kol-pad-chrome-x)' }}>
            <div className="kol-shell-header-tabs">
              <nav className="flex flex-1 gap-6" aria-label="Sections">
                {nav.map((item) => {
                  const active = isActive ? isActive(item.href) : false
                  return (
                    <a
                      key={item.href ?? item.label}
                      href={item.href}
                      className="kol-shell-header-tab"
                      aria-current={active ? 'page' : undefined}
                      onClick={onNavigate ? (event) => onNavigate(event, item) : undefined}
                    >
                      {item.icon && <Icon name={item.icon} size={14} />}
                      {item.label}
                    </a>
                  )
                })}
              </nav>
              {search && (
                <SearchInput
                  className="shrink-0 self-center"
                  aria-label="Search"
                  {...(search === true ? {} : search)}
                />
              )}
              {(onNavToggle || onTocToggle) && (
                <div className="hidden lg:flex items-center gap-1 pb-2">
                  {onNavToggle && (
                    <Tooltip label="Toggle navigation sidebar">
                      <button
                        type="button"
                        className={`${iconBtnCls} ${navCollapsed ? 'text-fg-32' : 'text-fg-64'}`}
                        onClick={onNavToggle}
                        aria-label="Toggle navigation sidebar"
                        aria-pressed={!navCollapsed}
                      >
                        <Icon name="panel-left" size={18} />
                      </button>
                    </Tooltip>
                  )}
                  {onTocToggle && (
                    <Tooltip label="Toggle table of contents sidebar">
                      <button
                        type="button"
                        className={`${iconBtnCls} ${tocCollapsed ? 'text-fg-32' : 'text-fg-64'}`}
                        onClick={onTocToggle}
                        aria-label="Toggle table of contents sidebar"
                        aria-pressed={!tocCollapsed}
                      >
                        <Icon name="panel-right" size={18} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
