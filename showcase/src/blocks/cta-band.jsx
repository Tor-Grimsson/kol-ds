import { CtaGlobal } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Contact CTA band',
  description: 'An editorial closing CTA band with a display wordmark and a mailto contact row',
  category: 'marketing',
}
export const stage = 'full'

export default function CtaBand() {
  return (
    <CtaGlobal
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
