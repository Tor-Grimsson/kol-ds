import useScrollSpy from '../hooks/useScrollSpy.js'

/* taxonomy-ok: atoms despite being interactive — it composes only the
 * useScrollSpy hook, and hooks don't count as nesting; no KOL component
 * is rendered (nav + anchors only). */

/**
 * DocsToc — on-page table of contents for long docs pages: a flat list of
 * anchor links that highlights the heading currently in view. The scroll
 * spy is useScrollSpy (IntersectionObserver + edge lock); this component
 * only renders the nav and maps the active id onto the links.
 *
 * A matching in-page element must exist for every `toc` id — the spy
 * observes `document.getElementById(id)`. Clicking a link sets the browser
 * hash natively; `onNavigate` lets the consumer hook the click (prevent
 * default, smooth-scroll, close a mobile drawer). Labels render verbatim —
 * casing is authored at the call site.
 *
 * @param {Array<{id: string, label: string}>} toc  headings to render + observe
 * @param {Function} onNavigate  (event) => void — optional click handler on every link
 * @param {string}   rootMargin  IntersectionObserver rootMargin passed to the
 *                               spy. Default keeps the ported source's tighter
 *                               top band (useScrollSpy's own default is
 *                               '-30% 0px -60% 0px')
 */
export default function DocsToc({ toc, onNavigate, rootMargin = '-80px 0px -80% 0px' }) {
  const activeId = useScrollSpy(toc.map((item) => item.id), { rootMargin })

  return (
    <nav>
      <ul className="space-y-0">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              className={`kol-mono-12 block rounded py-1 transition-colors focus-visible:ring-focus hover:text-fg-96 ${
                activeId === item.id ? 'text-fg-96' : 'text-fg-64'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
