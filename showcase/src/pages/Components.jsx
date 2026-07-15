import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag } from '@kolkrabbi/kol-component'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader from '../lib/DocHeader.jsx'
import DemoStage from '../lib/DemoStage.jsx'
import { groupComponents, FUNCTIONS, TOTAL, WITH_DEMOS } from '../lib/registry.js'
import { useGrouping } from '../lib/grouping.jsx'

/**
 * Components index — grouped by the active axis (Function default / Atomic),
 * A→Z within each group, function chips as a cross-cutting filter. Cards flow
 * in waterfall columns with a capped preview so tall demos can't blow holes
 * in the layout.
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
      <Link to={`/components/${c.slug}`} className="absolute inset-0 z-[1]" aria-label={c.name} />
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
    </div>
  )
}

export default function Components() {
  const { mode } = useGrouping()
  const [q, setQ] = useState('')
  const [fn, setFn] = useState(null)

  const grouped = useMemo(() => {
    let filter = (c) => true
    if (fn && q) filter = (c) => c.function === fn && c.name.toLowerCase().includes(q.toLowerCase())
    else if (fn) filter = (c) => c.function === fn
    else if (q) filter = (c) => c.name.toLowerCase().includes(q.toLowerCase())
    return groupComponents(mode).map(([key, label, items]) => [key, label, items.filter(filter)]).filter(([, , items]) => items.length)
  }, [q, fn, mode])

  const shown = grouped.reduce((n, [, , items]) => n + items.length, 0)
  const toc = grouped.map(([key, label]) => ({ id: key, label }))

  return (
    <DocLayout wide toc={toc}>
      <DocHeader
        eyebrow="KOL · Components"
        title="Components"
        lede={`${TOTAL} published components · ${WITH_DEMOS} with live previews. Every component carries a canonical snippet plus verbatim examples mined from real KOL apps.`}
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Input variant="filled" size="sm" placeholder="filter components…" value={q} onChange={(e) => setQ(e?.target?.value ?? e)} iconLeft="search" />
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(FUNCTIONS).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setFn(fn === key ? null : key)}>
              <Tag hash={false} className={fn === key ? 'border-fg-32' : 'border-fg-08'}>{label}</Tag>
            </button>
          ))}
        </div>
        <span className="kol-helper-12 text-meta ml-auto">{shown} of {TOTAL}</span>
      </div>

      {grouped.map(([key, label, items]) => (
        <section key={key} id={key} className="scroll-mt-20">
          <h2 className="kol-helper-10 uppercase tracking-widest text-meta mb-4 border-b border-fg-08 pb-2">
            {label} · {items.length}
          </h2>
          {/* Waterfall — tall cards (heroes, tables) can't blow holes in a row grid. */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {items.map((c) => <ComponentCard key={c.name} c={c} />)}
          </div>
        </section>
      ))}

      {shown === 0 && <p className="kol-sans-body-01 text-meta">no components match.</p>}
    </DocLayout>
  )
}
