import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageSection } from '@kolkrabbi/kol-framework'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'
import {
  COMPONENTS, componentsByCategory, CATEGORY_LABELS, TOTAL, WITH_DEMOS,
} from '../lib/registry.js'

function ComponentCard({ c }) {
  const Demo = c.demo?.render
  return (
    <Link
      to={`/components/${c.slug}`}
      className="group rounded-[var(--kol-radius-sm)] border border-fg-12 hover:border-fg-24 transition-colors flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-center flex-wrap gap-2 p-5 min-h-[6rem] bg-fg-02 pointer-events-none">
        {Demo ? (
          <ErrorBoundary><Demo /></ErrorBoundary>
        ) : (
          <span className="kol-mono-12 text-meta opacity-50">{c.name}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 px-4 py-3 border-t border-fg-08">
        <span className="kol-sans-body-02 text-emphasis">{c.name}</span>
        <span className="kol-mono-12 text-meta">{c.count} uses</span>
      </div>
    </Link>
  )
}

export default function Components() {
  const [q, setQ] = useState('')
  const grouped = useMemo(() => {
    const filtered = q
      ? COMPONENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      : COMPONENTS
    return componentsByCategory(filtered)
  }, [q])

  return (
    <PageSection
      title="Components"
      body={`${TOTAL} published components · ${WITH_DEMOS} with live previews. Every component carries a canonical snippet plus verbatim examples mined from real KOL apps. Click any card for its page.`}
    >
      <div className="flex flex-col gap-8 mt-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filter components…"
          className="self-start kol-mono-14 rounded-[var(--kol-radius-sm)] border border-fg-12 bg-fg-02 px-3 py-1.5 text-fg outline-none focus:border-fg-40"
        />

        {grouped.map(([cat, items]) => (
          <section key={cat} className="flex flex-col gap-4">
            <h2 className="kol-helper-10 uppercase tracking-widest text-meta">
              {CATEGORY_LABELS[cat] ?? cat} · {items.length}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => <ComponentCard key={c.name} c={c} />)}
            </div>
          </section>
        ))}

        {grouped.length === 0 && (
          <p className="kol-sans-body-01 text-meta">no components match “{q}”.</p>
        )}
      </div>
    </PageSection>
  )
}
