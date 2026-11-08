/* LINE SCREEN — `lines/` + `dot/steps` (plan 52 § 2.1).
 * Parallel lines across the art box; each line's WIDTH along its length follows the field: hairline at 0,
 * the full pitch × Fill at 1, nothing below Cut. Stepped edges hold each sample's width square (eclipse's
 * notches); tapered edges join the samples (fulcrum's spikes). The mask ends a line where it leaves the
 * shape — the line is cut, not the mark shrunk. */

export default {
  id: 'lineScreen',
  label: 'Line screen',
  about: 'Line screen — parallel lines whose width follows a field, cut by a mask',
  sampled: true,
  warp: false,
  /* the tuner leaves the look alone: these are what make it a line screen */
  hold: ['count', 'fill', 'hair', 'sample'],
  schema: [
    { key: 'orient', label: 'Lines', type: 'segmented', default: 'h', options: [{ value: 'h', label: 'Rows' }, { value: 'v', label: 'Columns' }], section: 'Lines' },
    { key: 'count', label: 'Count', type: 'range', min: 2, max: 200, step: 1, default: 40, animatable: false, section: 'Lines' },
    /* Edges: the first and last line sit on the frame (his Figma grids), instead of half a pitch in */
    /* per line: where each starts and ends along its length (0–1, comma list cycled over the lines) */
    { key: 'starts', label: 'Starts', type: 'text', default: '', placeholder: '0, 0.2, 0.1 …', section: 'Per line' },
    { key: 'ends', label: 'Ends', type: 'text', default: '', placeholder: '1, 0.8 …', section: 'Per line' },
    { key: 'shift', label: 'Shift', type: 'range', min: -1, max: 1, step: 0.005, default: 0, format: (v) => `${Math.round(v * 100)}% pitch`, section: 'Lines' },
    { key: 'justify', label: 'Edge to edge', type: 'toggle', default: false, section: 'Lines' },
    { key: 'fill', label: 'Fill', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.9, format: (v) => `${Math.round(v * 100)}%`, section: 'Lines' },
    { key: 'hair', label: 'Hairline', type: 'range', min: 0, max: 8, step: 0.1, default: 1.5, format: (v) => `${v}px`, section: 'Lines' },
    { key: 'cut', label: 'Cut below', type: 'range', min: 0, max: 1, step: 0.01, default: 0, section: 'Lines' },
    { key: 'edge', label: 'Edge', type: 'segmented', default: 'step', options: [{ value: 'step', label: 'Stepped' }, { value: 'taper', label: 'Tapered' }], section: 'Lines' },
    /* Smoothing: each width is the average of its neighbours (± N samples) — organic contours */
    { key: 'smooth', label: 'Smoothing', type: 'range', min: 0, max: 12, step: 1, default: 0, section: 'Lines' },
    { key: 'round', label: 'Round ends', type: 'toggle', default: false, section: 'Lines' },
    { key: 'sample', label: 'Sample', type: 'range', min: 0.5, max: 40, step: 0.5, default: 4, format: (v) => `${v}px`, section: 'Lines' },
  ],
  draw(m, p, box, { field, mask, aspect }) {
    const vert = p.orient === 'v'
    const across = vert ? box.w : box.h, along = vert ? box.h : box.w
    const n = Math.max(1, Math.round(p.count ?? 40))
    const pitch = across / n
    const maxW = pitch * (p.fill ?? 0.9), hair = Math.min(p.hair ?? 1.5, maxW)
    const cut = p.cut ?? 0
    const step = Math.max(0.5, p.sample ?? 4)
    const taper = p.edge === 'taper'
    const at = (c, t) => (vert ? [box.x + c, box.y + t] : [box.x + t, box.y + c])
    const list = (str) => String(str ?? '').split(/[\s,]+/).filter(Boolean).map(Number).filter((x) => Number.isFinite(x))
    const starts = list(p.starts), ends = list(p.ends)
    void aspect
    for (let i = 0; i < n; i++) {
      const c = (p.justify && n > 1 ? hair / 2 + (i * (across - hair)) / (n - 1) : (i + 0.5) * pitch) + (p.shift ?? 0) * pitch
      const t0 = (starts.length ? starts[i % starts.length] : 0) * along, t1 = (ends.length ? ends[i % ends.length] : 1) * along
      /* the samples: width per step, 0 = no line here */
      const ws = []
      for (let t = 0; t < along; t += step) {
        const tm = Math.min(along, t + step / 2)
        if (tm < t0 || tm > t1) { ws.push(0); continue }
        const u = (vert ? c : tm) / box.w, v = (vert ? tm : c) / box.h
        if (!mask(u, v)) { ws.push(0); continue }
        const f = field(u, v)
        ws.push(f < cut ? 0 : hair + (maxW - hair) * f)
      }
      /* smoothing: a moving average inside each run (a cut stays a cut) */
      const sm = Math.round(p.smooth ?? 0)
      if (sm > 0) {
        const src = ws.slice()
        for (let q = 0; q < ws.length; q++) {
          if (!src[q]) continue
          let a = 0, nn = 0
          for (let d = -sm; d <= sm; d++) { const v = src[q + d]; if (v) { a += v; nn++ } }
          ws[q] = a / nn
        }
      }
      /* runs of non-zero samples → one ring each: top edge forward, bottom edge back */
      let k = 0
      while (k < ws.length) {
        if (!ws[k]) { k++; continue }
        let e = k
        while (e < ws.length && ws[e]) e++
        const top = [], bot = []
        for (let j = k; j < e; j++) {
          const t0 = j * step, t1 = Math.min(along, (j + 1) * step), w = ws[j] / 2
          if (taper) {
            const tm = (t0 + t1) / 2
            /* the run's first and last samples pin the ends square, so a cut line still ends flat */
            if (j === k) { top.push(at(c - w, t0)); bot.push(at(c + w, t0)) }
            top.push(at(c - w, tm)); bot.push(at(c + w, tm))
            if (j === e - 1) { top.push(at(c - w, t1)); bot.push(at(c + w, t1)) }
          } else if (j === k || ws[j] !== ws[j - 1]) {
            top.push(at(c - w, t0)); bot.push(at(c + w, t0))
            /* hold the width to where it next changes */
            let q = j
            while (q + 1 < e && ws[q + 1] === ws[j]) q++
            const tq = Math.min(along, (q + 1) * step)
            top.push(at(c - w, tq)); bot.push(at(c + w, tq))
          }
        }
        /* round ends: a half-circle cap on each end of the run, its radius the end's half-width */
        if (p.round) {
          const cap = (t, w, dir) => {
            const pts = []
            for (let a = 1; a < 8; a++) {
              const th = (a / 8) * Math.PI
              pts.push(at(c - Math.cos(th) * w, t + dir * Math.sin(th) * w))
            }
            return pts
          }
          const t0 = k * step, t1 = Math.min(along, e * step)
          /* the end cap runs top side → bottom side, the start cap back again */
          m.polys.push([...top, ...cap(t1, ws[e - 1] / 2, 1), ...bot.reverse(), ...cap(t0, ws[k] / 2, -1).reverse()])
        } else m.polys.push([...top, ...bot.reverse()])
        k = e
      }
    }
  },
}
