import { useState } from 'react'
import { PrintGridCardGsap } from '@kolkrabbi/kol-store'

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

const PRINTS = [
  { slug: 'river-01', name: 'River 01', image: plate('RIVER 01', '#12161a', '#7aa2ff') },
  { slug: 'river-02', name: 'River 02', image: plate('RIVER 02', '#1a140e', '#ffab5f') },
  { slug: 'river-03', name: 'River 03', image: plate('RIVER 03', '#16101a', '#c58fff') },
]

/* The river-column variant of PrintGridCard: no 3D flip, but the outer node's
 * ref is forwarded so a parent GSAP timeline (DiagonalMarqueeRiver, a scroll
 * river) can measure and tween it. The demo stays DOM-only — click a card and
 * it reports its bounding rect + slug through `onCardClick`. */
export default function PrintGridCardGsapDemo() {
  const [last, setLast] = useState(null)
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {PRINTS.map((print) => (
          <PrintGridCardGsap
            key={print.slug}
            print={print}
            onCardClick={(rect, slug) =>
              setLast(`${slug} — ${Math.round(rect.width)}×${Math.round(rect.height)} @ ${Math.round(rect.left)},${Math.round(rect.top)}`)
            }
          />
        ))}
      </div>
      <p className="kol-mono-12 text-fg-48">
        {last ? `onCardClick → ${last}` : 'click a card — it reports its rect + slug'}
      </p>
    </>
  )
}
