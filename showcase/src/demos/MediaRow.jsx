import { useState } from 'react'
import { MediaRow, Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const stage = 'full'

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

export default function MediaRowDemo() {
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set(['b']))
  const toggle = (id) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <Button variant="primary" size="sm" pressed={selectMode} onClick={() => setSelectMode((v) => !v)}>
          {selectMode ? 'Done' : 'Select'}
        </Button>
      </div>
      <ul className="m-0 list-none p-0">
        {FILES.map((f) => (
          <MediaRow
            key={f.id}
            thumb={<Thumb icon={f.icon} />}
            name={<p className="kol-sans-body-02 truncate text-emphasis">{f.name}</p>}
            date={f.date}
            size={f.size}
            actions={<Button variant="ghost" size="sm">Rename</Button>}
            selectMode={selectMode}
            selected={selectMode && selected.has(f.id)}
            onSelect={() => toggle(f.id)}
          />
        ))}
      </ul>
    </div>
  )
}
