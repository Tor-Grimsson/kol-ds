import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import usageIndex from '../usage/usage-index.json'
import tokenIndex from '../usage/token-index.json'

/**
 * References — the reference graph, rendered.
 *
 * Every node the design system can point at, ranked by WEIGHTED inbound rather
 * than a raw count: five 1★ dependents are not one 5★ dependent, and a bare
 * count cannot tell the difference between a near-copy that breaks and a page
 * that loses one element.
 *
 * Generated, never authored — the two index files are emitted by
 * `pnpm extract:usage` and `pnpm extract:tokens`. Two hand-maintained sources
 * always drift, which is how `.text-fg-*` and `--kol-fg-*` became duplicates.
 *
 * The canon bar is 3x the median, not a constant: Law 3 (high reference =
 * canon) fires on arithmetic, and the bar moves with the repo instead of
 * ageing into a lie.
 */

const CONCERNS = ['all', 'color', 'type', 'layout', 'nav', 'chrome', 'component', 'breakpoint']

export function useGraph() {
  return useMemo(() => {
    const nodes = [
      ...usageIndex.map((e) => ({
        name: e.name,
        kind: 'component',
        concern: 'component',
        weighted: (e.weighted || 0) + (e.internal || 0),
        edgeCount: e.edgeCount || 0,
        apps: e.apps?.length || 0,
        definedIn: e.pkg,
        edges: e.edges || [],
      })),
      ...tokenIndex.map((e) => ({
        name: e.name,
        kind: e.kind,
        concern: e.concern,
        weighted: e.weighted || 0,
        edgeCount: e.edgeCount || 0,
        apps: e.apps?.length || 0,
        definedIn: e.definedIn,
        edges: e.edges || [],
      })),
    ].filter((n) => n.weighted > 0)
      .sort((a, b) => b.weighted - a.weighted)

    const weights = nodes.map((n) => n.weighted).sort((a, b) => a - b)
    const median = weights.length ? weights[Math.floor(weights.length / 2)] : 0
    return { nodes, median, threshold: Math.max(median * 3, 2) }
  }, [])
}

export default function References() {
  const { nodes, median, threshold } = useGraph()
  const [concern, setConcern] = useState('all')
  const [query, setQuery] = useState('')

  const shown = nodes.filter((n) =>
    (concern === 'all' || n.concern === concern) &&
    (!query || n.name.toLowerCase().includes(query.toLowerCase())))

  const canon = nodes.filter((n) => n.weighted >= threshold).length

  return (
    <>
      <DocHeader
        eyebrow="Reference graph"
        title="What depends on what."
        lede={`${nodes.length} referenced nodes. Ranked by weighted inbound — a 5★ dependent is a near-copy and breaks if the node goes; a 1★ dependent loses one element. ${canon} nodes sit at or above the canon bar of ${threshold}★ (3× the median of ${median}).`}
      />

      <DocSection title="Filter">
        <div className="flex flex-wrap items-center gap-2">
          {CONCERNS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setConcern(c)}
              className={`kol-btn kol-btn-sm ${c === concern ? 'kol-btn-primary' : 'kol-btn-outline'}`}
            >
              {c}
            </button>
          ))}
          <input
            className="kol-input ml-auto"
            placeholder="Filter by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </DocSection>

      <DocSection title={`${shown.length} nodes`}>
        <div className="overflow-x-auto">
          <table className="kol-table w-full">
            <thead>
              <tr>
                <th className="text-right">★</th>
                <th className="text-right">edges</th>
                <th>node</th>
                <th>concern</th>
                <th>defined in</th>
              </tr>
            </thead>
            <tbody>
              {shown.slice(0, 300).map((n) => (
                <tr key={`${n.kind}:${n.name}`}>
                  <td className="text-right kol-mono-12">
                    {n.weighted}
                    {n.weighted >= threshold && <span title="canon candidate"> ●</span>}
                  </td>
                  <td className="text-right kol-mono-12">{n.edgeCount}</td>
                  <td>
                    <Link to={`/references/${encodeURIComponent(n.name)}`} className="kol-mono-12">
                      {n.name}
                    </Link>
                  </td>
                  <td className="kol-helper-12">{n.concern}</td>
                  <td className="kol-helper-12">{n.definedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shown.length > 300 && (
          <p className="kol-helper-12 mt-4">Showing the top 300 of {shown.length}. Narrow with the filter.</p>
        )}
      </DocSection>

      <DocSection title="How to read this">
        <p>
          An edge exists only if changing or deleting the node would change or break the
          dependent. That is derivation, not co-occurrence: two swatches on one ramp never
          reference each other, so they never edge to each other — but both edge to the ramp
          that defines them, which is the real parent.
        </p>
        <p>
          Stars are <strong>computed</strong>, never declared. A component page may override a
          value in its <code>reuses:</code> frontmatter; the disagreement is then reported by{' '}
          <code>pnpm validate:frontmatter</code> rather than silently accepted.
        </p>
      </DocSection>
    </>
  )
}
