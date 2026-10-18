import { useMemo } from 'react'
import { DocSection } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import { Link } from 'react-router-dom'
import { ContentFilters, Table, Button, Tooltip } from '@kolkrabbi/kol-component'
import { NodeLabel, NodePreview, kindLabel } from '../lib/NodeLabel.jsx'
import usageIndex from '../usage/usage-index.json'
import tokenIndex from '../usage/token-index.json'
import { KIND_SLICES, concernsOf, concernLabel, countOf, sliceHref } from '../lib/referenceTree.js'

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
 *
 * Chrome is borrowed, not built: ContentFilters owns the filter groups, the
 * name search and the count; Table owns the grid. The previous version
 * hand-rolled a chip row and a bare <table>, and the result was a header that
 * read `edgesnode` with every cell in the same weight.
 */


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

/* Columns, in scan order: the number that ranks the row, then what it IS, then
 * where it comes from. Numeric columns are right-aligned and carry the ink;
 * the provenance columns are deliberately light so the eye lands on the name. */
export function graphColumns(threshold) {
  return [
    {
      accessor: 'weighted',
      header: '★',
      sortable: true,
      headerClassName: 'kol-table-cell-title text-right',
      className: 'kol-table-cell-text text-right',
      render: (n) => (
        <span className="kol-mono-12 text-emphasis font-medium">
          {n.weighted}
          {/* the DS tooltip, never a native title (3.2, 2026-10-17) */}
          {n.weighted >= threshold && <Tooltip label="Canon candidate" asChild><span className="text-fg-32"> ●</span></Tooltip>}
        </span>
      ),
    },
    {
      accessor: 'edgeCount',
      header: 'Edges',
      sortable: true,
      headerClassName: 'kol-table-cell-title text-right',
      className: 'kol-table-cell-text text-right',
      render: (n) => <span className="kol-mono-12 text-meta">{n.edgeCount}</span>,
    },
    {
      accessor: 'name',
      header: 'Node',
      sortable: true,
      render: (n) => <NodeLabel name={n.name} kind={n.kind} to={`/references/${encodeURIComponent(n.name)}`} />,
    },
    {
      accessor: 'preview',
      header: '',
      className: 'kol-table-cell-text',
      render: (n) => <NodePreview name={n.name} kind={n.kind} concern={n.concern} />,
    },
    /* PILLS IN CELLS, read off chess.kolkrabbi.io's own DOM 2026-08-01: a
     * categorical cell wears `.kol-table-pill` (+ -dark/-light/-muted), never
     * bare text. Those classes have existed in the theme the whole time and
     * this repo had never used one — the reference site was using our own
     * design system better than we were. */
    {
      accessor: 'kind',
      header: 'Kind',
      sortable: true,
      className: 'kol-table-cell-text',
      render: (n) => (
        <span className={`kol-table-pill ${n.kind === 'component' ? 'kol-table-pill-dark' : 'kol-table-pill-muted'}`}>
          {kindLabel(n.kind)}
        </span>
      ),
    },
    {
      accessor: 'concern',
      header: 'Concern',
      sortable: true,
      className: 'kol-table-cell-text',
      render: (n) => <span className="kol-table-pill kol-table-pill-light">{n.concern}</span>,
    },
    /* responsive columns, the same idiom chess uses — provenance is the first
     * thing to go when the viewport tightens */
    {
      accessor: 'definedIn',
      header: 'Defined in',
      sortable: true,
      headerClassName: 'kol-table-cell-title hidden lg:table-cell',
      className: 'kol-table-cell-meta hidden lg:table-cell',
      render: (n) => <span className="kol-helper-12 text-meta">{n.definedIn}</span>,
    },
    /* per-row ACTIONS — chess's `analysis-table__actions` cell, in DS terms */
    {
      accessor: 'actions',
      header: '',
      headerClassName: 'kol-table-cell-title text-right',
      className: 'kol-table-cell-text text-right',
      render: (n) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            tone="ghost"
            onClick={() => navigator.clipboard?.writeText(n.name)}
          >
            Copy
          </Button>
          <Link to={`/references/${encodeURIComponent(n.name)}`} className="kol-mono-12 text-meta hover:text-emphasis">
            Trace →
          </Link>
        </div>
      ),
    },
  ]
}

/* The ranked table every slice page shows: search by name, the top 300, the rest behind the search. */
export function NodeTable({ nodes, threshold, title = 'Nodes', caption, limit = 300, search = true }) {
  const columns = useMemo(() => graphColumns(threshold), [threshold])
  const table = (rows) => (
    <>
      {/* A DATA table declares its own width — seven columns need the
        * content column, not the panel rung meant for two. */}
      <Table width="column" caption={caption} columns={columns} rows={rows.slice(0, limit).map((n) => ({ ...n, id: `${n.kind}:${n.name}` }))} />
      {rows.length > limit && <p className="kol-helper-12 text-meta mt-4">Showing the top {limit} of {rows.length}. Narrow with the search.</p>}
    </>
  )
  if (!search) return table(nodes)
  return <ContentFilters items={nodes} title={title} titleIcon="library" totalCount={nodes.length} searchKeys={['name', 'definedIn']} renderItem={table} />
}

export default function References() {
  const { nodes, median, threshold } = useGraph()
  const canon = nodes.filter((n) => n.weighted >= threshold).length

  return (
    <>
      {/* the home (2026-10-01 — user: "in development neither references or quarantine have
        * homes"); the live counts follow it */}
      <HomeDoc id="references" />
      <p className="kol-doc-lede mt-6">{`${nodes.length} referenced nodes. ${canon} nodes sit at or above the canon bar of ${threshold}★ (3× the median of ${median}).`}</p>

      {/* A HOME, NOT A DUMP (2026-10-17): the 721 nodes are read by slice on their own pages; the home
        * shows what tops the whole graph and where each slice lives */}
      <div className="mt-8 flex flex-col gap-8">
        <DocSection id="top-10" title="Top 10">
          <NodeTable nodes={nodes.slice(0, 10)} threshold={threshold} caption="The ten most-referenced nodes across every kind" search={false} />
        </DocSection>
        <DocSection id="slices" title="Slices">
          <ul className="flex flex-col gap-3">
            {KIND_SLICES.map(({ kind, slug, label }) => (
              <li key={slug} className="flex flex-col gap-1">
                <Link to={sliceHref(slug)} className="kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64">{label}</Link>
                <span className="kol-helper-12 text-meta">
                  {countOf(kind)} nodes{concernsOf(kind).length ? ' · ' : ''}
                  {concernsOf(kind).map(({ concern, count }, i) => (
                    <span key={concern}>{i ? ' · ' : ''}<Link to={sliceHref(slug, concern)} className="hover:text-emphasis">{concernLabel(concern)} {count}</Link></span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </DocSection>
      <DocSection id="how-to-read-this" title="How to read this">
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
      </div>
    </>
  )
}
