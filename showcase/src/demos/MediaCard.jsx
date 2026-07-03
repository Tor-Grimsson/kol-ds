import { useState } from 'react'
import { MediaCard, Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-loader'

export const stage = 'lg'

const Thumb = ({ icon = 'image' }) => (
  <div className="flex h-full w-full items-center justify-center bg-fg-08 text-meta">
    <Icon name={icon} size={28} />
  </div>
)

export default function MediaCardDemo() {
  const [selected, setSelected] = useState(new Set(['b']))
  const toggle = (id) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Default — download overlay + actions */}
      <ul className="grid list-none grid-cols-2 gap-4 p-0">
        <MediaCard
          thumb={<Thumb />}
          name={<p className="kol-sans-body-02 truncate text-emphasis">poster-spread.png</p>}
          meta="1.2 MB · 2026-06-19"
          downloadHref="#"
          actions={<div className="flex gap-2"><Button variant="ghost" size="sm">Rename</Button><Button variant="ghost" size="sm">Delete</Button></div>}
        />
        <MediaCard
          thumb={<Thumb icon="video" />}
          name={<p className="kol-sans-body-02 truncate text-emphasis">reel-cut-04.mp4</p>}
          meta="48 MB · 2026-06-21"
          downloadHref="#"
          actions={<div className="flex gap-2"><Button variant="ghost" size="sm">Rename</Button><Button variant="ghost" size="sm">Delete</Button></div>}
        />
      </ul>

      {/* Select mode — checkbox chip, whole card toggles */}
      <ul className="grid list-none grid-cols-2 gap-4 p-0">
        {['a', 'b'].map((id) => (
          <MediaCard
            key={id}
            thumb={<Thumb />}
            name={<p className="kol-sans-body-02 truncate text-emphasis">{`asset-${id}.png`}</p>}
            meta="640 KB · 2026-07-01"
            selectMode
            selected={selected.has(id)}
            onSelect={() => toggle(id)}
          />
        ))}
      </ul>
    </div>
  )
}
