import { GalleryCarousel } from '@kolkrabbi/kol-component'

export const stage = 'full'

const img = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'>
      <rect width='800' height='1000' fill='${bg}'/>
      <circle cx='400' cy='420' r='220' fill='none' stroke='${fg}' stroke-width='3'/>
      <path d='M120 760 L400 500 L680 760' fill='none' stroke='${fg}' stroke-width='3'/>
      <rect x='300' y='320' width='200' height='200' fill='${fg}' opacity='0.14'/>
      <text x='64' y='110' fill='${fg}' font-family='monospace' font-size='34'>${label}</text>
    </svg>`,
  )

const MEDIA = [
  { url: img('PLATE 01', '#1a1712', '#e8df00'), kind: 'image', aspect: 0.8, alt: 'Plate 01' },
  { url: img('PLATE 02', '#0e1a1a', '#5fd0c0'), kind: 'image', aspect: 0.8, alt: 'Plate 02' },
  { url: img('PLATE 03', '#1a0e14', '#ff6b9d'), kind: 'image', aspect: 0.8, alt: 'Plate 03' },
]

export default function GalleryCarouselDemo() {
  return <GalleryCarousel media={MEDIA} title="Hverfjall Series" className="w-full max-w-3xl" />
}
