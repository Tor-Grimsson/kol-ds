import { useMemo } from 'react'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { Link } from 'react-router-dom'
import { ContentFilters, Table, Button } from '@kolkrabbi/kol-component'
import { NodeLabel, NodePreview, kindLabel } from '../lib/NodeLabel.jsx'
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
 *
 * Chrome is borrowed, not built: ContentFilters owns the filter groups, the
 * name search and the count; Table owns the grid. The previous version
 * hand-rolled a chip row and a bare <table>, and the result was a header that
 * read `edgesnode` with every cell in the same weight.
 */

const CONCERNS = ['color', 'type', 'layout', 'nav', 'chrome', 'component', 'breakpoint']
const KINDS = ['component', 'token', 'class']

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
function graphColumns(threshold) {
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
          {n.weighted >= threshold && <span title="canon candidate" className="text-fg-32"> ●</span>}
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
            variant="ghost"
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

export default function References() {
  const { nodes, median, threshold } = useGraph()
  const canon = nodes.filter((n) => n.weighted >= threshold).length
  const columns = useMemo(() => graphColumns(threshold), [threshold])

  return (
    <>
      <DocHeader
        eyebrow="Reference graph"
        title="What depends on what."
        lede={`${nodes.length} referenced nodes. Ranked by weighted inbound — a 5★ dependent is a near-copy and breaks if the node goes; a 1★ dependent loses one element. ${canon} nodes sit at or above the canon bar of ${threshold}★ (3× the median of ${median}).`}
      />

      {/* mt-8: DocHeader's lede butted straight onto the filter row with no
        * breathing space at all — the header ends, the control bar begins. */}
      <ContentFilters
        className="mt-8"
        items={nodes}
        title="Nodes"
        titleIcon="library"
        totalCount={nodes.length}
        searchKeys={['name', 'definedIn']}
        mutuallyExclusiveFilters={['kind', 'concern']}
        filterGroups={[
          { label: 'Kind', key: 'kind', values: KINDS },
          { label: 'Concern', key: 'concern', values: CONCERNS },
        ]}
        renderItem={(rows) => (
          <>
            {/* A DATA table declares its own width — seven columns need the
              * content column, not the panel rung meant for two. */}
            <Table
              width="column"
              caption="Reference graph nodes ranked by weighted inbound"
              columns={columns}
              rows={rows.slice(0, 300).map((n) => ({ ...n, id: `${n.kind}:${n.name}` }))}
            />
            {rows.length > 300 && (
              <p className="kol-helper-12 text-meta mt-4">
                Showing the top 300 of {rows.length}. Narrow with the filter.
              </p>
            )}
          </>
        )}
      />

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
