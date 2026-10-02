import CollectionLanding from '../lib/CollectionLanding.jsx'
import {
  SETS, SET_CATEGORIES, SET_CATEGORY_LABELS, FEATURED_SETS,
} from '../lib/sets-registry.js'

/**
 * Sets — full-apparatus compositions (a whole board, a whole dashboard):
 * an app-like thing you drop in whole. Same landing machine as /blocks
 * (CollectionLanding), different data.
 */
/* The package families left for the package pages (2026-09-30, the library taxonomy) — a set
 * that is only one package's components is that package's page. */
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
      home="sets"
      wall
      hero={{
        eyebrow: `Sets · ${SETS.length}`,
        title: 'Sets',
        lede: 'Whole compositions — a board, a dashboard — assembled from the published packages. Bigger than a module: copy the set, keep the wiring.',
        browseLabel: 'Browse all sets',
      }}
    />
  )
}
