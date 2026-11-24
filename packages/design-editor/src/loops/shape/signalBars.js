// Signal bars (C7, after the Atlas board signal-10-live-ledger): columns of blocks on a thin line, each block's top
// riding one travelling sine and its length another, clipped to the frame. Mechanism only: the board's numbers are
// settings, the colours the theme's. Both waves make whole turns per loop (`loopLength` seconds), so it closes.

const TAU = Math.PI * 2
const cyc = (rate, L) => (Math.round((rate * L) / TAU) * TAU) / L

export default {
  id: 'signal-bars',
  label: 'Signal bars',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'columns', label: 'Columns', type: 'range', min: 2, max: 80, step: 1, default: 21, section: 'Columns' },
    { key: 'blocks', label: 'Blocks', type: 'range', min: 1, max: 12, step: 1, default: 4, section: 'Columns' },
    { key: 'spread', label: 'Width', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.32, section: 'Columns' },
    { key: 'height', label: 'Height', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.86, section: 'Columns' },
    { key: 'blockWidth', label: 'Block width', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.49, section: 'Columns' },
    { key: 'line', label: 'Line width', type: 'range', min: 0, max: 0.5, step: 0.005, default: 0.06, section: 'Columns' },
    { key: 'lineAt', label: 'Line at', type: 'range', min: 0, max: 1, step: 0.01, default: 0.48, section: 'Columns' },
    { key: 'length', label: 'Block length', type: 'range', min: 0.01, max: 1, step: 0.005, default: 0.53, section: 'Blocks' },
    { key: 'ampTop', label: 'Top wave', type: 'range', min: 0, max: 0.5, step: 0.005, default: 0.11, section: 'Waves' },
    { key: 'freqTop', label: 'Top wavelength', type: 'range', min: 0, max: 2, step: 0.01, default: 0.45, section: 'Waves' },
    { key: 'rowTop', label: 'Top row shift', type: 'range', min: 0, max: 3, step: 0.05, default: 1.2, section: 'Waves' },
    { key: 'speedTop', label: 'Top speed', type: 'range', min: -3, max: 3, step: 0.01, default: 0.55, section: 'Waves' },
    { key: 'ampLen', label: 'Length wave', type: 'range', min: 0, max: 0.5, step: 0.005, default: 0.16, section: 'Waves' },
    { key: 'freqLen', label: 'Length wavelength', type: 'range', min: 0, max: 2, step: 0.01, default: 0.24, section: 'Waves' },
    { key: 'rowLen', label: 'Length row shift', type: 'range', min: 0, max: 3, step: 0.05, default: 1, section: 'Waves' },
    { key: 'speedLen', label: 'Length speed', type: 'range', min: -3, max: 3, step: 0.01, default: 0.32, section: 'Waves' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 22.8, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L
    const pa = t * cyc(p.speedTop, L), pb = t * cyc(p.speedLen, L)
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const N = Math.max(1, Math.round(p.columns)), B = Math.max(1, Math.round(p.blocks))
    const fw = w * p.spread, fh = h * p.height, fx = (w - fw) / 2, y0 = (h - fh) / 2, y1 = y0 + fh
    const pitch = fw / N, bw = pitch * p.blockWidth, lw = pitch * p.line, row = fh / B
    ctx.fillStyle = p.ink
    for (let i = 0; i < N; i++) {
      const x = fx + i * pitch
      if (lw > 0) ctx.fillRect(x + (bw - lw) * p.lineAt, y0, lw, fh)
      for (let k = 0; k < B; k++) {
        /* both waves in rows: a top that swings by ampTop of a row, a length that swings by ampLen of a row */
        const top = y0 + row * (k + p.ampTop * Math.sin(p.freqTop * i + p.rowTop * k + pa))
        const len = row * (p.length + p.ampLen * Math.sin(p.freqLen * i + p.rowLen * k + pb))
        const a = Math.max(y0, top), b = Math.min(y1, top + len)
        if (b - a > 0.5) ctx.fillRect(x, a, bw, b - a)
      }
    }
  },
}
