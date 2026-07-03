/**
 * CSS-variable + color utilities for token-doc widgets (ColorRamp,
 * SpectrumGrid, swatch tables). One probe-based resolver instead of the
 * three inline getComputedStyle forks the monorepo sources carried.
 * Plain functions, not hooks — they live here because src/hooks is the
 * taxonomy's only non-component folder.
 */

/** Read a custom property's raw value off an element (default: :root). */
export function resolveCssVar(name, el) {
  if (typeof document === 'undefined') return ''
  const target = el || document.documentElement
  const prop = name.startsWith('--') ? name : `--${name}`
  return getComputedStyle(target).getPropertyValue(prop).trim()
}

/**
 * Resolve ANY css color expression (var(), color-mix(), keywords) to the
 * browser's computed `rgb(...)`/`rgba(...)` form via a detached probe —
 * getPropertyValue alone can't evaluate color-mix.
 */
export function resolveCssColor(value, el) {
  if (typeof document === 'undefined') return ''
  const probe = document.createElement('span')
  probe.style.display = 'none'
  probe.style.color = value
  ;(el || document.body).appendChild(probe)
  const out = getComputedStyle(probe).color
  probe.remove()
  return out
}

/**
 * Perceptual is-this-color-light test (BT.709 luma) — drives contrast
 * label flips on swatches. Accepts hex or rgb()/rgba() strings; any other
 * expression goes through resolveCssColor first.
 */
export function isLight(color) {
  let r, g, b
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h.split('').map((c) => c + c).join('')
    r = parseInt(h.slice(0, 2), 16)
    g = parseInt(h.slice(2, 4), 16)
    b = parseInt(h.slice(4, 6), 16)
  } else {
    const rgb = (color.startsWith('rgb') ? color : resolveCssColor(color)).match(/[\d.]+/g)
    if (!rgb) return false
    ;[r, g, b] = rgb.map(Number)
  }
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55
}
