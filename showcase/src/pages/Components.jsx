import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag } from '@kolkrabbi/kol-component'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader from '../lib/DocHeader.jsx'
import DemoStage from '../lib/DemoStage.jsx'
import {
  componentsByCategory, CATEGORY_LABELS, FUNCTIONS, TOTAL, WITH_DEMOS,
} from '../lib/registry.js'

/**
 * Components index — grouped by type (atoms / molecules / organisms /
 * framework tiers), A→Z within each group, function
 * chips as a cross-cutting filter. Cards flow in waterfall columns with a
 * capped preview so tall demos can't blow holes in the layout.
 */

function ComponentCard({ c }) {
  return (
    <Link
      to={`/components/${c.slug}`}
      className="group mb-4 block break-inside-avoid overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 transition-colors hover:border-fg-24"
    >
      <div className="pointer-events-none flex max-h-56 min-h-[6rem] items-center justify-center overflow-hidden bg-fg-02 p-5">
        {c.demo ? (
          <DemoStage entry={c.demo} />
        ) : (
          <span className="kol-mono-12 text-meta opacity-50">{c.name}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t border-fg-08 px-4 py-3">
        <span className="kol-sans-body-02 text-emphasis">{c.name}</span>
        <span className="kol-helper-10 uppercase text-meta">{FUNCTIONS[c.function]}</span>
      </div>
    </Link>
  )
}

export default function Components() {
  const [q, setQ] = useState('')
  const [fn, setFn] = useState(null)

  const grouped = useMemo(() => {
    let filter = (c) => true
    if (fn && q) filter = (c) => c.function === fn && c.name.toLowerCase().includes(q.toLowerCase())
    else if (fn) filter = (c) => c.function === fn
    else if (q) filter = (c) => c.name.toLowerCase().includes(q.toLowerCase())
    return componentsByCategory().map(([cat, items]) => [cat, items.filter(filter)]).filter(([, items]) => items.length)
  }, [q, fn])

  const shown = grouped.reduce((n, [, items]) => n + items.length, 0)
  const toc = grouped.map(([cat]) => ({ id: cat, label: CATEGORY_LABELS[cat] ?? cat }))

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

      {grouped.map(([cat, items]) => (
        <section key={cat} id={cat} className="scroll-mt-20">
          <h2 className="kol-helper-10 uppercase tracking-widest text-meta mb-4 border-b border-fg-08 pb-2">
            {CATEGORY_LABELS[cat] ?? cat} · {items.length}
          </h2>
          {/* Waterfall — tall cards (heroes, tables) can't blow holes in a row grid. */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((c) => <ComponentCard key={c.name} c={c} />)}
          </div>
        </section>
      ))}

      {shown === 0 && <p className="kol-sans-body-01 text-meta">no components match.</p>}
    </DocLayout>
  )
}
