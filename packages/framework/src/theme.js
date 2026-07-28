import { useEffect, useState } from 'react'

/* Theme-state machinery — the logic behind ThemeToggle, exported so app code
 * (navbars, heroes, anything theme-aware) can read/set the theme without
 * mounting the toggle UI. Policy: the DS is light-first (USER law, theme
 * 0.9.2 dropped the OS-follow auto-dark CSS); an explicit choice is an
 * app-set data-theme attribute or a saved user toggle, and absent both the
 * theme is light — never the OS preference, so state can't disagree with
 * what the CSS renders. `data-theme` + localStorage are written ONLY through
 * applyTheme (a user action) — mounting a reader leaves the DOM untouched. */

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
  return getExplicitTheme() ?? 'light'
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
 * reader. When the page has no explicit choice, the theme is light
 * (light-first law). Returns { theme, isDark, setTheme, toggle }.
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

    return () => {
      observer.disconnect()
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
