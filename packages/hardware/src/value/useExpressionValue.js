// useExpressionValue — a value that can be an EXPRESSION: commit `wave(t)` and the value runs it every frame, clamped to
// [min, max], on the clock it is given; commit a number and it is a number again. kol-mirror's `hooks/useExpressionValue.js`,
// carried (ModulatableControls, 2026-10-28 — user: *"expression generator engine lives in DS, rotary dial lives in DS.
// nothing here is unique to mirror except that it homes modulation source"*); its clock is a prop now, not mirror's module.
//
//   clock   a transport (`createTransport()`, its `now()`) or a `() => seconds`; unset, wall time since the expression began
//   bus     the modulation bus — `{ current: { A: 0.4, … } }` (a ref the app owns) or the object itself; an expression may
//           name its keys, and a source is just its name
import { useCallback, useEffect, useRef, useState } from 'react'
import { compileExpression, isExpression } from '../signal/expression.js'

const busOf = (bus) => (bus && typeof bus === 'object' && 'current' in bus ? bus.current : bus) ?? {}
const secondsOf = (clock, t0) => (typeof clock === 'function' ? clock() : clock?.now ? clock.now() : performance.now() / 1000 - t0)

export default function useExpressionValue({ onChange, min = 0, max = 100, bus, clock, initial = null }) {
  const [expr, setExpr] = useState(initial)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const rafRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!expr) { frameRef.current = 0; return undefined }
    const { ok, fn } = compileExpression(expr, { bus: Object.keys(busOf(bus)) })
    if (!ok) { setExpr(null); return undefined }
    frameRef.current = 0
    const t0 = performance.now() / 1000
    const tick = () => {
      const f = frameRef.current++
      try {
        const raw = fn(secondsOf(clock, t0), f, min, max, busOf(bus))
        onChangeRef.current?.(Math.max(min, Math.min(max, Math.round(raw))))
      } catch { /* silent: the engine already holds the last good value */ }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [expr, min, max, bus, clock])

  /* a number commits as a value; anything else is an expression; empty clears */
  const commit = useCallback((draft) => {
    const trimmed = String(draft ?? '').trim()
    if (!trimmed) { setExpr(null); return }
    const n = parseFloat(trimmed)
    if (!isNaN(n) && !isExpression(trimmed)) { setExpr(null); onChangeRef.current?.(Math.round(n)) } else setExpr(trimmed)
  }, [])

  return { expr, commit, isAnimating: expr !== null }
}
