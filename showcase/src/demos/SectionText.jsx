import { Button, SectionText, Tag } from '@kolkrabbi/kol-component'

/* The ruled text block every section composes: label · headline · body ·
 * actions, each opt-in. `align` centres the block. */
export const variants = ['start', 'center']
export const stage = 'md'

export default function SectionTextDemo({ variant = 'start' }) {
  return (
    <SectionText
      align={variant}
      label="THE STUDIO"
      headline="One text block, every section"
      headlineSize="heading-02"
      body="Label, headline, body and actions — pass the ones the section needs and nothing else renders. Type is picked by role, never threaded in as a class."
      actions={
        <>
          <Button size="sm">Read more</Button>
          <Tag hash={false}>design-system</Tag>
        </>
      }
    />
  )
}
