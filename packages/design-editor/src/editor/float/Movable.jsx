import { useEffect, useRef, useState } from 'react'

/* A float you can pick up and put somewhere else (the user, 2026-11-12: *"float is supposed to be layout you can change
 * around"*). Grab the float by its body — a press on a button, link, field or tab inside still does its own thing — and
 * it follows the pointer inside its positioned parent. Where it was left is kept per browser under `id`; unset, it sits
 * at `start` (`{ right, bottom }` or `{ left, top }` in px). `onMoved(bool)` says whether it has left `start`, so a
 * neighbour can give back the room it kept for it. A double-click on its body puts it back at `start`. */
const CONTROLS = 'button, a, input, select, textarea, [role=button], [role=tab], [role=slider]'
const clamp = (v, max) => Math.max(0, Math.min(v, max))

export default function Movable({ id, start = { right: 24, bottom: 24 }, onMoved, className = '', children }) {
  const key = `kol-float-pos:${id}`
  /* a kept place carries the `start` it was dragged from: when the default moves, an old drag no longer pins the float */
  const startKey = JSON.stringify(start)
  const [pos, setPos] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v?.start === startKey ? { left: v.left, top: v.top } : null } catch { return null }
  })
  const ref = useRef(null)
  useEffect(() => { onMoved?.(!!pos) }, [!!pos]) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest(CONTROLS)) return
    const el = ref.current
    const box = el.getBoundingClientRect()
    const room = el.offsetParent.getBoundingClientRect()
    const dx = e.clientX - box.left, dy = e.clientY - box.top
    let last = null
    el.setPointerCapture(e.pointerId)
    const move = (ev) => {
      /* a press is not a drag: under 4px of travel nothing moves and nothing is kept */
      if (!last && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 4) return
      last = { left: clamp(ev.clientX - room.left - dx, room.width - box.width), top: clamp(ev.clientY - room.top - dy, room.height - box.height) }
      setPos(last)
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      if (last) try { localStorage.setItem(key, JSON.stringify({ ...last, start: startKey })) } catch { /* private window: the place is kept for this visit only */ }
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  /* ponytail: a kept place is not re-clamped when the window shrinks; clamp on resize if a float ever lands off-screen */
  return (
    <div ref={ref} onPointerDown={onPointerDown} style={pos ?? start}
      onDoubleClick={(e) => { if (e.target.closest(CONTROLS)) return; setPos(null); try { localStorage.removeItem(key) } catch { /* nothing kept */ } }}
      className={`absolute z-[var(--kol-z-sticky)] cursor-grab active:cursor-grabbing touch-none select-none ${className}`.trim()}>
      {children}
    </div>
  )
}
