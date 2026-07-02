/* Aligned to the showcase's theme contract: same storage key as
 * kol-framework's ThemeToggle (`kol-theme`), light default, and the
 * boot-script's <html data-theme> is the source of truth on load. */
const STORAGE_KEY = 'kol-theme'

export const applyTheme = (mode = 'light') => {
  if (typeof document === 'undefined') return

  const theme = mode === 'dark' ? 'dark' : 'light'
  const root = document.documentElement

  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  localStorage.setItem(STORAGE_KEY, theme)

  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
}

export const getInitialTheme = () => {
  if (typeof document === 'undefined') return 'light'

  // The index.html boot script already resolved storage + default.
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export const subscribeToSystemTheme = (handler) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (event) => handler(event.matches ? 'dark' : 'light')

  mediaQuery.addEventListener('change', listener)
  return () => mediaQuery.removeEventListener('change', listener)
}
