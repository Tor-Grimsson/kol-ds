// Signal monitor (C7, after the Atlas board signal-08-live-monitor): a fine line grid on its own layer and up to three
// sine waves drawn as a line with a dot at every step, each drifting across at its own speed. Mechanism only: the
// board's numbers are settings (sizes as parts of the frame), the colours the theme's (grid Dim, waves Accent, Ink and
// Warm). Each wave drifts a whole number of turns per loop, so it closes.

const TAU = Math.PI * 2
const cyc = (rate, L) => (Math.round((rate * L) / TAU) * TAU) / L
const BOARD = [
  /* amp (of the frame's height), cycles across the frame, phase, speed, dots, dot size (of the frame's height) */
  { amp: 0.25, cycles: 2.9, phase: 3.01, speed: 0.35, dots: 114, dot: 0.00625 },
  { amp: 0.125, cycles: 3.68, phase: -2.63, speed: -0.27, dots: 114, dot: 0.00625 },
  { amp: 0.414, cycles: 4.02, phase: 0.16, speed: 0.5, dots: 112, dot: 0.0044 },
]
const WAVE_ROWS = BOARD.flatMap((b, n) => {
  const i = n + 1, s = `Wave ${i}`
  return [
    { key: `amp${i}`, label: 'Height', type: 'range', min: 0, max: 0.5, step: 0.005, default: b.amp, section: s },
    { key: `cycles${i}`, label: 'Waves across', type: 'range', min: 0, max: 12, step: 0.01, default: b.cycles, section: s },
    { key: `phase${i}`, label: 'Phase', type: 'range', min: -3.14, max: 3.14, step: 0.01, default: b.phase, section: s },
    { key: `speed${i}`, label: 'Drift', type: 'range', min: -2, max: 2, step: 0.01, default: b.speed, section: s },
    { key: `dots${i}`, label: 'Dots', type: 'range', min: 0, max: 300, step: 1, default: b.dots, section: s },
    { key: `dot${i}`, label: 'Dot size', type: 'range', min: 0, max: 0.03, step: 0.0005, default: b.dot, section: s },
  ]
})

export default {
  id: 'signal-monitor',
  label: 'Signal monitor',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'grid', label: 'Grid', type: 'color', role: 'dim', default: '#333333', section: 'Color' },
    { key: 'c1', label: 'Wave 1', type: 'color', role: 'accent', default: '#f6c453', section: 'Color' },
    { key: 'c2', label: 'Wave 2', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'c3', label: 'Wave 3', type: 'color', role: 'warm', default: '#999999', section: 'Color' },
    { key: 'frame', label: 'Frame', type: 'range', min: 0.2, max: 1, step: 0.01, default: 0.9, section: 'Grid' },
    { key: 'cols', label: 'Columns', type: 'range', min: 0, max: 240, step: 1, default: 118, section: 'Grid' },
    { key: 'rows', label: 'Rows', type: 'range', min: 0, max: 120, step: 1, default: 47, section: 'Grid' },
    { key: 'gridLine', label: 'Grid line', type: 'range', min: 0, max: 4, step: 0.05, default: 0.75, section: 'Grid' },
    { key: 'waves', label: 'Waves', type: 'range', min: 1, max: 3, step: 1, default: 3, section: 'Waves' },
    { key: 'line', label: 'Wave line', type: 'range', min: 0, max: 6, step: 0.25, default: 1, section: 'Waves' },
    { key: 'centre', label: 'Centre', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, section: 'Waves' },
    ...WAVE_ROWS,
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 36, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const fw = w * p.frame, fh = h * p.frame, fx = (w - fw) / 2, fy = (h - fh) / 2
    ctx.save()
    ctx.beginPath(); ctx.rect(fx, fy, fw, fh); ctx.clip()
    const C = Math.round(p.cols), R = Math.round(p.rows)
    if (p.gridLine > 0 && (C || R)) {
      ctx.strokeStyle = p.grid; ctx.lineWidth = p.gridLine
      ctx.beginPath()
      for (let c = 0; c <= C; c++) { const x = fx + (fw * c) / C; ctx.moveTo(x, fy); ctx.lineTo(x, fy + fh) }
      for (let r = 0; r <= R; r++) { const y = fy + (fh * r) / R; ctx.moveTo(fx, y); ctx.lineTo(fx + fw, y) }
      ctx.stroke()
    }
    const cy = fy + fh * p.centre
    /* drawn back to front, as the board layers them: wave 3 under 2 under 1 */
    for (let i = Math.min(3, Math.round(p.waves)); i >= 1; i--) {
      const n = Math.max(2, Math.round(p[`dots${i}`])), col = p[`c${i}`], rad = fh * p[`dot${i}`]
      const k = (p[`cycles${i}`] * TAU) / fw, ph = p[`phase${i}`] + t * cyc(p[`speed${i}`], L)
      const pts = []
      for (let j = 0; j < n; j++) { const x = fx + (fw * j) / (n - 1); pts.push([x, cy + fh * p[`amp${i}`] * Math.sin(k * (x - fx) + ph)]) }
      if (p.line > 0) {
        ctx.strokeStyle = col; ctx.lineWidth = p.line
        ctx.beginPath(); pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke()
      }
      if (rad > 0) {
        ctx.fillStyle = col; ctx.beginPath()
        for (const [x, y] of pts) { ctx.moveTo(x + rad, y); ctx.arc(x, y, rad, 0, TAU) }
        ctx.fill()
      }
    }
    ctx.restore()
  },
}
