// useFloating — a panel you can drag around the stage and scale from a corner.
//
// LIFTED FROM TWO COPIES (UseFloatingHook, kol-mirror 2026-10-28 — user: *"seems like DS should tho?"*): kol-monitor's
// hook (kol-ds-ui apps/rack-hub/src/stage/useFloating.js, monitor's own beside it) and kol-mirror's copy of it
// (src/hooks/useFloating.js, 2026-10-03), which differed by one line — the cursor test also lets `nwse-resize` through, for
// a corner grip. That line is in: a grip that declares `cursor: nwse-resize` drags `onResize`, and monitor, which wires no
// grip, is unchanged by it.
//
// Window listeners rather than pointer capture, the same shape RackViewport's
// pan uses, so a drag survives the pointer leaving the handle. `scale` is CSS
// `zoom` at the call site: canvases inside re-measure through the shared
// ResizeObserver instead of being upsampled.
//
//   const panel = useFloating({ x: 40, y: 40, scale: 1 })
//   <div style={{ left: panel.box.x, top: panel.box.y, zoom: panel.box.scale }} onPointerDown={panel.onDrag}>
//     …<span style={{ cursor: 'nwse-resize' }} onPointerDown={panel.onResize} />
//   </div>

import { useCallback, useRef, useState } from 'react'

export const FLOATING_MIN_SCALE = 0.35
export const FLOATING_MAX_SCALE = 2.5

export function useFloating(initial) {
  const [box, setBox] = useState(initial)
  const boxRef = useRef(box)
  boxRef.current = box

  // Both gestures share one shape: capture the start, translate pointer delta,
  // release on pointerup.
  const gesture = useCallback((e, onDelta) => {
    if (e.button !== 0) return
    /* A press on a CONTROL belongs to that control; anything else drags. The
       test is the cursor, not a selector list: every control in this repo
       declares its own (`ns-resize` on knobs and sliders, `pointer` on keys and
       jacks, `text` on inputs), so one computed read covers them all and a new
       control needs no entry here. Excluding `[data-module-id]` — the obvious
       list-based guard — made the whole dock undraggable, since every pixel of
       it is inside a module. `nwse-resize` passes: it is the corner grip's own. */
    const cursor = getComputedStyle(e.target).cursor
    if (cursor !== 'auto' && cursor !== 'default' && cursor !== 'grab' && cursor !== 'nwse-resize') return
    e.preventDefault()
    e.stopPropagation()
    const px = e.clientX
    const py = e.clientY
    const start = boxRef.current
    const move = (ev) => setBox(onDelta(start, ev.clientX - px, ev.clientY - py))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [])

  const onDrag = useCallback((e) => {
    gesture(e, (start, dx, dy) => ({ ...start, x: start.x + dx, y: start.y + dy }))
  }, [gesture])

  // Corner handle: right/down grows. One axis drives it so a diagonal drag
  // doesn't fight itself — the larger movement wins.
  const onResize = useCallback((e) => {
    gesture(e, (start, dx, dy) => {
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy
      return { ...start, scale: Math.min(FLOATING_MAX_SCALE, Math.max(FLOATING_MIN_SCALE, start.scale + d / 400)) }
    })
  }, [gesture])

  return { box, onDrag, onResize, setBox }
}
