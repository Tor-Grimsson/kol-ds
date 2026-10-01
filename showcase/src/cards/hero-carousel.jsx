import { SectionHero } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Carousel hero',
  description: 'A hero that cycles its media',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/media', 'domain/website', 'pattern/website-cards'],
}
export const stage = 'full'

export default function HeroCarousel() {
  return (
    <SectionHero
      media={[
        { src: heroBg, kind: 'image', alt: '', title: 'Málrómur', description: 'A variable serif for long reading.', href: '#' },
        { src: heroBg, kind: 'image', alt: '', title: 'Tröllatunga', description: 'A display grotesk with teeth.', href: '#' },
      ]}
      height="60"
      autoPlay
      ctaLabel="Explore typeface"
      onNavigate={(href, e) => e.preventDefault()}
    />
  )
}
