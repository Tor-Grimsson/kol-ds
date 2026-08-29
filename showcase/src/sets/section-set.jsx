import { Button, SectionHero, SectionSplit, SectionCards, SectionCta, SectionNewsletter, SectionFaq } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Section Set',
  description: 'The website sections as one page — split hero, split, cards band, CTA, newsletter, FAQ — every one composed from SectionText',
  category: 'editorial',
  type: 'reference',
  status: 'draft',
  updated: '2026-08-26',
  tags: ['domain/design-system', 'pattern/sets'],
}
export const stage = 'full'

const gradient = (from, to) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/></svg>`,
  )

const features = [
  { title: 'Type foundry', icon: 'book-open', visual: gradient('#6C5CE7', '#00B894'), imageAspectRatio: '10/6', description: 'Original typefaces, variable and static.' },
  { title: 'Design systems', icon: 'grid', visual: gradient('#0984E3', '#6C5CE7'), imageAspectRatio: '10/6', description: 'Tokenised, themeable component kits.' },
  { title: 'Client work', icon: 'folder', visual: gradient('#E17055', '#FDCB6E'), imageAspectRatio: '10/6', description: 'Brand, editorial, and product design.' },
]

const faq = [
  { q: 'What does a design system license cover?', a: 'Every package under @kolkrabbi, source-available, for the projects named in the agreement.' },
  { q: 'Can I use the typefaces on the web?', a: 'Yes — the foundry licence includes web embedding for the licensed domains.' },
  { q: 'How are updates delivered?', a: 'As published npm versions; every publish carries a changelog entry.' },
]

/* One page, five sections, one text block underneath all of them. The hero is
 * the split variant with no media passed — the placeholder IS the half. */
export default function SectionSet() {
  return (
    <div className="flex w-full flex-col">
      <SectionHero variant="split" headline="A studio in two halves" />
      <SectionSplit
        label="THE STUDIO"
        headline={<>Built to hold <em>course</em></>}
        body="Label, display headline and lede beside a cover-fit visual. Pass meta for a stats strip or actions for a button row — pick one."
        actions={<><Button>Explore</Button><Button variant="secondary">Read the log</Button></>}
        media={<div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, var(--kol-fg-08) 0%, var(--kol-fg-32) 100%)' }} />}
        caption="FIG 01 — HARBOUR, REYKJAVÍK"
      />
      <SectionCards
        headline="What we make"
        body="A small studio building typefaces, design systems, and brand work in the open."
        headerClassName="w-full"
        features={features}
        actions={<><Button>Explore projects</Button><Button variant="ghost">Get in touch</Button></>}
        actionsClassName="pt-8"
      />
      <SectionCta eyebrow="/ CONNECT" promptLabel="WORKING ON A PROJECT?" heading="SEND A MESSAGE" contactLabel="CONTACT" email="hello@kolkrabbi.io" />
      <SectionNewsletter label="NEWSLETTER" headline="Subscribe to the newsletter" body="Get updates on new typefaces, design resources, and selected work." placeholder="Your mail address" submitLabel="Subscribe" onSubmit={() => Promise.resolve()} />
      <SectionFaq label="FAQ" headline="Questions, answered" items={faq} singleOpen defaultOpen={0} />
    </div>
  )
}
