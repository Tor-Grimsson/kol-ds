import { Link } from 'react-router-dom'

/**
 * CompositionDiagram — THE way the showcase draws what nests in what (2026-09-30, open questions
 * Round 1 Q5, the user: *"yes this looks good, yes this style should be documented as a way of
 * visual communications"*). The LOOK is Docs › Shell & Layout's, the drawing he pointed at: a
 * container is a solid box with its label in emphasis; a leaf is a dashed box with its label in
 * meta. That page now draws through this component, so there is one idiom, not two.
 *
 *   <CompositionDiagram node={{ label, to?, note?, row?, fixed?, children: [...] }} />
 *
 * `row` lays a node's children side by side (they share the width unless one is `fixed`, which
 * keeps its own 7rem); `note` is a line under a container's children; `to` makes the label a link.
 */
const Label = ({ node, className }) => (node.to
  ? <Link to={node.to} className={`${className} underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64`}>{node.label}</Link>
  : <p className={className}>{node.label}</p>)

function Node({ node, inRow }) {
  const kids = node.children ?? []
  const size = inRow ? (node.fixed ? 'w-28 shrink-0' : 'flex-1') : ''
  if (!kids.length) {
    return (
      <div className={`rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 px-3 ${inRow ? 'py-4' : 'py-1.5'} ${size}`}>
        <Label node={node} className="kol-mono-12 text-meta" />
      </div>
    )
  }
  return (
    <div className={`rounded-[var(--kol-radius-sm)] border border-fg-16 p-3 ${size}`}>
      <Label node={node} className="kol-mono-12 text-emphasis mb-2" />
      <div className={node.row ? 'flex gap-2' : 'flex flex-col gap-2'}>
        {kids.map((k) => <Node key={k.label} node={k} inRow={node.row} />)}
      </div>
      {node.note && <p className="kol-mono-12 text-meta mt-2">{node.note}</p>}
    </div>
  )
}

export default function CompositionDiagram({ node, className = '' }) {
  return <div className={className}><Node node={node} /></div>
}
