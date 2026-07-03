import { CtaGlobal } from '@kolkrabbi/kol-component'

export const Default = () => (
  <CtaGlobal
    eyebrow="/ CONNECT"
    promptLabel="WORKING ON A PROJECT?"
    heading="SEND A MESSAGE"
    contactLabel="CONTACT"
    email="hello@kolkrabbi.io"
  />
)

// No email → the contact row (and its mailto anchor) is omitted.
export const PromptOnly = () => (
  <CtaGlobal
    eyebrow="/ CONNECT"
    promptLabel="WORKING ON A PROJECT?"
    heading="SEND A MESSAGE"
  />
)

// Extra label/value rows slot between the prompt and contact rows;
// a row with href renders a link, without renders a static heading.
export const SecondaryRows = () => (
  <CtaGlobal
    eyebrow="/ CONNECT"
    promptLabel="WORKING ON A PROJECT?"
    heading="SEND A MESSAGE"
    contactLabel="CONTACT"
    email="hello@kolkrabbi.io"
    secondaryRows={[
      { label: 'STUDIO', value: 'REYKJAVÍK, IS' },
      { label: 'PRESS', value: 'DOWNLOAD KIT', href: '#press' },
    ]}
  />
)
