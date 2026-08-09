import { useParams, Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import composition from '../usage/composition-index.json'
import { useGraph } from './References.jsx'

/**
 * ReferenceNode — one node's two sides.
 *
 * INBOUND is the deletion guard made visible: who breaks if this goes, and how
 * badly. OUTBOUND is the lineage: what this was built from, so altering a
 * legend can be traced down to its children.
 */

const stem = (p) => p.split('/').pop().replace(/\.\w+$/, '')

export default function ReferenceNode() {
  const { name } = useParams()
  const { nodes, threshold } = useGraph()
  const node = nodes.find((n) => n.name === name)

  if (!node) {
    return (
      <>
        <DocHeader eyebrow="Reference graph" title={name} lede="No inbound edges recorded." />
        <DocSection title="Nothing depends on this">
          <p>
            Nothing in the scanned repos derives from <code>{name}</code>. On this evidence it is
            safe to remove — the graph sees usage, not intent, so check for dynamic references
            before acting.
          </p>
          <p><Link to="/references">Back to the graph</Link></p>
        </DocSection>
      </>
    )
  }

  // Outbound: what this node's own source file derives from.
  const outbound = Object.entries(composition)
    .filter(([file]) => stem(file) === name && /(^|\/)packages\/[^/]+\/src\//.test(file))
    .flatMap(([, list]) => list)

  const byStar = node.edges.reduce((a, e) => ((a[e.stars] = (a[e.stars] || 0) + 1), a), {})
  const isCanon = node.weighted >= threshold

  return (
    <>
      <DocHeader
        eyebrow={`${node.kind} · ${node.concern}`}
        title={node.name}
        lede={`${node.weighted}★ weighted inbound across ${node.edgeCount} edges${isCanon ? ' — above the canon bar' : ''}. Defined in ${node.definedIn}.`}
      />

      <DocSection title="Deletion guard — who breaks">
        {node.edges.length ? (
          <>
            <p className="kol-helper-12">
              {[5, 4, 3, 2, 1].filter((s) => byStar[s]).map((s) => `${byStar[s]}×${s}★`).join(' · ')}
              {' — '}a 5★ dependent is a near-copy and will break; a 1★ dependent loses one element.
            </p>
            {/* THE DS Table, not a hand-rolled one. The first cut wrote its own
              * `<table className="kol-table">` inside an `overflow-x-auto` div —
              * on a page whose entire subject is "what did you reuse". It also
              * cost the cell roles: the header ran together as `★usesfile` and
              * the counts touched the paths. The Table caps itself, so the
              * wrapper div goes too. */}
            <Table
              width="column"
              caption={`Files that depend on ${node.name}, by star weight`}
              columns={[
                /* The documented cell roles carry their own padding. `-text` is
                 * the default nowrap body cell. An earlier pass here invented
                 * `kol-table-cell-copy`, which no rule defines, so those cells
                 * rendered unpadded and the counts touched the paths. */
                { accessor: 'stars', header: '★', sortable: true, className: 'kol-table-cell-text text-right' },
                /* Sentence case, like every other header in References.jsx
                 * (`Edges`, `Node`, `Kind`, `Defined in`). These two were the
                 * only lowercase headers in the repo — one page's table
                 * disagreeing with its own sibling. */
                { accessor: 'uses', header: 'Uses', sortable: true, className: 'kol-table-cell-text text-right' },
                { accessor: 'file', header: 'File', sortable: true, className: 'kol-table-cell-text' },
              ]}
              rows={node.edges.map((e) => ({ id: e.file, stars: e.stars, uses: e.uses, file: e.file }))}
            />
            {node.edgeCount > node.edges.length && (
              <p className="kol-helper-12 mt-4">
                Showing {node.edges.length} of {node.edgeCount} edges — the index caps the list.
              </p>
            )}
          </>
        ) : (
          <p>No recorded dependents.</p>
        )}
      </DocSection>

      <DocSection title="Lineage — what this was built from">
        {outbound.length ? (
          <ul>
            {outbound.map((e) => (
              <li key={e.target} className="kol-mono-12">
                {e.stars}★{' '}
                <Link to={`/references/${encodeURIComponent(e.target)}`}>{e.target}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            Nothing recorded. Either it derives from nothing, or it composes through children —
            a component that takes others as <code>children</code> imports nothing, so the
            extractor cannot see the edge.
          </p>
        )}
      </DocSection>

      <p><Link to="/references">Back to the graph</Link></p>
    </>
  )
}
