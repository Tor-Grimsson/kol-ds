import { useState } from 'react'
import { MediaRow, Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

const Thumb = ({ icon = 'image' }) => (
  <div className="flex h-full w-full items-center justify-center bg-fg-08 text-meta">
    <Icon name={icon} size={18} />
  </div>
)

const FILES = [
  { id: 'a', name: 'poster-spread.png', date: '2026-06-19', size: '1.2 MB', icon: 'image' },
  { id: 'b', name: 'reel-cut-04.mp4', date: '2026-06-21', size: '48 MB', icon: 'video' },
  { id: 'c', name: 'brand-deck.pdf', date: '2026-07-01', size: '3.4 MB', icon: 'file' },
]

const List = ({ children }) => (
  <ul style={{ width: 560, listStyle: 'none', margin: 0, padding: 0 }}>{children}</ul>
)

export const Default = () => (
  <List>
    {FILES.map((f) => (
      <MediaRow
        key={f.id}
        thumb={<Thumb icon={f.icon} />}
        name={<p className="kol-sans-body-02 truncate text-emphasis">{f.name}</p>}
        date={f.date}
        size={f.size}
        actions={<Button variant="ghost" size="sm">Rename</Button>}
      />
    ))}
  </List>
)

export const SelectMode = () => {
  const [selected, setSelected] = useState(new Set(['b']))
  const toggle = (id) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  return (
    <List>
      {FILES.map((f) => (
        <MediaRow
          key={f.id}
          thumb={<Thumb icon={f.icon} />}
          name={<p className="kol-sans-body-02 truncate text-emphasis">{f.name}</p>}
          date={f.date}
          size={f.size}
          selectMode
          selected={selected.has(f.id)}
          onSelect={() => toggle(f.id)}
        />
      ))}
    </List>
  )
}

export const CustomColumns = () => (
  <List>
    <MediaRow
      thumb={<Thumb />}
      name={<p className="kol-sans-body-02 truncate text-emphasis">wide-date-column.png</p>}
      date="19 June 2026, 14:02"
      size="1.2 MB"
      dateWidth="w-44"
      sizeWidth="w-16"
    />
  </List>
)
