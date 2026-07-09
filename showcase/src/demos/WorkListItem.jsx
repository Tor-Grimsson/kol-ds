import { useState } from 'react'
import { WorkListItem } from '@kolkrabbi/kol-content'

export const stage = 'md'

const cover = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <rect width='200' height='200' fill='${bg}'/>
      <circle cx='100' cy='100' r='58' fill='none' stroke='${fg}' stroke-width='2'/>
      <rect x='70' y='70' width='60' height='60' fill='${fg}' opacity='0.18'/>
      <text x='16' y='30' fill='${fg}' font-family='monospace' font-size='13'>${label}</text>
    </svg>`,
  )

const PROJECTS = [
  {
    title: 'Kría Editions',
    thumbnail: cover('KRIA', '#1a1712', '#e8df00'),
    tags: ['Identity', 'Print'],
    type: 'Client',
    year: '2026',
    description: 'A full visual identity for a Reykjavík print house.',
    href: '#',
  },
  {
    title: 'Norðurljós',
    thumbnail: cover('NORD', '#0e1a1a', '#5fd0c0'),
    tags: ['Typeface'],
    type: 'Typeface',
    year: '2025',
    description: 'A variable display face drawn from aurora arcs.',
    href: '#',
  },
  {
    title: 'Hverfjall Study',
    thumbnail: cover('HVER', '#1a0e14', '#ff6b9d'),
    tags: ['Editions', 'Giclée'],
    type: 'Collection',
    year: '2024',
    description: 'A limited run of archival prints from crater fieldwork.',
    href: '#',
  },
]

export default function WorkListItemDemo() {
  const [active, setActive] = useState(PROJECTS[0].title)
  return (
    <div className="w-full">
      {PROJECTS.map((p) => (
        <WorkListItem
          key={p.title}
          {...p}
          active={active === p.title}
          onMouseEnter={() => setActive(p.title)}
          onNavigate={(href, e) => e.preventDefault()}
        />
      ))}
    </div>
  )
}
