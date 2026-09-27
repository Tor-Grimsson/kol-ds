// armLongPress — the hold that opens a ParamSheet (Knob + Fader; kol-monitor 2026-09-01).

const HOLD_MS = 500
const SLOP_PX = 6

/* Arm a long-press on a touch pointerdown. Returns `{ move, cancel }`: feed
 * pointermoves to `move` (past SLOP it disarms — that is a drag, not a hold),
 * call `cancel` on pointerup. `fire` runs once when the hold lands. A mouse
 * never arms — desktop keeps drag + ⌥-click and nothing else. */
export function armLongPress(e, fire) {
  if (e.pointerType !== 'touch') return { move: () => {}, cancel: () => {} }
  const x = e.clientX, y = e.clientY
  let t = setTimeout(() => { t = null; fire() }, HOLD_MS)
  const cancel = () => { if (t) { clearTimeout(t); t = null } }
  const move = (ev) => { if (t && Math.hypot(ev.clientX - x, ev.clientY - y) > SLOP_PX) cancel() }
  return { move, cancel }
}
