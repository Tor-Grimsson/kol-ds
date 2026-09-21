import { useRef } from 'react'

/**
 * XYPad — a two-axis control pad: drag one puck to vary two values at once.
 *
 * Lifted verbatim from kol-fxr's editor (`compose/inspectors/XYPad.jsx`,
 * `editor-panels-the-held-specs` A6, 2026-09-03 — the row the filer marked
 * "portable as-is", and it was: presentation-only, no store coupling). Its own
 * lineage runs back through kol-labs-single's para-type lab to Font Playground.
 *
 * Axis meaning, ranges and the write path belong to the caller. It fills its
 * container's width and is square via `aspect-ratio`; the puck is positioned
 * in %, so there is no `size` prop and a rail of any width takes it. `y` is
 * inverted — top is high — because that is how every axis pad reads.
 *
 * No `useCallback` on the handlers, on purpose: the labs original memoized
 * them with `[]` deps and froze the first render's axis ranges into the drag
 * math, so a pad whose range changed kept mapping to the old one.
 *
 *   <XYPad xValue={wdth} yValue={wght} xMin={50} xMax={200} yMin={100} yMax={900}
 *          xLabel="Width" yLabel="Weight" onChange={(x, y) => set({ wdth: x, wght: y })} />
 *
 * @param {number} xValue - Current x, in the x range
 * @param {number} yValue - Current y, in the y range
 * @param {number} [xMin=0] - x at the left edge
 * @param {number} [xMax=1] - x at the right edge
 * @param {number} [yMin=0] - y at the BOTTOM edge
 * @param {number} [yMax=1] - y at the top edge
 * @param {Function} onChange - `(x, y) => void` on pointer down and on every move while a button is held — the caller coalesces if it wants one patch per gesture
 * @param {ReactNode} xLabel - Left label above the pad
 * @param {ReactNode} yLabel - Right label above the pad
 * @param {string} [className] - Extra classes on the wrapper
 */
export default function XYPad({
  xValue, yValue,
  xMin = 0, xMax = 1,
  yMin = 0, yMax = 1,
  onChange,
  xLabel,
  yLabel,
  className = '',
}) {
  const ref = useRef(null)

  const handlePos = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const x = xMin + px * (xMax - xMin)
    const y = yMax - py * (yMax - yMin) /* invert: top = high */
    onChange?.(x, y)
  }

  const onPointerDown = (e) => {
    e.target.setPointerCapture?.(e.pointerId)
    handlePos(e)
  }
  const onPointerMove = (e) => {
    if (e.buttons === 0) return
    handlePos(e)
  }

  const span = (max, min) => (max - min) || 1
  const puckX = ((xValue - xMin) / span(xMax, xMin)) * 100
  const puckY = (1 - (yValue - yMin) / span(yMax, yMin)) * 100

  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <div className="flex justify-between kol-helper-10 tracking-widest text-meta">
        <span>{xLabel}</span>
        <span>{yLabel}</span>
      </div>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="relative w-full aspect-square border border-fg-16 bg-fg-04 rounded cursor-crosshair touch-none"
      >
        {/* crosshair guides */}
        <div className="absolute inset-x-0 top-1/2 border-t border-fg-08" />
        <div className="absolute inset-y-0 left-1/2 border-l border-fg-08" />
        {/* puck */}
        <div
          className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-fg-96 border border-fg-04 pointer-events-none"
          style={{ left: `${puckX}%`, top: `${puckY}%` }}
        />
      </div>
    </div>
  )
}
