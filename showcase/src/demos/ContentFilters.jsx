import { ContentFilters } from '@kolkrabbi/kol-component'

const items = [
  { id: 1, name: 'Kolkrabbi Grotesk', type: 'Typeface', weight: 'Regular' },
  { id: 2, name: 'Kolkrabbi Mono', type: 'Typeface', weight: 'Medium' },
  { id: 3, name: 'Specimen Poster', type: 'Print', weight: 'Bold' },
  { id: 4, name: 'Grid Study', type: 'Print', weight: 'Regular' },
]

const filterGroups = [
  { label: 'Type', key: 'type', values: ['Typeface', 'Print'] },
  { label: 'Weight', key: 'weight', values: ['Regular', 'Medium', 'Bold'] },
]

const renderItem = (filteredItems) => (
  <ul className="flex flex-col gap-2">
    {filteredItems.map((item) => (
      <li key={item.id} className="kol-helper-14 flex justify-between">
        <span>{item.name}</span>
        <span className="text-fg-48">{item.type} · {item.weight}</span>
      </li>
    ))}
  </ul>
)

export const stage = 'full'

export default function ContentFiltersDemo() {
  return (
    <ContentFilters
      title="Catalogue"
      items={items}
      totalCount={items.length}
      filterGroups={filterGroups}
      renderItem={renderItem}
    />
  )
}
