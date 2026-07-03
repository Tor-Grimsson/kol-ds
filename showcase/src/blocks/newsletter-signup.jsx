import { NewsletterBand } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Newsletter signup',
  description: 'A centered subscribe band with a working local submit that resolves to a success state',
  category: 'form',
}
export const stage = 'full'

/* Fake network: resolve after a short delay so the band flips to its success
 * state without any real request. */
const fakeSubscribe = (email) =>
  new Promise((resolve) => {
    console.info('Subscribing', email)
    setTimeout(resolve, 900)
  })

export default function NewsletterSignup() {
  return (
    <NewsletterBand
      id="signup"
      title="Stay in the loop"
      description="One email a month on new components, release notes and the occasional deep dive into how the system is built. No spam, unsubscribe anytime."
      placeholder="you@studio.com"
      submitLabel="Subscribe"
      onSubmit={fakeSubscribe}
      successCopy="You're on the list — check your inbox to confirm."
      errorCopy="That didn't go through. Please check the address and try again."
    />
  )
}
