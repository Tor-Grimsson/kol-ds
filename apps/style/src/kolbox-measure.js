import { createContext, useEffect, useState } from 'react'
import SRC from '@kolbox/kolbox.css?raw'

/* THE KOLBOX STYLESHEET'S READINGS (#/kolbox): the token list, each token's computed value, the forced states and the
 * measures of a rendered part. Nothing here is typed in: the names come from kolbox's own index.css, the values from
 * the board's scoped copy of them (index.css here) as the browser computes them, the measures from the parts. */

/* every custom property in kolbox's @theme, in its order: { name, source } */
const THEME = SRC.match(/@theme static \{([\s\S]*?)\n\}/)[1].replace(/\/\*[\s\S]*?\*\//g, '')
/* the space steps: kolbox's @theme leaves them to KOL's scale (kol-design-tokens.css, plan-2026-11-18-kolbox-system 8.1),
 * so the six it named before are listed here, first, as they stood */
const SPACE = [1, 2, 3, 4, 6, 8].map((n) => ({ name: `--spacing-${n}`, source: `var(--kol-spacing-${n})` }))
export const TOKENS = [...SPACE, ...[...THEME.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map((m) => ({ name: m[1], source: m[2].trim() }))]
export const tokensOf = (re) => TOKENS.filter((t) => re.test(t.name))

/* where a kolbox token lives in the board's scope (`.kol-style-kolbox`), and the property that computes it. The space
 * steps 1 to 8 are KOL's own ladder in this app (the same 4px values), read under their own names. */
export function scopeOf(name) {
  let m
  if (/^--font-/.test(name)) return { v: name, prop: 'fontFamily' }
  if ((m = name.match(/^--color-(.+)$/))) return { v: `--kolbox-${m[1]}`, prop: 'backgroundColor' }
  if (/^--spacing-\d+$/.test(name)) return { v: name, prop: 'width' }
  if ((m = name.match(/^--spacing-(.+)$/))) return { v: `--kolbox-${m[1]}`, prop: 'width' }
  if ((m = name.match(/^--radius-(.+)$/))) return { v: `--kolbox-radius-${m[1]}`, prop: 'borderTopLeftRadius' }
  if ((m = name.match(/^--shadow-(.+)$/))) return { v: `--kolbox-shadow-${m[1]}`, prop: 'boxShadow' }
  if ((m = name.match(/^--text-(.+?)--line-height$/))) return { v: `--kolbox-text-${m[1]}-lh`, prop: 'width' }
  if ((m = name.match(/^--text-(.+?)--font-weight$/))) return { v: `--kolbox-text-${m[1]}-weight`, prop: 'fontWeight' }
  if ((m = name.match(/^--text-(.+)$/))) return { v: `--kolbox-text-${m[1]}`, prop: 'width' }
  return null
}

/* a computed color as the sheet writes it: #RRGGBB when opaque, else rgb(r g b / a); transparent is null */
const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase()
export function colorText(c) {
  if (!c) return null
  let r, g, b, a = 1, m
  if ((m = c.match(/^rgba?\(([^)]+)\)$/))) [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
  else if ((m = c.match(/^color\(srgb ([^)]+)\)$/))) {
    const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number)
    ;[r, g, b] = p.slice(0, 3).map((x) => x * 255); a = p[3] ?? 1
  } else return c
  if (a === 0) return null
  if (a === 1) return `#${hex2(r)}${hex2(g)}${hex2(b)}`
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${+a.toFixed(2)})`
}

/* read every token through a hidden probe inside a kolbox scope: { name: { value, source } } plus the reverse maps the
 * measures name colors and radii by */
export function readTokens(scope) {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:0;border-style:solid'
  scope.appendChild(probe)
  const out = {}
  for (const t of TOKENS) {
    const s = scopeOf(t.name)
    if (!s) { out[t.name] = { value: null, source: t.source }; continue }
    probe.style[s.prop] = `var(${s.v})`
    let value = getComputedStyle(probe)[s.prop]
    if (s.prop === 'backgroundColor') value = colorText(value) ?? 'transparent'
    if (s.prop === 'fontFamily') value = value.replace(/"/g, "'")
    out[t.name] = { value, source: t.source }
    probe.style[s.prop] = ''
  }
  probe.remove()
  const colors = {}, radii = {}
  for (const [n, t] of Object.entries(out)) {
    if (n.startsWith('--color-') && n !== '--color-menu') colors[t.value] ??= n.slice(8)
    if (n.startsWith('--radius-')) radii[t.value] ??= n.slice(9)
  }
  return { tokens: out, colors, radii }
}

/* FORCED STATES: every :hover and :focus rule on the page, copied with the pseudo-class swapped for a class, in its
 * own layer, so a cell can hold a part in its hover or focus look without a pointer (the pseudo-states technique).
 * The cell puts `kol-force-hover` or `kol-force-focus` on the part's element; the part and its CSS are untouched. */
/* only a real pseudo-class: `\:hover` inside an escaped class name (`.enabled\:hover\:bg-field`) stays */
const swap = (sel) => sel.replace(/(?<!\\):hover/g, '.kol-force-hover').replace(/(?<!\\):focus(-visible|-within)?(?![\w-])/g, '.kol-force-focus')
function forcedRules() {
  const layers = new Map()
  const add = (layer, text) => { if (!layers.has(layer)) layers.set(layer, []); layers.get(layer).push(text) }
  const walk = (rules, parent, layer) => {
    for (const r of rules) {
      if (r instanceof CSSStyleRule) {
        const sel = !parent ? r.selectorText : r.selectorText.includes('&') ? r.selectorText.replaceAll('&', `:is(${parent})`) : `:is(${parent}) ${r.selectorText}`
        if (r.style.length && /(?<!\\):(hover|focus)/.test(sel)) add(layer, `${swap(sel)}{${r.style.cssText}}`)
        if (r.cssRules?.length) walk(r.cssRules, sel, layer)
      } else if (parent && !r.cssRules && r.style?.length && /(?<!\\):(hover|focus)/.test(parent)) {
        /* the declarations of a rule nested under @media inside a style rule (Tailwind's hover: sits in (hover: hover)) */
        add(layer, `${swap(parent)}{${r.style.cssText}}`)
      } else if (r instanceof CSSLayerBlockRule) walk(r.cssRules, parent, [layer, r.name].filter(Boolean).join('.'))
      else if (r.cssRules) walk(r.cssRules, parent, layer)
    }
  }
  for (const sheet of document.styleSheets) {
    if (sheet.ownerNode?.id === 'kol-force-states') continue
    try { walk(sheet.cssRules, null, '') } catch { /* a sheet from another origin */ }
  }
  return [...layers].map(([layer, list]) => (layer ? `@layer ${layer}{${list.join('')}}` : list.join(''))).join('\n')
}
export function useForcedStates() {
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'kol-force-states'
    el.textContent = forcedRules()
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
}

/* THE MEASURES of one rendered part: size, type step, padding, radius, and what each state changes against rest */
const px = (v) => +parseFloat(v).toFixed(1)
function textEl(el) {
  const walk = (n) => {
    if ([...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return n
    for (const c of n.children) { const f = walk(c); if (f) return f }
    return null
  }
  return walk(el) ?? (el.querySelector('input') || el)
}
function typeOf(el, tokens) {
  const t = textEl(el), cs = getComputedStyle(t)
  const size = px(cs.fontSize), lh = cs.lineHeight === 'normal' ? 'normal' : px(cs.lineHeight)
  const mono = /mono/i.test(cs.fontFamily)
  const steps = ['title', 'section', 'label', 'help', 'meta', 'value']
  const step = steps.find((s) => px(tokens[`--text-${s}`]?.value) === size && px(tokens[`--text-${s}--line-height`]?.value) === lh && (s === 'meta' || s === 'value' ? mono : !mono))
  return `${step ? `${step} ` : ''}${size}/${lh} ${cs.fontWeight}${mono && !step ? ' mono' : ''}`
}
const four = (a, b, c, d) => (a === b && b === c && c === d ? `${a}` : a === c && b === d ? `${a} ${b}` : `${a} ${b} ${c} ${d}`)
function look(el, map) {
  const cs = getComputedStyle(el)
  const name = (c) => { const t = colorText(c); return t ? map.colors[t] ?? t : null }
  const edge = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' ? name(cs.borderTopColor) : null
  const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? `${name(cs.outlineColor)} ${px(cs.outlineWidth)}` : null
  return {
    fill: name(cs.backgroundColor), ink: name(cs.color), edge, outline,
    filter: cs.filter === 'none' ? null : cs.filter, opacity: +cs.opacity === 1 ? null : +cs.opacity,
    shadow: cs.boxShadow === 'none' ? null : 'shadow',
  }
}
const LABEL = { fill: 'fill', ink: 'ink', edge: 'edge', outline: 'outline', filter: 'filter', opacity: 'opacity', shadow: '' }
const say = (o, keys) => keys.filter((k) => o[k] != null).map((k) => `${LABEL[k]} ${o[k]}`.trim()).join(', ')
const diff = (a, b) => say(b, Object.keys(b).filter((k) => b[k] !== a[k])) || 'no change'

/* el: the rest element; states: [{ label, kind, el, base }], base: the same element in the rest cell when a state
 * targets one element of the part */
export function measure(el, states, map) {
  const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
  const radius = px(cs.borderTopLeftRadius)
  const rest = look(el, map)
  const out = {
    size: `${px(r.width)} × ${px(r.height)}`,
    type: typeOf(el, map.tokens),
    padding: four(px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)),
    radius: radius > 999 ? 'full' : radius ? `${map.radii[`${radius}px`] ?? ''} ${radius}`.trim() : '0',
    rest: say(rest, ['fill', 'ink', 'edge', 'shadow']) || 'none',
    hover: '', focus: '', other: [],
  }
  for (const s of states) {
    if (!s.el) continue
    /* a state held on one element of the part (a SplitButton's half) is read against that same element at rest */
    const d = diff(s.base ? look(s.base, map) : rest, look(s.el, map))
    if (s.kind === 'hover' && !out.hover) out.hover = d
    else if (s.kind === 'focus' && !out.focus) out.focus = d
    else if (s.kind === 'other') out.other.push(`${s.label}: ${d}`)
  }
  return out
}

/* an overlay part's measures are taken when its trigger opens it (its panel lives in the body layer while open) */
export const OverlayMeasure = createContext({ register: () => {} })

/* a count that moves once the fonts have loaded, so the measures are read again at their final size */
export function useTick() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let id = 0
    const bump = () => { cancelAnimationFrame(id); id = requestAnimationFrame(() => setTick((t) => t + 1)) }
    document.fonts?.ready.then(bump)
    const t = setTimeout(bump, 400)
    return () => { clearTimeout(t); cancelAnimationFrame(id) }
  }, [])
  return tick
}
