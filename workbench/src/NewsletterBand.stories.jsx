import { NewsletterBand } from '@kolkrabbi/kol-component'

const resolveAfter = (ms) => () => new Promise((resolve) => setTimeout(resolve, ms))
const rejectAfter = (ms) => () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('demo rejection')), ms))

export const Default = () => (
  <NewsletterBand
    title="Subscribe to the newsletter"
    description="Get updates on new typefaces, design resources, and selected work."
    placeholder="Your mail address"
    submitLabel="Subscribe"
    onSubmit={resolveAfter(600)}
  />
)

export const ErrorPath = () => (
  <NewsletterBand
    title="Subscribe to the newsletter"
    description="Every submit rejects after 600ms — exercises the submitting state and the role=alert error line."
    placeholder="Your mail address"
    submitLabel="Subscribe"
    onSubmit={rejectAfter(600)}
  />
)

export const CustomCopy = () => (
  <NewsletterBand
    id="signup"
    title="Join the dispatch"
    description="Custom status copy: success and error lines are props with the source strings as defaults."
    placeholder="you@harbour.is"
    submitLabel="Sign up"
    successCopy="Welcome aboard — first dispatch lands Friday."
    errorCopy="That address didn't take. Try again."
    onSubmit={resolveAfter(600)}
  />
)
