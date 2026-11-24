// Signal spikes (C7, after the Atlas board signal-06-live-backup): stepped spike columns that breathe like level
// meters above a horizon, and a mirrored copy below it that follows a moment behind. The mechanism only: every number
// the board fixed is a setting, the colours are the theme's (Ground above, Ink below and in the spikes, Accent on the
// horizon). Each motion makes a whole number of its cycles per loop (`loopLength` seconds of board time), so it closes.

const TAU = Math.PI * 2
const on = (v) => v === true || v === 'true'
/* a rate snapped so it turns a whole number of times in L seconds */
const cyc = (rate, L) => (Math.round((rate * L) / TAU) * TAU) / L

export default {
  id: 'signal-spikes',
  label: 'Signal spikes',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'accent', label: 'Horizon', type: 'color', role: 'accent', default: '#f6c453', section: 'Color' },
    { key: 'columns', label: 'Columns', type: 'range', min: 3, max: 99, step: 1, default: 29, section: 'Columns' },
    { key: 'spread', label: 'Width', type: 'range', min: 0.2, max: 1, step: 0.01, default: 0.6, section: 'Columns' },
    { key: 'peak', label: 'Peak height', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.92, section: 'Columns' },
    { key: 'edge', label: 'Edge height', type: 'range', min: 0, max: 1, step: 0.01, default: 0.055, section: 'Columns' },
    { key: 'horizon', label: 'Horizon', type: 'range', min: 0.1, max: 0.9, step: 0.01, default: 0.5, section: 'Columns' },
    { key: 'line', label: 'Horizon line', type: 'range', min: 0, max: 12, step: 0.5, default: 2, section: 'Columns' },
    { key: 'steps', label: 'Steps', type: 'range', min: 1, max: 12, step: 1, default: 6, section: 'Spike' },
    { key: 'width', label: 'Base width', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.94, section: 'Spike' },
    { key: 'taper', label: 'Taper', type: 'range', min: 0.2, max: 1, step: 0.01, default: 0.6, section: 'Spike' },
    { key: 'curve', label: 'Step curve', type: 'range', min: 0.3, max: 3, step: 0.05, default: 1.3, section: 'Spike' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 25.1, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
    { key: 'rest', label: 'Rest level', type: 'range', min: 0, max: 1, step: 0.01, default: 0.62, section: 'Motion' },
    { key: 'speed', label: 'Meter speed', type: 'range', min: 0, max: 6, step: 0.05, default: 1.5, section: 'Motion' },
    { key: 'travel', label: 'Meter travel', type: 'range', min: 0, max: 2, step: 0.01, default: 0.42, section: 'Motion' },
    { key: 'swing', label: 'Swing', type: 'range', min: 0, max: 1, step: 0.01, default: 0.2, section: 'Motion' },
    { key: 'swingSpeed', label: 'Swing speed', type: 'range', min: 0, max: 4, step: 0.05, default: 0.55, section: 'Motion' },
    { key: 'swingTravel', label: 'Swing travel', type: 'range', min: 0, max: 2, step: 0.01, default: 0.3, section: 'Motion' },
    { key: 'mirror', label: 'Mirror', type: 'toggle', default: true, section: 'Mirror' },
    { key: 'delay', label: 'Mirror delay', type: 'range', min: 0, max: 3, step: 0.05, default: 0.5, format: (v) => `${v} s`, section: 'Mirror' },
    { key: 'flip', label: 'Hang', type: 'toggle', default: false, section: 'Mirror' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L
    const s1 = cyc(p.speed, L), s2 = cyc(p.swingSpeed, L)
    const lvl = (i, tt) => p.rest + (1 - p.rest) * (0.5 + 0.5 * Math.cos(tt * s1 - i * p.travel)) * (1 - p.swing + p.swing * Math.cos(tt * s2 + i * p.swingTravel))
    const flip = on(p.flip)
    const top = flip ? p.ink : p.bg, bottom = flip ? p.bg : p.ink
    const y0 = h * p.horizon
    ctx.fillStyle = top; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = bottom; ctx.fillRect(0, y0, w, h - y0)

    const N = Math.max(1, Math.round(p.columns)), S = Math.max(1, Math.round(p.steps))
    const pitch = (w * p.spread) / N, x0 = (w - pitch * N) / 2 + pitch / 2
    const half = Math.min(y0, h - y0), mid = (N - 1) / 2
    const fr = (k) => 1 - Math.pow(1 - k / S, p.curve)
    const spike = (cx, H, dir, col) => {
      ctx.fillStyle = col
      for (let k = 0; k < S; k++) {
        const hw = (pitch / 2) * p.width * Math.pow(p.taper, k)
        const a = y0 + dir * H * fr(k), b = y0 + dir * H * fr(k + 1)
        ctx.fillRect(cx - hw, Math.min(a, b), hw * 2, Math.abs(b - a))
      }
    }
    for (let i = 0; i < N; i++) {
      const d = mid ? Math.abs(i - mid) / mid : 0
      const base = half * p.peak * (p.edge + (1 - p.edge) * (1 - d))
      const cx = x0 + i * pitch
      spike(cx, base * lvl(i, t), -1, bottom)
      if (on(p.mirror)) spike(cx, base * lvl(i, t - p.delay), 1, top)
    }
    if (p.line > 0) { ctx.fillStyle = p.accent; ctx.fillRect(0, y0 - p.line / 2, w, p.line) }
  },
}
