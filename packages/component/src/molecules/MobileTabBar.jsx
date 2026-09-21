import { Icon } from '@kolkrabbi/kol-icons'

/**
 * MobileTabBar — the floating bottom tab pill, below `md` only.
 *
 * Both references end the same way: neither iOS Files nor Dropbox stacks two
 * full-height surfaces on a phone. Each floats a pill at the bottom and gives
 * every surface a tab — Files `Recents · Shared · Browse`, Dropbox `Home ·
 * Files · Photos · Account` (ColumnBrowserMobileViews §5, kol-r2b2, user-ruled
 * 2026-09-03). It is what answers the question `ColumnBrowserStackMode` left
 * open: the library wall does NOT stay stacked under the browser.
 *
 * WHAT A TAB MEANS IS THE CONSUMER'S. This ships the pill — the shape, the
 * float, the states, the breakpoint — and takes a list. A repo whose surfaces
 * are routes wires it to its router; one whose surfaces are variants swaps a
 * variant. The DS deciding that a media library has exactly three surfaces
 * called Browse, Files and Kinds is the kind of guess that makes an organism
 * un-reusable.
 *
 * FLOATS, not a layout row: it sits over the list on `position: fixed` so the
 * list scrolls under it, which is what both references do. The consumer owes
 * the list bottom padding — `--kol-tabbar-h` is published for exactly that, so
 * nobody hardcodes 56.
 *
 * @param {Array<{value: string, label: string, icon?: string}>} tabs
 * @param {string}   value      the active tab
 * @param {Function} onChange   (value) => void
 * @param {string}   className  extra classes on the pill
 */

export const TABBAR_H = 56

export default function MobileTabBar({ tabs = [], value, onChange, className = '' }) {
  if (tabs.length === 0) return null
  return (
    <nav
      className={`kol-mobile-tabbar md:hidden fixed inset-x-0 bottom-0 z-[var(--kol-z-sticky)] flex items-stretch ${className}`.trim()}
      style={{
        height: TABBAR_H,
        /* the pill's own ground, not the page's — it floats OVER content, so a
         * transparent bar would show rows sliding through the labels */
        background: 'var(--kol-surface-primary)',
        borderTop: '1px solid var(--kol-oq-08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Sections"
    >
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange?.(t.value)}
            aria-current={active ? 'page' : undefined}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 cursor-pointer"
            style={{ background: 'transparent', border: 'none', color: active ? 'var(--kol-fg-default)' : 'var(--kol-fg-48)' }}
          >
            {t.icon && <Icon name={t.icon} size={18} />}
            {/* helper is single-line chrome, which a tab label always is */}
            <span className="kol-helper-10 truncate max-w-full px-1">{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
