import { Button, SectionText, Tag } from '@kolkrabbi/kol-component'

/* The ruled text block every section composes: label · headline · body ·
 * actions, each opt-in. `align` centres the block. The header LEVELS (2026-10-22 — PageHeader folded in):
 * page · app · section · content · document, each a role set an explicit prop still overrides. */
export const variants = ['block', 'centred', 'page', 'app', 'section', 'content', 'document', 'float', 'kolbox', 'folio']
export const stage = 'full'

const LEVEL = {
  page: { eyebrow: 'Library', headline: 'Use cases', body: 'The hero masthead of a page.' },
  app: { headline: 'Dev', body: 'Experiments and reference, not the app' },
  section: { eyebrow: 'Section', headline: 'One header, four levels', body: 'A section of a page.' },
  content: { eyebrow: 'Home', headline: 'Grid — catalog', body: 'What Home renders today: thumb · no thumb · long name.' },
  /* float (W9 rows 135 · 140): the float page header — mono eyebrow, title, subtitle */
  float: { eyebrow: 'Studio  /  Workspace', headline: 'Dashboard', body: 'Tasks, projects, links — your living workspace.' },
  document: { headline: 'Lab', body: 'The Atlas identity lab: the generators, and the type and colour pages made from them. Each entry opens on its first view; the dropdown in the bar switches between its views.' },
}

export default function SectionTextPreview({ variant = 'block' }) {
  /* folio (Folio batch E): a page's title block and a numbered section head, on Folio's paper */
  if (variant === 'folio') return <div data-folio-theme="light" className="w-full bg-[var(--kol-folio-paper)] p-6 leading-[1.21] text-[var(--kol-folio-ink)] [font-family:var(--kol-font-family-float)]"><div className="flex flex-col gap-[36px]"><SectionText variant="folio" eyebrow="Your own little world" headline="My library" body="Old favorites, new discoveries, and the next good chapter." /><SectionText variant="folio" inline eyebrow="01" headline="Fresh on your shelf" headlineSize="section" headlineAs="h2" meta="The newest from each shelf." gap="gap-[18px]" /></div></div>
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return <div className="w-full"><SectionText variant="kolbox" headline="Drafts" actions={<Button variant="kolbox">New file</Button>} /></div>
  if (LEVEL[variant]) return (
    <div className="flex w-full flex-col">
      <SectionText variant={variant} {...LEVEL[variant]} />
      {variant === 'content' && <div className="h-40 w-full rounded bg-fg-04" />}
      {/* a section heading on the float: the window role and the source at the row's end (row 140) */}
      {variant === 'float' && <SectionText variant="float" headline="Website traffic" headlineClass="kol-float-window" meta="kolkrabbi.io · Umami" />}
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
