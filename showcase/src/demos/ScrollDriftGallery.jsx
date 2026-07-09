import { ScrollDriftGallery } from '@kolkrabbi/kol-content'

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
  ['#16101a', '#c58fff'],
]

const CARDS = PALETTE.map(([bg, fg], i) => ({
  img: cover(`DRIFT ${String(i + 1).padStart(2, '0')}`, bg, fg),
  title: `Drift ${i + 1}`,
}))

const renderCard = (item) => (
  <div className="w-full overflow-hidden rounded-[2px] border border-fg-08 bg-surface-secondary">
    <img src={item.img} alt={item.title} className="w-full" style={{ aspectRatio: '4 / 5' }} />
    <div className="p-3">
      <p className="kol-mono-12 text-emphasis">{item.title}</p>
    </div>
  </div>
)

export default function ScrollDriftGalleryDemo() {
  return (
    <ScrollDriftGallery items={CARDS} title="DRIFT" renderCard={renderCard} onCardClick={() => {}} />
  )
}
