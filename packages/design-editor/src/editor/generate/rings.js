/* The outline a generate layer borrows as its mask (plan 52 W4), in ART-BOX units ([0,1]², y down):
 *
 *  - LETTER (4.1): a character in a Right Grotesk cut, its opentype outline fitted into the art box.
 *  - LINKED LAYER (4.2, and Tools › Generate applied to a selection): another layer's outline — a shape,
 *    a path, a Paratype letter — read LIVE: the memo keys on the source layer object, and the compose
 *    store replaces that object on every edit, so the mask re-renders in the same commit as the source.
 *    A deleted source leaves no rings, and the mask falls back to none.
 *
 * ponytail: the source's rotation / flip are ignored — the outline is read in its unrotated box; bake the
 * transform here if a rotated source ever needs to mask. */
import { useEffect, useMemo, useState } from 'react'
import { useComposeState } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import { shapeOutlineD } from '../compose/shape-math'
import { pathD } from '../compose/path-math'
import { loadFont } from '../modes/type/fontLoader'
import { flattenD, ringsBounds } from '../../generate/path.js'
import { artBox } from '../../generate/index.js'
import { glyphPlacements } from '../../loops/paratype/specimen.js'
import { PARATYPE_DEFAULTS } from '../../generate/glyphs.js'

/* a source layer's outline as rings in DOCUMENT coordinates */
export function sourceRingsDoc(src) {
  if (!src) return null
  const ox = src.x ?? 0, oy = src.y ?? 0
  const shift = (rings) => rings.map((r) => r.map(([x, y]) => [x + ox, y + oy]))
  if (src.type === 'shape') return shift(flattenD(shapeOutlineD(src) || '', 8))
  if (src.type === 'path') {
    const rings = [src.nodes ?? [], ...(src.holes ?? [])].map((r) => pathD(r, true)).join(' ')
    return shift(flattenD(rings, 8))
  }
  if (src.type === 'misc' && src.loopId === 'paratype-glyph') {
    /* the same placement the canvas and Paratype's flatten use: font units y-up → layer px */
    const p = { ...PARATYPE_DEFAULTS }
    for (const k of Object.keys(PARATYPE_DEFAULTS)) if (src[k] != null && typeof src[k] !== 'object') p[k] = src[k]
    const out = []
    for (const pl of glyphPlacements(p, Math.max(1, src.w ?? 480), Math.max(1, src.h ?? 480))) {
      for (const path of pl.g.paths) for (const r of flattenD(path.d, 6)) out.push(r.map(([x, y]) => [ox + pl.tx + x * pl.s, oy + pl.ty - y * pl.s]))
    }
    return out
  }
  return null
}

/* document rings → the generate layer's art-box units */
export function toArtUnits(rings, gen) {
  if (!rings?.length) return null
  const b = artBox(gen, gen.w ?? 0, gen.h ?? 0)
  const x0 = (gen.x ?? 0) + b.x, y0 = (gen.y ?? 0) + b.y
  return rings.map((r) => r.map(([x, y]) => [(x - x0) / b.w, (y - y0) / b.h]))
}

/* a glyph's rings (any units) fitted, centred, into the art box at `fit` of its size — aspect-true */
export function fitRings(rings, gen, fit = 0.9) {
  if (!rings?.length) return null
  const b = artBox(gen, gen.w ?? 0, gen.h ?? 0)
  const g = ringsBounds(rings)
  const s = Math.min((b.w * fit) / (g.w || 1), (b.h * fit) / (g.h || 1))
  return rings.map((r) => r.map(([x, y]) => [(b.w / 2 + (x - g.x - g.w / 2) * s) / b.w, (b.h / 2 + (y - g.y - g.h / 2) * s) / b.h]))
}

/* a letter's outline in font px (y down), or null while the cut loads */
export async function letterRings(ch, cut = 'base', weight = 700) {
  const font = await loadFont(cut, weight, false)
  return flattenD(font.getPath(ch || 'A', 0, 0, 1000).toPathData(2), 8)
}

export function useGenerateRings(layer) {
  const { layers } = useComposeState()
  const kind = layer.mKind
  /* LETTER — async: the cut loads once (fontLoader caches the promise) */
  const [glyph, setGlyph] = useState(null)
  const ch = layer.mChar, cut = layer.mCut, wt = layer.mWeight
  useEffect(() => {
    if (kind !== 'letter') return undefined
    let live = true
    letterRings(ch, cut, wt).then((r) => { if (live) setGlyph(r) }).catch(() => { if (live) setGlyph(null) })
    return () => { live = false }
  }, [kind, ch, cut, wt])
  const src = kind === 'layer' && layer.mLayer ? findLayerDeep(layers, layer.mLayer) : null
  const box = [layer.x, layer.y, layer.w, layer.h, layer.inset]
  const fit = layer.mFit ?? 0.9
  /* eslint-disable-next-line react-hooks/exhaustive-deps -- the box values and the source object are the keys */
  return useMemo(() => {
    if (kind === 'letter') return fitRings(glyph, layer, fit)
    if (kind === 'layer') return toArtUnits(sourceRingsDoc(src), layer)
    return null
  }, [kind, glyph, src, fit, ...box])
}
