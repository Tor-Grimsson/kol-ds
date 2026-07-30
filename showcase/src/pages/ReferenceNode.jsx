import { useParams, Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
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
            <div className="overflow-x-auto">
              <table className="kol-table w-full">
                <thead>
                  <tr><th className="text-right">★</th><th className="text-right">uses</th><th>file</th></tr>
                </thead>
                <tbody>
                  {node.edges.map((e) => (
                    <tr key={e.file}>
                      <td className="text-right kol-mono-12">{e.stars}</td>
                      <td className="text-right kol-mono-12">{e.uses}</td>
                      <td className="kol-mono-12">{e.file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
