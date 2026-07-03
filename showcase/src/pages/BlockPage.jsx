import { useParams, Link } from 'react-router-dom'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader from '../lib/DocHeader.jsx'
import BlockViewer from '../lib/BlockViewer.jsx'
import { getBlock, BLOCKS, CATEGORY_LABELS } from '../lib/blocks-registry.js'

/**
 * BlockPage — the dedicated page for ONE block at /blocks/:slug (the
 * components-slug model): docs chrome + header + the full BlockViewer stage +
 * prev/next pager. /blocks/preview/:slug stays the bare product render.
 */
export default function BlockPage() {
  const { slug } = useParams()
  const entry = getBlock(slug)

  if (!entry) {
    return (
      <DocLayout>
        <DocHeader eyebrow="KOL · Blocks" title="Not found" lede={`No block named “${slug}”.`} />
        <Link to="/blocks" className="kol-mono-13 text-meta hover:text-emphasis transition-colors">← All blocks</Link>
      </DocLayout>
    )
  }

  const i = BLOCKS.findIndex((b) => b.key === entry.key)
  const prev = BLOCKS[i - 1]
  const next = BLOCKS[i + 1]

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow={`KOL · Blocks · ${CATEGORY_LABELS[entry.category] ?? entry.category}`}
        title={entry.title}
        lede={entry.description}
      />
      <BlockViewer entry={entry} />
      <div className="flex items-center justify-between border-t border-fg-08 pt-6">
        {prev ? (
          <Link to={`/blocks/${prev.key}`} className="kol-mono-12 text-meta hover:text-emphasis transition-colors">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link to={`/blocks/${next.key}`} className="kol-mono-12 text-meta hover:text-emphasis transition-colors">{next.title} →</Link>
        ) : <span />}
      </div>
    </DocLayout>
  )
}
