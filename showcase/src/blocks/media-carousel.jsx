import { FeaturedCarousel } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Media carousel',
  description: 'A featured carousel of wide image slides with title, blurb and CTA',
  category: 'media',
}
export const stage = 'full'

/* Inline wide gradient slide — no network. Each is a standalone SVG document. */
const slide = (a, b, seed = 0) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>` +
      `</linearGradient></defs>` +
      `<rect width='1600' height='900' fill='url(#g)'/>` +
      `<circle cx='${300 + seed * 200}' cy='300' r='260' fill='#ffffff' opacity='0.07'/>` +
      `<circle cx='${1200 - seed * 160}' cy='620' r='340' fill='#000000' opacity='0.10'/>` +
      `<path d='M0 700 L1600 ${480 - seed * 40} L1600 900 L0 900 Z' fill='#ffffff' opacity='0.05'/>` +
      `</svg>`,
  )}`

const ITEMS = [
  {
    media: { src: slide('#0F766E', '#22D3EE', 0), kind: 'image', alt: 'Teal to cyan gradient' },
    title: 'The Tidewater Issue',
    description: 'Our summer field guide to coastal craft — kelp dyeing, driftwood joinery, and the makers keeping the harbour alive.',
    href: '#/features/tidewater',
    ctaLabel: 'Read the issue',
  },
  {
    media: { src: slide('#7C2D12', '#F59E0B', 1), kind: 'image', alt: 'Rust to amber gradient' },
    title: 'Type Foundry at Work',
    description: 'A studio visit with the punchcutters reviving a lost 19th-century grotesk, one drawn glyph at a time.',
    href: '#/features/foundry',
    ctaLabel: 'Take the tour',
  },
  {
    media: { src: slide('#4C1D95', '#EC4899', 2), kind: 'image', alt: 'Violet to pink gradient' },
    title: 'After Hours in the Print Room',
    description: 'Risograph experiments, three-colour misregistration, and the happy accidents we kept.',
    href: '#/features/print-room',
    ctaLabel: 'See the prints',
  },
]

export default function MediaCarousel() {
  return (
    <FeaturedCarousel
      items={ITEMS}
      sectionLabel="Featured stories"
      autoPlay
      autoPlayInterval={6000}
    />
  )
}
