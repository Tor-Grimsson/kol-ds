/* GENERATE — the mark list and its three readers (plan 52 § 1.1, § 1.4).
 *
 * A style draws into a Marks list: polygons (closed point rings) and circles. ONE list feeds the live
 * render and the export (`marksD` → one `<path>`, nonzero, so overlapping marks union — dots/warp's
 * merged dots), and Expand (`marksToNodes` → editable path rings). Pure, no DOM. */

const r2 = (n) => Math.round(n * 100) / 100

export function createMarks() {
  return { polys: [], circles: [], compounds: [] }
}

/* signed area — positive / negative tells the winding */
const area = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]); return a / 2 }
/* a shape WITH HOLES (a glyph's counters): the largest ring is the outline, every other ring a hole.
   Windings are set opposite, so the one nonzero path still punches the holes. */
export function compound(m, rings) {
  const rs = rings.filter((r) => r.length >= 3)
  if (!rs.length) return
  rs.sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)))
  const out = rs.map((r, i) => ((area(r) > 0) === (i === 0) ? r : [...r].reverse()))
  m.compounds.push(out)
}

/* an axis-aligned rect, as a polygon (so Expand gets 4 corner nodes) */
export function rect(m, x, y, w, h) {
  if (w <= 0 || h <= 0) return
  m.polys.push([[x, y], [x + w, y], [x + w, y + h], [x, y + h]])
}
/* a rect rotated by `a` radians around its centre */
export function rotRect(m, cx, cy, w, h, a) {
  if (w <= 0 || h <= 0) return
  const c = Math.cos(a), s = Math.sin(a), hw = w / 2, hh = h / 2
  m.polys.push([[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]))
}
/* a circle, or an ellipse when `ry` is given (stored [cx, cy, rx, ry?]) */
export function circle(m, cx, cy, r, ry) {
  if (r > 0.05) m.circles.push(ry != null && ry !== r ? [cx, cy, r, ry] : [cx, cy, r])
}
export function poly(m, pts) {
  if (pts.length >= 3) m.polys.push(pts)
}

/* clip a polygon to an axis-aligned box (Sutherland–Hodgman — the box is convex, so one pass per edge) */
export function clipToBox(pts, box) {
  const edges = [
    (q) => q[0] >= box.x, (q) => q[0] <= box.x + box.w, (q) => q[1] >= box.y, (q) => q[1] <= box.y + box.h,
  ]
  const cut = [
    (a, b) => { const t = (box.x - a[0]) / (b[0] - a[0]); return [box.x, a[1] + t * (b[1] - a[1])] },
    (a, b) => { const t = (box.x + box.w - a[0]) / (b[0] - a[0]); return [box.x + box.w, a[1] + t * (b[1] - a[1])] },
    (a, b) => { const t = (box.y - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.y] },
    (a, b) => { const t = (box.y + box.h - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.y + box.h] },
  ]
  let out = pts
  for (let e = 0; e < 4 && out.length; e++) {
    const inp = out; out = []
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i]
      const ia = edges[e](a), ib = edges[e](b)
      if (ib) { if (!ia) out.push(cut[e](a, b)); out.push(b) } else if (ia) out.push(cut[e](a, b))
    }
  }
  return out
}

export function marksCount(m) {
  return m.polys.length + m.circles.length + (m.compounds?.length ?? 0)
}

/* the whole list as one path `d` — rings and circles (two arcs each) */
export function marksD(m) {
  let d = ''
  for (const p of m.polys) {
    d += `M${r2(p[0][0])} ${r2(p[0][1])}`
    for (let i = 1; i < p.length; i++) d += `L${r2(p[i][0])} ${r2(p[i][1])}`
    d += 'Z'
  }
  for (const c of m.compounds ?? []) {
    for (const p of c) {
      d += `M${r2(p[0][0])} ${r2(p[0][1])}`
      for (let i = 1; i < p.length; i++) d += `L${r2(p[i][0])} ${r2(p[i][1])}`
      d += 'Z'
    }
  }
  for (const [cx, cy, r, ry = r] of m.circles) {
    const rr = r2(r), rv = r2(ry)
    d += `M${r2(cx - r)} ${r2(cy)}a${rr} ${rv} 0 1 0 ${r2(2 * r)} 0a${rr} ${rv} 0 1 0 ${r2(-2 * r)} 0Z`
  }
  return d
}

/* a standalone SVG document — the match script and the export both use it */
export function marksSvg(m, w, h, { color = '#fff', bg = '#000' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`
    + (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '')
    + `<path fill="${color}" d="${marksD(m)}"/></svg>`
}

/* Expand: each mark → a node ring in the editor's path format ({ x, y, in, out }; null handles = corner).
   A circle is the standard 4-cubic approximation (k = 0.5523). */
const K = 0.5523
export function circleNodes(cx, cy, r, ry = r) {
  const k = r * K, kv = ry * K
  return [
    { x: cx + r, y: cy, in: { x: cx + r, y: cy - kv }, out: { x: cx + r, y: cy + kv } },
    { x: cx, y: cy + ry, in: { x: cx + k, y: cy + ry }, out: { x: cx - k, y: cy + ry } },
    { x: cx - r, y: cy, in: { x: cx - r, y: cy + kv }, out: { x: cx - r, y: cy - kv } },
    { x: cx, y: cy - ry, in: { x: cx - k, y: cy - ry }, out: { x: cx + k, y: cy - ry } },
  ]
}
const corner = (p) => p.map(([x, y]) => ({ x, y, in: null, out: null }))
/* Expand's shapes: { nodes, holes } — a compound keeps its counters as the path layer's `holes` */
export function marksToShapes(m) {
  return [
    ...m.polys.map((p) => ({ nodes: corner(p), holes: null })),
    ...(m.compounds ?? []).map(([outer, ...holes]) => ({ nodes: corner(outer), holes: holes.length ? holes.map(corner) : null })),
    ...m.circles.map(([cx, cy, r, ry]) => ({ nodes: circleNodes(cx, cy, r, ry), holes: null })),
  ]
}
