import { useEffect } from 'react'

/**
 * useScrollFade — the scroll state a `.kol-scroll-fade` box fades by (TimeSetAndSiteRailFade, kol-website 2026-10-29 —
 * user: *"FADE WHAT VERTICALLY SCROLLS into clipping!!!"*). On the element `ref` points at it sets `data-fade-top` once the
 * box is scrolled, and `data-fade-bottom` while more lies below; kol-theme's `.kol-scroll-fade` draws the two fades from
 * them. Re-read on scroll and whenever the box or its content changes size. One rule for every vertically scrolling rail
 * or list that clips: the site rail, the app rail, the workshop's rails.
 *
 * `axis="x"` (TabsRowOverflow, kol-website 2026-10-29): the same for a row that scrolls sideways — `data-fade-left` once
 * scrolled, `data-fade-right` while more lies to the right; `.kol-scroll-fade--x` draws them.
 */
export default function useScrollFade(ref, enabled = true, axis = 'y') {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return undefined
    const read = axis === 'x'
      ? () => {
        el.toggleAttribute('data-fade-left', el.scrollLeft > 1)
        el.toggleAttribute('data-fade-right', el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
      }
      : () => {
        el.toggleAttribute('data-fade-top', el.scrollTop > 1)
        el.toggleAttribute('data-fade-bottom', el.scrollTop + el.clientHeight < el.scrollHeight - 1)
      }
    read()
    el.addEventListener('scroll', read, { passive: true })
    const ro = new ResizeObserver(read)
    ro.observe(el)
    for (const c of el.children) ro.observe(c)
    const mo = new MutationObserver(() => { for (const c of el.children) ro.observe(c); read() })
    mo.observe(el, { childList: true })
    return () => {
      el.removeEventListener('scroll', read)
      ro.disconnect()
      mo.disconnect()
      for (const a of ['top', 'bottom', 'left', 'right']) el.removeAttribute(`data-fade-${a}`)
    }
  }, [ref, enabled, axis])
}
