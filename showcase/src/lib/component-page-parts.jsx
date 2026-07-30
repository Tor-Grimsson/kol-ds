import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@kolkrabbi/kol-component'
import { getComponentBySlug, COMPONENTS_AZ, slugify } from './registry.js'
import SOURCES from '../usage/component-sources.json'
import ORIGINS from '../usage/component-origins.json'

/**
 * The furniture a component doc carries regardless of how its body is authored.
 *
 * Extracted from ComponentPage.jsx (2026-07-30) because the MDX path rendered
 * header + body only: every converted component silently lost its source-mined
 * meta rows, its props-table merge and its prev/next pager. A conversion must
 * never be a regression, so both paths now render from ONE definition.
 */

/* API rows = authored ∪ generated (scripts/extract-api.mjs). Authored rows keep
 * their curated order + descriptions; generated rows fill defaults and append
 * the props the hand-authored table missed (the drift this kills). react-docgen
 * on plain JS only sees defaulted props reliably, so neither side is complete
 * alone — and 13 components (render-null utilities, class components, aliased
 * re-exports) still resolve to no definition at all. */
export function mergeApi(authored = [], generated = []) {
  if (!generated.length) return authored
  const gen = new Map(generated.map((r) => [r.prop, r]))
  const rows = authored.map((a) => {
    const g = gen.get(a.prop)
    return g ? {
      prop: a.prop,
      type: a.type && a.type !== '—' ? a.type : g.type,
      def: a.def && a.def !== '—' ? a.def : g.def,
      desc: a.desc || g.desc,
    } : a
  })
  const have = new Set(authored.map((a) => a.prop))
  for (const g of generated) if (!have.has(g.prop)) rows.push(g)
  return rows
}

/* Source-mined meta under the preview (scripts/extract-docs-meta.mjs):
 * D1 — the kol type classes the component renders text with, so system
 * conformance vs freestyle Tailwind is visible at a glance;
 * D2 — a "Composes" row linking the KOL components it nests. */
export function MetaRows({ meta, name }) {
  const composed = ((meta?.composes) || [])
    .map((n) => ({ name: n, comp: getComponentBySlug(slugify(n)) }))
  /* Provenance row (user ruling 2026-07-30): a component without a printed
   * origin is "a puzzle piece in a pile of 1000" — the source path renders on
   * every page, always. */
  const source = name ? SOURCES[name] : null
  /* Imported-from history (wave-4, 2026-07-30): origin repo + date mined from
   * the component's lobby/done spec frontmatter (scripts/extract-origins.mjs)
   * — where it came from and when it entered the DS, printed like the Source
   * row. No spec (born in-repo) → no row. */
  const origin = name ? ORIGINS[name] : null
  if (!meta?.typeClasses?.length && !composed.length && !source && !origin) return null
  return (
    <div className="flex flex-col gap-2">
      {source && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Source</span>
          <code className="kol-mono-12 text-body">{source}</code>
        </div>
      )}
      {origin && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Imported from</span>
          <code className="kol-mono-12 text-body">{origin.source}</code>
          {origin.date && <span className="kol-mono-12 text-meta">· {origin.date}</span>}
        </div>
      )}
      {meta?.typeClasses?.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Type styles</span>
          {meta.typeClasses.map((t) => (
            <code key={t} className="kol-mono-12 rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-2 py-0.5 text-body">.{t}</code>
          ))}
        </div>
      )}
      {composed.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Composes</span>
          {composed.map(({ name, comp }) => comp ? (
            <Link key={name} to={`/components/${comp.slug}`} className="kol-mono-12 text-emphasis underline decoration-fg-16 underline-offset-2 hover:decoration-current">{name}</Link>
          ) : (
            <span key={name} className="kol-mono-12 text-meta">{name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ONE code idiom (user ruling 2026-07-30): every code surface on a doc page is
 * THE CodeBlock — no bespoke pre/copy twins racing it. CodeLine renders a
 * single line through it; InstallBlock is the pm-tab row above one. */
export function CodeLine({ text, language = 'jsx' }) {
  return (
    <div className="max-w-[var(--kol-content-panel)]">
      <CodeBlock code={text} language={language} />
    </div>
  )
}

const PMS = { pnpm: 'pnpm add', npm: 'npm install', yarn: 'yarn add', bun: 'bun add' }

export function InstallBlock({ pkg }) {
  const [pm, setPm] = useState('pnpm')
  const cmd = `${PMS[pm]} ${pkg}`
  return (
    <div className="max-w-[var(--kol-content-panel)]">
      <div className="flex items-center gap-1">
        {Object.keys(PMS).map((k) => (
          <button key={k} type="button" onClick={() => setPm(k)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors ${pm === k ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}>
            {k}
          </button>
        ))}
      </div>
      <CodeBlock code={cmd} language="bash" />
    </div>
  )
}

/* Prev / next through the A→Z order (matches the sidebar within groups). */
export function Pager({ slug }) {
  const i = COMPONENTS_AZ.findIndex((x) => x.slug === slug)
  const prev = i > 0 ? COMPONENTS_AZ[i - 1] : null
  const next = i >= 0 && i < COMPONENTS_AZ.length - 1 ? COMPONENTS_AZ[i + 1] : null
  return (
    <nav className="mt-2 flex items-center justify-between gap-3 border-t border-fg-08 pt-6">
      {/* mono, not sans — nav chrome is mono-dominated (user ruling 2026-07-30) */}
      {prev ? (
        <Link to={`/components/${prev.slug}`} className="group flex flex-col gap-0.5 text-left">
          <span className="kol-mono-12 text-meta">← Prev</span>
          <span className="kol-mono-14 text-body group-hover:text-emphasis">{prev.name}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/components/${next.slug}`} className="group flex flex-col gap-0.5 text-right">
          <span className="kol-mono-12 text-meta">Next →</span>
          <span className="kol-mono-14 text-body group-hover:text-emphasis">{next.name}</span>
        </Link>
      ) : <span />}
    </nav>
  )
}
