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
  return (
    <CollectionLanding
      items={BLOCKS}
      categories={BLOCK_CATEGORIES}
      labels={CATEGORY_LABELS}
      featured={FEATURED_BLOCKS}
      basePath="/blocks"
      previewBase="/blocks/preview"
      srcDir="blocks"
      hero={{
        pill: `${BLOCKS.length} building blocks`,
        title: 'Building blocks for KOL tools.',
        lede: 'Composed sections built from the published packages — bigger than a component, smaller than a page. Copy the source, keep the wiring.',
        browseLabel: 'Browse all blocks',
        secondary: { label: 'View sets', to: '/sets' },
      }}
    />
  )
}
