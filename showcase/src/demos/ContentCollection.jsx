import { useState } from 'react'
import { ContentCollection, ContentItem, SegmentedToggle } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const ITEMS = [
  { title: 'Kolkrabbi Identity', date: '15 Aug 2026', size: '2.4 MB' },
  { title: 'poster-spread.png', date: '19 Jun 2026', size: '1.2 MB' },
  { title: 'reel-cut-04.mp4', date: '21 Jun 2026', size: '48 MB' },
  { title: 'wordmark-final.svg', date: '02 Jul 2026', size: '18 KB' },
]

/* the collection owns the switch AND the motion — enter stagger on the house
 * curve, re-run on every form flip */
export default function ContentCollectionDemo() {
  const [form, setForm] = useState('grid')
  return (
    <div className="flex w-full max-w-[40rem] flex-col gap-4">
      <SegmentedToggle
        size="sm"
        options={[{ value: 'grid', label: 'GRID' }, { value: 'list', label: 'LIST' }]}
        value={form}
        onChange={setForm}
      />
      <ContentCollection form={form}>
        {ITEMS.map((item) => (
          <ContentItem key={item.title} form={form === 'grid' ? 'card' : 'row'} variant="default" {...item} />
        ))}
      </ContentCollection>
    </div>
  )
}
