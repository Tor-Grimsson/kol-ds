import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import CollectionPage from '../lib/CollectionPage.jsx'
import { SETS, getSet, SET_CATEGORY_LABELS } from '../lib/sets-registry.js'
import { membersOf } from '../lib/set-membership.js'

/**
 * SetPage — /sets/:slug.
 *
 * A set page LISTS ITS MEMBERS (user ruling 2026-08-01): every component the
 * set composes, in a row, each linking through to its component page. Before
 * this it delegated wholesale to CollectionPage and listed nothing at all,
 * which made a "set" indistinguishable from a single preview.
 *
 * Membership is derived from the set's own imports — see lib/set-membership.js.
 */
export default function SetPage() {
  const { slug } = useParams()
  const members = membersOf(slug)

  return (
    <CollectionPage
      slug={slug}
      items={SETS}
      getItem={getSet}
      labels={SET_CATEGORY_LABELS}
      eyebrow="KOL · Sets"
      basePath="/sets"
      previewBase="/sets/preview"
      srcDir="sets"
      allLabel="All sets"
      afterPreview={members.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="kol-doc-eyebrow">In this set ({members.length})</p>
          <div className="flex flex-wrap items-center gap-2">
            {members.map(({ name, comp }) => (
              <Link
                key={name}
                to={`/components/${comp.slug}`}
                className="kol-table-token hover:text-emphasis"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    />
  )
}
