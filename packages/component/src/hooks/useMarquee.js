import { useCallback, useRef, useState } from 'react'

/**
 * useMarquee — drag a band across a list and select what it touches, Finder's
 * rubber band (user 2026-09-22: *"at least in column and row a drag to
 * highlight/select multiple items"*).
 *
 * The container is whatever gets `props`; every selectable child carries
 * `data-marquee-key`. The band is drawn by the caller from `rect` — one
 * absolutely-positioned div inside a `relative` container — so the hook owns
 * the geometry and the DOM stays the caller's.
 *
 * A drag that never leaves its starting pixel is a CLICK and is left alone:
 * the threshold is what keeps row clicks, double-clicks and the context menu
 * working. Modifier-drag adds to the selection instead of replacing it, which
 * is the one thing every file manager agrees on.
 *
 * @param {Function} onSelect  (keys: string[], additive: boolean) => void
 * @param {boolean}  enabled   false → the container behaves exactly as before
 * @returns {{ ref, rect, props }} rect is `{left, top, width, height}` in container space, or null
 */
const THRESHOLD = 4

export default function useMarquee({ onSelect, enabled = true } = {}) {
  const ref = useRef(null)
  const start = useRef(null)
  /* A finished band ends in a `click` on the container, and the container's own click is
   * "you clicked the background, so deselect" — which would undo the band the moment it landed.
   * The flag swallows exactly that one click. */
  const dragged = useRef(false)
  const [rect, setRect] = useState(null)

  const onPointerDown = useCallback((e) => {
    if (!enabled || e.button !== 0) return
    const box = ref.current
    if (!box) return
    /* A DRAG THAT BEGINS ON A ROW IS NOT A MARQUEE — it is a row drag (move to a folder), which
     * this must not steal. The band starts on the list's own background. */
    /* …unless the row says only part of it is the item (`data-hit-zone`, the list view's rows —
     * Finder's: the file ends where its name ends). Then only a press on `[data-hit]` is a row. */
    const keyEl = e.target.closest?.('[data-marquee-key]')
    if (keyEl && (!keyEl.hasAttribute('data-hit-zone') || e.target.closest('[data-hit]'))) return
    const origin = box.getBoundingClientRect()
    start.current = {
      x: e.clientX - origin.left + box.scrollLeft,
      y: e.clientY - origin.top + box.scrollTop,
      additive: e.metaKey || e.ctrlKey || e.shiftKey,
      moved: false,
    }

    const move = (ev) => {
      const s = start.current
      if (!s) return
      const now = box.getBoundingClientRect()
      const x = ev.clientX - now.left + box.scrollLeft
      const y = ev.clientY - now.top + box.scrollTop
      if (!s.moved && Math.abs(x - s.x) < THRESHOLD && Math.abs(y - s.y) < THRESHOLD) return
      s.moved = true
      const band = { left: Math.min(s.x, x), top: Math.min(s.y, y), width: Math.abs(x - s.x), height: Math.abs(y - s.y) }
      setRect(band)
      const keys = []
      for (const el of box.querySelectorAll('[data-marquee-key]')) {
        const r = el.getBoundingClientRect()
        const top = r.top - now.top + box.scrollTop
        const bottom = top + r.height
        const left = r.left - now.left + box.scrollLeft
        const right = left + r.width
        if (bottom > band.top && top < band.top + band.height && right > band.left && left < band.left + band.width) {
          keys.push(el.getAttribute('data-marquee-key'))
        }
      }
      onSelect?.(keys, s.additive)
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      dragged.current = !!start.current?.moved
      start.current = null
      setRect(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [enabled, onSelect])

  const onClickCapture = useCallback((e) => {
    if (!dragged.current) return
    dragged.current = false
    e.stopPropagation()
  }, [])

  return { ref, rect, props: { onPointerDown, onClickCapture } }
}
