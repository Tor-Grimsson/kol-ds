import { SectionHero } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Split hero',
  description: 'Media on one half, text the other',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/layout', 'domain/media', 'domain/website', 'pattern/website-cards'],
}
export const stage = 'full'

export default function HeroSplit() {
  return <SectionHero variant="split" headline="A title card in two halves" className="min-h-[640px]" />
}
