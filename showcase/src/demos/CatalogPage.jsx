import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { CatalogPage } from '@kolkrabbi/kol-shell'

export const stage = 'full'
/* `catalog` = the app tier's Home / Library page · `shelf` = the whole deck page as one word (preset) */
export const variants = ['catalog', 'shelf']

const IMG = (h) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850"><rect width="600" height="850" fill="hsl(${h} 25% 50%)"/></svg>`)
const RECENT = [
  { name: 'editor', title: 'Editor', detail: 'frames, layers, vector tools — the compositor', img: IMG(20) },
  { name: 'labs', title: 'Labs', detail: 'generative and kinetic type', img: IMG(200) },
  { name: 'randomiser', title: 'Randomiser', detail: 'seeded variations', img: IMG(320) },
]
const SAVED = [{ name: 'p1', title: 'Poster 04', detail: '3 layers · 1:1 · 12 Aug 2026' }]
const VIEWS = [{ value: 'recent', label: 'RECENT' }, { value: 'saved', label: 'SAVED' }]
const COVER = (h) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="hsl(${h} 30% 45%)"/></svg>`)
const DECKS = [
  { slug: 'runway', name: 'Runway 26', detail: 'Spring show — 32 slides on the runway template.', updated: '2026-09-01', bytes: 18400000, slides: 32, cover: COVER(210) },
  { slug: 'press', name: 'Press kit', detail: 'The press deck, sent with the lookbook.', updated: '2026-08-14', bytes: 6200000, slides: 12, cover: COVER(30) },
  { slug: 'brand', name: 'Brand book', detail: 'The identity guidelines as a deck.', updated: '2026-07-30', bytes: 41000000, slides: 58, cover: COVER(120) },
]

/* the app tier's Home / Library page: PageHeader → ContentFilters → the catalog
 * grid → the bottom action row; RECENT / SAVED semantics are the consumer's */
export default function CatalogPageDemo({ variant = 'catalog' }) {
  const [view, setView] = useState('recent')
  const [tour, setTour] = useState(false)
  const [favs, setFavs] = useState(() => new Set(['press']))
  if (variant === 'shelf') {
    /* the shelf: toCard returns FIELDS and HANDLERS, the preset renders the slots
     * — download on the image, star and trash on the plate, the size cell — so
     * the page writes no JSX for actions */
    return (
      <CatalogPage
        preset="shelf"
        header={{ title: 'Decks', subtitle: 'Every deck in the brand book. Open one to view or present it.' }}
        items={DECKS}
        filtersTitle="Decks"
        searchKeys={['name', 'detail']}
        toCard={(d) => ({ key: d.slug, title: d.name, detail: d.detail, date: d.updated, bytes: d.bytes, count: d.slides, cover: d.cover, href: '#', onNavigate: (e) => e.preventDefault(), onDownload: () => {}, onFavourite: () => setFavs((f) => { const n = new Set(f); n.has(d.slug) ? n.delete(d.slug) : n.add(d.slug); return n }), onDelete: () => {}, favourited: favs.has(d.slug) })}
        actions={<><Button size="md" iconRight="plus">New deck</Button><Button size="md">Templates</Button></>}
      />
    )
  }
  return (
    <CatalogPage
      header={{ size: 'sm', voice: 'mono', title: 'Effexor FXR', subtitle: 'Pick a chrome. All three run the same engine.' }}
      items={view === 'recent' ? RECENT : SAVED}
      filtersTitle="All Chromes"
      views={VIEWS}
      view={view}
      onViewChange={setView}
      toCard={(c, { view: v }) => ({ key: c.name, title: c.title, detail: c.detail, media: v === 'recent' ? <img src={c.img} alt="" /> : undefined, onClick: () => {} })}
      walkthrough={{ open: tour, steps: [{ title: '1. Pick a chrome', text: ['Placeholder.'] }, { title: 'Get Started', actions: <Button variant="grey" size="md" onClick={() => setTour(false)}>Open Editor</Button> }] }}
      actions={<><Button variant="grey" size="md">New File</Button><Button variant="grey" size="md" onClick={() => setTour((t) => !t)}>{tour ? 'Close' : 'Walkthrough'}</Button></>}
    />
  )
}
