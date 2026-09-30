import { Button, SectionHero } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Media hero',
  description: 'Full-bleed cover media, a surface scrim, and the text in a glass panel',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
  featured: true,
}
export const stage = 'full'

export default function HeroMedia() {
  return (
    <SectionHero
      media={{ src: heroBg, kind: 'image', alt: '' }}
      height="md"
      overlayOpacity={24}
      label="KOLKRABBI"
      headline="Full-bleed media hero"
      body="Cover media, an optional scrim, and the text in a glass panel — composed from SectionText."
      actions={<Button size="sm">View work</Button>}
    />
  )
}
