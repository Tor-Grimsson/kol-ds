import CollectionLanding from '../lib/CollectionLanding.jsx'
import {
  SETS, SET_CATEGORIES, SET_CATEGORY_LABELS, FEATURED_SETS,
} from '../lib/sets-registry.js'

/**
 * Sets — full-apparatus compositions (a whole board, a whole dashboard):
 * an app-like thing you drop in whole. Same landing machine as /blocks
 * (CollectionLanding), different data.
 */
export default function Sets() {
  return (
    <CollectionLanding
      items={SETS}
      categories={SET_CATEGORIES}
      labels={SET_CATEGORY_LABELS}
      featured={FEATURED_SETS}
      basePath="/sets"
      previewBase="/sets/preview"
      srcDir="sets"
      hero={{
        pill: `${SETS.length} set${SETS.length === 1 ? '' : 's'}`,
        title: 'Full-apparatus sets for KOL tools.',
        lede: 'Whole compositions — a board, a dashboard — assembled from the published packages. Bigger than a block: copy the set, keep the wiring.',
        browseLabel: 'Browse all sets',
        secondary: { label: 'View blocks', to: '/blocks' },
      }}
    />
  )
}
