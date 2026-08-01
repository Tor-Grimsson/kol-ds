import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { Table, SearchInput } from '@kolkrabbi/kol-component'
import { matchSearchItems } from '@kolkrabbi/kol-workshop/engine'
import { buildShellSearchItems } from '../nav/shell-nav.js'
import { NodePreview } from '../lib/NodeLabel.jsx'
import { useGraph } from './References.jsx'

/**
 * SearchResults — the ⌘K overlay's results, as a page you can sit on.
 *
 * Same items, same matcher, no second index: `buildShellSearchItems()` is the
 * overlay's own source and `matchSearchItems` is the pure predicate already
 * extracted out of it into the workshop engine. A page that re-implemented
 * either would drift from the modal within a week.
 *
 * It adds what a modal cannot afford: the reference graph's nodes as a second
 * result family, a conditional per-hit preview, and room to read the reason a
 * row matched (`matchedHeading` / `matchedKeyword`).
 *
 * The query lives in the URL (`/search?q=…`), so a result set is a link.
 */

const SURFACE_KIND = 'surface'

export default function SearchResults() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const { nodes } = useGraph()

  const items = useMemo(() => {
    /* Two families, one row shape. Surfaces carry an href; graph nodes carry a
     * kind/concern pair the preview column can read. */
    const surfaces = buildShellSearchItems().map((i) => ({ ...i, kind: SURFACE_KIND }))
    const graph = nodes.map((n) => ({
      id: `node:${n.kind}:${n.name}`,
      label: n.name,
      href: `/references/${encodeURIComponent(n.name)}`,
      sectionLabel: 'Reference graph',
      keywords: [n.definedIn, n.concern].filter(Boolean),
      kind: n.kind,
      concern: n.concern,
      weighted: n.weighted,
    }))
    return [...surfaces, ...graph]
  }, [nodes])

  const hits = useMemo(() => matchSearchItems(items, query), [items, query])

  const sections = useMemo(() => {
    const groups = new Map()
    for (const h of hits) {
      if (!groups.has(h.sectionLabel)) groups.set(h.sectionLabel, [])
      groups.get(h.sectionLabel).push(h)
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [hits])

  const columns = useMemo(() => [
    {
      accessor: 'label',
      header: 'Result',
      render: (r) => (
        <Link to={r.href} className="kol-mono-12 text-emphasis font-medium">{r.label}</Link>
      ),
    },
    {
      accessor: 'preview',
      header: '',
      className: 'kol-table-cell-text',
      render: (r) => <NodePreview name={r.label} kind={r.kind} concern={r.concern} />,
    },
    {
      accessor: 'why',
      header: 'Matched on',
      className: 'kol-table-cell-meta',
      render: (r) => (
        <span className="kol-helper-12 text-meta">
          {r.matchedHeading ? `heading · ${r.matchedHeading}`
            : r.matchedKeyword ? `keyword · ${r.matchedKeyword}`
            : 'name'}
        </span>
      ),
    },
    {
      accessor: 'href',
      header: 'Path',
      className: 'kol-table-cell-meta',
      render: (r) => <span className="kol-helper-12 text-meta">{r.href}</span>,
    },
  ], [])

  return (
    <>
      <DocHeader
        eyebrow="Search"
        title="Everything, findable."
        lede={`${items.length} indexed rows — every surface, component, vault doc and reference-graph node. The ⌘K overlay searches this exact list; this page is the same results with room to read them.`}
      />

      <DocSection title="Query">
        <SearchInput
          value={query}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
          placeholder="Search components, tokens, docs, surfaces…"
          className="w-full"
        />
      </DocSection>

      {!query && (
        <DocSection title="Nothing typed yet">
          <p className="kol-helper-12 text-meta">
            Type above, or press ⌘K anywhere to open the same search as a modal.
          </p>
        </DocSection>
      )}

      {query && hits.length === 0 && (
        <DocSection title="No matches">
          <p className="kol-helper-12 text-meta">Nothing matches “{query}”.</p>
        </DocSection>
      )}

      {sections.map(([section, rows]) => (
        <DocSection key={section} title={`${section} (${rows.length})`}>
          <Table
            variant="simple"
            caption={`${section} results for ${query}`}
            columns={columns}
            rows={rows.slice(0, 50)}
          />
          {rows.length > 50 && (
            <p className="kol-helper-12 text-meta mt-4">
              Showing 50 of {rows.length}. Narrow the query.
            </p>
          )}
        </DocSection>
      ))}
    </>
  )
}
