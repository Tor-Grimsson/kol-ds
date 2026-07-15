import { useEffect, useMemo, useState } from 'react'

/**
 * useFontMetrics — parse a real font with opentype.js and expose its metrics +
 * text→outline geometry. The parsing engine ported from the kol type-editor's
 * `fontLoader.js` (async fetch + parse + promise cache) and `textOutline.js`
 * (tracking-aware advance measurement, greedy soft-wrap, CSS half-leading
 * baseline math). Generalised off the editor's `layer` object into plain args
 * and stripped of the editor's case-folding — casing is a content concern, so
 * text is measured and outlined verbatim.
 *
 * WHY IT EXISTS: `GlyphMetricsGrid` already injects a FontFace and parses face-
 * level metrics (ascender/descender/cap/x-height) inline. This hook is the
 * reusable, parse-only layer beneath that — and it adds what the grid can't
 * currently show: per-glyph advance/bounding-box readouts and true glyph
 * OUTLINE path data (`<path d>`) for any string, at any size/tracking, wrapped
 * to a box. A consumer can feed those straight into an SVG specimen.
 *
 * GRACEFUL DEGRADATION: opentype.js is an OPTIONAL peer, loaded via dynamic
 * import. Absent it, the hook resolves to `status: 'unavailable'` with a null
 * font — every derived helper returns an empty/zero result instead of throwing,
 * exactly like the grid's overlay simply not drawing.
 *
 * @param {string} [fontUrl] Same-origin URL of a `.ttf`/`.otf` to fetch + parse.
 * @param {Object} [options]
 * @param {ArrayBuffer} [options.buffer] Pre-fetched font bytes — skips the fetch
 *   (use when a caller already holds the buffer, e.g. an upload). Takes priority
 *   over `fontUrl`; the two share the same parse/metric path.
 * @param {string} [options.cacheKey] Override the cache key when passing a raw
 *   buffer (defaults to a per-buffer identity key, so repeat buffers re-parse).
 * @returns {{
 *   status: 'idle'|'loading'|'ready'|'unavailable'|'error',
 *   opentypeAvailable: boolean,
 *   font: object|null,
 *   metrics: {unitsPerEm:number,ascender:number,descender:number,capHeight:number,xHeight:number}|null,
 *   error: Error|null,
 *   getAdvanceWidth: (text:string, size:number, opts?:{tracking?:number}) => number,
 *   getGlyphMetrics: (char:string, size?:number) => object|null,
 *   getOutlinePaths: (text:string, opts?:object) => string[],
 * }}
 */

/* ── opentype loader — cached dynamic import; null once we know it's absent ──
 * Mirrors GlyphMetricsGrid's inline dynamic import so the two agree on how the
 * optional peer is resolved (mod.parse ?? mod.default.parse ?? mod.default). */
let opentypePromise = null
function loadOpentype() {
  if (opentypePromise) return opentypePromise
  opentypePromise = import('opentype.js')
    .then((mod) => ({ parse: mod.parse || mod.default?.parse || mod.default }))
    .catch(() => null)
  return opentypePromise
}

/* Resolved { font, metrics } promises, keyed like fontLoader's cache so repeat
 * calls for the same cut never re-fetch or re-parse. A rejected/absent parse is
 * evicted so a later attempt can retry. */
const cache = new Map()

/* Face-level metric extraction with the SAME fallback chains GlyphMetricsGrid
 * uses (os2 ?? hhea ?? literal) so an incomplete font degrades instead of
 * throwing. */
function extractFaceMetrics(font) {
  const os2 = font.tables?.os2
  const hhea = font.tables?.hhea
  return {
    unitsPerEm: font.unitsPerEm || 1000,
    ascender: os2?.sTypoAscender ?? hhea?.ascender ?? 800,
    descender: os2?.sTypoDescender ?? hhea?.descender ?? -200,
    capHeight: os2?.sCapHeight ?? 700,
    xHeight: os2?.sxHeight ?? 500,
  }
}

async function loadFontMetrics(key, source) {
  if (cache.has(key)) return cache.get(key)
  const promise = (async () => {
    const ot = await loadOpentype()
    if (!ot?.parse) return { font: null, metrics: null, reason: 'unavailable' }
    const buffer =
      source.buffer ??
      (await fetch(source.url).then((r) => {
        if (!r.ok) throw new Error(`Font fetch failed: ${source.url}`)
        return r.arrayBuffer()
      }))
    const font = ot.parse(buffer)
    return { font, metrics: extractFaceMetrics(font), reason: 'ready' }
  })()
  cache.set(key, promise)
  promise.catch(() => cache.delete(key))
  return promise
}

/* opentype render options for an em tracking value. Non-zero tracking clears
 * ligature features — matching CSS ("UAs should not apply optional ligatures
 * when letter-spacing is non-zero"); kerning stays on via the defaults. */
const renderOpts = (track) =>
  !track ? {} : { letterSpacing: track, features: [] }

/* Greedy soft-wrap of one hard line to maxW, measured with the same advance/
 * kerning/letter-spacing engine that draws the glyphs. Whitespace never forces
 * a break (trailing space hangs); a word wider than the box splits at char
 * level (overflow-wrap: break-word). Ported verbatim from textOutline.js. */
function wrapLine(font, text, size, opts, maxW) {
  if (!text.trim() || maxW <= 0) return [text]
  const measure = (s) => font.getAdvanceWidth(s.replace(/\s+$/, ''), size, opts)
  const tokens = text.split(/(\s+)/).filter(Boolean)
  const lines = []
  let cur = ''
  for (const tok of tokens) {
    if (/^\s+$/.test(tok)) { cur += tok; continue }
    if (cur.trim() && measure(cur + tok) > maxW) { lines.push(cur); cur = tok }
    else cur += tok
    while (measure(cur) > maxW && cur.trim().length > 1) {
      let n = cur.length - 1
      while (n > 1 && measure(cur.slice(0, n)) > maxW) n -= 1
      lines.push(cur.slice(0, n))
      cur = cur.slice(n)
    }
  }
  lines.push(cur)
  return lines
}

/**
 * Glyph outlines as layer-local `<path d>` strings, one per rendered line.
 * Ported from textOutline.js `textOutlinePaths` — baselines via the CSS half-
 * leading model over hhea ascent/descent (what Chrome/mac uses for the line-box
 * content area). Text is outlined verbatim (no case-folding). When `boxWidth`
 * is 0 the text is treated as a single unwrapped line; when `boxHeight` is 0 the
 * block is top-anchored (top = 0) rather than vertically centered.
 */
function buildOutlinePaths(font, metrics, text, opts = {}) {
  const {
    size = 96,
    tracking = 0,
    lineHeight = 1.05,
    align = 'left',
    boxWidth = 0,
    boxHeight = 0,
    decimals = 2,
  } = opts
  const display = String(text ?? '')
  if (!display.trim()) return []

  const ropts = renderOpts(tracking)
  const lines = display
    .split('\n')
    .flatMap((ln) => (boxWidth > 0 ? wrapLine(font, ln, size, ropts, boxWidth) : [ln]))

  const scale = size / metrics.unitsPerEm
  const ascent = metrics.ascender * scale
  const descent = -metrics.descender * scale        /* hhea descender is negative */
  const lineH = lineHeight * size
  const blockH = Math.max(lines.length * lineH, size)  /* min-height: 1em */
  const top = boxHeight > 0 ? (boxHeight - blockH) / 2 : 0

  const paths = []
  lines.forEach((line, i) => {
    const t = line.replace(/\s+$/, '')             /* trailing spaces hang */
    if (!t) return                                 /* blank line still holds its slot */
    const lineW = font.getAdvanceWidth(t, size, ropts)
    const lx =
      align === 'left' ? 0 : align === 'right' ? boxWidth - lineW : (boxWidth - lineW) / 2
    const baseY = top + i * lineH + (lineH - (ascent + descent)) / 2 + ascent
    const d = font.getPath(t, lx, baseY, size, ropts).toPathData(decimals)
    if (d) paths.push(d)
  })
  return paths
}

/* Per-glyph readout for the first char of `char`, in font units and (if a size
 * is given) scaled px. Upgrades GlyphMetricsGrid: it can now print each cell's
 * real advance + bounding box, not just the face-level lines. */
function glyphMetricsOf(font, char, size) {
  const ch = String(char ?? '').charAt(0)
  if (!ch) return null
  const glyph = font.charToGlyph(ch)
  if (!glyph) return null
  const bbox = glyph.getBoundingBox?.() ?? { x1: 0, y1: 0, x2: 0, y2: 0 }
  const advanceUnits = glyph.advanceWidth ?? 0
  const base = {
    name: glyph.name,
    unicode: glyph.unicode,
    index: glyph.index,
    advanceWidth: advanceUnits,
    boundingBox: bbox,
    leftSideBearing: glyph.leftSideBearing ?? bbox.x1,
  }
  if (!size) return base
  const scale = size / (font.unitsPerEm || 1000)
  return {
    ...base,
    advanceWidthPx: advanceUnits * scale,
    widthPx: (bbox.x2 - bbox.x1) * scale,
    heightPx: (bbox.y2 - bbox.y1) * scale,
  }
}

export default function useFontMetrics(fontUrl, options = {}) {
  const { buffer, cacheKey } = options
  const key = buffer ? cacheKey ?? `buffer:${cacheKey ?? Math.random()}` : fontUrl

  const [state, setState] = useState({
    status: 'idle',
    font: null,
    metrics: null,
    error: null,
  })

  useEffect(() => {
    if (!buffer && !fontUrl) {
      setState({ status: 'idle', font: null, metrics: null, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, status: 'loading', error: null }))
    loadFontMetrics(key, buffer ? { buffer } : { url: fontUrl })
      .then(({ font, metrics, reason }) => {
        if (cancelled) return
        if (!font) { setState({ status: 'unavailable', font: null, metrics: null, error: null }); return }
        setState({ status: reason === 'ready' ? 'ready' : 'unavailable', font, metrics, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', font: null, metrics: null, error })
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const { font, metrics } = state

  // Stable helper identities per parsed font — safe to pass to children/memos.
  const helpers = useMemo(() => ({
    getAdvanceWidth: (text, size, opts = {}) =>
      font ? font.getAdvanceWidth(String(text ?? ''), size, renderOpts(opts.tracking)) : 0,
    getGlyphMetrics: (char, size) => (font ? glyphMetricsOf(font, char, size) : null),
    getOutlinePaths: (text, opts) => (font && metrics ? buildOutlinePaths(font, metrics, text, opts) : []),
  }), [font, metrics])

  return {
    status: state.status,
    opentypeAvailable: state.status !== 'unavailable',
    font,
    metrics,
    error: state.error,
    ...helpers,
  }
}

export { extractFaceMetrics, buildOutlinePaths, glyphMetricsOf }
