import { useEffect, useRef, useState } from 'react'

/**
 * useSectionTheme — the `theme` prop of the section organisms (SectionThemeInverse,
 * kol-website 2026-08-27).
 *
 *   undefined  inherit — nothing stamped
 *   'light' | 'dark'  pinned — the section carries `data-theme`, and the theme's
 *              subtree scopes (kol-theme ≥0.52.0: surfaces, fg ramp, roles, oq,
 *              borders all re-resolve on a stamped element) do the rest
 *   'inverse'  the PAIRED theme of the nearest live one — a light page gets a
 *              dark section, a dark page a light one — and it follows the
 *              toggle: an observer on <html> and the system-scheme query re-read
 *              the live theme, so the section flips with the page.
 *
 * Resolved in JS rather than CSS on purpose: the theme scopes already exist,
 * so stamping the RIGHT one is 20 lines; expressing "the other one" in CSS
 * means a twin of every surface token in every theme block and no nesting.
 * Here nesting works — an inverse inside an inverse reads the stamped
 * ancestor and flips back.
 *
 * Every token resolves on the stamped element, so Buttons, Pills, the glass
 * panel — anything reading `--kol-*` — flip for free. No inverse classes.
 *
 * @returns [ref, resolvedTheme]  put `ref` on the section root and stamp
 *   `data-theme={resolvedTheme}` (undefined stamps nothing)
 */
const htmlTheme = () => {
  if (typeof document === 'undefined') return 'light'
  const root = document.documentElement
  const stamped = root.dataset.theme || (root.classList.contains('dark') ? 'dark' : root.classList.contains('light') ? 'light' : null)
  if (stamped) return stamped
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const nearestTheme = (el) => {
  const scope = el?.parentElement?.closest('[data-theme], .dark, .light')
  if (scope && scope !== document.documentElement) {
    return scope.dataset.theme || (scope.classList.contains('dark') ? 'dark' : 'light')
  }
  return htmlTheme()
}

export default function useSectionTheme(theme) {
  const ref = useRef(null)
  const [live, setLive] = useState(htmlTheme)

  useEffect(() => {
    if (theme !== 'inverse') return undefined
    const read = () => setLive(nearestTheme(ref.current))
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    mq?.addEventListener('change', read)
    return () => { mo.disconnect(); mq?.removeEventListener('change', read) }
  }, [theme])

  const resolved = theme === 'inverse' ? (live === 'dark' ? 'light' : 'dark') : theme
  return [ref, resolved]
}
