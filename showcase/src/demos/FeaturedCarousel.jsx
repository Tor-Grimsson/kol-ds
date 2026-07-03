import { FeaturedCarousel } from '@kolkrabbi/kol-component'

export const stage = 'full'

// Neutral stand-in artwork — inline SVG data URIs, no network, render anywhere.
const bg = (base, ring) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="${base}"/><circle cx="1150" cy="330" r="360" fill="none" stroke="${ring}" stroke-width="2"/><circle cx="1150" cy="330" r="220" fill="none" stroke="${ring}" stroke-width="2"/><line x1="0" y1="640" x2="1600" y2="640" stroke="${ring}" stroke-width="1"/><line x1="420" y1="0" x2="420" y2="900" stroke="${ring}" stroke-width="1"/></svg>`,
  )}`

const ITEMS = [
  {
    media: { src: bg('#1d1d21', '#6b6b74'), kind: 'image', alt: '' },
    title: 'Northern Signals',
    description: 'A wide media slide over a frosted glass panel — image background, centered content, one CTA.',
    href: '#northern-signals',
    ctaLabel: 'Read more',
  },
  {
    media: { src: bg('#20242b', '#5a7a86'), kind: 'image', alt: '' },
    title: 'Cold Harbour',
    description: 'Autoplay advances image slides on a timer; the bar across the top tracks the interval.',
    href: '#cold-harbour',
    ctaLabel: 'Read more',
  },
  {
    media: { src: bg('#241f26', '#8a6b86'), kind: 'image', alt: '' },
    title: 'Drift',
    description: 'Prev/next and drag ride the shared kol-embla carousel core; the autoplay ring is layered on top.',
    href: '#drift',
    ctaLabel: 'Read more',
  },
]

export default function FeaturedCarouselDemo() {
  return (
    <FeaturedCarousel
      items={ITEMS}
      sectionLabel="Featured"
      autoPlay
      autoPlayInterval={4000}
    />
  )
}
