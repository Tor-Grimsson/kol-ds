import { ContentFilters, ContentCollection, ContentItem } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Content filters',
  description: 'The listing apparatus every consumer hand-rolled — ContentFilters over a ContentCollection of ContentItems, LIST/GRID as one prop instead of nine hand-written switches',
  category: 'listing',
  type: 'reference',
  status: 'active',
  updated: '2026-08-15',
  tags: ['domain/design-system', 'pattern/sets'],
}
export const stage = 'full'

/* The composition the content-card system exists for: nine cards in the
 * estate render under a content filter, each with its own hand-written
 * `layout === 'list' ? row : card` switch. Here the whole apparatus is
 * ContentFilters (filtering + the LIST/GRID strip) handing its layout to
 * ContentCollection, which renders ContentItems flipped by one prop.
 *
 * Per 06-content-card-system.md §7: the collection is passed TO renderItem —
 * ContentFilters builds no cards in. */

const ITEMS = [
  { title: 'Kolkrabbi Identity', date: '15 Aug 2026', size: '2.4 MB', kind: 'image' },
  { title: 'poster-spread.png', date: '19 Jun 2026', size: '1.2 MB', kind: 'image' },
  { title: 'reel-cut-04.mp4', date: '21 Jun 2026', size: '48 MB', kind: 'video' },
  { title: 'wordmark-final.svg', date: '02 Jul 2026', size: '18 KB', kind: 'vector' },
  { title: 'brand-deck.pdf', date: '11 Jul 2026', size: '6.1 MB', kind: 'document' },
  { title: 'stills-batch-02.zip', date: '30 Jul 2026', size: '210 MB', kind: 'archive' },
]

export default function ContentFiltersSet() {
  return (
    <div className="w-full p-6">
      <ContentFilters
        items={ITEMS}
        title="Library"
        totalCount={ITEMS.length}
        filterGroups={[{ label: 'Kind', key: 'kind', values: [...new Set(ITEMS.map((i) => i.kind))] }]}
        layoutOptions={[{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]}
        defaultLayout="grid"
        renderItem={(filtered, viewMode, layout) => (
          <ContentCollection form={layout === 'grid' ? 'grid' : 'list'}>
            {filtered.map((item) => (
              <ContentItem
                key={item.title}
                form={layout === 'grid' ? 'card' : 'row'}
                variant="default"
                title={item.title}
                date={item.date}
                size={item.size}
              />
            ))}
          </ContentCollection>
        )}
      />
    </div>
  )
}
