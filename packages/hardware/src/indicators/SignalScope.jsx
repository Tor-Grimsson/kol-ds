import { useEffect, useRef } from 'react'

/**
 * SignalScope — An oscilloscope trace of a signal. the oscilloscope every expression tool draws (signal engine, 2026-09-27): a
 * trace of `sample(t)` over a window, the knob range as dashed reference lines, a midline, and
 * a playhead that sweeps the window live. kol-mirror's /expressions scope, kol-monitor's
 * Scope / Scope+ and the design editor's Oscilloscope loop each drew their own.
 *
 * Presentational: pass any `sample(t) → number` — a compiled expression, an envelope, a bus.
 *
 * THE VIEW IS MIRROR'S (app frame and curves, 2026-09-27): `zoomX` narrows the window to
 * `sec / zoomX` seconds starting at `ofs`; `zoomY` narrows the value span around the centre of
 * `min…max`, shifted by `panY`. `onPan` makes the trace draggable — it reports the new
 * `{ ofs, panY }` and the host keeps them, as mirror's Oscilloscope did with its own state.
 *
 * THE CLOCK is the scope's: `rate` is time units per second (BPM / 60 for a beat clock), and
 * `playing` stops it where it is. `loop` (default) wraps the playhead over `sec`; off, the
 * playhead runs `0 → sec` once and holds at the end, and every change of `trigger` fires it
 * again — a one-shot envelope's gate. `now` hands the clock to the host instead: a
 * `() => t` read every frame (mirror's desk transport), and `rate` / `playing` stop applying.
 *
 * THE PLAYED PART IS THE ACCENT (SignalScopePlayedTraceAndClock, kol-mirror): while live, the
 * curve is faint and the trace up to the playhead, the playhead and its dot take
 * `--kol-slider-playhead` (the accent unless a host overrides it) — where the position is in the
 * signal, at a glance.
 *
 * @param {(t:number)=>number} sample
 * @param {number} min · max       the view (default 0…100)
 * @param {number} sec · ofs       the window: `sec` time units starting at `ofs`
 * @param {number} zoomX · zoomY   view zoom (default 1)
 * @param {number} panY            value pan (default 0)
 * @param {Function} onPan         `({ ofs, panY }) => void` — drag the trace to pan
 * @param {number[]} refLines      values drawn dashed (default the knob range 0 and 100)
 * @param {boolean} live           redraw every frame and sweep a playhead (default true)
 * @param {boolean} playing        the clock runs (default true)
 * @param {number}  rate           time units per second (default 1)
 * @param {boolean} loop           wrap the playhead (default true); off = one pass per `trigger`
 * @param {number}  trigger        a counter — each change restarts the pass
 * @param {()=>number} now         an external clock (time units); overrides the scope's own
 * @param {number|'fill'} height   px (default 320), or `fill` to take the parent's height
 */
const css = (el, name, fallback) => getComputedStyle(el).getPropertyValue(name).trim() || fallback

export default function SignalScope({
  sample, min = 0, max = 100, sec = 5, ofs = 0, zoomX = 1, zoomY = 1, panY = 0, onPan,
  refLines = [0, 100], live = true, playing = true, rate = 1, loop = true, trigger = 0, now,
  height = 320, className = '',
}) {
  const ref = useRef(null)
  const args = useRef({})
  const drawRef = useRef(null)
  const clock = useRef({ t: 0, last: 0 })
  args.current = { sample, min, max, sec, ofs, zoomX, zoomY, panY, refLines, live, playing, rate, loop, now }

  // a trigger restarts the pass
  useEffect(() => { clock.current.t = 0 }, [trigger])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    clock.current.last = performance.now()
    let raf = 0
    const draw = () => {
      const a = args.current
      const now = performance.now()
      const dt = (now - clock.current.last) / 1000
      clock.current.last = now
      if (a.now) clock.current.t = a.now()
      else if (a.live && a.playing) clock.current.t += dt * a.rate
      const fn = a.sample
      const dpr = window.devicePixelRatio || 1
      const { width: w, height: h } = canvas.getBoundingClientRect()
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const ink = css(canvas, '--kol-surface-on-primary', '#e8e4dc')
      const red = css(canvas, '--kol-ctl-led-red', '#e74c3c')
      const accent = css(canvas, '--kol-slider-playhead', css(canvas, '--kol-accent-primary', ink))
      const pad = 12
      const span = (a.max - a.min) / (a.zoomY || 1) || 1
      const lo = (a.min + a.max) / 2 + a.panY - span / 2
      const hi = lo + span
      const dur = a.sec / (a.zoomX || 1)
      const toY = (v) => pad + (h - pad * 2) * (1 - (v - lo) / span)
      const toX = (t) => ((t - a.ofs) / dur) * w
      const fmt = (v) => String(Math.round(v * 10) / 10)
      ctx.font = '9px var(--kol-font-family-mono), monospace'
      // midline
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, toY((lo + hi) / 2)); ctx.lineTo(w, toY((lo + hi) / 2)); ctx.stroke()
      // the knob range, dashed
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = red
      ctx.fillStyle = red
      ctx.setLineDash([4, 4])
      for (const v of a.refLines) {
        const y = toY(v)
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
        ctx.fillText(String(v), w - 4 - ctx.measureText(String(v)).width, y - 3)
      }
      ctx.setLineDash([])
      // axis labels
      ctx.globalAlpha = 0.4
      ctx.fillStyle = ink
      ctx.fillText(fmt(hi), 4, pad + 9)
      ctx.fillText(fmt(lo), 4, h - pad - 3)
      const trace = (to) => {
        ctx.beginPath()
        for (let x = 0; x <= to; x++) {
          const y = toY(fn ? fn(a.ofs + (x / w) * dur) : lo)
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      const played = a.live && fn
      // trace — faint under a playhead, the played part drawn over it
      ctx.globalAlpha = played ? 0.15 : 1
      ctx.strokeStyle = ink
      ctx.lineWidth = played ? 1 : 1.5
      trace(w)
      ctx.globalAlpha = 1
      // playhead — over the base window, whatever the zoom (mirror's)
      if (played) {
        const t = a.loop ? ((clock.current.t % a.sec) + a.sec) % a.sec : Math.max(0, Math.min(clock.current.t, a.sec))
        const px = toX(t)
        ctx.strokeStyle = accent
        ctx.lineWidth = 2
        if (px > 0) trace(Math.min(px, w))
        if (px >= 0 && px <= w) {
          const py = toY(fn(t))
          ctx.globalAlpha = 0.4
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke()
          ctx.globalAlpha = 1
          ctx.fillStyle = accent
          ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill()
        }
      }
      if (a.live) raf = requestAnimationFrame(draw)
    }
    drawRef.current = draw
    draw()
    const ro = new ResizeObserver(() => { if (!args.current.live) draw() })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [live])

  // a static scope redraws when its inputs change; a live one is already redrawing every frame
  useEffect(() => { if (!live) drawRef.current?.() })

  /* drag to pan — mirror's gesture, reported rather than kept */
  const pan = onPan ? {
    onPointerDown: (e) => {
      const canvas = ref.current
      const box = canvas.getBoundingClientRect()
      const start = { x: e.clientX, y: e.clientY, ofs, panY }
      const dur = sec / (zoomX || 1)
      const span = (max - min) / (zoomY || 1)
      canvas.setPointerCapture(e.pointerId)
      const move = (ev) => onPan({
        ofs: start.ofs - ((ev.clientX - start.x) / box.width) * dur,
        panY: start.panY + ((ev.clientY - start.y) / box.height) * span,
      })
      const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up) }
      canvas.addEventListener('pointermove', move)
      canvas.addEventListener('pointerup', up)
    },
  } : {}

  const fill = height === 'fill'
  return (
    <canvas
      ref={ref}
      {...pan}
      className={`block w-full rounded-[4px] bg-surface-primary ${fill ? 'h-full min-h-0' : ''} ${onPan ? 'cursor-grab touch-none active:cursor-grabbing' : ''} ${className}`}
      style={fill ? undefined : { height }}
    />
  )
}
