import { CtaGlobal } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Contact CTA band',
  description: 'An editorial closing CTA band with a display wordmark and a mailto contact row',
  category: 'marketing',
  type: 'reference',
  status: 'active',
  updated: '2026-07-30',
  tags: ['domain/design-system', 'pattern/blocks'],
}
export const stage = 'full'

export default function CtaBand() {
  return (
    <CtaGlobal
      className="px-6 md:px-10"
      eyebrow="/ Connect"
      promptLabel="Working on a project?"
      heading="Tell us what you're building"
      secondaryRows={[
        { label: 'Prefer a call?', value: 'Book a 30-minute intro' },
      ]}
      contactLabel="Send a message"
      email="studio@kolkrabbi.io"
    />
  )
}
