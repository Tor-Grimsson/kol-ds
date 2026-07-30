import { useEffect, useState } from 'react'

/* Theme-state machinery — the logic behind ThemeToggle, exported so app code
 * (navbars, heroes, anything theme-aware) can read/set the theme without
 * mounting the toggle UI. Policy (USER law, corrected 2026-07-28):
 * explicit choice > system/auto > light. An explicit choice is an app-set
 * data-theme attribute or a saved user toggle; absent both, the theme
 * follows prefers-color-scheme (the theme CSS ≥0.11.6 mirrors this via
 * `:root:not([data-theme])`, so state and render agree); light is the
 * last-resort fallback. A consumer stamps data-theme to veto the OS.
 *
 * Tri-state (0.6.0): `mode` is 'light' | 'dark' | 'system'. 'system' is the
 * absence of an explicit choice — applyTheme('system') clears the stamp and
 * the saved key, handing the page back to the OS. `theme` stays the RESOLVED
 * value ('light'|'dark') so existing consumers keep working unchanged.
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

/* One resolver for both axes: mode (the choice) + theme (what renders). */
function resolveThemeState() {
  const explicit = getExplicitTheme()
  if (explicit) return { mode: explicit, theme: explicit }
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  return { mode: 'system', theme: dark ? 'dark' : 'light' }
}

export function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  return resolveThemeState().theme
}

/** Stamp + persist an explicit theme choice — or 'system' to clear both and
 * hand the page back to prefers-color-scheme. */
export function applyTheme(theme) {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme
    try { localStorage.removeItem(THEME_STORAGE_KEY) } catch { /* storage blocked */ }
    return
  }
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* storage blocked */ }
}

/**
 * useTheme — live theme state, synced across every consumer.
 *
 * All instances observe the html `data-theme` attribute, so any writer
 * (this hook's setTheme, ThemeToggle, an app boot script) updates every
 * reader. When the page has no explicit choice, the theme follows the
 * system (explicit > system > light).
 * Returns { theme, isDark, mode, setTheme, toggle, cycle }:
 *   theme  — resolved 'light' | 'dark' (what renders right now)
 *   mode   — 'light' | 'dark' | 'system' (what is chosen)
 *   setTheme(t) — stamp 'light'/'dark', or 'system' to follow the OS
 *   toggle — binary light↔dark (always an explicit choice; kept for compat)
 *   cycle  — light ↔ dark (two positions; see the ruling at the call site)
 *   clear  — hand the page back to the OS (what 'system' actually is)
 */
export function useTheme() {
  const [state, setState] = useState(() =>
    typeof document === 'undefined'
      ? { mode: 'light', theme: 'light' }
      : resolveThemeState()
  )

  useEffect(() => {
    /* Re-stamp a previously saved user choice so persistence works in apps
     * with no theme boot script — but only when the app itself hasn't set
     * data-theme (an app-set attribute always wins over storage). Idempotent
     * across instances; the observer below picks the stamp up. */
    const attr = document.documentElement.dataset.theme
    let saved = null
    try { saved = localStorage.getItem(THEME_STORAGE_KEY) } catch { /* storage blocked */ }
    if (attr !== 'light' && attr !== 'dark' && (saved === 'light' || saved === 'dark')) {
      document.documentElement.dataset.theme = saved
    }

    /* One sync path for every writer: data-theme mutations (stamp OR removal)
     * and live OS switches both re-resolve. resolveThemeState ignores the OS
     * whenever an explicit choice exists, so the guards are inherent. */
    const sync = () => setState(resolveThemeState())
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    mq?.addEventListener?.('change', sync)

    sync()
    return () => {
      observer.disconnect()
      mq?.removeEventListener?.('change', sync)
    }
  }, [])

  const setTheme = (t) => {
    applyTheme(t)
    setState(resolveThemeState())
  }

  return {
    theme: state.theme,
    isDark: state.theme === 'dark',
    mode: state.mode,
    setTheme,
    toggle: () => setTheme(state.theme === 'dark' ? 'light' : 'dark'),
    /* light ↔ dark, TWO positions (user ruling 2026-07-30: "system … that is
     * not a state"). `system` is the absence of a choice, so a click can land
     * ON it only by resetting — never by cycling INTO it. From system, cycling
     * commits the value the OS is currently resolving to, which is the one
     * thing a user can predict from what they're looking at. */
    cycle: () => setTheme(state.theme === 'dark' ? 'light' : 'dark'),
    /* the reset — hands the page back to the OS. Kept as its own verb, not a
     * rung, so no single click can walk into it. */
    clear: () => setTheme('system'),
  }
}
