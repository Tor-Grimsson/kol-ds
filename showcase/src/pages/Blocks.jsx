import { useParams } from 'react-router-dom'
import CollectionLanding from '../lib/CollectionLanding.jsx'
import {
  BLOCKS, BLOCK_CATEGORIES, CATEGORY_LABELS, FEATURED_BLOCKS,
} from '../lib/blocks-registry.js'

/**
 * Blocks — UI compositions (sidenavs, panels, forms, toolbars…): bigger than a
 * component, smaller than a page. The landing is the shared CollectionLanding
 * machine; full-apparatus compositions live on /sets, same machine.
 */
export default function Blocks() {
  /* a category's home (`/blocks/category/:cat`, 2026-09-30) — its markdown over its own items */
  const { cat } = useParams()
  const list = cat ? BLOCKS.filter((x) => x.category === cat) : BLOCKS
  return (
    <CollectionLanding
      items={list}
      categories={cat ? [cat] : BLOCK_CATEGORIES}
      labels={CATEGORY_LABELS}
      featured={cat ? list.filter((x) => x.featured) : FEATURED_BLOCKS}
      basePath="/modules"
      previewBase="/modules/preview"
      srcDir="blocks"
      key={cat ?? 'all'}
      home={cat ? `block-${cat}` : 'blocks'}
      hero={{
        eyebrow: `Modules · ${BLOCKS.length}`,
        title: 'Modules',
        lede: 'Composed sections built from the published packages — bigger than a component, smaller than a page. Copy the source, keep the wiring.',
        browseLabel: 'Browse all modules',
      }}
    />
  )
}
