import CollectionLanding from '../lib/CollectionLanding.jsx'
import { CARDS, CARD_CATEGORIES, CARD_LABELS, FEATURED_CARDS } from '../lib/cards-registry.js'

/** Cards — the website cards' landing: the shared CollectionLanding machine over `src/cards/`. */
export default function Cards() {
  return (
    <CollectionLanding
      items={CARDS}
      categories={CARD_CATEGORIES}
      labels={CARD_LABELS}
      featured={FEATURED_CARDS}
      basePath="/cards"
      previewBase="/cards/preview"
      srcDir="cards"
      home="cards"
      hero={{
        eyebrow: `Cards · ${CARDS.length}`,
        title: 'Cards',
        lede: 'The sections a website is built from.',
        browseLabel: 'Browse all cards',
      }}
    />
  )
}
