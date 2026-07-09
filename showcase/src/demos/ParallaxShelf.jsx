import { ParallaxShelf } from '@kolkrabbi/kol-content'

export const stage = 'full'

const cover = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'>
      <rect width='400' height='500' fill='${bg}'/>
      <circle cx='200' cy='210' r='110' fill='none' stroke='${fg}' stroke-width='2'/>
      <path d='M60 380 L200 250 L340 380' fill='none' stroke='${fg}' stroke-width='2'/>
      <rect x='150' y='160' width='100' height='100' fill='${fg}' opacity='0.15'/>
      <text x='32' y='60' fill='${fg}' font-family='monospace' font-size='18'>${label}</text>
    </svg>`,
  )

const PALETTE = [
  ['#1a1712', '#e8df00'],
  ['#0e1a1a', '#5fd0c0'],
  ['#1a0e14', '#ff6b9d'],
  ['#12161a', '#7aa2ff'],
  ['#1a140e', '#ffab5f'],
]

const ITEMS = [
  { title: 'Kría Editions', client: 'Kría', year: '2026', type: 'client' },
  { title: 'Norðurljós', year: '2025', type: 'typeface' },
  { title: 'Hverfjall Study', client: 'Fjall', year: '2024', type: 'collection' },
  { title: 'Basalt Grid', client: 'Stólpi', year: '2024', type: 'client' },
  { title: 'Móberg Tool', year: '2023', type: 'tool' },
].map((p, i) => ({
  ...p,
  href: '#',
  thumbnail: cover(`0${i + 1}`, PALETTE[i][0], PALETTE[i][1]),
}))

export default function ParallaxShelfDemo() {
  return (
    <ParallaxShelf
      type={{ label: 'Client Work' }}
      items={ITEMS}
      onNavigate={(href, e) => e.preventDefault()}
    />
  )
}
