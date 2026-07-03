import { useParams } from 'react-router-dom'
import CollectionPreview from '../lib/CollectionPreview.jsx'
import { getBlock } from '../lib/blocks-registry.js'

/** BlockPreview — /blocks/preview/:slug, the bare product view (iframe src +
 *  open-standalone target). */
export default function BlockPreview() {
  const { slug } = useParams()
  return <CollectionPreview slug={slug} getItem={getBlock} />
}
