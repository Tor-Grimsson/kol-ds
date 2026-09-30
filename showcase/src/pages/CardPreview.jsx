import { useParams } from 'react-router-dom'
import CollectionPreview from '../lib/CollectionPreview.jsx'
import { getCard } from '../lib/cards-registry.js'

/** CardPreview — /cards/preview/:slug, the bare view (iframe src + open-standalone target). */
export default function CardPreview() {
  const { slug } = useParams()
  return <CollectionPreview slug={slug} getItem={getCard} />
}
