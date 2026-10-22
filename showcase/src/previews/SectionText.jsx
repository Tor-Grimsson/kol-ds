import { Button, SectionText, Tag } from '@kolkrabbi/kol-component'

/* The ruled text block every section composes: label · headline · body ·
 * actions, each opt-in. `align` centres the block. The header LEVELS (2026-10-22 — PageHeader folded in):
 * page · app · section · content, each a role set an explicit prop still overrides. */
export const variants = ['block', 'centred', 'page', 'app', 'section', 'content']
export const stage = 'full'

const LEVEL = {
  page: { eyebrow: 'Library', headline: 'Use cases', body: 'The hero masthead of a page.' },
  app: { headline: 'Dev', body: 'Experiments and reference, not the app' },
  section: { eyebrow: 'Section', headline: 'One header, four levels', body: 'A section of a page.' },
  content: { eyebrow: 'Home', headline: 'Grid — catalog', body: 'What Home renders today: thumb · no thumb · long name.' },
}

export default function SectionTextPreview({ variant = 'block' }) {
  if (LEVEL[variant]) return (
    <div className="flex w-full flex-col">
      <SectionText level={variant} {...LEVEL[variant]} />
      {variant === 'content' && <div className="h-40 w-full rounded bg-fg-04" />}
    </div>
  )
  return (
    <div className="mx-auto w-full max-w-[28rem]">
      <SectionText
        align={variant === 'centred' ? 'center' : 'start'}
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
    </div>
  )
}
