import { useEffect, useRef } from 'react'

/**
 * SignalScope — the oscilloscope every expression tool draws (signal engine, 2026-09-27): a
 * trace of `sample(t)` over a window, the knob range as dashed reference lines, a midline, and
 * a playhead that sweeps the window live. kol-mirror's /expressions scope, kol-monitor's
 * Scope / Scope+ and the design editor's Oscilloscope loop each drew their own.
 *
 * Presentational: pass any `sample(t) → number` — a compiled expression, an envelope, a bus.
 *
 * @param {(t:number)=>number} sample
 * @param {number} min · max       the view (default 0…100)
 * @param {number} sec · ofs       the window: `sec` seconds starting at `ofs`
 * @param {number[]} refLines      values drawn dashed (default the knob range 0 and 100)
 * @param {boolean} live           sweep a playhead and redraw every frame (default true)
 * @param {number|string} height   (default 320)
 */
const css = (el, name, fallback) => getComputedStyle(el).getPropertyValue(name).trim() || fallback

export default function SignalScope({
  sample, min = 0, max = 100, sec = 5, ofs = 0, refLines = [0, 100], live = true, height = 320, className = '',
}) {
  const ref = useRef(null)
  const args = useRef({})
  const drawRef = useRef(null)
  args.current = { sample, min, max, sec, ofs, refLines, live }

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const start = performance.now()
    let raf = 0
    const draw = () => {
      const { sample: fn, min: lo, max: hi, sec: s, ofs: o, refLines: lines, live: on } = args.current
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
      const span = hi - lo || 1
      const toY = (v) => pad + (h - pad * 2) * (1 - (v - lo) / span)
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
      for (const v of lines) {
        const y = toY(v)
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
        ctx.fillText(String(v), w - 4 - ctx.measureText(String(v)).width, y - 3)
      }
      ctx.setLineDash([])
      // axis labels
      ctx.globalAlpha = 0.4
      ctx.fillStyle = ink
      ctx.fillText(String(hi), 4, pad + 9)
      ctx.fillText(String(lo), 4, h - pad - 3)
      // trace
      ctx.globalAlpha = 1
      ctx.strokeStyle = ink
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x <= w; x++) {
        const y = toY(fn ? fn(o + (x / w) * s) : lo)
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      // playhead
      if (on && fn) {
        const u = (((performance.now() - start) / 1000) % s) / s
        const px = u * w
        const py = toY(fn(o + u * s))
        ctx.globalAlpha = 0.25
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke()
        ctx.globalAlpha = 1
        ctx.fillStyle = ink
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill()
      }
      if (on) raf = requestAnimationFrame(draw)
    }
    drawRef.current = draw
    draw()
    const ro = new ResizeObserver(() => { if (!args.current.live) draw() })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [live])

  // a static scope redraws when its inputs change; a live one is already redrawing every frame
  useEffect(() => { if (!live) drawRef.current?.() })

  return <canvas ref={ref} className={`block w-full rounded-[4px] bg-surface-primary ${className}`} style={{ height }} />
}
