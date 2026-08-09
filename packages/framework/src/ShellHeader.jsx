import { Icon } from '@kolkrabbi/kol-icons'
import { IconFrame, SearchInput, Tooltip, glyphSize } from '@kolkrabbi/kol-component'
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
 * controls, two scales, in a row eight inches wide.
 *
 * It is NOT an independent number. Every header control is a `lg` rung, and
 * `SOLO.lg` (hooks/glyphLadders.js) is 24 — this constant is that ladder rung
 * under a name the chrome can import. Naming it once was not enough on its own:
 * it shipped exported and the two rail toggles still hardcoded 18 three rows
 * below it, which is the whole reason the row looked wrong after the fix. The
 * durable answer is that no header control writes a glyph size at all — it
 * writes `size="lg"` and the ladder resolves it.
 *
 * @deprecated 2026-08-01 — **zero consumers as of this change.** Every header
 * control now names its rung and takes the glyph from `SOLO`. Kept exported
 * because it is public API of a published package (breaking an export needs a
 * changeset + major bump); a consumer still importing it gets the right number,
 * it is just no longer how the chrome decides. Passing it as `iconSize` is the
 * anti-pattern this whole change removes: it pins the glyph while leaving the
 * SQUARE on whatever rung the call site forgot to set, which is precisely how
 * the search trigger ended up drawing an lg glyph in an md box. */
export const HEADER_ICON = 24

/* `iconBtnCls` lived here — a private class string re-implementing the icon
 * button box (h-9 w-9, rounded, transparent, hover wash) on three call sites,
 * with a near-duplicate of it hand-written in the showcase's GitHub link. Four
 * containers, one job. Deleted 2026-08-01: the box has an owner, and it is
 * `Button variant="ghost" quiet iconOnly` — the shape the search trigger in
 * ShellLayout had been calling correctly the entire time. */

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
                  {/* md at every width (user re-rule 2026-08-09: the whole
                    * header glyph row rides md, full ink — the earlier lg-at-lg+
                    * split is repealed, which also collapsed the two spans). */}
                  <ThemeToggle fill="none" label={false} size="md" />
                </Tooltip>
              )}
              {onMenuClick && (
                <Tooltip label="Open navigation menu">
                  {/* IconFrame, not Button (user ruling 2026-08-01). Header
                    * chrome takes a click but must not light up; the frame has
                    * no state rules at all, which is the property Button can
                    * only approximate by dropping its own. `nav` rests at FULL
                    * ink since the 2026-08-09 re-rule (was oq-64). */}
                  <IconFrame
                    name="hamburger"
                    variant="nav"
                    size="md"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                  />
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
                      {/* The ladder, not a literal (2026-08-01). This hardcoded
                        * 14 — the same value ADJACENT.sm carries, but written
                        * out, so the tab could not follow the rule it was
                        * meant to. The tab's own type is 14/18, which is that
                        * rung. */}
                      {item.icon && <Icon name={item.icon} size={glyphSize('sm')} />}
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
                      {/* The collapsed tint is a VARIANT SWAP, not a state:
                        * `ghost` rests at oq-48, `nav` at oq-64, and both are
                        * static classes with no rules to fire. That is the only
                        * honest way to express it on a frame — Button's `quiet`
                        * is an opacity transition, i.e. exactly the kind of
                        * behaviour this control was ruled out of. */}
                      <IconFrame
                        name="panel-left"
                        variant={navCollapsed ? 'ghost' : 'nav'}
                        size="sm"
                        onClick={onNavToggle}
                        aria-label="Toggle navigation sidebar"
                        aria-pressed={!navCollapsed}
                      />
                    </Tooltip>
                  )}
                  {onTocToggle && (
                    <Tooltip label="Toggle table of contents sidebar">
                      <IconFrame
                        name="panel-right"
                        variant={tocCollapsed ? 'ghost' : 'nav'}
                        size="sm"
                        onClick={onTocToggle}
                        aria-label="Toggle table of contents sidebar"
                        aria-pressed={!tocCollapsed}
                      />
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
