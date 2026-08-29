import { Button, SectionCta } from '@kolkrabbi/kol-component'

export const variants = ['editorial', 'centered', 'connect']
export const stage = 'full'

export default function SectionCtaDemo({ variant = 'editorial' }) {
  if (variant === 'connect') return <SectionCta variant="connect" />
  if (variant === 'centered') {
    return (
      <SectionCta
        variant="centered"
        headline="Licence this typeface"
        body="One licence covers web, desktop and app embedding for the named domains."
        actions={<><Button>See licences</Button><Button variant="outline">Ask a question</Button></>}
      />
    )
  }
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
