/**
 * A text layer's type settings beyond font, size and spacing (the kolbox Type settings window), in one place for the
 * three that draw text: the canvas (TypeBlock, as CSS), the auto-size measure (LayerRenderer, the same CSS on a plain
 * element) and the outline export (textOutline.js, its own layout of the same rules).
 *
 * Layer fields, each absent by default:
 *   decoration    'underline' | 'strikethrough'
 *   case          adds 'title' (applyCase) and 'small-caps' (the font's smcp)
 *   textAlign     adds 'justify'
 *   trim          'cap': the block's top at the first line's cap height, its foot at the last baseline
 *   listStyle     'bullets' | 'numbers'; hangLists: the marker outside the box
 *   paragraphSpacing, paragraphIndent   px
 *   hangPunctuation   an opening mark starting any line sits outside the left edge (left and justified text), a closing
 *                 mark ending one outside the right edge (right and justified text); neither counts toward the line's fit
 *   underlineThicknessPct, underlineOffsetPct   percent of the size, absent: Auto (the font's own); the offset is the
 *                 line's top below the baseline. underlineStyle 'dotted' | 'wavy', absent: solid. underlineColor hex,
 *                 absent: the text's. Files from before 2026-11-20 hold underlineThickness / underlineOffset in px (the
 *                 offset added to the font's position); underlineOf reads them as percent
 *   underlineSkipInk   the underline breaks where it crosses the letters
 *   truncate      lines past the box's foot are cut and the last one kept ends in an ellipsis
 *   wrap          'balance'
 *   features      { tag: 0 | 1 } OpenType features; kern, liga, calt and clig are on unless set 0
 */

export const DEFAULT_ON = new Set(['kern', 'liga', 'calt', 'clig'])
export const featureOn = (layer, tag) => (layer?.features?.[tag] ?? (DEFAULT_ON.has(tag) ? 1 : 0)) === 1

/* the features the layer sets apart from the browser's defaults; small caps is the smcp feature */
export function activeFeatures(layer) {
  const f = { ...(layer?.features ?? {}) }
  if (layer?.case === 'small-caps') f.smcp = 1
  return Object.entries(f).filter(([t, v]) => t !== 'kern' && (v ? 1 : 0) !== (DEFAULT_ON.has(t) ? 1 : 0))
}

/* the marker's box and the punctuation that hangs */
export const MARKER_EM = 1.5
export const HANGS = /^["'“‘„‚«‹(\[{¿¡—–-]/
export const HANGS_END = /["'”’»›)\]}.,:;!?]$/
/* which edges hang for the layer: the start on a flush left edge, the end on a flush right one */
export function hangEdges(layer) {
  const align = layer?.textAlign ?? 'center'
  const on = !!layer?.hangPunctuation && layer?.listStyle !== 'bullets' && layer?.listStyle !== 'numbers'
  return { start: on && (align === 'left' || align === 'justify'), end: on && (align === 'right' || align === 'justify') }
}
export const markerFor = (layer, n) => (layer?.listStyle === 'bullets' ? '•' : layer?.listStyle === 'numbers' ? `${n}.` : null)

/* Figma's underline styles, in its order */
export const UNDERLINE_STYLES = ['solid', 'dotted', 'wavy']
/* the font's own underline, in percent of the size; the defaults are fontLoader's when the font is not parsed yet */
export const autoUnderline = (font) => font
  ? { thickness: (font.underlineThickness / font.unitsPerEm) * 100, offset: (-font.underlinePosition / font.unitsPerEm) * 100 }
  : { thickness: 5, offset: 10 }
/* the layer's underline in percent of the size, null for Auto; px values from older files are converted here */
export function underlineOf(layer, font) {
  const size = layer?.size ?? 96
  const thickness = layer?.underlineThicknessPct ?? (layer?.underlineThickness ? (layer.underlineThickness / size) * 100 : null)
  const offset = layer?.underlineOffsetPct ?? (layer?.underlineOffset ? autoUnderline(font).offset + (layer.underlineOffset / size) * 100 : null)
  return { thickness, offset, style: UNDERLINE_STYLES.includes(layer?.underlineStyle) ? layer.underlineStyle : 'solid' }
}

/* the block's CSS on top of font, size, spacing and align */
export function textCss(layer) {
  const feats = activeFeatures(layer)
  const deco = layer?.decoration === 'underline' ? 'underline' : layer?.decoration === 'strikethrough' ? 'line-through' : null
  return {
    fontFeatureSettings: feats.length ? feats.map(([t, v]) => `"${t}" ${v ? 1 : 0}`).join(', ') : undefined,
    fontKerning: featureOn(layer, 'kern') ? undefined : 'none',
    ...(deco ? { textDecorationLine: deco, textDecorationThickness: 'from-font', textUnderlinePosition: 'from-font', textDecorationSkipInk: 'none' } : {}),
    ...(deco === 'underline' ? {
      ...(layer.underlineThicknessPct != null ? { textDecorationThickness: `${layer.underlineThicknessPct / 100}em` }
        : layer.underlineThickness ? { textDecorationThickness: `${layer.underlineThickness}px` } : {}),
      /* a percent offset is from the baseline (position auto); an old px one from the font's own position */
      ...(layer.underlineOffsetPct != null ? { textUnderlinePosition: 'auto', textUnderlineOffset: `${layer.underlineOffsetPct / 100}em` }
        : layer.underlineOffset ? { textUnderlineOffset: `${layer.underlineOffset}px` } : {}),
      ...(layer.underlineStyle === 'dotted' || layer.underlineStyle === 'wavy' ? { textDecorationStyle: layer.underlineStyle } : {}),
      ...(layer.underlineColor ? { textDecorationColor: layer.underlineColor } : {}),
      ...(layer.underlineSkipInk ? { textDecorationSkipInk: 'auto' } : {}),
    } : {}),
    textWrap: layer?.wrap === 'balance' ? 'balance' : undefined,
  }
}

/* paragraphs as their own blocks, when a setting works per paragraph; null when the text is one plain block. Each:
   { text, marker, segs, style } — the marker an inline box MARKER_EM wide at the line's start; with hanging punctuation
   `segs` is the text cut into plain strings and { t, hang: 'start' | 'end' } marks (a word's opening or closing mark),
   which hangMarks pulls outside the box where they land on a line's edge */
export function paragraphLayout(layer, display) {
  const list = layer?.listStyle === 'bullets' || layer?.listStyle === 'numbers'
  const spacing = layer?.paragraphSpacing ?? 0
  const indent = layer?.paragraphIndent ?? 0
  const edges = hangEdges(layer)
  if (!list && !spacing && !indent && !edges.start && !edges.end) return null
  const size = layer?.size ?? 96
  const m = MARKER_EM * size
  const paras = String(display ?? '').split('\n')
  return paras.map((text, i) => {
    return {
      text,
      marker: list ? markerFor(layer, i + 1) : null,
      segs: edges.start || edges.end ? hangSegments(text, edges) : null,
      style: {
        paddingLeft: list && !layer.hangLists ? m : undefined,
        textIndent: list ? indent - m : indent || undefined,
        marginBottom: i < paras.length - 1 && spacing ? spacing : undefined,
        minHeight: '1lh',
      },
      markerStyle: { display: 'inline-block', width: m, textIndent: 0, textAlign: 'left' },
    }
  })
}

/* a paragraph cut at its words' hanging marks */
function hangSegments(text, edges) {
  const segs = []
  let plain = ''
  for (const part of text.split(/(\s+)/)) {
    if (!part || /^\s+$/.test(part)) { plain += part; continue }
    let word = part
    if (edges.start && HANGS.test(word)) { if (plain) segs.push(plain); plain = ''; segs.push({ t: word[0], hang: 'start' }); word = word.slice(1) }
    if (edges.end && word.length && HANGS_END.test(word)) { plain += word.slice(0, -1); if (plain) segs.push(plain); plain = ''; segs.push({ t: word[word.length - 1], hang: 'end' }) }
    else plain += word
  }
  if (plain) segs.push(plain)
  return segs
}

/* Hanging punctuation on the laid-out text: each mark (`[data-hang]`) that sits at its line's start (or end) takes a
   negative margin of its own width, so it stands outside the box and the line fits without it; laid out again until
   no mark changes, as the margins move words between lines (3 passes at most). The root must be in the document. */
export function hangMarks(root) {
  const marks = [...(root?.querySelectorAll('[data-hang]') ?? [])]
  if (!marks.length) return
  const prop = (s) => (s.dataset.hang === 'start' ? 'marginLeft' : 'marginRight')
  for (const s of marks) s.style[prop(s)] = ''
  /* widths in the layer's own px: the canvas may be scaled */
  const k = root.offsetWidth ? root.getBoundingClientRect().width / root.offsetWidth : 1
  for (let pass = 0; pass < 3; pass++) {
    let changed = false
    for (const s of marks) {
      const want = atLineEdge(s) ? `${-(s.getBoundingClientRect().width / k).toFixed(2)}px` : ''
      if (s.style[prop(s)] !== want) { s.style[prop(s)] = want; changed = true }
    }
    if (!changed) break
  }
}
/* whether a mark is first (start) or last (end) on its line: the nearest letter before (after) it, spaces passed over,
   is on another line or there is none */
function atLineEdge(s) {
  const para = s.parentElement
  const walk = document.createTreeWalker(para, NodeFilter.SHOW_TEXT)
  const chars = []
  for (let n = walk.nextNode(); n; n = walk.nextNode()) for (let i = 0; i < n.data.length; i++) chars.push([n, i])
  const own = chars.findIndex(([n]) => s.contains(n))
  if (own < 0) return false
  const top = s.getBoundingClientRect()
  const step = s.dataset.hang === 'start' ? -1 : 1
  for (let k = own + step; k >= 0 && k < chars.length; k += step) {
    const [n, i] = chars[k]
    if (s.contains(n) || /\s|\u200b/.test(n.data[i])) continue
    const r = document.createRange()
    r.setStart(n, i); r.setEnd(n, i + 1)
    const b = r.getBoundingClientRect()
    return Math.abs(b.top - top.top) > top.height / 2
  }
  return true
}

/* the same paragraphs on a plain element (the auto-size measure) */
export function appendParagraphs(el, paras) {
  for (const p of paras) {
    const d = document.createElement('div')
    Object.assign(d.style, cssText(p.style))
    if (p.marker) { const s = document.createElement('span'); Object.assign(s.style, cssText(p.markerStyle)); s.textContent = p.marker; d.appendChild(s) }
    if (p.segs) {
      for (const g of p.segs) {
        if (typeof g === 'string') { d.appendChild(document.createTextNode(g)); continue }
        const s = document.createElement('span'); s.dataset.hang = g.hang; s.textContent = g.t; d.appendChild(s)
      }
    } else d.appendChild(document.createTextNode(p.text || '​'))
    el.appendChild(d)
  }
}
const cssText = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null).map(([k, v]) => [k, typeof v === 'number' && k !== 'zIndex' ? `${v}px` : v]))

/* Vertical trim's cut, top and foot in px, read from the font the canvas draws with (canvas metrics: the content area
   CSS lays a line in, and the H's height) */
let ctx = null
export function capTrim(layer, fontCss, weight) {
  if (layer?.trim !== 'cap' || typeof document === 'undefined') return null
  ctx ??= document.createElement('canvas').getContext('2d')
  const size = layer.size ?? 96
  ctx.font = `${weight} ${size}px ${fontCss}`
  const mt = ctx.measureText('H')
  const asc = mt.fontBoundingBoxAscent, desc = mt.fontBoundingBoxDescent, cap = mt.actualBoundingBoxAscent
  if (!Number.isFinite(asc) || !Number.isFinite(cap)) return null
  const half = ((layer.lineHeight ?? 1.05) * size - (asc + desc)) / 2
  return { top: half + asc - cap, bottom: half + desc }
}

/* the block's line clamp for Truncate text: as many lines as the box holds */
export function clampLines(layer) {
  if (!layer?.truncate) return null
  const lh = (layer.lineHeight ?? 1.05) * (layer.size ?? 96)
  return Math.max(1, Math.floor(((layer.h ?? 0) + 0.5) / lh))
}
