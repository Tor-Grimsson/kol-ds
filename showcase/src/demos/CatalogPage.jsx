import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { CatalogPage } from '@kolkrabbi/kol-shell'

export const stage = 'full'

const IMG = (h) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850"><rect width="600" height="850" fill="hsl(${h} 25% 50%)"/></svg>`)
const RECENT = [
  { name: 'editor', title: 'Editor', detail: 'frames, layers, vector tools — the compositor', img: IMG(20) },
  { name: 'labs', title: 'Labs', detail: 'generative and kinetic type', img: IMG(200) },
  { name: 'randomiser', title: 'Randomiser', detail: 'seeded variations', img: IMG(320) },
]
const SAVED = [{ name: 'p1', title: 'Poster 04', detail: '3 layers · 1:1 · 12 Aug 2026' }]
const VIEWS = [{ value: 'recent', label: 'RECENT' }, { value: 'saved', label: 'SAVED' }]

/* the app tier's Home / Library page: PageHeader → ContentFilters → the catalog
 * grid → the bottom action row; RECENT / SAVED semantics are the consumer's */
export default function CatalogPageDemo() {
  const [view, setView] = useState('recent')
  const [tour, setTour] = useState(false)
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
