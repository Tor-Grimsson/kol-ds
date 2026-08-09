import { useEffect, useRef, useState } from 'react'

/**
 * Tracks which section id is currently in view. Borrowed pattern from vcap:
 * IntersectionObserver with an edge-lock so first/last sections stay active
 * when the user reaches the top/bottom of the page.
 */
/* `root` (2026-08-01) — the SCROLL CONTAINER, not always the viewport. The
 * workshop shell scrolls `#main` internally (it is `fixed inset-0` with its own
 * scroll regions), so an observer rooted at the viewport never fired and the
 * right rail could not highlight anything. The edge-lock reads the same
 * element for the same reason: `window.scrollY` is 0 forever in that shell. */
export default function useScrollSpy(ids, { rootMargin = '-30% 0px -60% 0px', edgeOffset = 100, root = null } = {}) {
  const [activeId, setActiveId] = useState(null)
  const edgeLockRef = useRef(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!ids.length) { setActiveId(null); return }
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return

    const scroller = typeof root === 'string' ? document.querySelector(root) : root

    const checkEdges = () => {
      const top = scroller ? scroller.scrollTop : window.scrollY
      const viewH = scroller ? scroller.clientHeight : window.innerHeight
      const fullH = scroller ? scroller.scrollHeight : document.documentElement.scrollHeight
      const atTop = top < edgeOffset
      const atBottom = top + viewH >= fullH - edgeOffset * 0.8
      if (atTop) {
        /* THE FIRST HEADING, not null (user ruling 2026-08-01): *"at any given
         * time you are at some place in the file, THAT LOCATION SHOULD
         * HIGHLIGHT"*. The top lock used to clear the active id, so the rail
         * highlighted nothing at rest — and a page opens at rest, which made
         * "no active row" the state the reader saw first and most. The bottom
         * lock has always activated the LAST id; this is that rule, both ends.
         * You are at the top of the document, so you are in its first section. */
        edgeLockRef.current = 'top'
        setActiveId(ids[0])
      } else if (atBottom) {
        edgeLockRef.current = 'bottom'
        setActiveId(ids[ids.length - 1])
      } else {
        edgeLockRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (edgeLockRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { root: scroller ?? null, rootMargin, threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    const target = scroller ?? window
    target.addEventListener('scroll', checkEdges, { passive: true })
    checkEdges()

    return () => {
      observer.disconnect()
      target.removeEventListener('scroll', checkEdges)
    }
  }, [key, rootMargin, edgeOffset, root])

  return activeId
}
