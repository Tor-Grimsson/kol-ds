import { useRef, useState } from 'react'

/**
 * usePointerSort — a vertical reorder by pointer, the ~50 lines `RecordManager` carried inline
 * (2026-08-09, "util before any dependency"), lifted so `StepList` is not a second copy (kol-fxr
 * StepList, 2026-10-09). Pointer events, so a finger works where HTML drag does not.
 *
 *   const { drag, startDrag } = usePointerSort(onReorder)
 *   <button onPointerDown={(e) => startDrag(e, i, rowEls)} className="touch-none">⠿</button>
 *
 * `startDrag(e, from, rowEls)`: `rowEls` is the list of row elements in order (a NodeList or an
 * array); their rects are measured once at the start. While the pointer is down `drag` is
 * `{ from, over, x, y }` — `over` is the row under the pointer, `x`/`y` the pointer, for a
 * floating label — and null otherwise. On release `onReorder(from, over)` fires when they differ.
 * Without `onReorder` a start is a no-op, so a handle can render conditionally on it.
 */
export default function usePointerSort(onReorder) {
  const dragRef = useRef(null)
  const [drag, setDrag] = useState(null)

  const startDrag = (e, from, rowEls) => {
    if (!onReorder) return
    e.preventDefault()
    if (!rowEls?.length) return
    const rects = [...rowEls].map((el) => el.getBoundingClientRect())
    const move = (ev) => {
      const hit = rects.findIndex((r) => ev.clientY < r.bottom)
      const over = hit === -1 ? rects.length - 1 : hit
      dragRef.current = { from, over, x: ev.clientX, y: ev.clientY }
      setDrag(dragRef.current)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (d && d.over !== d.from) onReorder(d.from, d.over)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    dragRef.current = { from, over: from, x: e.clientX, y: e.clientY }
    setDrag(dragRef.current)
  }

  return { drag, startDrag }
}
