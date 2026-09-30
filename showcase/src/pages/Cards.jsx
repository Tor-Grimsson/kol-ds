import { useParams } from 'react-router-dom'
import CollectionLanding from '../lib/CollectionLanding.jsx'
import { CARDS, CARD_CATEGORIES, CARD_LABELS, FEATURED_CARDS } from '../lib/cards-registry.js'

/** Cards — the website cards' landing: the shared CollectionLanding machine over `src/cards/`. */
export default function Cards() {
  /* a category's home (`/cards/category/:cat`, 2026-09-30) — its markdown over its own items */
  const { cat } = useParams()
  const list = cat ? CARDS.filter((x) => x.category === cat) : CARDS
  return (
    <CollectionLanding
      items={list}
      categories={cat ? [cat] : CARD_CATEGORIES}
      labels={CARD_LABELS}
      featured={cat ? list.filter((x) => x.featured) : FEATURED_CARDS}
      basePath="/cards"
      previewBase="/cards/preview"
      srcDir="cards"
      key={cat ?? 'all'}
      home={cat ? `card-${cat}` : 'cards'}
      hero={{
        eyebrow: `Cards · ${CARDS.length}`,
        title: 'Cards',
        lede: 'The sections a website is built from.',
        browseLabel: 'Browse all cards',
      }}
    />
  )
}
