import { useState } from 'react'
import { CatalogPage } from '@kolkrabbi/kol-shell'

/* THE CATALOG'S REFERENCE APP (apps review 2026-09-29 — the user: *"that layout and arrangement is
 * highly used … you could decide if you wanted the classic mono header with description like in hub
 * or a uppercase sans like media"*). kol-shell's `CatalogPage` ALONE — no Shell, so the masthead is
 * the page's own prop (inside a Shell it would be the app's). The search in its ContentFilters is the
 * kol-search engine: `tag:brand`, `#motion`, `-draft`, `"a phrase"`, several words ANDed.
 * The DISPLAY · MONO masthead toggle went 2026-10-18: PageHeader is one header now (Round 11).
 *
 * Placeholder items; what a card IS is the consumer's (`toCard`). */

const KINDS = ['deck', 'note', 'image', 'video']
const TAGS = ['brand', 'motion', 'print', 'web', 'draft']
const NAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo']
const ITEMS = NAMES.map((name, i) => ({
  name,
  title: `${name} ${KINDS[i % KINDS.length]}`,
  kind: KINDS[i % KINDS.length],
  tags: [TAGS[i % TAGS.length], TAGS[(i + 2) % TAGS.length]],
  date: `2026-09-${String(28 - (i % 27)).padStart(2, '0')}`,
  size: `${(i + 1) * 64} KB`,
  saved: i % 3 === 0,
}))

const VIEWS = [{ value: 'recent', label: 'RECENT' }, { value: 'saved', label: 'SAVED' }]

export default function App() {
  const [view, setView] = useState('recent')
  return (
    <CatalogPage
      header={{
        title: 'Catalog',
        subtitle: `${ITEMS.length} items`,
      }}
      items={view === 'saved' ? ITEMS.filter((i) => i.saved) : ITEMS}
      searchKeys={['title', 'kind']}
      filtersTitle="All Items"
      filterGroups={[{ label: 'Kind', key: 'kind', values: KINDS }, { label: 'Tag', key: 'tags', values: TAGS }]}
      views={VIEWS}
      view={view}
      onViewChange={setView}
      toCard={(it) => ({ key: it.name, title: it.title, detail: `${it.kind} · ${it.tags.map((t) => `#${t}`).join(' ')}`, date: it.date, size: it.size, media: false })}
    />
  )
}
