import { useEffect, useRef, useState } from 'react'

const PAD = 6
const fmt = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2))

/**
 * FunctionPlot — Plot y = f(u) over one loop. a read-only plot of a function over u ∈ 0–1 with a cursor at
 * the current u: the curve faint ahead of the cursor, solid behind it, a dot on the current value.
 *
 * Lobby FunctionPlot (kol-fxr, 2026-10-31): fxr's `params/ModulationEditor.jsx` drew its `ExprPlot` on a
 * hand-built `<canvas>` with hard-coded colours. This is it in SVG on the KOL inks, so it follows light and
 * dark with no colour reads. It samples one point per pixel of its width; it fills its container's width.
 *
 * DATA. `fn(u) → number` (sampled across u = 0…1), or `samples` (evenly spaced over u, used as given).
 * The range is `min` / `max`, or the samples' own extent when unset (a flat line gets ±0.5).
 * A live plot (audio, noise) is the caller re-rendering with a new `fn` or `cursor`.
 *
 * INKS (the icon ink law — oq, never fg): ground oq-04, the zero line oq-24 (drawn only when 0 is in range),
 * the extent labels oq-48, the curve, cursor and dot in the accent.
 *
 *   <FunctionPlot fn={(u) => Math.sin(u * Math.PI * 2)} cursor={phase} height={64} />
 *
 * @param {(u:number) => number} [fn] - The function to plot over u ∈ 0–1 (ignored when `samples` is given)
 * @param {number[]} [samples] - Precomputed values, evenly spaced over u = 0…1
 * @param {number} [min] - Bottom of the range (default: the lowest sample)
 * @param {number} [max] - Top of the range (default: the highest sample)
 * @param {number} [cursor] - The current u, 0–1 — draws the cursor line and dot; omit for none
 * @param {number} [height=64] - The plot's height in px
 * @param {boolean} [labels=true] - Show the range's max / min values at the left edge
 * @param {string} [ariaLabel='Function plot'] - The plot's accessible name
 * @param {string} [className] - Extra classes on the plot
 */
export default function FunctionPlot({
  fn,
  samples,
  min,
  max,
  cursor,
  height = 64,
  labels = true,
  ariaLabel = 'Function plot',
  className = '',
}) {
  const ref = useRef(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const innerW = Math.max(1, w - PAD * 2)
  const innerH = Math.max(1, height - PAD * 2)
  const vs = samples?.length
    ? samples
    : fn ? Array.from({ length: Math.round(innerW) + 1 }, (_, i) => fn(i / Math.round(innerW))) : []
  const finite = vs.filter(Number.isFinite)
  let lo = min ?? (finite.length ? Math.min(...finite) : 0)
  let hi = max ?? (finite.length ? Math.max(...finite) : 1)
  if (hi === lo) { lo -= 0.5; hi += 0.5 }
  const toX = (u) => PAD + u * innerW
  const toY = (v) => PAD + innerH * (1 - (v - lo) / (hi - lo))

  const n = vs.length - 1
  const pts = vs.map((v, i) => [toX(n > 0 ? i / n : 0), toY(Number.isFinite(v) ? v : lo)])
  const line = (list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
  const u = cursor == null ? null : Math.min(1, Math.max(0, cursor))
  const at = u == null || n < 1 ? -1 : Math.round(u * n)
  const cy = at < 0 ? 0 : (fn && !samples?.length ? toY(fn(u)) : pts[at][1])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={`kol-function-plot relative w-full overflow-hidden rounded-[var(--kol-radius-xs)] bg-[var(--kol-oq-04)] ${className}`.trim()}
      style={{ height }}
    >
      {w > 0 && (
        <svg className="absolute inset-0" width={w} height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true">
          {lo < 0 && hi > 0 && (
            <line x1={PAD} x2={w - PAD} y1={toY(0)} y2={toY(0)} stroke="var(--kol-oq-24)" strokeWidth="1" />
          )}
          {pts.length > 1 && (
            <>
              <path d={line(pts)} fill="none" stroke="var(--kol-accent-primary)" strokeOpacity={at < 0 ? 1 : 0.25} strokeWidth={at < 0 ? 1.5 : 1} />
              {at > 0 && <path d={line(pts.slice(0, at + 1))} fill="none" stroke="var(--kol-accent-primary)" strokeWidth="1.5" />}
            </>
          )}
          {at >= 0 && (
            <>
              <line x1={toX(u)} x2={toX(u)} y1={PAD} y2={height - PAD} stroke="var(--kol-accent-primary)" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx={toX(u)} cy={cy} r="2.5" fill="var(--kol-accent-primary)" />
            </>
          )}
        </svg>
      )}
      {labels && (
        <>
          <span className="kol-mono-10 absolute left-2 top-0.5 text-[var(--kol-oq-48)] pointer-events-none">{fmt(hi)}</span>
          <span className="kol-mono-10 absolute left-2 bottom-0.5 text-[var(--kol-oq-48)] pointer-events-none">{fmt(lo)}</span>
        </>
      )}
    </div>
  )
}
