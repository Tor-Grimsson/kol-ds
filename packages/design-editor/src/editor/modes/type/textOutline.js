/**
 * Text-layer outline export — sync glyph-path generation for compose's
 * SVG builder.
 *
 * `buildLayersSvg` is synchronous (the PNG / webm / eyedropper callers all
 * build in a tight sync path), but opentype font parsing is async. The
 * bridge: export triggers `await warmTextFonts(layers)` BEFORE building,
 * which resolves every text layer's font through the shared fontLoader
 * promise cache and parks the parsed Font in a sync map. `textLayerFont()`
 * then answers synchronously at build time; a miss (render family / fetch failed
 * / a sync caller that never warmed) makes the builder fall back to the
 * legacy foreignObject writer.
 *
 * Layout mirrors the live render (LayerRenderer's TextLayer wrapper +
 * TypeBlock div) so outlines land where the canvas shows them:
 *   - flex align-center wrapper — the line stack is vertically centered in
 *     layer.h, with TypeBlock's `min-height: 1em` floor
 *   - `white-space: pre-wrap` + `overflow-wrap: break-word` — hard \n breaks
 *     plus greedy soft-wrap at layer.w, char-level breaks for oversized words
 *   - letter-spacing in em after every glyph incl. the last (CSS behavior);
 *     kerning on; ligatures only at zero tracking (browsers drop optional
 *     ligatures when letter-spacing is non-zero)
 *   - baselines via the CSS half-leading model over hhea ascent/descent
 *     (what Chrome/mac uses for the line box content area)
 */

import { loadFont } from './fontLoader'
import { applyCase } from './cuts'
import { layerFamily, layerWeight, isOutlineFamily } from './families'
import { activeFeatures, autoUnderline, clampLines, featureOn, hangEdges, HANGS, HANGS_END, markerFor, MARKER_EM, underlineOf } from './textSettings'
import { computeFrameGlyphs } from './buildTypeSvg'

/* Resolved (not promised) Fonts, keyed like fontLoader's promise cache. */
const warm = new Map()

const keyOf = (family, weight, italic, slant) => `${family}-${weight}-${italic ? '1' : '0'}${Number.isFinite(slant) ? `-${slant}` : ''}`

/**
 * Parse-and-cache every cut used by text layers (groups walked deep).
 * Await this before a sync buildLayersSvg call; failures are swallowed —
 * the affected layer just falls back to foreignObject.
 */
export async function warmTextFonts(layers) {
  const jobs = []
  const walk = (ls) => {
    for (const l of ls ?? []) {
      if (l.type === 'group') { walk(l.children); continue }
      if (l.type !== 'text') continue
      const family = layerFamily(l)
      /* Only outline families (the variable TTFs) warm — JetBrains ships
       * woff2-only and Google families serve woff2 (opentype.js parses
       * neither), so those export via the foreignObject fallback. */
      if (!isOutlineFamily(family)) continue
      /* Axis text (morph/random/fade) needs PER-GLYPH paths only the async
       * computeFrameGlyphs can produce — precompute the pack here so the
       * sync builder can pick it up (axisTextGlyphs below). */
      if (l.axisOn) {
        const akey = axisKey(l)
        if (!axisWarm.has(akey)) {
          jobs.push(
            computeFrameGlyphs({ ...l, x: 0, y: 0 })
              .then(({ glyphs }) => { axisWarm.set(akey, glyphs) })
              .catch(() => {}),
          )
        }
      }
      const weight = layerWeight(l)
      const key = keyOf(family, weight, !!l.italic, l.slant)
      if (warm.has(key)) continue
      jobs.push(
        loadFont(family, weight, !!l.italic, l.slant)
          .then((font) => { warm.set(key, font) })
          .catch(() => {}),
      )
    }
  }
  if (axisWarm.size > 64) axisWarm.clear()  /* ponytail: crude cap, no LRU */
  walk(layers)
  await Promise.all(jobs)
}

/* ── axis-text glyph packs (morph export parity, T6 2026-08-12) ────────── */
const axisWarm = new Map()  /* signature → glyphs from computeFrameGlyphs */
const axisKey = (l) => JSON.stringify([
  l.text, l.case, layerFamily(l), l.weight, l.italic, l.weight2,
  l.axisMode, l.axisBlend ?? l.blend, l.axisCurve, l.curveCp1, l.curveCp2,
  l.size, l.tracking, l.lineHeight, l.textAlign, l.verticalAlign, l.w, l.h,
])

/** Sync lookup for an axis layer's precomputed glyph pack (null = cold —
 * builder falls back to the basic outline / foreignObject path). */
export function axisTextGlyphs(layer) {
  return axisWarm.get(axisKey(layer)) ?? null
}

/** Sync lookup for a text layer's parsed Font. Null = use the fallback. */
export function textLayerFont(layer) {
  const family = layerFamily(layer)
  if (!isOutlineFamily(family)) return null
  return warm.get(keyOf(family, layerWeight(layer), !!layer.italic, layer.slant)) ?? null
}

/* opentype render options: the run is shaped (shape.js, `kolShape`) through the features the canvas applies, the
 * browser's own (ccmp, locl, rlig, rclt, calt, clig, liga; liga and clig off when letter-spacing is not zero, as CSS
 * drops optional ligatures then) with the layer's features set on or off over them; kerning stays opentype's. */
const BROWSER_ON = ['ccmp', 'locl', 'rlig', 'rclt', 'calt', 'clig', 'liga']
function renderOpts(layer) {
  const track = layer.tracking ?? -0.01
  const tags = new Set(BROWSER_ON)
  if (track !== 0) { tags.delete('liga'); tags.delete('clig') }
  for (const [t, v] of activeFeatures(layer)) { if (v) tags.add(t); else tags.delete(t) }
  const o = { kolShape: [...tags] }
  if (track !== 0) o.letterSpacing = track
  if (!featureOn(layer, 'kern')) o.kerning = false
  return o
}

/* Greedy soft-wrap of one hard line to maxW (the first line to firstW), measured
 * with the SAME advance/kerning/letter-spacing engine that draws the glyphs
 * (`measure`, trailing whitespace and hanging marks already left out).
 * Whitespace never forces a break (pre-wrap hangs trailing spaces); a word wider
 * than the box splits at character level (overflow-wrap: break-word). */
function wrapLine(measure, text, maxW, firstW = maxW) {
  if (!text.trim() || maxW <= 0) return [text]
  const tokens = text.split(/(\s+)/).filter(Boolean)
  const lines = []
  const room = () => (lines.length ? maxW : firstW)
  let cur = ''
  for (const tok of tokens) {
    if (/^\s+$/.test(tok)) { cur += tok; continue }
    if (cur.trim() && measure(cur + tok) > room()) { lines.push(cur); cur = tok }
    else cur += tok
    while (measure(cur) > room() && cur.trim().length > 1) {
      let n = cur.length - 1
      while (n > 1 && measure(cur.slice(0, n)) > room()) n -= 1
      lines.push(cur.slice(0, n))
      cur = cur.slice(n)
    }
  }
  lines.push(cur)
  return lines
}

/* Wrap style Balanced: the narrowest width that keeps the line count (CSS text-wrap: balance) */
function wrapBalanced(measure, text, maxW, firstW) {
  const lines = wrapLine(measure, text, maxW, firstW)
  if (lines.length < 2) return lines
  let lo = maxW / lines.length, hi = maxW
  for (let k = 0; k < 12; k++) {
    const mid = (lo + hi) / 2
    if (wrapLine(measure, text, mid, firstW - (maxW - mid)).length > lines.length) lo = mid
    else hi = mid
  }
  return wrapLine(measure, text, hi, firstW - (maxW - hi))
}

const rect = (x, y, w, h) => `M${x.toFixed(2)} ${y.toFixed(2)}H${(x + w).toFixed(2)}V${(y + h).toFixed(2)}H${x.toFixed(2)}Z`

/**
 * Compute the layer's glyph outlines as layer-local path data strings
 * (one `<path d>` per rendered line, and one per decoration line). Empty array = nothing to draw.
 */
export function textOutlinePaths(layer, font) {
  const size  = layer.size ?? 96
  const lh    = layer.lineHeight ?? 1.05
  const align = layer.textAlign ?? 'center'
  const w     = layer.w ?? 0
  const h     = layer.h ?? 0

  const display = applyCase(String(layer.text ?? ''), layer.case)
  if (!display.trim()) return []

  const opts  = renderOpts(layer)
  const list  = layer.listStyle === 'bullets' || layer.listStyle === 'numbers'
  const m     = list ? MARKER_EM * size : 0
  const pad   = list && !layer.hangLists ? m : 0
  const indent = layer.paragraphIndent ?? 0
  const spacing = layer.paragraphSpacing ?? 0
  const wrap  = layer.wrap === 'balance' ? wrapBalanced : wrapLine
  /* Hanging punctuation: an opening mark starting a line sits outside the left edge, a closing mark ending one outside
     the right edge (textSettings hangEdges); neither counts toward the line's fit */
  const edges = hangEdges(layer)
  const adv = (s) => (s ? font.getAdvanceWidth(s, size, opts) : 0)
  const leadOf = (t) => (edges.start && HANGS.test(t) ? t[0] : '')
  const tailOf = (t) => (edges.end && t.length > leadOf(t).length && HANGS_END.test(t) ? t[t.length - 1] : '')
  const measure = (s) => { const t = s.replace(/\s+$/, ''); return adv(t) - adv(leadOf(t)) - adv(tailOf(t)) }

  /* every line with its paragraph's place: the first line of a paragraph starts at pad + indent (its marker, when a
     list, takes the first MARKER_EM of that), the rest at pad */
  const lines = []
  let gap = 0
  display.split('\n').forEach((para, pi) => {
    const firstAt = pad + indent - (list ? m : 0)
    const wrapped = wrap(measure, para, w - pad, w - pad - indent)
    wrapped.forEach((text, li) => {
      lines.push({ text, first: li === 0, last: li === wrapped.length - 1, gap: li === 0 ? gap : 0,
        x0: li === 0 ? firstAt : pad, room: li === 0 ? w - firstAt : w - pad,
        marker: li === 0 && list ? markerFor(layer, pi + 1) : null })
    })
    gap = spacing
  })

  const scale   = size / font.unitsPerEm
  const ascent  = font.ascender * scale
  const descent = -font.descender * scale        /* hhea descender is negative */
  const lineH   = lh * size
  const lead    = (lineH - (ascent + descent)) / 2
  /* Vertical trim: the block's top at the first line's cap height, its foot at the last baseline */
  const trim    = layer.trim === 'cap' ? { top: lead + ascent - (font.capHeight ?? font.ascender * 0.7) * scale, bottom: lead + descent } : { top: 0, bottom: 0 }
  /* Truncate text: the lines the box holds, the last kept one ending in an ellipsis when any are cut */
  const keep = clampLines(layer)
  if (keep != null && lines.length > keep) {
    lines.length = keep
    const last = lines[keep - 1]
    let t = last.text.replace(/\s+$/, '')
    while (t && font.getAdvanceWidth(`${t}…`, size, opts) + (last.marker ? m : 0) > last.room) t = t.slice(0, -1).replace(/\s+$/, '')
    last.text = `${t}…`
    last.last = true
  }
  const gaps    = lines.reduce((a, l) => a + l.gap, 0)
  const blockH  = Math.max(lines.length * lineH + gaps, size) - trim.top - trim.bottom  /* min-height: 1em */
  /* Vertical align mirrors the live flex wrapper (top | middle | bottom). */
  const top     = (layer.verticalAlign === 'top' ? 0
    : layer.verticalAlign === 'bottom' ? (h - blockH)
    : (h - blockH) / 2) - trim.top

  /* underline's own settings: thickness and offset in percent of the size (unset: the font's), style, skip ink */
  const u = layer.decoration === 'underline' ? underlineOf(layer, font) : null
  const deco = u
    ? { y: ((u.offset ?? autoUnderline(font).offset) * size) / 100, t: ((u.thickness ?? autoUnderline(font).thickness) * size) / 100, style: u.style, skip: !!layer.underlineSkipInk }
    : layer.decoration === 'strikethrough'
      ? { y: -font.strikeoutPosition * scale, t: font.strikeoutSize * scale }
      : null

  const paths = []
  let y = top
  lines.forEach((line) => {
    y += line.gap
    const baseY = y + lead + ascent
    y += lineH
    const text = line.text.replace(/\s+$/, '')        /* trailing spaces hang */
    if (!text && !line.marker) return                /* blank line still holds its slot */
    const textW = adv(text)
    const lw = adv(leadOf(text))
    const lineW = textW - lw - adv(tailOf(text)) + (line.marker ? m : 0)
    const justify = align === 'justify' && !line.last && /\s/.test(text)
    const free = line.room - lineW
    const lx = line.x0 + (justify || align === 'left' || align === 'justify' ? 0 : align === 'right' ? free : free / 2)
    if (line.marker) { const d = font.getPath(line.marker, lx, baseY, size, opts).toPathData(2); if (d) paths.push(d) }
    const tx = lx + (line.marker ? m : 0) - lw
    const runs = []
    if (justify) {
      /* the line's spare width shared out over its spaces, each word drawn where the stretched line puts it */
      const words = text.split(/(\s+)/)
      const spaces = words.filter((s) => /^\s+$/.test(s)).length
      const extra = free / spaces
      let k = 0, pre = ''
      for (const part of words) {
        if (/^\s+$/.test(part)) { k += 1; pre += part; continue }
        runs.push(font.getPath(part, tx + adv(pre) + extra * k, baseY, size, opts))
        pre += part
      }
    } else if (text) runs.push(font.getPath(text, tx, baseY, size, opts))
    for (const r of runs) { const d = r.toPathData(2); if (d) paths.push(d) }
    if (deco && text) {
      const x1 = tx + textW + (justify ? free : 0)
      const y0 = baseY + deco.y
      const gaps = deco.skip ? inkGaps(runs, y0, y0 + deco.t, deco.t) : []
      let x = tx
      for (const [a, b] of [...gaps, [x1, x1]]) {
        if (a > x) { const d = decoRun(deco, tx, x, Math.min(a, x1), y0); if (d) paths.push({ d, decoration: true }) }
        x = Math.max(x, b)
        if (x >= x1) break
      }
    }
  })
  return paths
}

/* one run of the underline from x to x1, its top at y0: solid a bar; dotted round dots a thickness wide, one thickness
   apart, counted from the line's start x0; wavy a band a thickness deep on a wave 2 thicknesses high and 8 long, its
   phase from x0 so a run cut by skip ink stays on the one wave */
function decoRun({ t, style }, x0, x, x1, y0) {
  if (style === 'dotted') {
    const r = t / 2
    let d = ''
    for (let c = x0 + Math.ceil((x - x0 - r) / (2 * t)) * 2 * t + r; c + r <= x1 + 0.01; c += 2 * t) {
      d += `M${(c - r).toFixed(2)} ${(y0 + r).toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${t.toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-t).toFixed(2)} 0Z`
    }
    return d
  }
  if (style === 'wavy') {
    const len = 8 * t, amp = t, step = len / 16
    const ys = (px) => y0 + amp * Math.sin(((px - x0) / len) * 2 * Math.PI)
    const xs = []
    for (let px = x; px < x1; px += step) xs.push(px)
    xs.push(x1)
    const top = xs.map((px, i) => `${i ? 'L' : 'M'}${px.toFixed(2)} ${ys(px).toFixed(2)}`).join('')
    const foot = xs.slice().reverse().map((px) => `L${px.toFixed(2)} ${(ys(px) + t).toFixed(2)}`).join('')
    return `${top}${foot}Z`
  }
  return rect(x, y0, x1 - x, t)
}

/* Skip ink: where the outlines cross the underline's band, widened by the line's thickness each side, as x intervals
   merged in order. Curves are walked as 8 straight steps each. */
function inkGaps(runs, y0, y1, pad) {
  const spans = []
  for (const r of runs) {
    let px = 0, py = 0, sx = 0, sy = 0
    const seg = (x0, ya, x1, yb) => {
      if ((ya < y0 && yb < y0) || (ya > y1 && yb > y1)) return
      const at = (y) => (yb === ya ? x0 : x0 + ((x1 - x0) * (y - ya)) / (yb - ya))
      const xs = [ya >= y0 && ya <= y1 ? x0 : at(ya < y0 ? y0 : y1), yb >= y0 && yb <= y1 ? x1 : at(yb < y0 ? y0 : y1)]
      spans.push([Math.min(...xs) - pad, Math.max(...xs) + pad])
    }
    for (const c of r.commands) {
      if (c.type === 'M') { px = sx = c.x; py = sy = c.y; continue }
      if (c.type === 'Z') { seg(px, py, sx, sy); px = sx; py = sy; continue }
      if (c.type === 'L') { seg(px, py, c.x, c.y); px = c.x; py = c.y; continue }
      let qx = px, qy = py
      for (let k = 1; k <= 8; k++) {
        const t = k / 8, u = 1 - t
        const x = c.type === 'Q' ? u * u * px + 2 * u * t * c.x1 + t * t * c.x : u * u * u * px + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x
        const y = c.type === 'Q' ? u * u * py + 2 * u * t * c.y1 + t * t * c.y : u * u * u * py + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y
        seg(qx, qy, x, y)
        qx = x; qy = y
      }
      px = c.x; py = c.y
    }
  }
  spans.sort((a, b) => a[0] - b[0])
  const out = []
  for (const s of spans) { const last = out[out.length - 1]; if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]); else out.push([...s]) }
  return out
}
