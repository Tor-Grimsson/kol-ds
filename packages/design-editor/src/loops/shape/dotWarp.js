// Dot warp (C7, after the Atlas board signal-11-live-bridge): a square lattice of dots whose sizes come from your
// shape or image (bright = big) and whose sideways shifts follow its slope, so the picture shows as a warp of the
// dither. The sizes breathe and the shifts sway. The board packed one picture's 3721 dots into its code; here the
// source is yours (lib/source.js). Its numbers are settings, its colours the theme's; every motion makes whole turns
// per loop, so it closes.
import { sourceParams, sourceField } from '../lib/source.js'

const TAU = Math.PI * 2
const cyc = (rate, L) => (Math.round((rate * L) / TAU) * TAU) / L

export default {
  id: 'dot-warp',
  label: 'Dot warp',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    ...sourceParams('Source', 'circle'),
    { key: 'cols', label: 'Columns', type: 'range', min: 4, max: 160, step: 1, default: 61, section: 'Lattice' },
    { key: 'rows', label: 'Rows', type: 'range', min: 4, max: 160, step: 1, default: 61, section: 'Lattice' },
    { key: 'frame', label: 'Frame', type: 'range', min: 0.2, max: 1.2, step: 0.01, default: 0.82, section: 'Lattice' },
    { key: 'dotMin', label: 'Smallest dot', type: 'range', min: 0, max: 1, step: 0.01, default: 0.08, section: 'Lattice' },
    { key: 'dotMax', label: 'Largest dot', type: 'range', min: 0, max: 1.5, step: 0.01, default: 0.58, section: 'Lattice' },
    { key: 'shift', label: 'Warp', type: 'range', min: 0, max: 3, step: 0.05, default: 0.6, section: 'Lattice' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 26, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
    { key: 'breath', label: 'Breath', type: 'range', min: 0, max: 1, step: 0.01, default: 0.16, section: 'Motion' },
    { key: 'breathSpeed', label: 'Breath speed', type: 'range', min: 0, max: 3, step: 0.05, default: 0.7, section: 'Motion' },
    { key: 'breathX', label: 'Breath across', type: 'range', min: -1, max: 1, step: 0.01, default: 0.11, section: 'Motion' },
    { key: 'breathY', label: 'Breath down', type: 'range', min: -1, max: 1, step: 0.01, default: -0.08, section: 'Motion' },
    { key: 'pulse', label: 'Pulse speed', type: 'range', min: 0, max: 3, step: 0.05, default: 0.5, section: 'Motion' },
    { key: 'sway', label: 'Sway speed', type: 'range', min: 0, max: 3, step: 0.05, default: 0.6, section: 'Motion' },
    { key: 'swayY', label: 'Sway down', type: 'range', min: -1, max: 1, step: 0.01, default: 0.05, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L
    const bs = cyc(p.breathSpeed, L), ps = cyc(p.pulse, L), ss = cyc(p.sway, L)
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const F = sourceField(p)
    if (!F) return
    const C = Math.max(2, Math.round(p.cols)), R = Math.max(2, Math.round(p.rows))
    const side = Math.min(w, h) * p.frame, pitch = side / Math.max(C, R)
    const x0 = (w - pitch * (C - 1)) / 2, y0 = (h - pitch * (R - 1)) / 2
    const e = 1 / Math.max(C, R), env = Math.sin(t * ps)
    ctx.fillStyle = p.ink
    ctx.beginPath()
    for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
      const gx = (i + 0.5 + (Math.max(C, R) - C) / 2) / Math.max(C, R), gy = (j + 0.5 + (Math.max(C, R) - R) / 2) / Math.max(C, R)
      const v = F(gx, gy), slope = Math.max(-1, Math.min(1, ((F(gx + e, gy) - F(gx - e, gy)) / (2 * e)) * 0.1))
      const rad = pitch * (p.dotMin + (p.dotMax - p.dotMin) * v) * (1 + p.breath * Math.sin(t * bs + i * p.breathX + j * p.breathY) * env)
      if (rad <= 0.05) continue
      const x = x0 + i * pitch + pitch * p.shift * slope * Math.cos(t * ss + j * p.swayY), y = y0 + j * pitch
      ctx.moveTo(x + rad, y); ctx.arc(x, y, rad, 0, TAU)
    }
    ctx.fill()
  },
}
