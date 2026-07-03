import { useParams } from 'react-router-dom'
import CollectionPreview from '../lib/CollectionPreview.jsx'
import { getSet } from '../lib/sets-registry.js'

/** SetPreview — /sets/preview/:slug, the bare product view (iframe src +
 *  open-standalone target). */
export default function SetPreview() {
  const { slug } = useParams()
  return <CollectionPreview slug={slug} getItem={getSet} />
}
