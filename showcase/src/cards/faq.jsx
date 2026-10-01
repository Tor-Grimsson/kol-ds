import { SectionFaq } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'FAQ',
  description: 'Questions in an accordion',
  category: 'features',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/website', 'pattern/website-cards'],
}
export const stage = 'full'

const items = [
  { q: 'What does a design system license cover?', a: 'Every package under @kolkrabbi, source-available, for the projects named in the agreement.' },
  { q: 'Can I use the typefaces on the web?', a: 'Yes — the foundry licence includes web embedding for the licensed domains.' },
  { q: 'How are updates delivered?', a: 'As published npm versions; every publish carries a changelog entry.' },
]

export default function Faq() {
  return <SectionFaq label="FAQ" headline="Questions, answered" body="The things people ask before they write." items={items} singleOpen defaultOpen={0} />
}
