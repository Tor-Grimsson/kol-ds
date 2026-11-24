/**
 * The outline export's shaper: a run of glyphs through the font's GSUB and GPOS the way the browser shapes the canvas
 * (HarfBuzz): every lookup of the enabled features, for the latn script's default language (DFLT when absent), applied
 * in lookup order over the whole run. GSUB lookup types 1 to 7 (single, multiple, alternate, ligature, context,
 * chained context, extension); GPOS single adjustment (cpsp). Pair kerning stays opentype's own (fontLoader).
 *
 * `shapeRun(font, glyphIndexes, tags)` → { glyphs, adj }, adj[i] = { dx, adv } in font units.
 */

const covMaps = new WeakMap()
function covIndex(cov, g) {
  if (!cov) return -1
  let m = covMaps.get(cov)
  if (!m) {
    m = new Map()
    if (cov.format === 1) cov.glyphs.forEach((x, i) => m.set(x, i))
    else for (const r of cov.ranges ?? []) for (let x = r.start; x <= r.end; x++) m.set(x, r.index + x - r.start)
    covMaps.set(cov, m)
  }
  return m.get(g) ?? -1
}

function classOf(cd, g) {
  if (cd?.format === 1) { const i = g - cd.startGlyph; return i >= 0 && i < cd.classes.length ? cd.classes[i] : 0 }
  if (cd?.format === 2) for (const r of cd.ranges) if (g >= r.start && g <= r.end) return r.classId
  return 0
}

/* the glyphs a lookup's flag skips: bases, ligatures, marks by GDEF's glyph classes
   ponytail: mark attachment types and mark filtering sets are not read, add when a font with marks needs them */
function skipper(font, flag) {
  const cd = font.tables.gdef?.classDef
  if (!cd || !(flag & 14)) return () => false
  return (g) => { const c = classOf(cd, g); return (c === 1 && !!(flag & 2)) || (c === 2 && !!(flag & 4)) || (c === 3 && !!(flag & 8)) }
}

/* the lookups the given features reach for latn's default language (DFLT when the font has no latn), in lookup order */
const lookupCache = new WeakMap()
function lookupsFor(table, tags) {
  if (!table) return []
  const key = tags.join(' ')
  let byTable = lookupCache.get(table)
  if (!byTable) lookupCache.set(table, (byTable = new Map()))
  if (byTable.has(key)) return byTable.get(key)
  const script = (table.scripts ?? []).find((s) => s.tag === 'latn') ?? (table.scripts ?? []).find((s) => s.tag === 'DFLT')
  const sys = script?.script?.defaultLangSys
  const want = new Set(tags)
  const out = new Set()
  for (const fi of [...(sys?.featureIndexes ?? []), ...(sys?.reqFeatureIndex != null && sys.reqFeatureIndex !== 0xffff ? [sys.reqFeatureIndex] : [])]) {
    const f = table.features[fi]
    if (f && want.has(f.tag === 'ccm_' ? 'ccmp' : f.tag)) f.feature.lookupListIndexes.forEach((i) => out.add(i))
  }
  const list = [...out].sort((a, b) => a - b)
  byTable.set(key, list)
  return list
}

const subtablesOf = (lk) => (lk.lookupType === 7 ? lk.subtables.map((s) => [s.lookupType, s.extension]) : lk.subtables.map((s) => [lk.lookupType, s]))
const nextAt = (buf, j, skip) => { for (let k = j + 1; k < buf.length; k++) if (!skip(buf[k])) return k; return -1 }
const prevAt = (buf, j, skip) => { for (let k = j - 1; k >= 0; k--) if (!skip(buf[k])) return k; return -1 }

/* positions of a sequence matched from `at` (the first already matched), each item tested by `test(glyph, item)` */
function matchInput(buf, at, items, test, skip) {
  const pos = [at]
  let j = at
  for (const it of items) { j = nextAt(buf, j, skip); if (j < 0 || !test(buf[j], it)) return null; pos.push(j) }
  return pos
}
function matchAround(buf, pos, back, ahead, testB, testA, skip) {
  let j = pos[0]
  for (const it of back) { j = prevAt(buf, j, skip); if (j < 0 || !testB(buf[j], it)) return false }
  j = pos[pos.length - 1]
  for (const it of ahead) { j = nextAt(buf, j, skip); if (j < 0 || !testA(buf[j], it)) return false }
  return true
}

/* a context subtable's match: the input positions and its lookup records, or null */
function contextMatch(type, st, buf, i, skip) {
  const g = buf[i]
  const eq = (x, it) => x === it
  const cov = (x, c) => covIndex(c, x) >= 0
  if (type === 5) {
    if (st.substFormat === 3) {
      if (!cov(g, st.coverages[0])) return null
      const pos = matchInput(buf, i, st.coverages.slice(1), cov, skip)
      return pos && { pos, records: st.lookupRecords }
    }
    const k = covIndex(st.coverage, g)
    if (k < 0) return null
    const rules = st.substFormat === 1 ? st.ruleSets[k] : st.classSets[classOf(st.classDef, g)]
    const test = st.substFormat === 1 ? eq : (x, c) => classOf(st.classDef, x) === c
    for (const r of rules ?? []) {
      const pos = matchInput(buf, i, st.substFormat === 1 ? r.input : r.classes, test, skip)
      if (pos) return { pos, records: r.lookupRecords }
    }
    return null
  }
  if (st.substFormat === 3) {
    if (!cov(g, st.inputCoverage[0])) return null
    const pos = matchInput(buf, i, st.inputCoverage.slice(1), cov, skip)
    return pos && matchAround(buf, pos, st.backtrackCoverage, st.lookaheadCoverage, cov, cov, skip) ? { pos, records: st.lookupRecords } : null
  }
  const k = covIndex(st.coverage, g)
  if (k < 0) return null
  const byClass = st.substFormat === 2
  const rules = byClass ? st.chainClassSet[classOf(st.inputClassDef, g)] : st.chainRuleSets[k]
  const cls = (cd) => (x, c) => classOf(cd, x) === c
  for (const r of rules ?? []) {
    const pos = matchInput(buf, i, r.input, byClass ? cls(st.inputClassDef) : eq, skip)
    if (pos && matchAround(buf, pos, r.backtrack, r.lookahead, byClass ? cls(st.backtrackClassDef) : eq, byClass ? cls(st.lookaheadClassDef) : eq, skip)) return { pos, records: r.lookupRecords }
  }
  return null
}

/* one GSUB lookup at position i: the index after what it consumed, or -1 when nothing matched */
function applyAt(ctx, li, buf, i) {
  const lk = ctx.gsub.lookups[li]
  if (!lk) return -1
  const skip = ctx.skip(lk.lookupFlag)
  if (skip(buf[i])) return -1
  const g = buf[i]
  for (const [type, st] of subtablesOf(lk)) {
    if (!st) continue
    if (type === 1) {
      const k = covIndex(st.coverage, g)
      if (k < 0) continue
      buf[i] = st.substFormat === 1 ? (g + st.deltaGlyphId) & 0xffff : st.substitute[k]
      return i + 1
    }
    if (type === 2 || type === 3) {
      const k = covIndex(st.coverage, g)
      if (k < 0) continue
      const seq = type === 2 ? st.sequences[k] : [st.alternateSets[k][0]]
      buf.splice(i, 1, ...seq)
      return i + seq.length
    }
    if (type === 4) {
      const k = covIndex(st.coverage, g)
      if (k < 0) continue
      for (const lig of st.ligatureSets[k] ?? []) {
        const pos = matchInput(buf, i, lig.components, (x, c) => x === c, skip)
        if (!pos) continue
        buf[i] = lig.ligGlyph
        for (const p of pos.slice(1).reverse()) buf.splice(p, 1)
        return i + 1
      }
      continue
    }
    if (type === 5 || type === 6) {
      const m = contextMatch(type, st, buf, i, skip)
      if (!m) continue
      const pos = m.pos
      for (const rec of m.records) {
        const p = pos[rec.sequenceIndex]
        if (p == null || p >= buf.length) continue
        const before = buf.length
        applyAt(ctx, rec.lookupListIndex, buf, p)
        const d = buf.length - before
        if (d) for (let q = rec.sequenceIndex + 1; q < pos.length; q++) pos[q] += d
      }
      return Math.max(i + 1, Math.min(buf.length, pos[pos.length - 1] + 1))
    }
  }
  return -1
}

export function shapeRun(font, glyphIndexes, tags) {
  const buf = [...glyphIndexes]
  const gsub = font.tables.gsub
  const skips = new Map()
  const ctx = { gsub, skip: (flag) => { if (!skips.has(flag)) skips.set(flag, skipper(font, flag)); return skips.get(flag) } }
  for (const li of lookupsFor(gsub, tags)) {
    if (gsub.lookups[li]?.lookupType === 8) continue
    for (let i = 0; i < buf.length;) { const r = applyAt(ctx, li, buf, i); i = r > i ? r : i + 1 }
  }
  const adj = buf.map(() => ({ dx: 0, adv: 0 }))
  const gpos = font.tables.gpos
  for (const li of lookupsFor(gpos, tags)) {
    const lk = gpos.lookups[li]
    if (lk?.lookupType !== 1) continue
    const skip = ctx.skip(lk.lookupFlag)
    buf.forEach((g, i) => {
      if (skip(g)) return
      for (const st of lk.subtables) {
        const k = covIndex(st.coverage, g)
        if (k < 0) continue
        const v = (st.posFormat === 1 ? st.value : st.values?.[k]) ?? {}
        adj[i].dx += v.xPlacement ?? 0
        adj[i].adv += v.xAdvance ?? 0
        break
      }
    })
  }
  return { glyphs: buf, adj }
}
