// Signal ring (C7, after the Atlas board signal-09-live-clock): spokes round a centre, each cut where its ray crosses
// three off-centre circles that orbit at their own speeds: a needle to the first, a bar to the second, a block to the
// rim. As the circles move the bands clip into each other. Mechanism only: the board's numbers are settings (radii and
// widths as parts of the rim), the colours the theme's. Each orbit makes whole turns per loop and the spin moves a
// whole number of spokes, so the loop closes.

const TAU = Math.PI * 2
const cyc = (rate, L, period = TAU) => (Math.round((rate * L) / period) * period) / L

export default {
  id: 'signal-ring',
  label: 'Signal ring',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'spokes', label: 'Spokes', type: 'range', min: 6, max: 360, step: 1, default: 90, section: 'Ring' },
    { key: 'size', label: 'Size', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.87, section: 'Ring' },
    { key: 'rimOffset', label: 'Rim offset', type: 'range', min: 0, max: 0.3, step: 0.005, default: 0.017, section: 'Ring' },
    { key: 'r1', label: 'Needle from', type: 'range', min: 0, max: 1, step: 0.005, default: 0.48, section: 'Circles' },
    { key: 'r2', label: 'Bar from', type: 'range', min: 0, max: 1, step: 0.005, default: 0.677, section: 'Circles' },
    { key: 'r3', label: 'Block from', type: 'range', min: 0, max: 1, step: 0.005, default: 0.834, section: 'Circles' },
    { key: 'off1', label: 'Needle offset', type: 'range', min: 0, max: 0.4, step: 0.005, default: 0.03, section: 'Circles' },
    { key: 'off2', label: 'Bar offset', type: 'range', min: 0, max: 0.4, step: 0.005, default: 0.123, section: 'Circles' },
    { key: 'off3', label: 'Block offset', type: 'range', min: 0, max: 0.4, step: 0.005, default: 0.14, section: 'Circles' },
    { key: 'w1', label: 'Needle width', type: 'range', min: 0, max: 0.05, step: 0.0005, default: 0.002, section: 'Widths' },
    { key: 'w2', label: 'Bar width', type: 'range', min: 0, max: 0.05, step: 0.0005, default: 0.006, section: 'Widths' },
    { key: 'w3', label: 'Block width', type: 'range', min: 0, max: 0.08, step: 0.0005, default: 0.0145, section: 'Widths' },
    { key: 'needleTip', label: 'Needle tip', type: 'range', min: 0, max: 1, step: 0.05, default: 0.4, section: 'Widths' },
    { key: 'flare', label: 'Flare', type: 'range', min: 0, max: 1, step: 0.01, default: 0.15, section: 'Widths' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 240, step: 0.5, default: 60, format: (v) => `${v} s`, noRandom: true, section: 'Motion' },
    { key: 's1', label: 'Needle orbit', type: 'range', min: -1, max: 1, step: 0.01, default: 0.21, section: 'Motion' },
    { key: 's2', label: 'Bar orbit', type: 'range', min: -1, max: 1, step: 0.01, default: -0.16, section: 'Motion' },
    { key: 's3', label: 'Block orbit', type: 'range', min: -1, max: 1, step: 0.01, default: 0.12, section: 'Motion' },
    { key: 'spin', label: 'Spin', type: 'range', min: -0.5, max: 0.5, step: 0.005, default: 0.03, section: 'Motion' },
  ],
  draw(ctx, u, w, h, p) {
    const L = p.loopLength, t = u * L
    const N = Math.max(3, Math.round(p.spokes))
    const R = (Math.min(w, h) / 2) * p.size, cx = w / 2, cy = h / 2
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const circ = [
      { rad: p.r1 * R, off: p.off1 * R, ang: 0.35 + t * cyc(p.s1, L) },
      { rad: p.r2 * R, off: p.off2 * R, ang: 3.4 + t * cyc(p.s2, L) },
      { rad: p.r3 * R, off: p.off3 * R, ang: 2.9 + t * cyc(p.s3, L) },
      { rad: R, off: p.rimOffset * R, ang: 1 },
    ]
    /* how far along the ray (ux, uy) it leaves circle c */
    const hit = (ux, uy, c) => {
      const ox = c.off * Math.cos(c.ang), oy = c.off * Math.sin(c.ang), d = ux * ox + uy * oy
      return d + Math.sqrt(Math.max(0, d * d - (ox * ox + oy * oy) + c.rad * c.rad))
    }
    const half = [p.w1 * R, p.w2 * R, p.w3 * R], flare = [0, 0.8 * p.flare, 1.2 * p.flare]
    const spin = t * cyc(p.spin, L, TAU / N)
    ctx.fillStyle = p.ink
    ctx.beginPath()
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + spin, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
      const s1 = hit(ux, uy, circ[0]), s2 = Math.max(s1, hit(ux, uy, circ[1])), s3 = Math.max(s2, hit(ux, uy, circ[2])), s4 = Math.max(s3, hit(ux, uy, circ[3]))
      const seg = [[s1, s2], [s2, s3], [s3, s4]]
      for (let k = 0; k < 3; k++) {
        const [sa, sb] = seg[k]
        if (sb - sa < 1) continue
        const wa = k === 0 ? half[0] * p.needleTip : half[k]
        const wb = k === 0 ? half[0] : half[k] * (1 + flare[k]) * (0.8 + (0.2 * sb) / R)
        ctx.moveTo(cx + ux * sa - nx * wa, cy + uy * sa - ny * wa)
        ctx.lineTo(cx + ux * sb - nx * wb, cy + uy * sb - ny * wb)
        ctx.lineTo(cx + ux * sb + nx * wb, cy + uy * sb + ny * wb)
        ctx.lineTo(cx + ux * sa + nx * wa, cy + uy * sa + ny * wa)
        ctx.closePath()
      }
    }
    ctx.fill()
  },
}
