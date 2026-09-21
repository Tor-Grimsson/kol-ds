import { useEffect, useState } from 'react'

/**
 * useMediaQuery — subscribe to a media query, SSR-safe.
 *
 * The general form of `useCoarsePointer` and `usePrefersReducedMotion`, which
 * are each this hook with one query frozen in. It exists because a STRUCTURAL
 * responsive fork cannot be a stylesheet: `ColumnBrowser` renders Miller
 * columns on a desktop and a single inline-expanding list on a phone
 * (`ColumnBrowserStackMode`, kol-r2b2 2026-09-03), and those are different
 * TREES, not one tree with different padding. A component that only needs
 * different sizes still uses Tailwind's breakpoints — reach for this when the
 * markup itself has to change.
 *
 * Returns false during SSR and on the first client render if the query cannot
 * be evaluated, so a server render and its hydration agree.
 *
 * @param {string} query a media query, e.g. '(max-width: 767px)'
 * @returns {boolean} whether it currently matches
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
