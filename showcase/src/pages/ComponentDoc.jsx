import { useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-loader'
import ComponentPreview from '../lib/ComponentPreview.jsx'
import {
  getComponentBySlug, componentsByCategory, CATEGORY_LABELS,
} from '../lib/registry.js'

/* Flat, category-ordered list for prev/next paging — matches the sidebar order. */
const ORDERED = componentsByCategory().flatMap(([, items]) => items)

function CopyableCode({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked */ }
  }
  return (
    <div className="relative group">
      <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] px-3 py-2.5 pr-10 bg-fg-04 text-fg">
        {text}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-[var(--kol-radius-sm)] text-meta hover:text-emphasis hover:bg-fg-08 transition-colors"
        aria-label={copied ? 'Copied' : 'Copy'}
      >
        <Icon name={copied ? 'check' : 'copy'} size={13} />
      </button>
    </div>
  )
}

function Examples({ examples }) {
  const [open, setOpen] = useState(false)
  if (!examples?.length) return null
  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="self-start kol-mono-12 text-meta hover:text-emphasis transition-colors"
      >
        {open ? '▾' : '▸'} {examples.length} real example{examples.length === 1 ? '' : 's'} mined from consumers
      </button>
      {open && (
        <div className="flex flex-col gap-4">
          {examples.map((ex, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="kol-mono-12 text-meta">{ex.app} · {ex.file}</span>
              <pre className="kol-mono-12 whitespace-pre-wrap overflow-x-auto rounded-[var(--kol-radius-sm)] px-3 py-2.5 bg-fg-04 text-fg">
                {ex.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function ComponentDoc() {
  const { slug } = useParams()
  const c = getComponentBySlug(slug)

  const pager = useMemo(() => {
    const i = ORDERED.findIndex((x) => x.slug === slug)
    return { prev: i > 0 ? ORDERED[i - 1] : null, next: i >= 0 && i < ORDERED.length - 1 ? ORDERED[i + 1] : null }
  }, [slug])

  if (!c) return <Navigate to="/components" replace />

  const pkgShort = c.pkg.replace('@kolkrabbi/', '')
  const importLine = `import { ${c.name} } from '${c.pkg}'`

  return (
    <div className="kol-page flex flex-col gap-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 kol-mono-12 text-meta">
        <Link to="/components" className="hover:text-emphasis">Components</Link>
        <span aria-hidden>/</span>
        <span className="text-subtle">{CATEGORY_LABELS[c.category] ?? c.category}</span>
        <span aria-hidden>/</span>
        <span className="text-emphasis">{c.name}</span>
      </nav>

      {/* header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h1 className="kol-sans-display-02 text-emphasis">{c.name}</h1>
          <div className="flex items-center gap-2 kol-mono-12 text-meta">
            <span className="rounded px-1.5 py-0.5 bg-fg-04">{pkgShort}</span>
            <span>{c.count} uses · {c.apps.length} apps</span>
          </div>
        </div>
        {c.description && <p className="kol-sans-body-01 text-body max-w-prose">{c.description}</p>}
      </header>

      {/* live preview */}
      {c.demo && (
        <ComponentPreview render={c.demo.render} code={c.demo.code} />
      )}

      {/* install + import */}
      <section className="flex flex-col gap-3">
        <h2 className="kol-helper-10 uppercase tracking-widest text-meta">Installation</h2>
        <CopyableCode text={`npm install ${c.pkg}`} />
        <CopyableCode text={importLine} />
      </section>

      {/* mined real-world usage */}
      {c.examples?.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="kol-helper-10 uppercase tracking-widest text-meta">Real-world usage</h2>
          <Examples examples={c.examples} />
        </section>
      ) : (
        <p className="kol-mono-12 text-meta opacity-60">published — no consumer usage mined yet</p>
      )}

      {/* pager */}
      <nav className="flex items-center justify-between gap-3 pt-6 mt-2 border-t border-fg-08">
        {pager.prev ? (
          <Link to={`/components/${pager.prev.slug}`} className="group flex flex-col gap-0.5 text-left">
            <span className="kol-mono-12 text-meta">← Prev</span>
            <span className="kol-sans-body-02 text-body group-hover:text-emphasis">{pager.prev.name}</span>
          </Link>
        ) : <span />}
        {pager.next ? (
          <Link to={`/components/${pager.next.slug}`} className="group flex flex-col gap-0.5 text-right">
            <span className="kol-mono-12 text-meta">Next →</span>
            <span className="kol-sans-body-02 text-body group-hover:text-emphasis">{pager.next.name}</span>
          </Link>
        ) : <span />}
      </nav>
    </div>
  )
}
