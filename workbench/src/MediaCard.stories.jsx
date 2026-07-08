import { useState } from 'react'
import { MediaCard, Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

const Thumb = ({ icon = 'image' }) => (
  <div className="flex h-full w-full items-center justify-center bg-fg-08 text-meta">
    <Icon name={icon} size={28} />
  </div>
)

const Grid = ({ children }) => (
  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', gap: 16, listStyle: 'none', margin: 0, padding: 0 }}>
    {children}
  </ul>
)

export const Default = () => (
  <Grid>
    <MediaCard
      thumb={<Thumb />}
      name={<p className="kol-sans-body-02 truncate text-emphasis">poster-spread.png</p>}
      meta="1.2 MB · 2026-06-19"
      downloadHref="#"
      actions={<Button variant="ghost" size="sm">Rename</Button>}
    />
    <MediaCard
      thumb={<Thumb icon="video" />}
      name={<p className="kol-sans-body-02 truncate text-emphasis">reel-cut-04.mp4</p>}
      meta="48 MB · 2026-06-21"
      downloadHref="#"
      actions={<Button variant="ghost" size="sm">Rename</Button>}
    />
  </Grid>
)

export const SelectMode = () => {
  const [selected, setSelected] = useState(new Set(['b']))
  const toggle = (id) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  return (
    <Grid>
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
    </Grid>
  )
}

export const NoDownload = () => (
  <Grid>
    <MediaCard
      thumb={<Thumb icon="file" />}
      name={<p className="kol-sans-body-02 truncate text-emphasis">brand-deck.pdf</p>}
      meta="3.4 MB · 2026-07-01"
    />
  </Grid>
)
