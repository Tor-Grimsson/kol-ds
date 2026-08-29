import { SectionNewsletter } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function SectionNewsletterDemo() {
  // Mock handler: resolves after 600ms; addresses starting with "fail"
  // reject so the error status line can be exercised.
  const subscribe = (email) =>
    new Promise((resolve, reject) =>
      setTimeout(() => (email.startsWith('fail') ? reject(new Error('demo rejection')) : resolve()), 600)
    )

  return (
    <SectionNewsletter
      label="NEWSLETTER"
      headline="Subscribe to the newsletter"
      body="Get updates on new typefaces, design resources, and selected work."
      placeholder="Your mail address"
      submitLabel="Subscribe"
      onSubmit={subscribe}
    />
  )
}
