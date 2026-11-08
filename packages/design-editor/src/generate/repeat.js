/* REPEAT — the copy maths (plan 53 W3). Pure: one affine matrix per copy, [a, b, c, d, e, f] in document px
 * (x' = a·x + c·y + e, y' = b·x + d·y + f — SVG / CSS matrix order). The canvas wraps each copy in it, the
 * export writes it as <g transform>, Expand bakes it into the clone, the match script maps marks with it.
 *
 *   RADIAL  count copies round a pivot (Radius from the source's centre, toward Pivot angle); each copy also
 *           turns by Rotate per step and scales by Scale per step about its own centre.
 *   GRID    cols × rows; Gap between boxes; Row / Col shift offset alternate rows / columns; the same per-step
 *           turn and scale.
 *   MIRROR  one reflected copy across an axis (Axis angle) through the source's centre + Axis offset; Point
 *           mirror turns it 180° instead.
 * The source itself is copy 0 and is not in the list. */

const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
]
const T = (x, y) => [1, 0, 0, 1, x, y]
const R = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, s, -s, c, 0, 0] }
const S = (sx, sy = sx) => [sx, 0, 0, sy, 0, 0]
const about = (cx, cy, m) => mul(T(cx, cy), mul(m, T(-cx, -cy)))
export const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]

export const REPEAT_DEFAULTS = {
  repMode: 'radial', repCount: 8, repRadius: 200, repPivotAngle: 90, repSpan: 360, repRotate: 0, repScale: 1,
  repCols: 3, repRows: 3, repGapX: 20, repGapY: 20, repRowShift: 0, repColShift: 0,
  repAxisAngle: 90, repAxisX: 0, repAxisY: 0, repPoint: false, repReverse: false,
}

/* box = the source's { x, y, w, h } in document px */
export function copyMatrices(p, box) {
  const q = { ...REPEAT_DEFAULTS, ...p }
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2
  const own = (k) => about(cx, cy, mul(R((q.repRotate ?? 0) * k), S((q.repScale ?? 1) ** k)))
  const out = []
  if (q.repMode === 'mirror') {
    const ax = cx + (q.repAxisX ?? 0), ay = cy + (q.repAxisY ?? 0)
    const t = q.repAxisAngle ?? 90
    out.push(q.repPoint ? about(ax, ay, R(180)) : about(ax, ay, mul(R(t), mul(S(1, -1), R(-t)))))
  } else if (q.repMode === 'grid') {
    const cols = Math.max(1, Math.round(q.repCols)), rows = Math.max(1, Math.round(q.repRows))
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (!i && !j) continue
      const k = j * cols + i
      const dx = i * (box.w + q.repGapX) + j * q.repRowShift, dy = j * (box.h + q.repGapY) + i * q.repColShift
      out.push(mul(T(dx, dy), own(k)))
    }
  } else {
    const n = Math.max(1, Math.round(q.repCount))
    const a = ((q.repPivotAngle ?? 90) * Math.PI) / 180
    const px = cx + Math.cos(a) * q.repRadius, py = cy + Math.sin(a) * q.repRadius
    const full = (q.repSpan ?? 360) >= 360
    const step = full ? 360 / n : (q.repSpan ?? 360) / Math.max(1, n - 1)
    for (let k = 1; k < n; k++) out.push(mul(about(px, py, R(step * k)), own(k)))
  }
  return q.repReverse ? out.reverse() : out
}

/* a matrix's rotation (deg), uniform scale and whether it mirrors — for Expand's baked clones */
export function decompose(m) {
  const det = m[0] * m[3] - m[1] * m[2]
  const s = Math.sqrt(Math.abs(det))
  return { rotation: (Math.atan2(m[1], m[0]) * 180) / Math.PI, scale: s, mirror: det < 0 }
}

/* the Repeat rows — the Repeat window and a generate layer's own Repeat section share them */
const is = (m) => (l) => (l.repMode ?? 'radial') === m
const turn = { min: -180, max: 180, step: 1, format: (v) => `${v}°` }
export const REPEAT_SCHEMA = [
  { key: 'repCount', label: 'Count', type: 'range', min: 2, max: 64, step: 1, default: 8, when: is('radial') },
  { key: 'repRadius', label: 'Radius', type: 'range', min: 0, max: 2000, step: 1, default: 200, format: (v) => `${v}px`, when: is('radial') },
  { key: 'repPivotAngle', label: 'Pivot angle', type: 'range', ...turn, default: 90, when: is('radial') },
  { key: 'repSpan', label: 'Span', type: 'range', min: 1, max: 360, step: 1, default: 360, format: (v) => `${v}°`, when: is('radial') },
  { key: 'repCols', label: 'Columns', type: 'range', min: 1, max: 40, step: 1, default: 3, when: is('grid') },
  { key: 'repRows', label: 'Rows', type: 'range', min: 1, max: 40, step: 1, default: 3, when: is('grid') },
  { key: 'repGapX', label: 'Gap X', type: 'range', min: -1000, max: 1000, step: 1, default: 20, format: (v) => `${v}px`, when: is('grid') },
  { key: 'repGapY', label: 'Gap Y', type: 'range', min: -1000, max: 1000, step: 1, default: 20, format: (v) => `${v}px`, when: is('grid') },
  { key: 'repRowShift', label: 'Row shift', type: 'range', min: -1000, max: 1000, step: 1, default: 0, format: (v) => `${v}px`, when: is('grid') },
  { key: 'repColShift', label: 'Column shift', type: 'range', min: -1000, max: 1000, step: 1, default: 0, format: (v) => `${v}px`, when: is('grid') },
  { key: 'repRotate', label: 'Rotate per step', type: 'range', ...turn, default: 0, when: (l) => !is('mirror')(l) },
  { key: 'repScale', label: 'Scale per step', type: 'range', min: 0.5, max: 1.5, step: 0.005, default: 1, format: (v) => `${Math.round(v * 100)}%`, when: (l) => !is('mirror')(l) },
  { key: 'repAxisAngle', label: 'Axis angle', type: 'range', ...turn, default: 90, when: is('mirror') },
  { key: 'repAxisX', label: 'Axis offset X', type: 'range', min: -2000, max: 2000, step: 1, default: 0, format: (v) => `${v}px`, when: is('mirror') },
  { key: 'repAxisY', label: 'Axis offset Y', type: 'range', min: -2000, max: 2000, step: 1, default: 0, format: (v) => `${v}px`, when: is('mirror') },
  { key: 'repPoint', label: 'Point mirror', type: 'toggle', default: false, when: is('mirror') },
  { key: 'repReverse', label: 'Reverse overlap', type: 'toggle', default: false },
]
