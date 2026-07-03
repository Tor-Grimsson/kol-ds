import { useState } from 'react'
import { WorkViewToggle, WorkCard, WorkListItem } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Work grid',
  description: 'A project index that toggles between a tilt-card shelf and a list view',
  category: 'content',
}
export const stage = 'full'

/* Inline project cover — standalone SVG document, no network. */
const cover = (a, b, seed = 0) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>` +
      `</linearGradient></defs>` +
      `<rect width='800' height='1000' fill='url(#g)'/>` +
      `<circle cx='${180 + seed * 90}' cy='300' r='200' fill='#ffffff' opacity='0.08'/>` +
      `<rect x='${420 - seed * 40}' y='560' width='300' height='300' rx='24' fill='#000000' opacity='0.12'/>` +
      `</svg>`,
  )}`

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="kol-label-mono-xs text-fg-64">Selected work</div>
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
