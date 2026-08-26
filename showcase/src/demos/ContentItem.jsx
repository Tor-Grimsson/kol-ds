import { useState } from 'react'
import { ContentItem, SegmentedToggle } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const S = { title: 'Kolkrabbi Identity', date: '15 Aug 2026', size: '2.4 MB' }

/* the switch the estate hand-wrote nine times — here it is one prop */
export default function ContentItemDemo() {
  const [form, setForm] = useState('card')
  return (
    <div className="flex w-full max-w-[40rem] flex-col gap-4">
      <SegmentedToggle
        size="sm"
        options={[{ value: 'card', label: 'GRID' }, { value: 'row', label: 'LIST' }]}
        value={form}
        onChange={setForm}
      />
      <div className={form === 'card' ? 'grid grid-cols-3 gap-4' : 'flex flex-col divide-y divide-fg-08'}>
        <ContentItem form={form} variant="default" title={S.title} date={S.date} size={S.size} />
        <ContentItem form={form} variant="default" title="poster-spread.png" date="19 Jun 2026" size="1.2 MB" />
        <ContentItem form={form} variant="default" title="reel-cut-04.mp4" date="21 Jun 2026" size="48 MB" />
      </div>
    </div>
  )
}
