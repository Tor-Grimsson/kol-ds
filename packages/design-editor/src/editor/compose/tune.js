import paper from 'paper/dist/paper-core'
import { pathD } from './path-math'
import { shapeToPathNodes } from './shape-math'
import { ensurePaper, pathToRing } from './boolean-ops'

/**
 * THE TUNE ROW (plan-2026-11-18-kolbox-system 27.5b, plan-2026-11-19 C6.2): what the tuner mode leaves on a shape.
 * A row in `layer.content` like the other effect rows (./layerModel.js), of type `tune`:
 *
 *   params: { amount 0..100, mode 'generate' | 'modify', settings, rings }
 *
 * `rings` is the tuned form as real geometry: path-math node rings (anchors and absolute handles), stored as shares of
 * the layer's box (x / w, y / h) so the form follows a resize. The layer keeps its own shape; the row only changes what
 * its body draws: at 0 the original, at 100 the tuned rings, between them the one morphed into the other. `settings`
 * are the tuner's (Modify) or the System's measures (Generate), read back when the mode is entered again.
 *
 * The body is drawn as a path layer (./LayerRenderer.jsx PathLayer, ./build.js pathLayerSvg) through the one seam both
 * the canvas and the export go through, `expandLayer`, so the export is what the canvas shows. The tuner itself (kol-
 * tuner) runs in the host's mode, never here: this file only stores, scales and morphs geometry.
 */
export const TUNE = 'tune'
export const tuneRowOf = (l) => (Array.isArray(l?.content) ? l.content.find((c) => c.type === TUNE) : undefined)

/* a shape or a closed path: what Tune can be entered on */
export const tunable = (l) => !!l && ((l.type === 'shape' && !!shapeToPathNodes(l)?.closed) || (l.type === 'path' && !!l.closed && (l.nodes?.length ?? 0) >= 2))

/* the layer's own outline, layer-local: its rings */
export function outlineRings(l) {
  if (l?.type === 'path') return l.closed ? [l.nodes ?? [], ...(l.holes ?? [])] : null
  if (l?.type === 'shape') { const g = shapeToPathNodes(l); return g?.closed ? [g.nodes] : null }
  return null
}

/* the outline as an SVG file, for the tuner to read as vectors (its `image.__svg`) */
export function outlineSvg(l) {
  const rings = outlineRings(l)
  if (!rings) return null
  const w = Math.max(1, l.w ?? 1), h = Math.max(1, l.h ?? 1)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path fill="#000" fill-rule="evenodd" d="${rings.map((r) => pathD(r, true)).join(' ')}"/></svg>`
}

const bounds = (rings) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of rings) for (const n of r) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y) }
  return Number.isFinite(x0) ? { x: x0, y: y0, w: Math.max(1e-6, x1 - x0), h: Math.max(1e-6, y1 - y0) } : null
}
const mapNode = (n, f) => ({ ...f(n), in: n.in ? f(n.in) : null, out: n.out ? f(n.out) : null })

/* An SVG path (the tuner's form, arcs and all, or the System's) → node rings through paper, which turns arcs into
   cubics. `unite`: the System draws its mark as thin slices; uniting them gives the outline. Biggest ring first. */
export function ringsFromD(d, { unite = false } = {}) {
  if (!d) return []
  ensurePaper()
  let item = paper.PathItem.create(d)
  try {
    if (unite) { const u = item.unite(new paper.Path(), { insert: false }); item.remove(); item = u }
    const kids = (item.className === 'CompoundPath' ? item.children : [item]).filter((p) => p.segments?.length >= 2)
    const rings = kids.map((p) => ({ ring: pathToRing(p), a: Math.abs(p.area) }))
    return rings.sort((p, q) => q.a - p.a).map((r) => r.ring)
  } finally { item.remove() }
}

/* The tuned rings laid into the layer: `frame` (in the rings' own units) fitted inside `box` (layer-local) keeping its
   ratio, centred, then written as shares of the layer's w and h: what the row stores. */
export function fitRings(rings, frame, box, l) {
  const f = frame ?? bounds(rings)
  if (!f || !rings.length) return []
  const k = Math.min(box.w / f.w, box.h / f.h)
  const ox = box.x + (box.w - f.w * k) / 2, oy = box.y + (box.h - f.h * k) / 2
  const w = Math.max(1, l.w ?? 1), h = Math.max(1, l.h ?? 1)
  const r4 = (v) => Math.round(v * 1e5) / 1e5
  return rings.map((r) => r.map((n) => mapNode(n, (p) => ({ x: r4((ox + (p.x - f.x) * k) / w), y: r4((oy + (p.y - f.y) * k) / h) }))))
}
/* the box the original outline fills, layer-local (the tuned form takes its place) */
export const outlineBox = (l) => bounds(outlineRings(l) ?? []) ?? { x: 0, y: 0, w: Math.max(1, l.w ?? 1), h: Math.max(1, l.h ?? 1) }

/* ---- the morph, for an amount between 0 and 100 ---- */
const N = 160
const cubic = (p, c, t) => {
  const a = p.out ?? p, b = c.in ?? c, u = 1 - t
  return { x: u * u * u * p.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * c.x, y: u * u * u * p.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * c.y }
}
/* a ring as N points evenly along its length */
function ringPoints(nodes) {
  const dense = []
  for (let i = 0; i < nodes.length; i++) for (let k = 0; k < 16; k++) dense.push(cubic(nodes[i], nodes[(i + 1) % nodes.length], k / 16))
  dense.push(dense[0])
  const cum = [0]
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y))
  const len = cum[cum.length - 1] || 1
  const out = []
  for (let i = 0, j = 1; i < N; i++) {
    const want = (i / N) * len
    while (j < cum.length - 1 && cum[j] < want) j++
    const a = dense[j - 1], b = dense[j], f = (want - cum[j - 1]) / (cum[j] - cum[j - 1] || 1)
    out.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f })
  }
  return out
}
const area = (r) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p.x * q.y - q.x * p.y }, 0) / 2
const centre = (r) => r.reduce((c, p) => ({ x: c.x + p.x / r.length, y: c.y + p.y / r.length }), { x: 0, y: 0 })
/* b turned to a's winding and started where it best follows a around their centres (blendOutlines' rule) */
function align(a, b) {
  if (Math.sign(area(a)) !== Math.sign(area(b))) b = b.slice().reverse()
  const ca = centre(a), cb = centre(b)
  let best = 0, bestD = Infinity
  for (let s = 0; s < N; s += 2) {
    let d = 0
    for (let i = 0; i < N; i += 8) { const p = a[i], q = b[(i + s) % N]; d += Math.hypot(p.x - ca.x - (q.x - cb.x), p.y - ca.y - (q.y - cb.y)) }
    if (d < bestD) { bestD = d; best = s }
  }
  return b.map((_, i) => b[(i + best) % N])
}
/* ring for ring, biggest first; a ring with no partner grows from (or shrinks to) its own centre.
   ponytail: pairing by size only, so two forms with several rings of like size can cross; match by place if one does */
export function morphRings(from, to, t) {
  const A = from.map(ringPoints).sort((p, q) => Math.abs(area(q)) - Math.abs(area(p)))
  const B = to.map(ringPoints).sort((p, q) => Math.abs(area(q)) - Math.abs(area(p)))
  const out = []
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    const a = A[i] ?? B[i].map(() => centre(B[i])), b0 = B[i] ?? A[i].map(() => centre(A[i]))
    const b = align(a, b0)
    out.push(a.map((p, j) => ({ x: p.x + (b[j].x - p.x) * t, y: p.y + (b[j].y - p.y) * t, in: null, out: null })))
  }
  return out
}

/* THE ROW ON THE BODY: what `expandLayer` draws for a layer carrying an enabled Tune row */
export function tuneBody(body, row) {
  const p = row?.params ?? {}
  const t = Math.max(0, Math.min(100, Number(p.amount ?? 100))) / 100
  if (!(t > 0) || !Array.isArray(p.rings) || !p.rings.length) return body
  const w = Math.max(1, body.w ?? 1), h = Math.max(1, body.h ?? 1)
  const to = p.rings.map((r) => r.map((n) => mapNode(n, (q) => ({ x: q.x * w, y: q.y * h }))))
  const rings = t >= 1 ? to : morphRings(outlineRings(body) ?? [], to, t)
  if (!rings.length) return body
  return { ...body, type: 'path', kind: undefined, closed: true, nodes: rings[0], holes: rings.slice(1) }
}
