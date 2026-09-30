import { SectionCta } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Editorial CTA',
  description: 'A closing band with a display wordmark and a contact row',
  category: 'cta',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
  featured: true,
}
export const stage = 'full'

export default function CtaEditorial() {
  return (
    <SectionCta
      eyebrow="/ CONNECT"
      promptLabel="WORKING ON A PROJECT?"
      heading="SEND A MESSAGE"
      contactLabel="CONTACT"
      email="hello@kolkrabbi.io"
    />
  )
}
