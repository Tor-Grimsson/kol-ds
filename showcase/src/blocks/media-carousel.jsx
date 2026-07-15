import { FeaturedCarousel } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Media carousel',
  description: 'A featured carousel of wide image slides with title, blurb and CTA',
  category: 'media',
}
export const stage = 'full'

/* Real wide imagery (served at /kol-images), cycled through the slides. */
const KOL_IMAGES = Array.from({ length: 7 }, (_, i) => `/kol-images/tt-0${i + 1}.jpg`)
let _phi = 0
const slide = () => KOL_IMAGES[_phi++ % KOL_IMAGES.length]

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
      sectionLabel="FEATURED STORIES"
      autoPlay
      autoPlayInterval={6000}
    />
  )
}
