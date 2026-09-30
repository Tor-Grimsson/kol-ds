import { SectionCta } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Connect CTA',
  description: 'The studio contact band',
  category: 'cta',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
}
export const stage = 'full'

export default function CtaConnect() {
  return <SectionCta variant="connect" />
}
