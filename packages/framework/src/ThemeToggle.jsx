import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

const STORAGE_KEY = 'kol-theme'

/* An explicit choice is an app-set data-theme attribute or a saved user
 * toggle. Absent both, the DS is light-first and follows the system
 * (prefers-color-scheme) — matching the theme CSS, which only darkens via
 * explicit [data-theme="dark"] or the media query. */
function getExplicitTheme() {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* storage blocked */ }
  return null
}

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  return getExplicitTheme()
    ?? (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light')
}

/**
 * Theme toggle — horizontal icon-swap button.
 *
 * Variants:
 *   icon     — minimal 32×32 icon-only button (no container chrome). For
 *              top-bar / nav-bar use where the toggle sits inline with other
 *              icon buttons.
 *   hop      — full-width labeled Button-primary-styled sidenav row
 *              (bg-fg-04, on-primary text). For sidenav rows where it pairs
 *              with other Button-primary "hop" entries.
 *   hop-bare — same shape + padding as hop, but fully transparent (no rest
 *              bg, no hover bg). For sidenav rows where the row should read
 *              as plain text + icon, not a button.
 *
 * Self-contained but never imposing: initial state is the app-set
 * `data-theme` attribute, else the user's saved toggle (`kol-theme`), else
 * the system preference. `data-theme` + localStorage are written ONLY on a
 * user toggle — mounting the component leaves the DOM untouched, so an
 * undecided page keeps following prefers-color-scheme via the theme CSS.
 * The icon-swap animation slides the `mode-toggle-01` / `mode-toggle-02`
 * pair (v1 set) horizontally — two different halves of the split circle,
 * so the slide is a visible flip.
 */
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    /* Re-stamp a previously saved user choice so persistence works in apps
     * with no theme boot script — but only when the app itself hasn't set
     * data-theme (an app-set attribute always wins over storage). */
    const attr = document.documentElement.dataset.theme
    let saved = null
    try { saved = localStorage.getItem(STORAGE_KEY) } catch { /* storage blocked */ }
    if (attr !== 'light' && attr !== 'dark') {
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.dataset.theme = saved
        return
      }
      /* No explicit choice anywhere — CSS follows the system on its own;
       * this listener only keeps the toggle's icon in sync with it. */
      const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
      if (!mq?.addEventListener) return
      const onChange = (e) => {
        try { if (localStorage.getItem(STORAGE_KEY)) return } catch { /* storage blocked */ }
        setTheme(e.matches ? 'dark' : 'light')
      }
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
  }, [])

  const isDark = theme === 'dark'
  const next = isDark ? 'light' : 'dark'
  const handleToggle = () => {
    setTheme(next)
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* storage blocked */ }
  }

  const iconSwap = (size) => (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="flex transition-transform duration-500 ease-in-out"
        style={{ width: size * 2, transform: isDark ? 'translateX(0)' : `translateX(-${size}px)` }}
      >
        <Icon name="mode-toggle-01" size={size} />
        <Icon name="mode-toggle-02" size={size} />
      </span>
    </span>
  )

  if (variant === 'hop' || variant === 'hop-bare') {
    const bare = variant === 'hop-bare'
    const chromeCls = bare
      ? 'w-full inline-flex items-center justify-start gap-2 py-1.5 px-6 kol-mono-14 bg-transparent text-emphasis transition-colors'
      : 'kol-btn kol-btn-primary kol-btn-md kol-mono-14 w-full justify-start gap-2'
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Switch to ${next} mode`}
        className={`${chromeCls} ${className}`.trim()}
      >
        <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
          {iconSwap(16)}
        </span>
        {/* kol-sidenav-hop-label keeps the responsive label-hide rule firing
         * at narrow viewports without subjecting the button to the muted
         * sidenav-hop text-color override. */}
        <span className="kol-sidenav-hop-label flex-1 min-w-0 text-left">
          {isDark ? 'Dark mode' : 'Light mode'}
        </span>
      </button>
    )
  }

  // variant === 'icon' (default)
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`inline-flex items-center justify-center w-8 h-8 p-0 bg-transparent border-0 cursor-pointer text-emphasis hover:opacity-80 transition-opacity duration-300 ${className}`.trim()}
    >
      {iconSwap(18)}
    </button>
  )
}
