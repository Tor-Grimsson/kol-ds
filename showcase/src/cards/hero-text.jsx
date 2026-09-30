import { Button, SectionHero } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Text hero',
  description: 'No media — the composed text on the surface',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function HeroText() {
  return (
    <SectionHero
      height="60"
      label="LICENSING"
      headline="One licence, every project"
      body="The text-only hero — the composed text on the surface, no media, no glass."
      actions={<Button size="sm">Read the terms</Button>}
    />
  )
}
