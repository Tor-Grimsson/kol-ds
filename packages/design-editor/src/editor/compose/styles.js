/* STYLES (plan-2026-11-20-kolbox-everything-left W7, Figma's local styles). A style is a named value kept with the file:
 *
 *   styles: { colors: [{ id, name, color, opacity }], texts: [{ id, name, value }] }
 *
 * `value` of a text style holds TEXT_STYLE_KEYS as the layer holds them. A layer that uses a style keeps the value
 * itself (so the canvas and the export read the layer as always) and the style's id beside it:
 *
 *   fillStyle, strokeStyle    the layer's own fill and stroke
 *   fills[i].style, strokes[i].style    a fill or stroke row (W6.2)
 *   textStyle                 a text layer's type
 *
 * A style that changes writes its value into every layer that points at it (`follow`), in the same undo step. A style
 * removed leaves each layer its value and drops the pointer. Plain JS, no React. */
export const EMPTY_STYLES = { colors: [], texts: [] }

export const TEXT_STYLE_KEYS = [
  'family', 'width', 'weight', 'italic', 'slant', 'size', 'lineHeight', 'tracking',
  'case', 'decoration', 'underlineStyle', 'underlineThicknessPct', 'underlineOffsetPct', 'underlineSkipInk', 'underlineColor',
  'trim', 'listStyle', 'paragraphSpacing', 'truncate', 'wrap', 'features', 'hangPunctuation', 'hangLists', 'paragraphIndent',
]

export const newStyleId = (kind) => `${kind}-style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/* a spec's styles, or none; anything malformed is left out */
export function stylesFrom(spec) {
  const s = spec?.styles
  if (!s || typeof s !== 'object') return EMPTY_STYLES
  const ok = (r) => r && typeof r.id === 'string' && typeof r.name === 'string'
  return {
    colors: Array.isArray(s.colors) ? s.colors.filter((r) => ok(r) && typeof r.color === 'string') : [],
    texts: Array.isArray(s.texts) ? s.texts.filter((r) => ok(r) && r.value && typeof r.value === 'object') : [],
  }
}
export const hasStyles = (s) => !!s && (s.colors.length > 0 || s.texts.length > 0)

/* a text layer's type, as a text style keeps it */
export function textValueOf(layer) {
  const out = {}
  for (const k of TEXT_STYLE_KEYS) if (layer?.[k] !== undefined) out[k] = layer[k]
  return out
}
/* a text style's value onto a layer: every key it names, the rest cleared, so the layer reads exactly the style */
export const textPatch = (value) => Object.fromEntries(TEXT_STYLE_KEYS.map((k) => [k, value?.[k]]))

/* WHERE A COLOR STYLE SITS: 'fill' | 'stroke' (the layer's own) | 'fills:<i>' | 'strokes:<i>' (a row) */
export function colorPatch(layer, slot, style) {
  const [list, at] = slot.split(':')
  if (at != null) {
    const rows = Array.isArray(layer[list]) ? layer[list] : []
    return { [list]: rows.map((r, i) => (i === Number(at) ? { ...r, color: style.color, opacity: style.opacity ?? 1, style: style.id } : r)) }
  }
  return slot === 'stroke'
    ? { stroke: style.color, strokeOpacity: style.opacity ?? 1, strokeStyle: style.id }
    : { color: style.color, fillOpacity: style.opacity ?? 1, fill: null, fillStyle: style.id }
}
/* the style id at a slot, or null */
export function styleAt(layer, slot) {
  const [list, at] = slot.split(':')
  if (at != null) return layer?.[list]?.[Number(at)]?.style ?? null
  return (slot === 'stroke' ? layer?.strokeStyle : layer?.fillStyle) ?? null
}
/* the slot's pointer dropped, its value kept */
export function detachPatch(layer, slot) {
  const [list, at] = slot.split(':')
  if (at != null) return { [list]: (layer[list] ?? []).map((r, i) => (i === Number(at) ? { ...r, style: undefined } : r)) }
  return slot === 'stroke' ? { strokeStyle: undefined } : { fillStyle: undefined }
}

/* one layer brought in line with the styles: each pointer reads its style's value now; a pointer whose style is gone
   is dropped (the value stays). The same layer back when nothing changes. Group children are walked. */
export function follow(layer, styles) {
  let next = layer
  const set = (patch) => { next = next === layer ? { ...layer, ...patch } : { ...next, ...patch } }
  const colors = new Map(styles.colors.map((s) => [s.id, s]))
  const texts = new Map(styles.texts.map((s) => [s.id, s]))
  const own = (key, write) => {
    const id = layer[key]
    if (!id) return
    const s = colors.get(id)
    if (!s) return set({ [key]: undefined })
    const patch = write(s)
    if (Object.keys(patch).some((k) => layer[k] !== patch[k])) set(patch)
  }
  own('fillStyle', (s) => ({ color: s.color, fillOpacity: s.opacity ?? 1 }))
  own('strokeStyle', (s) => ({ stroke: s.color, strokeOpacity: s.opacity ?? 1 }))
  for (const list of ['fills', 'strokes']) {
    const rows = layer[list]
    if (!Array.isArray(rows) || !rows.some((r) => r?.style)) continue
    let changed = false
    const out = rows.map((r) => {
      if (!r?.style) return r
      const s = colors.get(r.style)
      if (!s) { changed = true; return { ...r, style: undefined } }
      if (r.color === s.color && (r.opacity ?? 1) === (s.opacity ?? 1)) return r
      changed = true
      return { ...r, color: s.color, opacity: s.opacity ?? 1 }
    })
    if (changed) set({ [list]: out })
  }
  if (layer.textStyle) {
    const s = texts.get(layer.textStyle)
    if (!s) set({ textStyle: undefined })
    else {
      const patch = textPatch(s.value)
      if (TEXT_STYLE_KEYS.some((k) => JSON.stringify(layer[k]) !== JSON.stringify(patch[k]))) set(patch)
    }
  }
  if (Array.isArray(layer.children)) {
    const kids = followAll(layer.children, styles)
    if (kids !== layer.children) set({ children: kids })
  }
  return next
}
export function followAll(list, styles) {
  let changed = false
  const out = list.map((l) => { const n = follow(l, styles); if (n !== l) changed = true; return n })
  return changed ? out : list
}

/* the styles a layer uses (for the Styles list's counts and a Detach on every place) */
export function usesStyle(layer, id) {
  return layer.fillStyle === id || layer.strokeStyle === id || layer.textStyle === id
    || (layer.fills ?? []).some((r) => r?.style === id) || (layer.strokes ?? []).some((r) => r?.style === id)
}

/* A PAGE FOLLOWS ITS STYLE as a layer does (W7): its color is the style's, an opacity under 100 riding in the hex's
   last two digits (the page row's own form); a page whose style is gone keeps its color and drops the pointer */
export function pageColorOf(style) {
  const op = style.opacity ?? 1
  const hex = String(style.color)
  if (op >= 1 || !/^#[0-9a-f]{6}$/i.test(hex)) return hex
  return `${hex}${Math.round(op * 255).toString(16).padStart(2, '0')}`
}
export function followPages(pages, styles) {
  const colors = new Map(styles.colors.map((s) => [s.id, s]))
  let changed = false
  const out = pages.map((p) => {
    if (!p.style) return p
    const s = colors.get(p.style)
    if (!s) { changed = true; const { style: _drop, ...rest } = p; return rest }
    const c = pageColorOf(s)
    if (p.color === c) return p
    changed = true
    return { ...p, color: c }
  })
  return changed ? out : pages
}
