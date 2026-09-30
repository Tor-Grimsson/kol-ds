import { Link } from 'react-router-dom'
import { DocSection } from '@kolkrabbi/kol-workshop'
import CollectionLanding from '../lib/CollectionLanding.jsx'
import { TOP_LEVEL, PACKAGE_ORDER, packageLabel } from '../nav/registry.js'
import { familyHref } from '../lib/sets-registry.js'
import {
  SETS, SET_CATEGORIES, SET_CATEGORY_LABELS, FEATURED_SETS,
} from '../lib/sets-registry.js'

/**
 * Sets — full-apparatus compositions (a whole board, a whole dashboard):
 * an app-like thing you drop in whole. Same landing machine as /blocks
 * (CollectionLanding), different data.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/* The families — one set per package (2026-09-30). The composed sets follow in the tabs below. */
function Families() {
  const families = PACKAGE_ORDER.filter((dir) => TOP_LEVEL.some((c) => c.family === dir))
  return (
    <DocSection id="families" title="Families">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {families.map((dir) => (
          <li key={dir} className="kol-doc-body">
            <Link className={linkCls} to={familyHref(dir)}>{packageLabel(dir)}</Link>
            <span className="text-subtle"> · {TOP_LEVEL.filter((c) => c.family === dir).length}</span>
          </li>
        ))}
      </ul>
    </DocSection>
  )
}

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
      intro={<Families />}
      hero={{
        eyebrow: `Sets · ${SETS.length}`,
        title: 'Sets',
        lede: 'Whole compositions — a board, a dashboard — assembled from the published packages. Bigger than a block: copy the set, keep the wiring.',
        browseLabel: 'Browse all sets',
      }}
    />
  )
}
