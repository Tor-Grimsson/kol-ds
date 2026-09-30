import { SectionNewsletter } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Newsletter signup',
  description: "An email field and a submit — the handler is the consumer's",
  category: 'signup',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/design-system', 'pattern/website-cards'],
  featured: true,
}
export const stage = 'full'

/* a mock handler: resolves after 600ms; an address starting "fail" rejects, to show the error line */
const subscribe = (email) =>
  new Promise((resolve, reject) => setTimeout(() => (email.startsWith('fail') ? reject(new Error('demo')) : resolve()), 600))

export default function SignupNewsletter() {
  return (
    <SectionNewsletter
      label="NEWSLETTER"
      headline="Subscribe to the newsletter"
      body="Get updates on new typefaces, design resources and selected work."
      placeholder="Your mail address"
      submitLabel="Subscribe"
      onSubmit={subscribe}
    />
  )
}
