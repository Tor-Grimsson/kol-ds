import { useState } from 'react'
import { ContentCollection, ContentItem, SegmentedToggle } from '@kolkrabbi/kol-component'

export const variants = ['fluid', 'cols']
export const stage = 'lg'

const ITEMS = [
  { title: 'Kolkrabbi Identity', date: '15 Aug 2026', size: '2.4 MB' },
  { title: 'poster-spread.png', date: '19 Jun 2026', size: '1.2 MB' },
  { title: 'reel-cut-04.mp4', date: '21 Jun 2026', size: '48 MB' },
  { title: 'wordmark-final.svg', date: '02 Jul 2026', size: '18 KB' },
  { title: 'type-specimen.pdf', date: '11 Jul 2026', size: '3.1 MB' },
  { title: 'mood-05.jpg', date: '28 Jul 2026', size: '860 KB' },
]

/* the collection owns the switch AND the motion — enter stagger on the house
 * curve, re-run on every form flip. `fluid` = the default auto-fill wall
 * (count from the wall's own width); `cols` = the page says the count —
 * `cols={{ md: 3, xl: 4 }}`, one column below md, three from md, four from xl. */
export default function ContentCollectionDemo({ variant = 'fluid' }) {
  const [form, setForm] = useState('grid')
  const cols = variant === 'cols' ? { md: 3, xl: 4 } : undefined
  return (
    <div className={`flex w-full flex-col gap-4 ${cols ? '' : 'max-w-[40rem]'}`}>
      <SegmentedToggle
        size="sm"
        options={[{ value: 'grid', label: 'GRID' }, { value: 'list', label: 'LIST' }]}
        value={form}
        onChange={setForm}
      />
      <ContentCollection form={form} cols={cols}>
        {ITEMS.map((item) => (
          <ContentItem key={item.title} form={form === 'grid' ? 'card' : 'row'} variant="default" {...item} />
        ))}
      </ContentCollection>
    </div>
  )
}
