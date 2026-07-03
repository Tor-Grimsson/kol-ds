import { DiagonalMarqueeRiver } from '@kolkrabbi/kol-component'

export const stage = 'full'

const cover = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='400' viewBox='0 0 320 400'>
      <rect width='320' height='400' fill='${bg}'/>
      <circle cx='160' cy='170' r='90' fill='none' stroke='${fg}' stroke-width='2'/>
      <rect x='115' y='125' width='90' height='90' fill='${fg}' opacity='0.16'/>
      <text x='24' y='48' fill='${fg}' font-family='monospace' font-size='16'>${label}</text>
    </svg>`,
  )

const PALETTE = [
  ['#1a1712', '#e8df00'],
  ['#0e1a1a', '#5fd0c0'],
  ['#1a0e14', '#ff6b9d'],
  ['#12161a', '#7aa2ff'],
  ['#1a140e', '#ffab5f'],
  ['#0e1a12', '#7fffa0'],
  ['#16101a', '#c58fff'],
  ['#1a1010', '#ff8f6b'],
]

const TILES = PALETTE.map(([bg, fg], i) => ({
  img: cover(`PLATE ${String(i + 1).padStart(2, '0')}`, bg, fg),
  label: `Plate ${i + 1}`,
}))

const renderItem = (item) => (
  <div className="overflow-hidden rounded-[2px] border border-fg-08">
    <img src={item.img} alt={item.label} className="w-full" style={{ aspectRatio: '4 / 5' }} />
  </div>
)

export default function DiagonalMarqueeRiverDemo() {
  return (
    <div className="w-full">
      <DiagonalMarqueeRiver items={TILES} renderItem={renderItem} colCount={4} height="640px" />
    </div>
  )
}
