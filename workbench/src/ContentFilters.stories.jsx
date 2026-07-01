import { useState } from 'react'
import { ContentFilters } from '@kolkrabbi/kol-component'

const items = [
  { id: 1, name: 'Raven', type: 'print', size: 'A2' },
  { id: 2, name: 'Fox', type: 'poster', size: 'A1' },
  { id: 3, name: 'Whale', type: 'print', size: 'A1' },
  { id: 4, name: 'Heron', type: 'poster', size: 'A2' },
]

const filterGroups = [
  { label: 'Type', key: 'type', values: ['print', 'poster'] },
  { label: 'Size', key: 'size', values: ['A1', 'A2'] },
]

const renderList = (filtered) => (
  <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {filtered.map((it) => (
      <li key={it.id} className="kol-mono-12 text-body">
        {it.name} · {it.type} · {it.size}
      </li>
    ))}
  </ul>
)

export const Default = () => (
  <ContentFilters
    items={items}
    title="Shop"
    totalCount={items.length}
    filterGroups={filterGroups}
    searchKeys={['name', 'type']}
    renderItem={renderList}
  />
)

export const WithViewModes = () => {
  const [view, setView] = useState('grid')
  return (
    <ContentFilters
      items={items}
      title="Collections"
      totalCount={items.length}
      filterGroups={filterGroups}
      searchKeys={['name', 'type']}
      viewModeOptions={[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
      ]}
      viewMode={view}
      onViewModeChange={setView}
      showCountOnlyWhenFiltering
      renderItem={(filtered, viewMode) =>
        viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {filtered.map((it) => (
              <div key={it.id} className="kol-mono-12 text-body">{it.name}</div>
            ))}
          </div>
        ) : (
          renderList(filtered)
        )
      }
    />
  )
}
