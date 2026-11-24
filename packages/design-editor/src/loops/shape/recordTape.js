// Record tape (C7, after the Atlas board web-08-record-card, its Wave and Flags views): a looping tape of runs, each
// run a column of dots about the middle, its tips in the accent, with dashed week dividers and markers on chosen runs,
// sliding sideways. The board's 90 seeded runs and its event list become your data: Values (one number per run, 0 to 1;
// empty rolls them from Seed) and Markers (run numbers). The DOM cards, the ledger text and the date labels are Atlas's
// page, not the mechanism, and stay there. The tape slides a whole number of tapes per loop, so it closes.

const TAU = Math.PI * 2
const on = (v) => v === true || v === 'true'
const list = (s) => String(s ?? '').split(/[\s,;]+/).filter(Boolean).map(Number).filter((v) => Number.isFinite(v))
/* the board's generator: a linear congruential roll, a base and a weekly lift */
function rolled(n, seed, base, spread, lift, every) {
  let s = Math.max(1, Math.round(seed))
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280
  return Array.from({ length: n }, (_, i) => base + spread * r() + (every > 0 && i % every === 0 ? lift * r() : 0))
}
const memo = { key: '', runs: [] }

export default {
  id: 'record-tape',
  label: 'Record tape',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Dots', type: 'color', role: 'dim', default: '#9a9a9a', section: 'Color' },
    { key: 'accent', label: 'Tips and markers', type: 'color', role: 'accent', default: '#f6c453', section: 'Color' },
    { key: 'rule', label: 'Dividers', type: 'color', role: 'fg', default: '#444444', section: 'Color' },
    { key: 'values', label: 'Values', type: 'text', rows: 3, default: '', placeholder: '0.4 0.7 0.55 … one per run, 0 to 1', noRandom: true, section: 'Data' },
    { key: 'markers', label: 'Markers', type: 'text', rows: 1, default: '3 12 19 27 34 41 50 56 66 73 81 87', placeholder: 'run numbers', noRandom: true, section: 'Data' },
    { key: 'runs', label: 'Runs', type: 'range', min: 7, max: 365, step: 1, default: 90, section: 'Data' },
    { key: 'seed', label: 'Seed', type: 'range', min: 1, max: 999, step: 1, default: 7, section: 'Data' },
    { key: 'base', label: 'Base', type: 'range', min: 0, max: 1, step: 0.01, default: 0.25, section: 'Data' },
    { key: 'spread', label: 'Spread', type: 'range', min: 0, max: 1, step: 0.01, default: 0.45, section: 'Data' },
    { key: 'lift', label: 'Weekly lift', type: 'range', min: 0, max: 1, step: 0.01, default: 0.3, section: 'Data' },
    { key: 'week', label: 'Week', type: 'range', min: 0, max: 31, step: 1, default: 7, section: 'Data' },
    { key: 'shown', label: 'Runs shown', type: 'range', min: 5, max: 365, step: 1, default: 90, section: 'Tape' },
    { key: 'step', label: 'Dot step', type: 'range', min: 0.005, max: 0.1, step: 0.001, default: 0.02, section: 'Tape' },
    { key: 'dot', label: 'Dot size', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.36, section: 'Tape' },
    { key: 'tips', label: 'Tips', type: 'range', min: 0, max: 1, step: 0.01, default: 0.3, section: 'Tape' },
    { key: 'dividers', label: 'Dividers', type: 'toggle', default: true, section: 'Tape' },
    { key: 'flags', label: 'Markers', type: 'toggle', default: true, section: 'Tape' },
    { key: 'flagSize', label: 'Marker size', type: 'range', min: 0, max: 0.05, step: 0.001, default: 0.012, section: 'Tape' },
    { key: 'stem', label: 'Stem to', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0.06, section: 'Tape' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 240, step: 0.5, default: 41, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
    { key: 'play', label: 'Runs a second', type: 'range', min: -10, max: 10, step: 0.1, default: 2.2, section: 'Motion' },
    { key: 'breath', label: 'Breath', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0.15, section: 'Motion' },
    { key: 'breathSpeed', label: 'Breath speed', type: 'range', min: 0, max: 6, step: 0.1, default: 3, section: 'Motion' },
    { key: 'breathTravel', label: 'Breath travel', type: 'range', min: 0, max: 2, step: 0.01, default: 0.8, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const own = list(p.values)
    const N = own.length || Math.max(1, Math.round(p.runs))
    const key = own.length ? '' : [N, p.seed, p.base, p.spread, p.lift, p.week].join('|')
    if (!own.length && memo.key !== key) { memo.key = key; memo.runs = rolled(N, p.seed, p.base, p.spread, p.lift, Math.round(p.week)) }
    const RUNS = own.length ? own : memo.runs
    const marks = new Set(list(p.markers).map((v) => ((Math.round(v) % N) + N) % N))
    const wrap = (i) => ((i % N) + N) % N

    /* the clock: the tape slides a whole number of tapes per loop; the breath makes whole turns */
    const L = p.loopLength, t = u * L
    const slide = Math.round((p.play * L) / N) * N, bs = (Math.round((p.breathSpeed * L) / TAU) * TAU) / L
    const d0 = u * slide, span = Math.max(1, p.shown), cw = w / span
    const mid = h / 2, stepPx = h * p.step, r = Math.min(cw, stepPx) * p.dot

    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const i0 = Math.floor(d0) - 1, i1 = Math.ceil(d0 + span) + 1
    const week = Math.round(p.week)
    if (on(p.dividers) && week > 0) {
      ctx.fillStyle = p.rule
      for (let i = i0; i <= i1; i++) if (wrap(i) % week === 0) { const x = (i - d0) * cw; for (let y = 0; y < h; y += stepPx * 1.2) ctx.fillRect(x - 1, y, 2, stepPx * 0.6) }
    }
    const tops = []
    for (let i = i0; i <= i1; i++) {
      const x = (i + 0.5 - d0) * cw
      if (x < -r || x > w + r) continue
      const k = wrap(i), mod = 1 - p.breath + p.breath * Math.sin(t * bs + k * p.breathTravel)
      const n = Math.floor((Math.max(0, RUNS[k]) * mid * mod) / stepPx)
      if (on(p.flags) && marks.has(k)) tops.push([x, mid - n * stepPx])
      for (let j = -n; j <= n; j++) {
        ctx.fillStyle = Math.abs(j) > n * (1 - p.tips) ? p.accent : p.ink
        ctx.beginPath(); ctx.arc(x, mid + j * stepPx, r, 0, TAU); ctx.fill()
      }
    }
    const fs = h * p.flagSize
    for (const [x, top] of tops) {
      ctx.fillStyle = p.ink
      for (let y = h * p.stem; y < top - fs; y += stepPx * 0.8) ctx.fillRect(x - 1, y, 2, stepPx * 0.4)
      ctx.fillStyle = p.accent; ctx.fillRect(x - fs / 2, top - fs / 2, fs, fs)
    }
  },
}
