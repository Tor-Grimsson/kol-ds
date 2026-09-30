import { useParams } from 'react-router-dom'
import CollectionPage from '../lib/CollectionPage.jsx'
import { CARDS, getCard, CARD_LABELS } from '../lib/cards-registry.js'

/** CardPage — /cards/:slug, the dedicated page for one website card. */
export default function CardPage() {
  const { slug } = useParams()
  return (
    <CollectionPage
      slug={slug}
      items={CARDS}
      getItem={getCard}
      labels={CARD_LABELS}
      eyebrow="KOL · Cards"
      basePath="/cards"
      previewBase="/cards/preview"
      srcDir="cards"
      allLabel="All cards"
    />
  )
}
