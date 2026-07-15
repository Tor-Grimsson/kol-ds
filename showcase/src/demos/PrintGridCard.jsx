import { useState } from 'react'
import { PrintGridCard } from '@kolkrabbi/kol-store'

export const stage = 'md'

/* Portrait plate (√2 aspect) as an inline data URI — the demo owns its media. */
const plate = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='566' viewBox='0 0 400 566'>
      <rect width='400' height='566' fill='${bg}'/>
      <circle cx='200' cy='240' r='120' fill='none' stroke='${fg}' stroke-width='2'/>
      <path d='M60 430 L200 300 L340 430' fill='none' stroke='${fg}' stroke-width='2'/>
      <text x='28' y='56' fill='${fg}' font-family='monospace' font-size='18'>${label}</text>
    </svg>`,
  )

/* Framed "print mockup" variant — when present as detailImages[0], the card
 * randomly shows artwork or mockup on mount, so a reload reshuffles the wall. */
const mockup = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='566' viewBox='0 0 400 566'>
      <rect width='400' height='566' fill='#e9e6df'/>
      <rect x='60' y='90' width='280' height='386' fill='${bg}'/>
      <rect x='60' y='90' width='280' height='386' fill='none' stroke='#1d1d21' stroke-width='6'/>
      <circle cx='200' cy='260' r='80' fill='none' stroke='${fg}' stroke-width='2'/>
      <text x='84' y='140' fill='${fg}' font-family='monospace' font-size='14'>${label}</text>
    </svg>`,
  )

const PRINTS = [
  {
    slug: 'plate-01',
    name: 'Plate 01',
    image: plate('PLATE 01', '#1a1712', '#e8df00'),
    detailImages: [mockup('PLATE 01', '#1a1712', '#e8df00')],
  },
  { slug: 'plate-02', name: 'Plate 02', image: plate('PLATE 02', '#0e1a1a', '#5fd0c0') },
  { slug: 'plate-03', name: 'Plate 03' }, // no image → empty state
]

/* Click (or Enter/Space) a card: it reports its rect + slug and flips 180°
 * while `isFlipped` — the hook a parent uses for a FLIP detail transition. */
export default function PrintGridCardDemo() {
  const [flipped, setFlipped] = useState(null)
  return (
    <div className="grid grid-cols-3 gap-4">
      {PRINTS.map((print) => (
        <PrintGridCard
          key={print.slug}
          print={print}
          isFlipped={flipped === print.slug}
          onCardClick={(rect, slug) => setFlipped(flipped === slug ? null : slug)}
        />
      ))}
    </div>
  )
}
