import { useState } from 'react'
import { Input, Tag, ViewToggle, Dropdown, Divider } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Filter bar',
  description: 'Search, tag filters, sort, and view mode composed as a content-grid header.',
}
export const stage = 'full'

const TAGS = ['prints', 'posters', 'editions', 'studies']

export default function FilterBar() {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(new Set(['prints']))
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')

  const toggle = (t) => setActive((prev) => {
    const next = new Set(prev)
    next.has(t) ? next.delete(t) : next.add(t)
    return next
  })

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Input variant="filled" size="sm" placeholder="Search work…" value={q} onChange={(e) => setQ(e?.target?.value ?? e)} iconLeft="search" />
        <div className="flex flex-wrap items-center gap-2">
          {TAGS.map((t) => (
            <button key={t} type="button" onClick={() => toggle(t)}>
              <Tag className={active.has(t) ? 'border-fg-32' : 'border-fg-08'}>{t}</Tag>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Dropdown
            size="sm"
            variant="minimal"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'newest', label: 'Newest first' },
              { value: 'oldest', label: 'Oldest first' },
              { value: 'az', label: 'A → Z' },
            ]}
          />
          <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
        </div>
      </div>
      <Divider />
    </div>
  )
}
