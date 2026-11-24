import { useEffect, useRef } from 'react'
import { isTyping, useComposeState } from '../editor/engine.js'

/* THE LIST'S KEYS (plan-2026-11-20 W10): Figma's arrange keys move the selected layer's row in Layers, one undo step
   a press. Figma's US keys, and the Swedish-Finnish ones its help lists for the same keys (Ö and Ä, the layout whose §
   the shell's keys already take): ⌘] (⌘Ä) one row up, ⌘[ (⌘Ö) one row down, ] (Ä) to the top, [ (Ö) to the bottom.
   One row is one row of the list as drawn: past the first or last layer of a frame the row leaves the frame, and on
   the page a row that meets a frame goes in at its near end, so pressing on walks the row through the whole list.
   To the top or bottom stays among its siblings (the frame's, or the page's). A layer inside a group moves among the
   group's children. */
const UP = [']', 'ä'], DOWN = ['[', 'ö']

/* where one row up (by 1) or down (by -1) puts a top-level layer, as placeLayer's [target, position], or null */
export function rowStep(layers, id, by) {
  const me = layers.find((l) => l.id === id)
  if (!me) return null
  const inFrame = (fid) => layers.filter((l) => l.frameId === fid && l.type !== 'frame')
  if (me.type !== 'frame' && me.frameId) {
    const sibs = inFrame(me.frameId), i = sibs.indexOf(me), next = sibs[i + by]
    if (next) return [next.id, by > 0 ? 'above' : 'below']
    return [me.frameId, by > 0 ? 'above' : 'below']
  }
  /* the page's own rows: frames and unframed layers, in z-order */
  const page = layers.filter((l) => l.type === 'frame' || !l.frameId || !layers.some((f) => f.id === l.frameId))
  const next = page[page.indexOf(me) + by]
  if (!next) return null
  if (next.type === 'frame' && me.type !== 'frame') {
    const kids = inFrame(next.id)
    if (!kids.length) return [next.id, 'into']
    return by > 0 ? [kids[0].id, 'below'] : [kids[kids.length - 1].id, 'above']
  }
  return [next.id, by > 0 ? 'above' : 'below']
}

/* to the top (by 1) or the bottom (by -1) of its siblings */
export function rowEnd(layers, id, by) {
  const me = layers.find((l) => l.id === id)
  if (!me) return null
  const sibs = me.type !== 'frame' && me.frameId
    ? layers.filter((l) => l.frameId === me.frameId && l.type !== 'frame')
    : layers.filter((l) => l.type === 'frame' || !l.frameId)
  const end = by > 0 ? sibs[sibs.length - 1] : sibs[0]
  return end && end.id !== id ? [end.id, by > 0 ? 'above' : 'below'] : null
}

export function useLayerKeys() {
  const s = useComposeState()
  const live = useRef(s); live.current = s
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e) || e.altKey || e.shiftKey) return
      const k = e.key.toLowerCase()
      const by = UP.includes(k) ? 1 : DOWN.includes(k) ? -1 : 0
      if (!by) return
      const { layers, selectedIds, placeLayer, moveLayer } = live.current
      const id = selectedIds.length === 1 ? selectedIds[0] : null
      if (!id || id === 'canvas') return
      e.preventDefault()
      if (!layers.some((l) => l.id === id)) {
        /* a group's child: among the group's children */
        if (!e.metaKey && !e.ctrlKey) return moveLayer(id, by > 0 ? Infinity : 0)
        const parent = (function find(list) { for (const l of list) { if (l.children?.some((c) => c.id === id)) return l; const p = l.children && find(l.children); if (p) return p } return null })(layers)
        const at = parent?.children.findIndex((c) => c.id === id) ?? -1
        if (at >= 0) moveLayer(id, at + by)
        return
      }
      const to = e.metaKey || e.ctrlKey ? rowStep(layers, id, by) : rowEnd(layers, id, by)
      if (to) placeLayer(id, to[0], to[1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/* A TOUCH DRAG ON A ROW (W10): a finger held still on a Layers or Pages row for HOLD ms lifts it, and from then on the
   list does not scroll under it, so the rows' own pointer drag runs; a finger that moves sooner scrolls the list as
   before. Mounted once for both lists. */
const HOLD = 250
export function useTouchHold() {
  useEffect(() => {
    let held = false, timer = 0, x0 = 0, y0 = 0
    const start = (e) => {
      held = false; clearTimeout(timer)
      if (e.touches.length !== 1 || !e.target.closest?.('[data-layers-row], [data-page-row]')) return
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY
      timer = setTimeout(() => { held = true }, HOLD)
    }
    const move = (e) => {
      if (held) { e.preventDefault(); return }
      if (Math.hypot(e.touches[0].clientX - x0, e.touches[0].clientY - y0) > 6) clearTimeout(timer)
    }
    const end = () => { held = false; clearTimeout(timer) }
    document.addEventListener('touchstart', start, { passive: true })
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', end)
    document.addEventListener('touchcancel', end)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('touchstart', start)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', end)
      document.removeEventListener('touchcancel', end)
    }
  }, [])
}
