import { SectionHero } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Split hero',
  description: 'A title card in two halves — media one side, text centred in the other',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function HeroSplit() {
  return <SectionHero variant="split" headline="A title card in two halves" className="min-h-[640px]" />
}
