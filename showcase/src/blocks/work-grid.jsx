import { useState } from 'react'
import { WorkViewToggle, WorkCard, WorkListItem } from '@kolkrabbi/kol-content'

export const meta = {
  title: 'Work grid',
  description: 'A project index that toggles between a tilt-card shelf and a list view',
  category: 'content',
}
export const stage = 'full'

/* Real project imagery (served at /kol-images), cycled through the grid. */
const KOL_IMAGES = Array.from({ length: 7 }, (_, i) => `/kol-images/tt-0${i + 1}.jpg`)
let _phi = 0
const cover = () => KOL_IMAGES[_phi++ % KOL_IMAGES.length]

const PROJECTS = [
  {
    title: 'Harbour Wayfinding',
    thumbnail: cover('#0F766E', '#22D3EE', 0),
    client: 'Port of Vestmann',
    type: 'system',
    year: 2025,
    tags: ['Wayfinding', 'Identity'],
    description: 'A signage system for a working fishing harbour',
    href: '#/work/harbour',
  },
  {
    title: 'Grotesk Revival',
    thumbnail: cover('#7C2D12', '#F59E0B', 1),
    client: 'Foundry North',
    type: 'typeface',
    year: 2025,
    tags: ['Type', 'Retail'],
    description: 'Reviving a lost 19th-century grotesk',
    href: '#/work/grotesk',
  },
  {
    title: 'Kelp Dye Collection',
    thumbnail: cover('#065F46', '#84CC16', 2),
    client: 'Saltwater Studio',
    type: 'collection',
    year: 2024,
    tags: ['Textile', 'Craft'],
    description: 'A capsule range coloured entirely with seaweed',
    href: '#/work/kelp',
  },
  {
    title: 'Nightshift Player',
    thumbnail: cover('#4C1D95', '#EC4899', 3),
    client: 'Ambient FM',
    type: 'tool',
    year: 2024,
    tags: ['Product', 'Audio'],
    description: 'A minimal web player for long ambient sets',
    href: '#/work/nightshift',
  },
  {
    title: 'Concrete Diaries',
    thumbnail: cover('#1E293B', '#64748B', 4),
    client: 'Brutal Press',
    type: 'client',
    year: 2023,
    tags: ['Editorial', 'Print'],
    description: 'A photobook on post-war municipal architecture',
    href: '#/work/concrete',
  },
  {
    title: 'Meadow Index',
    thumbnail: cover('#312E81', '#F43F5E', 5),
    client: 'Wildseed Trust',
    type: 'system',
    year: 2023,
    tags: ['Data', 'Identity'],
    description: 'A living catalogue of native grassland species',
    href: '#/work/meadow',
  },
]

export default function WorkGrid() {
  const [view, setView] = useState('shelf')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)

  const q = query.trim().toLowerCase()
  const visible = q
    ? PROJECTS.filter((p) =>
        `${p.title} ${p.client} ${p.type} ${p.tags.join(' ')}`.toLowerCase().includes(q),
      )
    : PROJECTS

  return (
    <div className="flex flex-col gap-8 px-6 py-12 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <div className="kol-helper-12 text-fg-64">SELECTED WORK</div>
        <WorkViewToggle
          view={view}
          onView={setView}
          query={query}
          onQuery={setQuery}
          placeholder="Search projects"
        />
      </div>

      {visible.length === 0 ? (
        <p className="kol-mono-14 text-fg-64 py-12 text-center">No projects match “{query}”.</p>
      ) : view === 'shelf' ? (
        <div className="flex gap-6 overflow-x-auto pb-4 items-end">
          {visible.map((p, i) => (
            <WorkCard key={p.href} index={i} {...p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {visible.map((p) => (
            <WorkListItem
              key={p.href}
              {...p}
              active={active === p.href}
              onMouseEnter={() => setActive(p.href)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
