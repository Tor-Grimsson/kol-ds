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
 * again — a one-shot envelope's gate.
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
 * @param {number|'fill'} height   px (default 320), or `fill` to take the parent's height
 */
const css = (el, name, fallback) => getComputedStyle(el).getPropertyValue(name).trim() || fallback

export default function SignalScope({
  sample, min = 0, max = 100, sec = 5, ofs = 0, zoomX = 1, zoomY = 1, panY = 0, onPan,
  refLines = [0, 100], live = true, playing = true, rate = 1, loop = true, trigger = 0,
  height = 320, className = '',
}) {
  const ref = useRef(null)
  const args = useRef({})
  const drawRef = useRef(null)
  const clock = useRef({ t: 0, last: 0 })
  args.current = { sample, min, max, sec, ofs, zoomX, zoomY, panY, refLines, live, playing, rate, loop }

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
      if (a.live && a.playing) clock.current.t += dt * a.rate
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
      // trace
      ctx.globalAlpha = 1
      ctx.strokeStyle = ink
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x <= w; x++) {
        const y = toY(fn ? fn(a.ofs + (x / w) * dur) : lo)
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      // playhead — over the base window, whatever the zoom (mirror's)
      if (a.live && fn) {
        const t = a.loop ? clock.current.t % a.sec : Math.min(clock.current.t, a.sec)
        const px = toX(t)
        if (px >= 0 && px <= w) {
          const py = toY(fn(t))
          ctx.globalAlpha = 0.25
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke()
          ctx.globalAlpha = 1
          ctx.fillStyle = ink
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
