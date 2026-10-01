import { Button, SectionCards } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Feature cards',
  description: 'A headline over image cards',
  category: 'features',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/cards', 'domain/media', 'pattern/website-cards'],
  featured: true,
}
export const stage = 'full'

const features = [
  { title: 'Type foundry', icon: 'book-open', visual: gradient('#6C5CE7', '#00B894'), imageAspectRatio: '10/6', description: 'Original typefaces, variable and static.' },
  { title: 'Design systems', icon: 'grid', visual: gradient('#0984E3', '#6C5CE7'), imageAspectRatio: '10/6', description: 'Tokenised, themeable component kits.' },
  { title: 'Client work', icon: 'folder', visual: gradient('#E17055', '#FDCB6E'), imageAspectRatio: '10/6', description: 'Brand, editorial and product design.' },
]

export default function FeaturesCards() {
  return (
    <SectionCards
      headline="What we make"
      body="A small studio building typefaces, design systems and brand work in the open."
      headerClassName="w-full"
      features={features}
      actions={<><Button>Explore projects</Button><Button variant="ghost">Get in touch</Button></>}
      actionsClassName="pt-8"
    />
  )
}
