import { Button, SectionCta } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Centered CTA',
  description: 'A centred headline with two actions',
  category: 'cta',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/website', 'pattern/website-cards'],
}
export const stage = 'full'

export default function CtaCentered() {
  return (
    <SectionCta
      variant="centered"
      headline="Licence this typeface"
      body="One licence covers web, desktop and app embedding for the named domains."
      actions={<><Button>See licences</Button><Button tone="outline">Ask a question</Button></>}
    />
  )
}
