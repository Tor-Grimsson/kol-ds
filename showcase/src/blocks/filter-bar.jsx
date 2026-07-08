import { useState } from 'react'
import { Input, Tag, ViewToggle, Dropdown, Divider, AssetPlaceholder } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Filter bar',
  description: 'A filter bar with search, tags, sort and view mode',
  category: 'toolbar',
}
export const stage = 'full'

const TAGS = ['prints', 'posters', 'editions', 'studies']

/* Rendered as the product surface it lives on — a content-grid header over its
 * results — so the bar reads in context, not as a floating strip. */
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
    <div className="flex h-full min-h-0 w-full flex-col gap-5 bg-surface-primary p-6">
      <div className="flex flex-col gap-3">
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
            <ViewToggle
              viewMode={view}
              onViewChange={setView}
              variant="icon"
              iconVariant="solid"
              options={[
                { value: 'grid', label: 'Grid view', icon: 'grid' },
                { value: 'list', label: 'List view', icon: 'list-01' },
              ]}
            />
          </div>
        </div>
        <Divider />
      </div>

      {/* The results the bar filters — grid or rows per the view mode. */}
      {view === 'grid' ? (
        <div className="grid flex-1 grid-cols-2 content-start gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <AssetPlaceholder key={i} aspectRatio="4 / 3" note="result" name={`print-0${i + 1}`} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col content-start gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <AssetPlaceholder key={i} aspectRatio="" className="h-14 !p-2" note="result" name={`print-0${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  )
}
