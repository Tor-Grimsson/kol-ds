import { useNavigate } from 'react-router-dom'
import { ContentCard, ContentCollection } from '@kolkrabbi/kol-component'
import PageHero from './PageHero.jsx'

/**
 * CategoryPage — A category's overview, from the nav tree. the FOLDERNOTE: the page a rail category opens
 * on — its label and lede over its pages as cards — read from the same tree the rail reads, so nothing is
 * listed by hand and a page added to the rail is on the overview the same moment (site-hub W4, user
 * 2026-10-24: kol-branding's three categories each hand-wrote this page).
 *
 * The tree is `SideNav`'s: `{ id, label, icon, lede?, pages: [{ to, label, card? }] }`. A page with a `card`
 * is on the overview — `{ eyebrow, body, media, meta }`, the article card's fields (`media` a node or an
 * image src); a page without one (the overview's own row, a plain link) is not. The card opens its page.
 *
 * @param {Array}  navTree   the sidenav's tree
 * @param {string} id        the category's id
 * @param {string} [min]     the collection's column minimum (ContentCollection `min`, default 280px)
 * @param {string} [ratio]   the card media's ratio (default 16 / 9)
 */
export default function CategoryPage({ navTree = [], id, min = '280px', ratio = '16 / 9' }) {
  const navigate = useNavigate()
  const cat = navTree.find((c) => c.id === id)
  if (!cat) return null
  const pages = (cat.pages ?? []).filter((p) => p.card)
  return (
    <div className="kol-page flex flex-col gap-10">
      <PageHero label={cat.eyebrow} title={cat.label} lede={cat.lede} />
      <ContentCollection min={min}>
        {pages.map((p) => (
          <ContentCard
            key={p.to}
            variant="article"
            ratio={ratio}
            media={typeof p.card.media === 'string' ? <img src={p.card.media} alt="" className="size-full object-cover" /> : p.card.media}
            eyebrow={p.card.eyebrow}
            title={p.label}
            body={p.card.body}
            date={p.card.meta}
            onClick={() => navigate(p.to)}
          />
        ))}
      </ContentCollection>
    </div>
  )
}
