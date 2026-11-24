// Cube lattice — the Atlas Cube Motion pattern (plan-2026-11-18-kolbox-system W29.3): a hex grid of cubes drawn as
// lines, with a train of waves in which a dot in each cell grows into a nested cube (white-05-tuned), circles on every
// intersection that swell in a diagonal wave (white-06-nodes), and the navy boards' running dashes and band of lit faces
// (blue-01-pulse, blue-01-sweep). One mechanism; the four boards are its presets. The board's mechanism only, none of
// Atlas's colours: Ink and Ground are the theme's.
//
// The boards ran an open clock. Here each moving part makes a WHOLE number of its cycles per loop (waves, scroll by two
// rows, breaths, node pulses, dash steps, sweeps), snapped from the board's speeds over `loopLength` seconds of board
// time, so the last frame meets the first. The presets' lengths are the ones at which the board's own speeds close.
// Drawn in the board's 1440 px wide units, scaled to the layer's width; rows fill whatever height the layer has.

const WIDE = 1440
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
const easeOut = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3))
const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
const on = (v) => v === true || v === 'true'

export default {
  id: 'cube-lattice',
  label: 'Cube lattice',
  group: 'shape',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#ffffff', section: 'Color' },
    { key: 'ink', label: 'Ink', type: 'color', role: 'fg', default: '#000000', section: 'Color' },
    { key: 'speed', label: 'Speed', type: 'range', min: 0, max: 2, step: 0.05, default: 0.85, section: 'Motion' },
    { key: 'direction', label: 'Direction', type: 'select', default: 'down', options: [{ value: 'down', label: 'Down' }, { value: 'up', label: 'Up' }], section: 'Motion' },
    { key: 'scroll', label: 'Scroll', type: 'range', min: -1.5, max: 1.5, step: 0.05, default: -0.3, section: 'Motion' },
    { key: 'loopLength', label: 'Loop length', type: 'range', min: 2, max: 120, step: 0.5, default: 1200 / 17, format: (v) => `${Math.round(v * 10) / 10} s`, noRandom: true, section: 'Motion' },
    { key: 'start', label: 'Start', type: 'range', min: 0, max: 20, step: 0.1, default: 0, format: (v) => `${v} s`, section: 'Motion' },
    { key: 'cubes', label: 'Cubes', type: 'range', min: 3, max: 24, step: 0.5, default: 4.5, section: 'Shape' },
    { key: 'margin', label: 'Margin', type: 'range', min: 0, max: 400, step: 4, default: 148, format: (v) => `${v} px`, section: 'Shape' },
    { key: 'cubeHeight', label: 'Cube height', type: 'range', min: 0.8, max: 1.5, step: 0.0001, default: 2 / Math.sqrt(3), section: 'Shape' },
    { key: 'whole', label: 'Whole cubes only', type: 'toggle', default: true, section: 'Shape' },
    { key: 'offsetX', label: 'Offset X', type: 'range', min: -400, max: 400, step: 1, default: 0, format: (v) => `${v} px`, section: 'Shape' },
    { key: 'offsetY', label: 'Offset Y', type: 'range', min: -400, max: 400, step: 1, default: 0, format: (v) => `${v} px`, section: 'Shape' },
    { key: 'spin', label: 'Spin', type: 'range', min: 0, max: 360, step: 15, default: 0, format: (v) => `${v}°`, section: 'Shape' },
    { key: 'breath', label: 'Breath', type: 'range', min: 0, max: 0.1, step: 0.005, default: 0.035, section: 'Shape' },
    { key: 'breathTime', label: 'Breath time', type: 'range', min: 1, max: 20, step: 0.5, default: 6, format: (v) => `${v} s`, section: 'Shape' },
    { key: 'line', label: 'Line', type: 'range', min: 0.5, max: 8, step: 0.5, default: 4, section: 'Lines' },
    { key: 'lineOpacity', label: 'Line opacity', type: 'range', min: 0, max: 1, step: 0.05, default: 1, section: 'Lines' },
    { key: 'roundJoins', label: 'Round joins', type: 'toggle', default: true, section: 'Lines' },
    { key: 'dash', label: 'Dash', type: 'range', min: 0, max: 40, step: 1, default: 0, format: (v) => `${v} px`, section: 'Lines' },
    { key: 'dashGap', label: 'Dash gap', type: 'range', min: 1, max: 40, step: 1, default: 8, format: (v) => `${v} px`, section: 'Lines' },
    { key: 'dashSpeed', label: 'Dash speed', type: 'range', min: -96, max: 96, step: 1, default: 24, section: 'Lines' },
    { key: 'waves', label: 'Growing cubes', type: 'toggle', default: true, section: 'Wave' },
    { key: 'sweep', label: 'Sweep', type: 'range', min: 0, max: 4, step: 0.1, default: 3.5, section: 'Wave' },
    { key: 'spacing', label: 'Spacing', type: 'range', min: 0, max: 8, step: 0.25, default: 0, section: 'Wave' },
    { key: 'grow', label: 'Grow length', type: 'range', min: 1, max: 12, step: 0.5, default: 6, section: 'Wave' },
    { key: 'travel', label: 'Wave speed', type: 'range', min: 0, max: 4, step: 0.1, default: 1.6, section: 'Wave' },
    { key: 'growLine', label: 'Growing line', type: 'range', min: 0.5, max: 8, step: 0.5, default: 2, section: 'Wave' },
    { key: 'dot', label: 'Dot', type: 'range', min: 0, max: 20, step: 0.5, default: 6, format: (v) => `${v} px`, section: 'Wave' },
    { key: 'dotFade', label: 'Dot fade', type: 'range', min: 0.01, max: 1, step: 0.01, default: 0.15, section: 'Wave' },
    /* white-01-slow: the grown cube sits nested inside its cell with a ring opening out of it, then fades */
    { key: 'nest', label: 'Nested size', type: 'range', min: 0.2, max: 1, step: 0.01, default: 1, section: 'Wave' },
    { key: 'ring', label: 'Ring', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0, section: 'Wave' },
    { key: 'fade', label: 'Fade out', type: 'toggle', default: false, section: 'Wave' },
    { key: 'fadeAt', label: 'Fade from', type: 'range', min: 1, max: 20, step: 0.5, default: 8.5, section: 'Wave' },
    { key: 'fadeLength', label: 'Fade length', type: 'range', min: 0.5, max: 10, step: 0.5, default: 2.5, section: 'Wave' },
    { key: 'nodes', label: 'Nodes', type: 'toggle', default: false, section: 'Nodes' },
    { key: 'nodeSize', label: 'Node size', type: 'range', min: 4, max: 40, step: 1, default: 14, format: (v) => `${v} px`, section: 'Nodes' },
    { key: 'pulse', label: 'Pulse', type: 'range', min: 0, max: 1, step: 0.05, default: 0.35, section: 'Nodes' },
    { key: 'nodeSpeed', label: 'Pulse speed', type: 'range', min: 0, max: 6, step: 0.1, default: 1.6, section: 'Nodes' },
    { key: 'nodeWave', label: 'Pulse length', type: 'range', min: 20, max: 600, step: 10, default: 140, format: (v) => `${v} px`, section: 'Nodes' },
    { key: 'nodeLine', label: 'Node line', type: 'range', min: 0.5, max: 6, step: 0.5, default: 2, section: 'Nodes' },
    { key: 'nodeDot', label: 'Node dot', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0.25, section: 'Nodes' },
    { key: 'nodeDotAt', label: 'Node dot from', type: 'range', min: 0, max: 0.99, step: 0.01, default: 0.6, section: 'Nodes' },
    { key: 'band', label: 'Lit band', type: 'toggle', default: false, section: 'Band' },
    { key: 'bandSlope', label: 'Band slope', type: 'range', min: -2, max: 2, step: 0.05, default: 0.6, section: 'Band' },
    { key: 'bandScale', label: 'Band scale', type: 'range', min: 200, max: 3000, step: 50, default: 900, format: (v) => `${v} px`, section: 'Band' },
    { key: 'bandWidth', label: 'Band width', type: 'range', min: 0.5, max: 10, step: 0.1, default: 3.2, section: 'Band' },
    { key: 'bandSpeed', label: 'Band speed', type: 'range', min: 0, max: 1, step: 0.01, default: 0.18, section: 'Band' },
    { key: 'bandPeriod', label: 'Band period', type: 'range', min: 0.2, max: 4, step: 0.1, default: 1.6, section: 'Band' },
    { key: 'bandShift', label: 'Band shift', type: 'range', min: -1, max: 1, step: 0.05, default: 0.3, section: 'Band' },
    { key: 'faceLeft', label: 'Left face', type: 'range', min: 0, max: 1, step: 0.05, default: 0.2, section: 'Band' },
    { key: 'faceRight', label: 'Right face', type: 'range', min: 0, max: 1, step: 0.05, default: 0.1, section: 'Band' },
  ],
  draw(ctx, u, w, h, p) {
    const s = w / WIDE, H = h / s
    ctx.fillStyle = p.bg
    ctx.fillRect(0, 0, w, h)
    ctx.save()
    ctx.scale(s, s)

    /* the clock: board time t = start + u · loopLength · speed, every cycle snapped to whole ones */
    const T = p.loopLength * p.speed, up = p.direction === 'up', t0 = p.start
    const snap = (rate, period) => Math.round((rate * T) / period) * period
    const S = snap(p.scroll, 2)                                   // rows scrolled per loop: the grid repeats every two
    const GROW = p.grow, PERIOD = GROW + p.spacing, roll = up ? -S : S
    const F = (Math.round((p.travel * (up ? -1 : 1) * T + roll) / PERIOD) * PERIOD) - roll
    const front = p.travel * (up ? -1 : 1) * t0 + u * F
    const shiftRows = p.scroll * t0 + u * S
    const breathPh = t0 / p.breathTime + u * Math.round(T / p.breathTime)
    const nodeArg = p.nodeSpeed * t0 + u * snap(p.nodeSpeed, 2 * Math.PI)
    const step = Math.max(1e-6, p.dash + p.dashGap)
    const dashOff = -(p.dashSpeed * t0 + u * snap(p.dashSpeed, step))
    const bandPh = ((((p.bandSpeed * t0 + u * snap(p.bandSpeed, p.bandPeriod)) % p.bandPeriod) + p.bandPeriod) % p.bandPeriod)

    const M = p.margin, BAND = WIDE - 2 * M, N = p.cubes
    const W = BAND / (2 * N), A = W * p.cubeHeight, ROW = 1.5 * A
    const SPIN = (p.spin * Math.PI) / 180
    const verts = (cw, a) => [[0, -a], [cw, -a / 2], [cw, a / 2], [0, a], [-cw, a / 2], [-cw, -a / 2]]
    const cube = (cx, cy, cw, a, rot) => {
      const c = Math.cos(rot), sn = Math.sin(rot)
      const q = verts(cw, a).map(([x, y]) => [cx + x * c - y * sn, cy + x * sn + y * c])
      ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1])
      for (let i = 1; i < 6; i++) ctx.lineTo(q[i][0], q[i][1])
      ctx.closePath()
      ctx.moveTo(cx, cy); ctx.lineTo(q[1][0], q[1][1])
      ctx.moveTo(cx, cy); ctx.lineTo(q[5][0], q[5][1])
      ctx.moveTo(cx, cy); ctx.lineTo(q[3][0], q[3][1])
      ctx.stroke()
    }

    /* breath: the whole grid swells and settles around the frame's centre */
    const k = 1 + p.breath * (0.5 - 0.5 * Math.cos(breathPh * Math.PI * 2))
    ctx.translate(WIDE / 2, H / 2); ctx.scale(k, k); ctx.translate(-WIDE / 2, -H / 2)
    const round = on(p.roundJoins)
    ctx.lineJoin = round ? 'round' : 'miter'; ctx.lineCap = round ? 'round' : 'butt'

    const shiftPx = shiftRows * ROW
    const shift = ((shiftPx % (2 * ROW)) + 2 * ROW) % (2 * ROW)
    const rMin = Math.floor((-A * 2 - shift - H * p.breath - p.offsetY) / ROW) - 1
    const rMax = Math.ceil((H + A * 2 - shift + H * p.breath - p.offsetY) / ROW) + 1
    const rowBase = Math.round((shiftPx - shift) / ROW)          // each cell keeps its grid identity as the grid scrolls
    const whole = on(p.whole), cMax = whole ? N + 1 : Math.ceil(WIDE / (2 * W)) + 2
    const cells = []
    for (let r = rMin; r <= rMax; r++) {
      const y = r * ROW + shift + p.offsetY, off = (((r % 2) + 2) % 2) ? W : 0
      for (let c = whole ? -1 : -2; c <= cMax; c++) {
        const x = M + W + c * 2 * W + off + p.offsetX
        if (whole && (x - W < M - 0.5 || x + W > WIDE - M + 0.5)) continue   // whole cubes only, inside the margins
        cells.push([x, y, r - rowBase])
      }
    }

    /* the lit band: two faces of each cube under a band that sweeps across, fading along the face */
    if (on(p.band)) {
      const face = (pts, alpha) => {
        const gr = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1])
        gr.addColorStop(0, withAlpha(p.ink, alpha)); gr.addColorStop(1, withAlpha(p.ink, 0))
        ctx.fillStyle = gr
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
        ctx.closePath(); ctx.fill()
      }
      for (const [x, y] of cells) {
        const band = (x * p.bandSlope + y) / p.bandScale - bandPh + p.bandShift
        const kk = Math.max(0, 1 - Math.abs(band) * p.bandWidth)
        if (kk <= 0) continue
        const v = verts(W, A).map(([vx, vy]) => [x + vx, y + vy]), c = [x, y]
        face([c, v[3], v[4], v[5]], p.faceLeft * kk)
        face([c, v[1], v[2], v[3]], p.faceRight * kk)
      }
    }

    const ink = withAlpha(p.ink, p.lineOpacity)
    const waves = on(p.waves)
    const LAG = p.sweep
    const fading = on(p.fade), nest = p.nest ?? 1
    for (const [x, y, R] of cells) {
      ctx.strokeStyle = ink
      ctx.lineWidth = p.line
      if (p.dash > 0) { ctx.setLineDash([p.dash, p.dashGap]); ctx.lineDashOffset = dashOff }
      cube(x, y, W, A, 0)
      if (p.dash > 0) ctx.setLineDash([])
      if (!waves) continue
      /* sweep: how far the left leads the right; spacing: the gap between waves, 0 = back to back */
      const lag = LAG * ease(clamp((x - M) / BAND, 0, 1))
      const pos = up ? -R : R
      const uu = (((front - pos - lag) % PERIOD) + PERIOD) % PERIOD
      if (uu <= 0 || uu >= (fading ? Math.min(PERIOD, p.fadeAt + p.fadeLength) : GROW)) continue
      const g = easeOut(clamp(uu / GROW, 0, 1))
      const fa = fading ? 1 - ease(clamp((uu - p.fadeAt) / p.fadeLength, 0, 1)) : 1
      const dot = 1 - ease(clamp(g / p.dotFade, 0, 1))
      if (dot > 0 && p.dot > 0) {
        ctx.globalAlpha = dot * fa
        ctx.beginPath(); ctx.arc(x, y, p.dot * dot, 0, Math.PI * 2); ctx.fillStyle = p.ink; ctx.fill()
        ctx.globalAlpha = 1
      }
      /* spin: the cube turns as it grows and lands square on the grid */
      const sz = g * nest
      ctx.globalAlpha = fa
      ctx.lineWidth = p.growLine + (p.line - p.growLine) * g
      cube(x, y, W * sz, A * sz, SPIN * (1 - g))
      if (p.ring > 0) {
        const kr = sz * (1 + p.ring * g), q = verts(W * kr, A * kr)
        ctx.globalAlpha = fa * g
        ctx.beginPath(); ctx.moveTo(x + q[0][0], y + q[0][1])
        for (let i = 1; i < 6; i++) ctx.lineTo(x + q[i][0], y + q[i][1])
        ctx.closePath(); ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    /* nodes: a circle on every intersection, ground inside, ink ring; a diagonal wave swells them, a dot at its peak */
    if (on(p.nodes)) {
      const nodes = new Map()
      for (const [x, y] of cells) for (const v of verts(W, A).concat([[0, 0]])) nodes.set(Math.round(x + v[0]) + ',' + Math.round(y + v[1]), [x + v[0], y + v[1]])
      ctx.lineWidth = p.nodeLine
      for (const [nx, ny] of nodes.values()) {
        const wave = Math.max(0, Math.sin(nodeArg - (nx + ny) / p.nodeWave))
        const rad = p.nodeSize * (1 + p.pulse * wave * wave)
        ctx.beginPath(); ctx.arc(nx, ny, rad, 0, Math.PI * 2)
        ctx.fillStyle = p.bg; ctx.fill(); ctx.strokeStyle = p.ink; ctx.stroke()
        if (p.nodeDot > 0 && wave > p.nodeDotAt) {
          ctx.globalAlpha = (wave - p.nodeDotAt) / (1 - p.nodeDotAt)
          ctx.beginPath(); ctx.arc(nx, ny, p.nodeSize * p.nodeDot, 0, Math.PI * 2); ctx.fillStyle = p.ink; ctx.fill()
          ctx.globalAlpha = 1
        }
      }
    }
    ctx.restore()
  },
}

/* a colour at an opacity, for the canvas: '#rgb', '#rrggbb' or anything the canvas takes (left as it is at 1) */
function withAlpha(col, a) {
  if (a >= 1) return col
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(col).trim())
  if (!m) return col
  const hx = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  return `rgba(${parseInt(hx.slice(0, 2), 16)},${parseInt(hx.slice(2, 4), 16)},${parseInt(hx.slice(4, 6), 16)},${a})`
}
