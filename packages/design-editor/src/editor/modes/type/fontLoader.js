/**
 * Font loader for the outline engine (variable fonts since 2026-11-18).
 *
 * `loadFont(family, weight, italic)` resolves to a Font INSTANCE: the family's
 * variable TTF (see families.js) parsed once with opentype.js, fixed at
 * `weight` on its wght axis (and, for Inter's italic, slnt at its end). The instance speaks the
 * slice of opentype's Font API the engine uses — unitsPerEm, ascender,
 * descender, getPath, getAdvanceWidth, charToGlyph — so callers draw, measure
 * and morph without knowing a variable font is underneath.
 *
 * The opentype.js 2.0.0 gaps are closed here and nowhere else:
 *   - gvar: a tuple with private point numbers whose count is 0 ("all
 *     points") is read as if it used the shared points, so its deltas land
 *     on the wrong points (Inter's slnt broke whole glyphs). Each glyph's
 *     tuples are re-read from the file before first use.
 *   - advances: getAdvanceWidth / forEachGlyph read the glyph's static
 *     advance, and a font without HVAR (Malromur) never varies it. The
 *     instance sets each glyph's advance at the weight first: HVAR through
 *     opentype's own transform, otherwise from gvar's phantom points.
 *   - ccmp: opentype applies ccmp on every string and throws on a chained
 *     context lookup it does not support (Inter has one). The feature is
 *     renamed out of the GSUB list at parse; precomposed Latin does not need it.
 *
 * `family` may be any old value (a Right Grotesk width cut id like 'base' or
 * 'Tight'): it resolves to Inter, so pre-2026-11-18 callers keep working.
 */

import opentype from 'opentype.js'
import { resolveFamily, clampWeight, fontFileFor, axisCoords } from './families'
import { shapeRun } from './shape'

/* opentype's path writer rounds through a string ("7.1e-15" + "e+2"), so a
 * coordinate a hair off a whole number (float noise from scaling or the
 * variation math) writes as NaN and the glyph breaks. Coordinates are snapped
 * to 1e-4 before writing; every `d` the engine takes from opentype passes here. */
const writePathData = opentype.Path.prototype.toPathData
opentype.Path.prototype.toPathData = function (options) {
  const commands = this.commands
  const snap = (v) => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)
  this.commands = commands.map((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, snap(v)])))
  try { return writePathData.call(this, options) } finally { this.commands = commands }
}

const files = new Map()      // url → Promise<opentype.Font>
const instances = new Map()  // `${url}|${coords}` → instance

/* A variable TTF parsed once, with the gaps below closed. Exported for the
 * kinetic layer's outline morph (morph.js), so both engines read one parse. */
export function loadFontFile(url) {
  if (files.has(url)) return files.get(url)
  const promise = (async () => {
    const buffer = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`Font fetch failed: ${url}`)
      return r.arrayBuffer()
    })
    const font = opentype.parse(buffer)
    for (const f of font.tables.gsub?.features ?? []) if (f.tag === 'ccmp') f.tag = 'ccm_'
    font.kolFeatures = readFeatures(font, buffer)
    /* `kolShape` in the render options (the feature tags the canvas applies) shapes the run through shape.js in place of
       opentype's own shaping; the GPOS single adjustments ride on the glyph list (`kolAdj`) into forEachGlyph */
    const toGlyphs = font.stringToGlyphs.bind(font)
    font.stringToGlyphs = (s, o) => {
      if (!o?.kolShape) return toGlyphs(s, o)
      const run = shapeRun(font, Array.from(String(s), (ch) => font.charToGlyphIndex(ch)), o.kolShape)
      const notdef = font.glyphs.get(0)
      const glyphs = run.glyphs.map((g) => font.glyphs.get(g) ?? notdef)
      glyphs.kolAdj = run.adj
      return glyphs
    }
    const forEach = font.forEachGlyph
    font.forEachGlyph = function (text, x = 0, y = 0, fontSize = 72, options, callback) {
      const o = Object.assign({}, this.defaultRenderOptions, options)
      if (!o.kolShape) return forEach.call(this, text, x, y, fontSize, options, callback)
      const scale = fontSize / this.unitsPerEm
      const glyphs = this.stringToGlyphs(text, o)
      const kern = o.kerning ? this.position.getKerningTables(o.script || this.position.getDefaultScriptName(), o.language) : null
      glyphs.forEach((g, i) => {
        const a = glyphs.kolAdj[i]
        callback.call(this, g, x + a.dx * scale, y, fontSize, o)
        x += ((g.advanceWidth ?? 0) + a.adv) * scale
        if (o.kerning && i < glyphs.length - 1) x += (kern ? this.position.getKerningValue(kern, g.index, glyphs[i + 1].index) : this.getKerningValue(g, glyphs[i + 1])) * scale
        if (o.letterSpacing) x += o.letterSpacing * fontSize
      })
      return x
    }
    unwrapKerning(font, buffer)
    fixGlyphVariations(font, buffer)
    return font
  })()
  files.set(url, promise)
  promise.catch(() => files.delete(url))
  return promise
}

/* ── kerning ───────────────────────────────────────────────────────────
 * Inter and Malromur keep their kern lookups behind GPOS Extension lookups
 * (type 9), which opentype.js 2.0.0 parses as an error, so it kerns nothing
 * while the browser kerns. Each Extension subtable that wraps a pair
 * adjustment (type 2) is read from the file and put back as a plain type 2
 * lookup, which opentype's kerning then finds. Rot and Gullhamrar (the
 * 2026-11-12 exports) use plain type 2 lookups, which opentype reads but
 * without their deltas, so those are re-read the same way. A pair's xAdvance also varies
 * with weight through a VariationIndex device and GDEF's item store, which
 * opentype drops; here xAdvance is a getter that adds the delta at the
 * coordinates the instance is drawing (`font.kolCoords`). */
const { Parser } = opentype._parse

/* a table's offset in the file, -1 when absent */
function tableAt(buffer, tag) {
  const view = new DataView(buffer)
  for (let i = 0, n = view.getUint16(4); i < n; i++) {
    const rec = 12 + i * 16
    if (String.fromCharCode(...new Uint8Array(buffer, rec, 4)) === tag) return view.getUint32(rec + 8)
  }
  return -1
}

/* a ValueRecord, with its xAdvance device kept when it is a VariationIndex */
function readValue(view, p, fmt, base, vary) {
  if (!fmt) return undefined
  const v = {}
  if (fmt & 1) v.xPlacement = p.parseShort()
  if (fmt & 2) v.yPlacement = p.parseShort()
  if (fmt & 4) v.xAdvance = p.parseShort()
  if (fmt & 8) v.yAdvance = p.parseShort()
  if (fmt & 16) p.parseUShort()
  if (fmt & 32) p.parseUShort()
  if (fmt & 64) {
    const off = p.parseUShort()
    if (off && view.getUint16(base + off + 4) === 0x8000) vary(v, view.getUint16(base + off), view.getUint16(base + off + 2))
  }
  if (fmt & 128) p.parseUShort()
  return v
}

function parsePairPos(view, at, vary) {
  const p = new Parser(view, at)
  const posFormat = p.parseUShort()
  const coverage = p.parsePointer(Parser.coverage)
  const valueFormat1 = p.parseUShort()
  const valueFormat2 = p.parseUShort()
  const pair = (q) => ({ value1: readValue(view, q, valueFormat1, at, vary), value2: readValue(view, q, valueFormat2, at, vary) })
  if (posFormat === 1) {
    const sets = []
    for (let i = 0, n = p.parseUShort(); i < n; i++) {
      const q = new Parser(view, at + p.parseUShort())
      const set = []
      for (let j = 0, m = q.parseUShort(); j < m; j++) set.push({ secondGlyph: q.parseUShort(), ...pair(q) })
      sets.push(set)
    }
    return { posFormat, coverage, valueFormat1, valueFormat2, pairSets: sets }
  }
  const classDef1 = p.parsePointer(Parser.classDef)
  const classDef2 = p.parsePointer(Parser.classDef)
  const class1Count = p.parseUShort()
  const class2Count = p.parseUShort()
  const classRecords = []
  for (let i = 0; i < class1Count; i++) {
    const row = []
    for (let j = 0; j < class2Count; j++) row.push(pair(p))
    classRecords.push(row)
  }
  return { posFormat, coverage, valueFormat1, valueFormat2, classDef1, classDef2, class1Count, class2Count, classRecords }
}

function unwrapKerning(font, buffer) {
  const lookups = font.tables.gpos?.lookups
  if (!lookups?.some((l) => l.lookupType === 9 || l.lookupType === 2)) return
  const view = new DataView(buffer)
  const gpos = tableAt(buffer, 'GPOS')
  if (gpos < 0) return
  /* GDEF 1.3's item variation store: where the pair deltas live */
  const gdef = tableAt(buffer, 'GDEF')
  let store = null
  if (gdef >= 0 && view.getUint16(gdef + 2) >= 3 && view.getUint32(gdef + 14)) {
    store = new Parser(view, gdef + view.getUint32(gdef + 14)).parseItemVariationStore()
  }
  const deltas = new Map()
  const vary = (v, outer, inner) => {
    if (!store || !font.variation) return
    const base = v.xAdvance ?? 0
    Object.defineProperty(v, 'xAdvance', {
      enumerable: true,
      get() {
        const c = font.kolCoords
        if (!c) return base
        const key = `${outer}.${inner}.${JSON.stringify(c)}`  /* every axis: Rot's kerning varies with wdth too */
        if (!deltas.has(key)) deltas.set(key, font.variation.process.getDelta(store, outer, inner, c))
        return base + deltas.get(key)
      },
    })
  }
  const list = gpos + view.getUint16(gpos + 8)
  lookups.forEach((lookup, i) => {
    if (lookup.lookupType !== 9 && lookup.lookupType !== 2) return
    const at = list + view.getUint16(list + 2 + i * 2)
    const count = view.getUint16(at + 4)
    const subtables = []
    for (let s = 0; s < count; s++) {
      const sub = at + view.getUint16(at + 6 + s * 2)
      if (lookup.lookupType === 2) { try { subtables.push(parsePairPos(view, sub, vary)) } catch { return } continue }
      if (view.getUint16(sub + 2) !== 2) return  /* not a pair lookup: leave it as opentype has it */
      try { subtables.push(parsePairPos(view, sub + view.getUint32(sub + 4), vary)) } catch { return }
    }
    lookup.lookupType = 2
    lookup.subtables = subtables
  })
}

/* ── gvar, re-read per glyph ───────────────────────────────────────────
 * Every tuple gets its own explicit point list (the shared list, its private
 * list, or all points + the 4 phantoms when a list's count is 0) and its
 * deltas read for exactly that many points. opentype's transform then runs
 * unchanged on correct data. Lazy: a glyph is re-read the first time it is
 * transformed (composites reach their components through the same hook). */
function fixGlyphVariations(font, buffer) {
  const gvar = tableAt(buffer, 'gvar')
  if (gvar < 0 || !font.variation) return
  const view = new DataView(buffer)
  const axisCount = view.getUint16(gvar + 4)
  const flags = view.getUint16(gvar + 14)
  const dataArray = gvar + view.getUint32(gvar + 16)
  const offset = (i) => (flags & 1 ? view.getUint32(gvar + 20 + i * 4) : view.getUint16(gvar + 20 + i * 2) * 2)
  const done = new Set()
  const fix = (glyph) => {
    if (done.has(glyph.index)) return
    done.add(glyph.index)
    const vd = font.tables.gvar.glyphVariations?.[glyph.index]
    if (!vd || offset(glyph.index + 1) === offset(glyph.index)) return
    glyph.path  /* opentype parses points lazily */
    const n = (glyph.isComposite ? glyph.components?.length ?? 0 : glyph.points?.length ?? 0) + 4
    const all = Array.from({ length: n }, (_, i) => i)
    const start = dataArray + offset(glyph.index)
    const countWord = view.getUint16(start)
    const serial = start + view.getUint16(start + 2)
    const sp = new Parser(view, serial)
    let shared = []
    if (countWord & 0x8000) { const pts = sp.parsePackedPointNumbers(); shared = pts.length ? pts : all }
    let data = serial + sp.relativeOffset
    let h = start + 4
    for (let t = 0; t < (countWord & 0x0fff); t++) {
      const size = view.getUint16(h)
      const tupleIndex = view.getUint16(h + 2)
      h += 4 + (tupleIndex & 0x8000 ? axisCount * 2 : 0) + (tupleIndex & 0x4000 ? axisCount * 4 : 0)
      const q = new Parser(view, data)
      let pts = shared.length ? shared : all
      if (tupleIndex & 0x2000) { const own = q.parsePackedPointNumbers(); pts = own.length ? own : all }
      const dx = q.parsePackedDeltas(pts.length)
      const dy = q.parsePackedDeltas(pts.length)
      const header = vd.headers[t]
      if (header) {
        Object.defineProperty(header, 'deltas', { value: dx, writable: true, configurable: true })
        Object.defineProperty(header, 'deltasY', { value: dy, writable: true, configurable: true })
        header.privatePoints = pts
      }
      data += size
    }
  }
  font.kolFixGlyph = fix
  const process = font.variation.process
  const transform = process.getTransform.bind(process)
  process.getTransform = (glyph, coords) => {
    fix(Number.isInteger(glyph) ? font.glyphs.get(glyph) : glyph)
    return transform(glyph, coords)
  }
  font.variation.getTransform = process.getTransform
}

/* ── advance at a weight ─────────────────────────────────────────────── */
const baseAdvance = new WeakMap()  // glyph → its static advance (before any write)

/* gvar phantom points (spec: points n and n+1 are the origin and the advance)
 * through opentype's own tuple math. A simple glyph's n is its outline
 * points; a composite's n is its component count, its "points" the component
 * offsets, each its own contour so nothing interpolates across them. The
 * glyph is loaded (and its tuples re-read) first: `isComposite` and the
 * points are lazy, and reading them cold took the wrong branch once. */
function phantomAdvance(font, glyph, coords) {
  font.kolFixGlyph?.(glyph)
  if (!baseAdvance.has(glyph)) baseAdvance.set(glyph, glyph.advanceWidth ?? 0)
  const adv = baseAdvance.get(glyph)
  const data = font.tables.gvar?.glyphVariations?.[glyph.index]
  if (!data) return adv
  const lone = (x, y) => ({ x, y, onCurve: true, lastPointOfContour: true })
  const pts = glyph.isComposite
    ? (glyph.components ?? []).map((c) => lone(c.dx ?? 0, c.dy ?? 0))
    : (glyph.points ?? [])
  const out = font.variation.process.applyTupleVariationStore(data, [...pts, lone(0, 0), lone(adv, 0), lone(0, 0), lone(0, 0)], coords, 'gvar')
  return out[pts.length + 1].x - out[pts.length].x
}

function setAdvance(font, glyph, coords) {
  if (font.tables.hvar) { font.variation.getTransform(glyph, coords); return }
  glyph.advanceWidth = phantomAdvance(font, glyph, coords)
}

function instanceAt(font, url, coords) {
  const key = `${url}|${JSON.stringify(coords)}`
  if (instances.has(key)) return instances.get(key)
  /* Shared glyph objects carry the advance of whichever weight touched them
   * last; every call sets them for THIS weight first (sync, so safe). */
  const prep = (text, opts) => {
    font.kolCoords = coords  /* the kerning getters read it (sync, so safe) */
    for (const g of font.stringToGlyphs(String(text), opts)) setAdvance(font, g, coords)
  }
  const withAxis = (opts) => ({ ...opts, variation: coords })
  const inst = {
    variable: true,
    wght: coords.wght,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    capHeight: font.tables.os2?.sCapHeight ?? font.ascender * 0.7,
    underlinePosition: font.tables.post?.underlinePosition ?? -font.unitsPerEm * 0.1,
    underlineThickness: font.tables.post?.underlineThickness ?? font.unitsPerEm * 0.05,
    strikeoutPosition: font.tables.os2?.yStrikeoutPosition ?? font.unitsPerEm * 0.3,
    strikeoutSize: font.tables.os2?.yStrikeoutSize ?? font.unitsPerEm * 0.05,
    getPath(text, x, y, size, opts = {}) {
      const o = withAxis(opts)
      prep(text, Object.assign({}, font.defaultRenderOptions, o))
      return font.getPath(String(text), x, y, size, o)
    },
    getAdvanceWidth(text, size, opts = {}) {
      const o = withAxis(opts)
      prep(text, Object.assign({}, font.defaultRenderOptions, o))
      return font.getAdvanceWidth(String(text), size, o)
    },
    /* A glyph fixed at this weight: its own path and advance, so
     * glyph.getPath(x, y, size) and glyph.advanceWidth read the instance. */
    charToGlyph(ch) {
      const g = font.charToGlyph(ch)
      setAdvance(font, g, coords)
      const advanceWidth = g.advanceWidth
      const t = font.variation.getTransform(g, coords)
      if (t !== g) t.advanceWidth = advanceWidth
      return t
    },
  }
  instances.set(key, inst)
  return inst
}

export async function loadFont(family, weight, italic = false, slant) {
  const fam = resolveFamily(family)
  const url = fontFileFor(fam, italic)
  if (!url) throw new Error(`No outline font for ${family}`)
  const font = await loadFontFile(url)
  return instanceAt(font, url, axisCoords(fam, clampWeight(fam, Number(weight)), italic, slant))
}

/* What an outline family's file carries: its GSUB and GPOS feature tags and the names it gives its stylistic sets and
   character variants ({ ss01: 'Open digits' }). Null for a family with no file here (JetBrains, Google). */
export async function fontFeatures(family, italic = false) {
  const url = fontFileFor(resolveFamily(family), italic)
  if (!url) return null
  return (await loadFontFile(url)).kolFeatures
}

/* the feature tags and the ss / cv names, read from the file: opentype keeps a feature's params as an offset only */
function readFeatures(font, buffer) {
  const gsub = new Set((font.tables.gsub?.features ?? []).map((f) => (f.tag === 'ccm_' ? 'ccmp' : f.tag)))
  const gpos = new Set((font.tables.gpos?.features ?? []).map((f) => f.tag))
  const names = {}
  const at = tableAt(buffer, 'GSUB')
  if (at >= 0) {
    const view = new DataView(buffer)
    const list = at + view.getUint16(at + 6)
    for (let i = 0, n = view.getUint16(list); i < n; i++) {
      const rec = list + 2 + i * 6
      const tag = String.fromCharCode(...new Uint8Array(buffer, rec, 4))
      if (!/^(ss|cv)\d\d$/.test(tag) || names[tag]) continue
      const table = list + view.getUint16(rec + 4)
      const params = view.getUint16(table)
      if (!params) continue
      const name = font.names?.windows?.[view.getUint16(table + params + 2)]?.en
      if (name) names[tag] = name
    }
  }
  return { gsub, gpos, names }
}

/* A font instance for any variable file at any axis coordinates, the same
 * object loadFont hands back (kinetic's Rot and Gullhamrar are not outline
 * families, so they are reached by file). */
export async function loadFontAt(url, coords) {
  return instanceAt(await loadFontFile(url), url, coords)
}
