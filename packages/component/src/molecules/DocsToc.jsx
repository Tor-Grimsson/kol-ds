import { useCallback, useEffect, useRef } from 'react'
import useScrollSpy from '../hooks/useScrollSpy.js'

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
 * TWO RENDERS, ONE CONTRACT (`variant`, 2026-09-03 — `docstoc-rail-variant`,
 * kol-client-olina, which built and ran it before filing):
 *
 * - **`list`** (default) — the docs-sidebar column. No existing call moves.
 * - **`rail`** — a fisheye rail pinned to a page edge (Bederson, *Fisheye
 *   Menus*, UIST 2000). One hairline per heading with its label beside it,
 *   magnified under the pointer on a gaussian curve, with inert graduations
 *   between the headings. It reads as a ruler and behaves as a dial.
 *
 * WHY THE RAIL IS NOT A STYLESHEET OVER THE LIST — three behaviours a CSS file
 * over the flat render cannot express:
 *
 * 1. **The curve.** Each row's magnitude is `exp(-((focus − centre)/falloff)²)`,
 *    written to the row as `--m`; every visual derives from it in CSS (scale,
 *    opacity, rule width), so JS sets ONE number per row and the cascade does
 *    the rest. Gaussian, not linear: linear leaves the pointer a visible cone
 *    edge, this has none.
 * 2. **The lens SNAPS.** It never rests between two marks — it locks to the
 *    nearest graduation and holds across that mark's whole band, so travelling
 *    the rail is a run of countable clicks rather than a smear that settles
 *    nowhere. The filer's test, verbatim: *"think about a lock picking thief,
 *    he counts the ticks right"*. Snapping to the labelled rows alone was tried
 *    and rejected — seven coarse stops, and it throws the ruler away. **The
 *    graduations are the clicks; the labels are where the numbers happen to be
 *    printed.**
 * 3. **The graduations.** `minors` inert ticks between each pair of headings,
 *    carrying the same `--m` — which is what makes the movement read as a lens
 *    rather than rows blinking, and gives the rail a scale that seven bare
 *    strokes have none of. They are `aria-hidden`, not links, no tab stop: a
 *    screen reader wants the headings, not the seventy-seven marks.
 *
 * TWO THINGS THAT BIT THE FILER, kept here so they do not bite twice.
 * `transform` does nothing on a non-replaced INLINE element — the label is a
 * `<span>` and its scale was silently ignored until `display:inline-block`
 * (which is why `.kol-toc-label` sets it in the theme). And transitions are OFF
 * while the pointer drives: the rail carries `data-live` on pointer-enter and
 * the CSS drops every transition under it, because a 120ms ease on top of a
 * continuous input lags the cursor and reads as sluggish. They come back on
 * leave so the wave settles instead of snapping.
 *
 * Row centres are measured on ENTER and on resize, never per pointer-move, and
 * `--m` is written inside one rAF straight to the DOM. Reading geometry in a
 * move handler is what makes this pattern jank; so is re-rendering React seven
 * times a frame to animate seven numbers.
 *
 * HEADING DISCOVERY STAYS THE CONSUMER'S. `toc` is the contract for both
 * variants — reading `<section id>` and its `<h2>` out of the DOM is app
 * knowledge and does not belong in the package.
 *
 * @param {Array<{id: string, label: string}>} toc  headings to render + observe
 * @param {'list'|'rail'} variant  render (default 'list' — the docs-sidebar column)
 * @param {Function} onNavigate  (event) => void — optional click handler on every link
 * @param {string}   rootMargin  IntersectionObserver rootMargin passed to the
 *                               spy. Default keeps the ported source's tighter
 *                               top band (useScrollSpy's own default is
 *                               '-30% 0px -60% 0px')
 * @param {Element}  root        IntersectionObserver root passed to the spy
 * @param {number}   minors      RAIL: graduations between one heading and the next — the dial's resolution, so literally how many clicks a heading is worth (default 10)
 * @param {number}   falloff     RAIL: the gaussian's sigma in px, measured against the TICK pitch not the label pitch — at 10 graduations of 3px a section spans ~52px, so 14 crosses four or five clicks. Widen it and the whole column swells together, which is a column getting bigger rather than a lens moving over it (default 14)
 * @param {'tick'|'label'|'off'} snap  RAIL: what the lens locks to — `tick` (default) is the safecracker dial, locking to the nearest graduation and holding across its band; `label` locks to headings only, which is the ONLY sensible detent at `minors={0}`; `off` lets the lens follow the pointer continuously, which is the honest fisheye and reads better on a long rail with no graduations
 * @param {'left'|'right'} position  RAIL: which edge it pins to (default 'right')
 * @param {number}   minSections RAIL: render nothing under this many headings — an index of one is noise (default 2)
 * @param {string}   ariaLabel   RAIL: the nav's accessible name (default 'On this page')
 * @param {string}   className   RAIL: extra classes on the nav — where a consumer puts its own breakpoint (olina hides it under `xl`, where the sidenav is the navigation)
 */
export default function DocsToc({
  toc,
  variant = 'list',
  onNavigate,
  rootMargin = '-80px 0px -80% 0px',
  root = null,
  minors = 10,
  falloff = 14,
  snap = 'tick',
  position = 'right',
  minSections = 2,
  ariaLabel = 'On this page',
  className = '',
}) {
  const activeId = useScrollSpy(toc.map((item) => item.id), { rootMargin, root })

  if (variant === 'rail') {
    return (
      <TocRail
        toc={toc}
        activeId={activeId}
        onNavigate={onNavigate}
        minors={minors}
        falloff={falloff}
        snap={snap}
        position={position}
        minSections={minSections}
        ariaLabel={ariaLabel}
        className={className}
      />
    )
  }

  return (
    <nav>
      <ul className="shell-nav-items">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              /* THE rail row idiom (04-compositions/02-shells: "the right TOC
               * rail wears the LEFT tree's exact idiom"). This was
               * `kol-mono-12 … py-1` with no left padding, so on-this-page rows
               * sat at a smaller size and a different left edge than the
               * Related rows directly beneath them in the same rail. */
              /* THE one row string (user ruling 2026-08-01). This carried
               * `block transition-colors focus-visible:ring-focus
               * hover:text-emphasis text-body` as utilities, so the same rung
               * rendered a different className here than in the left tree.
               * Layout, colour, hover and focus live in `.shell-nav-item` now;
               * active is the shared `is-active` marker, not `text-emphasis`
               * typed at one call site. Matches RailRow exactly. */
              className={`shell-nav-item kol-mono-14${activeId === item.id ? ' is-active' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* TocRail — the fisheye render. A sibling component rather than a branch inside
 * the default export, because it owns refs, three pointer handlers and an
 * effect that the list has no use for; hooks that only ever run for one variant
 * do not belong in the other's render path.
 *
 * The magnitudes go to the DOM as `--m`, never to state — see the header. */
function TocRail({ toc, activeId, onNavigate, minors, falloff, snap, position, minSections, ariaLabel, className }) {
  const navRef = useRef(null)
  const centresRef = useRef([])
  const frameRef = useRef(0)

  /* Row centres in viewport coords. Measured on enter and on resize — the rail
   * is fixed and its rows do not move while the pointer is inside it. EVERY
   * child is a detent: labels and graduations alike. */
  const measure = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    centresRef.current = [...nav.children].map((el) => {
      const r = el.getBoundingClientRect()
      return r.top + r.height / 2
    })
  }, [])

  const paint = useCallback((y) => {
    const nav = navRef.current
    if (!nav) return

    /* THE DETENT. `tick` is the safecracker's dial — the lens locks to the
     * nearest mark and holds across its whole band, so dragging down the rail
     * is a run of discrete clicks rather than a smear. The three modes differ
     * only in WHICH array is snapped against, which is why this is a prop and
     * not three components (`docstoc-rail-tracking-and-snap-prop`, 2026-09-04):
     *
     *   tick   every graduation — the default, right for an index you aim with
     *   label  the headings only — coarse at 10 minors, and the ONLY sensible
     *          detent at `minors={0}`, which the component already allows: no
     *          ticks plus a tick-snap is `label` by accident rather than choice
     *   off    no snap at all — the honest fisheye, and better on a long rail
     *          with many headings and no graduations
     *
     * Majors are every (minors + 1)th child, because the render interleaves
     * one heading with `minors` ticks and stops after the last heading. */
    const marks = centresRef.current
    const targets = snap === 'off'
      ? null
      : snap === 'label'
        ? marks.filter((_, i) => i % (minors + 1) === 0)
        : marks
    const focus = y == null
      ? null
      : !targets?.length
        ? y
        : targets.reduce((best, c) => (Math.abs(c - y) < Math.abs(best - y) ? c : best), targets[0])

    marks.forEach((c, i) => {
      const m = focus == null ? 0 : Math.exp(-(((focus - c) / falloff) ** 2))
      nav.children[i]?.style.setProperty('--m', m.toFixed(3))
    })
  }, [falloff, snap, minors])

  const onMove = useCallback((e) => {
    /* Reduced motion: the curve is the animation, so there is nothing to damp —
     * the lens simply does not run, and the theme's reduced-motion block gives
     * every row its resting size. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const y = e.clientY
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => paint(y))
  }, [paint])

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => paint(null))
  }, [paint])

  useEffect(() => {
    paint(null)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frameRef.current)
    }
  }, [measure, paint, toc])

  if (toc.length < minSections) return null

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      data-position={position}
      onPointerEnter={(e) => { measure(); e.currentTarget.dataset.live = '' }}
      onPointerMove={onMove}
      onPointerLeave={(e) => { delete e.currentTarget.dataset.live; onLeave() }}
      className={`kol-toc kol-toc--${position} ${className}`.trim()}
    >
      {toc.flatMap(({ id, label }, i) => {
        const active = id === activeId
        const row = (
          <a
            key={id}
            href={`#${id}`}
            onClick={onNavigate}
            aria-current={active ? 'true' : undefined}
            data-major=""
            data-active={active ? '' : undefined}
            className="kol-toc-row"
          >
            {/* `kol-helper-12`, and it is the FAULT LINE that says so, not
              * taste (01-foundations/03-typography: *"can this string ever
              * wrap? No (structurally single-line) → helper"*). This label is
              * `white-space: nowrap` — a graduation on a ruler, which is the
              * helper family's own listed use.
              *
              * The line-height is the functional half. `kol-mono-14` carries
              * 18px leading on a 14px label: 4px this string never uses, and
              * THIS component measures its rows — `measure()` reads
              * `getBoundingClientRect()` on every child to place the detents,
              * so leading inflates each row box and moves the label's centre
              * off its own tick. A ramp built for wrapping text is the wrong
              * tool for a mark on a ruler.
              *
              * It shipped as `kol-mono-14` in 0.188.0 because validate:rails
              * R1 tested the class PREFIX rather than the rung's purpose and I
              * took the gate's word over the type law. The filer had specified
              * helper-12 deliberately (user: *"its a bit big and tight and
              * bold"*, and then *"I just dont get the point of me desiging for
              * the design be ignored?!"*). R1 now carries the exemption with
              * this reason — see `docstoc-rail-tracking-and-snap-prop`. */}
            <span className="kol-toc-label kol-helper-12 text-meta">{label}</span>
            <span aria-hidden="true" className="kol-toc-rule" />
          </a>
        )
        /* No graduations after the last heading — a ruler ends on a mark. */
        if (i === toc.length - 1) return [row]
        return [row, ...Array.from({ length: minors }, (_, k) => (
          <span key={`${id}-tick-${k}`} aria-hidden="true" className="kol-toc-row kol-toc-tick">
            <span className="kol-toc-rule" />
          </span>
        ))]
      })}
    </nav>
  )
}
