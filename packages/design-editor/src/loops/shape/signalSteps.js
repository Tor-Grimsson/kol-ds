// Signal steps (C7, after the Atlas board signal-16-plans): rows of block, bar and line, end to end. Each row's
// block retracts toward and extends from its right end on its own beat. Mechanism only: the board's numbers are
// settings, its eight block lengths are the Lengths list (your own data: one number per row, 1 = the full block), the
// colours the theme's. Both beats make whole turns per loop, so it closes.

const TAU = Math.PI * 2
const cyc = (rate, L) => (Math.round((rate * L) / TAU) * TAU) / L
const list = (s) => String(s ?? '').split(/[\s,;]+/).map(Number).filter((v) => Number.isFinite(v))

export default {
  id: 'signal-steps',
  label: 'Signal steps',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'lengths', label: 'Lengths', type: 'text', rows: 2, default: '0.5, 0.68, 1, 1, 0.5, 0.5, 0.5, 0.5', placeholder: '0.5, 1, 0.75', noRandom: true, section: 'Rows' },
    { key: 'rows', label: 'Rows', type: 'range', min: 1, max: 40, step: 1, default: 8, section: 'Rows' },
    { key: 'frame', label: 'Frame', type: 'range', min: 0.2, max: 1, step: 0.01, default: 0.74, section: 'Rows' },
    { key: 'blockEnd', label: 'Block end', type: 'range', min: 0.05, max: 1, step: 0.005, default: 0.528, section: 'Rows' },
    { key: 'barEnd', label: 'Bar end', type: 'range', min: 0.05, max: 1, step: 0.005, default: 0.768, section: 'Rows' },
    { key: 'block', label: 'Block', type: 'range', min: 0, max: 1, step: 0.005, default: 0.508, section: 'Weights' },
    { key: 'bar', label: 'Bar', type: 'range', min: 0, max: 1, step: 0.005, default: 0.268, section: 'Weights' },
    { key: 'thin', label: 'Line', type: 'range', min: 0, max: 1, step: 0.005, default: 0.119, section: 'Weights' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 34, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
    { key: 'depth', label: 'Retract', type: 'range', min: 0, max: 1, step: 0.01, default: 0.22, section: 'Motion' },
    { key: 'beat', label: 'Beat', type: 'range', min: 0, max: 3, step: 0.01, default: 0.9, section: 'Motion' },
    { key: 'rowBeat', label: 'Row beat', type: 'range', min: 0, max: 3, step: 0.01, default: 0.37, section: 'Motion' },
    { key: 'rowShift', label: 'Row shift', type: 'range', min: 0, max: 3, step: 0.01, default: 0.85, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L, a = cyc(p.beat, L), b = cyc(p.rowBeat, L)
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const side = Math.min(w, h) * p.frame, fx = (w - side) / 2, fy = (h - side) / 2
    const R = Math.max(1, Math.round(p.rows)), pitch = side / R
    const lens = list(p.lengths); if (!lens.length) lens.push(1)
    const xb = fx + side * p.blockEnd, xr = fx + side * Math.max(p.blockEnd, p.barEnd), xe = fx + side
    ctx.fillStyle = p.ink
    for (let k = 0; k < R; k++) {
      const yc = fy + pitch * (k + 0.5), band = (wgt) => [yc - (pitch * wgt) / 2, pitch * wgt]
      const full = (xb - fx) * Math.max(0, Math.min(1, lens[k % lens.length]))
      const len = full * (1 - p.depth * (1 - Math.cos(t * a)) * 0.5 * (1 + Math.sin(t * b + k * p.rowShift)))
      let [y, hh] = band(p.block); if (len > 0 && hh > 0) ctx.fillRect(xb - len, y, len, hh);
      [y, hh] = band(p.bar); if (hh > 0) ctx.fillRect(xb, y, xr - xb, hh);
      [y, hh] = band(p.thin); if (hh > 0) ctx.fillRect(xr, y, xe - xr, hh)
    }
  },
}
