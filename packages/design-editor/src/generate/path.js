/* GENERATE — SVG path data → point rings (plan 52 § 2.4, W4). Pure.
 * Flattens M L H V C S Q T A Z (absolute and relative) into closed rings of [x, y], curves sampled by
 * `seg` points each. Used for glyph outlines (Paratype, a letter) as marks and as masks. */

function tokenize(d) {
  const out = []
  const re = /([MLHVCSQTAZmlhvcsqtaz])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g
  let m
  while ((m = re.exec(d))) out.push(m[1] ?? Number(m[2]))
  return out
}

/* endpoint arc → centre form, sampled (SVG spec F.6.5) */
function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2, seg) {
  if (!rx || !ry) return [[x2, y2]]
  const c = Math.cos(phi), s = Math.sin(phi)
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  const xp = c * dx + s * dy, yp = -s * dx + c * dy
  rx = Math.abs(rx); ry = Math.abs(ry)
  const lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry)
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
  const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp
  const k = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / (rx * rx * yp * yp + ry * ry * xp * xp)))
  const cxp = (k * rx * yp) / ry, cyp = (-k * ry * xp) / rx
  const cx = c * cxp - s * cyp + (x1 + x2) / 2, cy = s * cxp + c * cyp + (y1 + y2) / 2
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
  let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
  if (!fs && dt > 0) dt -= 2 * Math.PI
  if (fs && dt < 0) dt += 2 * Math.PI
  const pts = []
  for (let i = 1; i <= seg; i++) {
    const t = t1 + (dt * i) / seg
    pts.push([cx + rx * Math.cos(t) * c - ry * Math.sin(t) * s, cy + rx * Math.cos(t) * s + ry * Math.sin(t) * c])
  }
  return pts
}

export function flattenD(d, seg = 8) {
  const t = tokenize(d)
  const rings = []
  let ring = null, x = 0, y = 0, sx = 0, sy = 0, cmd = 'M', i = 0
  let lc = null /* last control point, for S / T */
  const close = () => { if (ring && ring.length >= 3) rings.push(ring); ring = null }
  const n = () => t[i++]
  while (i < t.length) {
    if (typeof t[i] === 'string') cmd = t[i++]
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') { close(); x = sx; y = sy; lc = null; continue }
    if (C === 'M') {
      close()
      x = ox + n(); y = oy + n(); sx = x; sy = y; ring = [[x, y]]
      cmd = rel ? 'l' : 'L'; lc = null
      continue
    }
    if (!ring) ring = [[x, y]]
    if (C === 'L') { x = ox + n(); y = oy + n(); ring.push([x, y]); lc = null }
    else if (C === 'H') { x = ox + n(); ring.push([x, y]); lc = null }
    else if (C === 'V') { y = oy + n(); ring.push([x, y]); lc = null }
    else if (C === 'C' || C === 'S') {
      let x1, y1
      if (C === 'C') { x1 = ox + n(); y1 = oy + n() } else { x1 = lc ? 2 * x - lc[0] : x; y1 = lc ? 2 * y - lc[1] : y }
      const x2 = ox + n(), y2 = oy + n(), ex = ox + n(), ey = oy + n()
      for (let k = 1; k <= seg; k++) {
        const s = k / seg, u = 1 - s
        ring.push([u * u * u * x + 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s * ex, u * u * u * y + 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s * ey])
      }
      lc = [x2, y2]; x = ex; y = ey
    } else if (C === 'Q' || C === 'T') {
      let x1, y1
      if (C === 'Q') { x1 = ox + n(); y1 = oy + n() } else { x1 = lc ? 2 * x - lc[0] : x; y1 = lc ? 2 * y - lc[1] : y }
      const ex = ox + n(), ey = oy + n()
      for (let k = 1; k <= seg; k++) {
        const s = k / seg, u = 1 - s
        ring.push([u * u * x + 2 * u * s * x1 + s * s * ex, u * u * y + 2 * u * s * y1 + s * s * ey])
      }
      lc = [x1, y1]; x = ex; y = ey
    } else if (C === 'A') {
      const rx = n(), ry = n(), rot = (n() * Math.PI) / 180, fa = n(), fs = n(), ex = ox + n(), ey = oy + n()
      ring.push(...arcPoints(x, y, rx, ry, rot, fa, fs, ex, ey, seg * 2))
      x = ex; y = ey; lc = null
    } else { i++ }
  }
  close()
  return rings
}

export function ringArea(r) {
  let a = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1])
  return a / 2
}

export function ringsBounds(rings) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of rings) for (const [x, y] of r) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}
