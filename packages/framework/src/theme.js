import { useEffect, useState } from 'react'

/* Theme-state machinery — the logic behind ThemeToggle, exported so app code
 * (navbars, heroes, anything theme-aware) can read/set the theme without
 * mounting the toggle UI. Policy (USER law, corrected 2026-07-28):
 * explicit choice > system/auto > light. An explicit choice is an app-set
 * data-theme attribute or a saved user toggle; absent both, the theme
 * follows prefers-color-scheme (the theme CSS ≥0.11.6 mirrors this via
 * `:root:not([data-theme])`, so state and render agree); light is the
 * last-resort fallback. A consumer stamps data-theme to veto the OS.
 * `data-theme` + localStorage are written ONLY through applyTheme (a user
 * action) — mounting a reader leaves the DOM untouched. */

export const THEME_STORAGE_KEY = 'kol-theme'

function getExplicitTheme() {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* storage blocked */ }
  return null
}

export function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  return getExplicitTheme()
    ?? (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light')
}

/** Stamp + persist an explicit theme choice. */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* storage blocked */ }
}

/**
 * useTheme — live theme state, synced across every consumer.
 *
 * All instances observe the html `data-theme` attribute, so any writer
 * (this hook's setTheme, ThemeToggle, an app boot script) updates every
 * reader. When the page has no explicit choice, the theme follows the
 * system (explicit > system > light). Returns { theme, isDark, setTheme, toggle }.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    /* Re-stamp a previously saved user choice so persistence works in apps
     * with no theme boot script — but only when the app itself hasn't set
     * data-theme (an app-set attribute always wins over storage). Idempotent
     * across instances. */
    const attr = document.documentElement.dataset.theme
    let saved = null
    try { saved = localStorage.getItem(THEME_STORAGE_KEY) } catch { /* storage blocked */ }
    if (attr !== 'light' && attr !== 'dark' && (saved === 'light' || saved === 'dark')) {
      document.documentElement.dataset.theme = saved
    }

    /* Sync with any data-theme writer. */
    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.theme
      if (current === 'light' || current === 'dark') setThemeState(current)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    /* No explicit choice anywhere — follow live OS switches, like the
     * theme CSS's :root:not([data-theme]) block. */
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      try { if (localStorage.getItem(THEME_STORAGE_KEY)) return } catch { /* storage blocked */ }
      if (document.documentElement.dataset.theme) return
      setThemeState(e.matches ? 'dark' : 'light')
    }
    mq?.addEventListener?.('change', onChange)

    return () => {
      observer.disconnect()
      mq?.removeEventListener?.('change', onChange)
    }
  }, [])

  const setTheme = (t) => {
    setThemeState(t)
    applyTheme(t)
  }

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
