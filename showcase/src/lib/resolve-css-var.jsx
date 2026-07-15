import { useEffect, useState } from 'react'

/**
 * Live CSS-var resolution — ported verbatim from the brand app's
 * components/sections/ColorRamp.jsx (the util Reference.jsx imports).
 * Consumed by the FoundationsColor / FoundationsTypography pages.
 */

/**
 * Resolve a CSS custom property to its raw computed value (untransformed).
 *
 * Returns whatever `getComputedStyle().getPropertyValue()` reads — usually
 * literal values like `48px`, `'Right Grotesk Narrow', sans-serif`,
 * `color-mix(...)`. For var() chains, the chain stays unresolved (use
 * `resolveCssVar` instead, which uses a probe + property assignment to force
 * full resolution). SSR-safe.
 *
 * Use cases:
 *   - size tokens: --kol-text-heading-01 → "48px"
 *   - family tokens: --kol-font-family-sans-narrow → "'Right Grotesk Narrow', ..."
 *   - any non-color token where you want the literal declared value
 */
export function resolveCssVarRaw(name) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Resolve a CSS custom property to its computed hex value.
 *
 * Forces full var() chain resolution by applying the var to a real CSS
 * property (color) on a hidden DOM node and reading the computed value.
 * Returns uppercase hex format (e.g. '#FFCF33'). SSR-safe — returns empty
 * string when window is undefined.
 *
 * Single source of truth for any color in the system: kol-color.css. Edit a
 * token there, every consumer (chips, ramps, palettes, generators) updates on
 * next render.
 */
export function resolveCssVar(name) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''
  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.color = `var(${name})`
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  document.body.removeChild(probe)
  return rgbToHex(computed)
}

function rgbToHex(rgb) {
  const m = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!m) return rgb
  return '#' + [m[1], m[2], m[3]]
    .map(n => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Live read of a non-color token (e.g. size, family). Returns the trimmed
 * computed value as a span — useful in table cells where you want the live
 * value, not a hardcoded literal.
 *
 * For colors use `<LiveHex>` patterns elsewhere — those use the probe trick
 * (resolveCssVar) because color values can be in rgb() form.
 */
export function LiveValue({ token }) {
  const [value, setValue] = useState('')
  useEffect(() => { setValue(resolveCssVarRaw(token)) }, [token])
  return <span>{value}</span>
}

/**
 * Resolve a custom property's declared value PER THEME by walking the loaded
 * stylesheets (CSSOM) — the only way to show light AND dark columns at once,
 * since getComputedStyle can only see the active theme. Reads the real theme
 * CSS, so an edit to kol-base-tokens/kol-color updates these cells on reload —
 * no copied literals (2026-07-15 audit P1-4).
 *
 * Buckets: `[data-theme="light"]` → light · `[data-theme="dark"]`/`.dark` or a
 * `prefers-color-scheme: dark` media block → dark · plain :root → base
 * (fallback for both). Later declarations win, matching the cascade.
 */
export function resolveTokenThemed(name) {
  if (typeof document === 'undefined') return { light: '', dark: '' }
  let base = ''; let light = ''; let dark = ''
  const visit = (rules, inDarkMedia) => {
    for (const rule of rules) {
      if (rule.cssRules) {
        const darkMedia = inDarkMedia || /prefers-color-scheme:\s*dark/.test(rule.conditionText || rule.media?.mediaText || '')
        visit(rule.cssRules, darkMedia)
      } else if (rule.style) {
        const v = rule.style.getPropertyValue(name)
        if (!v) continue
        const sel = rule.selectorText || ''
        if (/data-theme=.?light/.test(sel)) light = v.trim()
        else if (/data-theme=.?dark|\.dark\b/.test(sel) || inDarkMedia) dark = v.trim()
        else base = v.trim()
      }
    }
  }
  for (const sheet of document.styleSheets) {
    try { visit(sheet.cssRules, false) } catch { /* cross-origin sheet — skip */ }
  }
  return { light: light || base, dark: dark || base }
}

/**
 * Measure a CSS CLASS's computed properties on a hidden probe element — for
 * class-driven scales (.kol-mono-N, .kol-helper-N) whose values live in class
 * rules, not custom properties. Same truth contract as resolveCssVar: the
 * loaded theme CSS is the single source, nothing is hand-copied.
 */
export function measureClass(cls, props = ['font-size']) {
  if (typeof document === 'undefined') return {}
  const probe = document.createElement('span')
  probe.className = cls.replace(/^\./, '')
  probe.textContent = 'x'
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const out = {}
  for (const p of props) out[p] = cs.getPropertyValue(p).trim()
  document.body.removeChild(probe)
  return out
}

/** Live table cell for one measured class property. */
export function LiveClassValue({ cls, prop, format }) {
  const [value, setValue] = useState('')
  useEffect(() => { setValue(measureClass(cls, [prop])[prop] || '') }, [cls, prop])
  return <span>{format ? format(value) : value}</span>
}
