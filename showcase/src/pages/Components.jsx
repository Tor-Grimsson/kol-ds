import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentFilters } from '@kolkrabbi/kol-component'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import DemoStage from '../lib/DemoStage.jsx'
import { groupComponents, FUNCTIONS, TOTAL, WITH_DEMOS } from '../nav/registry.js'
import { useGrouping } from '../lib/grouping.jsx'

/**
 * Components index — grouped by the active axis (Function default / Atomic),
 * A→Z within each group, function chips as a cross-cutting filter. Cards flow
 * in waterfall columns with a capped preview so tall demos can't blow holes
 * in the layout.
 *
 * THE FILTER ROW IS `ContentFilters`, THE ORGANISM (2026-09-02 — the showcase
 * held to the DS's own full-consumption law, check 5: "no hand-rolled chrome
 * the DS ships"). This page carried an Input + a hand-mapped chip row + its
 * own "N of N" — the organism's exact anatomy, re-implemented in the one repo
 * that ships it. Search, the Function group and the count are the organism's
 * now; the grouping into sections stays this page's, done inside `renderItem`
 * over the rows the organism hands back.
 */

/* Gate the live demo on visibility: the index renders 100+ cards, and each
 * live DemoStage is expensive to mount. Without this, regrouping (the
 * Atomic⇄Function toggle) remounts every card and re-inits every demo in one
 * blocking task (~150ms). Off-screen cards render the cheap name placeholder
 * until scrolled near; once shown, they stay shown. `useReveal` can't do this
 * — it toggles a class, it doesn't return an in-view state. */
function useInView(rootMargin = '250px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (inView || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } },
      { rootMargin },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [inView, rootMargin])
  return [ref, inView]
}

function ComponentCard({ c }) {
  const [ref, inView] = useInView()
  return (
    /* Overlay link, not a wrapping <Link>: live demos contain real anchors
       (footers, work cards) and <a>-in-<a> is invalid HTML — React logs a
       nesting error for every such card. The absolute Link keeps the whole
       card clickable without containing the demo. */
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 transition-colors hover:border-fg-24">
      <div ref={ref} className="pointer-events-none flex max-h-56 min-h-[6rem] items-center justify-center overflow-hidden bg-fg-02 p-5">
        {c.demo && inView ? (
          c.demo.Card ? <c.demo.Card /> : <DemoStage entry={c.demo} />
        ) : (
          <span className="kol-mono-12 text-meta opacity-50">{c.name}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t border-fg-08 px-4 py-3">
        <span className="kol-sans-body-02 text-emphasis">{c.name}</span>
        <span className="kol-helper-10 uppercase text-meta">{FUNCTIONS[c.function]}</span>
      </div>
      {/* LAST child, not `z-[1]`: a later sibling paints on top, so the overlay
        * link covers the card with no raw z (full-consumption check 5). */}
      <Link to={`/components/${c.slug}`} className="absolute inset-0" aria-label={c.name} />
    </div>
  )
}

export default function Components() {
  const { mode } = useGrouping()
  /* the organism filters a FLAT list; each item remembers its group so the
   * sections can be rebuilt from whatever rows come back */
  const groups = useMemo(() => groupComponents(mode), [mode])
  const items = useMemo(
    () => groups.flatMap(([key, label, list]) => list.map((c) => ({ ...c, group: key, groupLabel: label, fnLabel: FUNCTIONS[c.function] }))),
    [groups],
  )
  const regroup = (rows) => groups
    .map(([key, label]) => [key, label, rows.filter((c) => c.group === key)])
    .filter(([, , list]) => list.length)


  return (
    /* The page stack (user, 2026-08-09: "make a breather in the layout") —
     * header, filter row and sections were flush; gap-8 is the Foundations
     * page's stack rhythm. */
    <div className="flex flex-col gap-8">
      <DocHeader
        eyebrow="KOL · Components"
        title="Components"
        lede={`${TOTAL} published components · ${WITH_DEMOS} with live previews. Every component carries a canonical snippet plus verbatim examples mined from real KOL apps.`}
      />

      <ContentFilters
        items={items}
        title="All components"
        totalCount={TOTAL}
        searchKeys={['name']}
        filterGroups={[{ label: 'Function', key: 'fnLabel', values: Object.values(FUNCTIONS) }]}
        mutuallyExclusiveFilters={['fnLabel']}
        showCountOnlyWhenFiltering
        renderItem={(rows) => {
          const grouped = regroup(rows)
          return grouped.length === 0
            ? <p className="kol-sans-body-01 text-meta">no components match.</p>
            : (
              <div className="flex flex-col gap-8">
                {grouped.map(([key, label, list]) => (
                  <section key={key} id={key} className="scroll-mt-20">
                    <h2 className="kol-helper-10 uppercase tracking-widest text-meta mb-4 border-b border-fg-08 pb-2">
                      {label} · {list.length}
                    </h2>
                    {/* Waterfall — tall cards (heroes, tables) can't blow holes in a row grid.
                      * Column count derives from the wall's own width (min card 20rem, cap 4)
                      * — viewport breakpoints can't see the rails (05-layout-systems § walls). */}
                    <div className="gap-4 [columns:4_20rem]">
                      {list.map((c) => <ComponentCard key={c.name} c={c} />)}
                    </div>
                  </section>
                ))}
              </div>
            )
        }}
      />
    </div>
  )
}
