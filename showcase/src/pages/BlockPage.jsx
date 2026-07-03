import { useParams } from 'react-router-dom'
import CollectionPage from '../lib/CollectionPage.jsx'
import { BLOCKS, getBlock, CATEGORY_LABELS } from '../lib/blocks-registry.js'

/** BlockPage — /blocks/:slug, the dedicated page for one block. */
export default function BlockPage() {
  const { slug } = useParams()
  return (
    <CollectionPage
      slug={slug}
      items={BLOCKS}
      getItem={getBlock}
      labels={CATEGORY_LABELS}
      eyebrow="KOL · Blocks"
      basePath="/blocks"
      previewBase="/blocks/preview"
      srcDir="blocks"
      allLabel="All blocks"
    />
  )
}
