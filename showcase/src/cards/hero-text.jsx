import { Button, SectionHero } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Text hero',
  description: 'A hero with text only',
  category: 'hero',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/website', 'pattern/website-cards'],
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
