import { useParams } from 'react-router-dom'
import CollectionPage from '../lib/CollectionPage.jsx'
import { SETS, getSet, SET_CATEGORY_LABELS } from '../lib/sets-registry.js'

/** SetPage — /sets/:slug, the dedicated page for one set. */
export default function SetPage() {
  const { slug } = useParams()
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
    />
  )
}
