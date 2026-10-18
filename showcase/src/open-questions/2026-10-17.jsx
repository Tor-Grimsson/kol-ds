import { DocHeader, usePageMeta } from '@kolkrabbi/kol-workshop'
import { PageHeader } from '@kolkrabbi/kol-component'

/* Round 11 — one header, two levels (plan-2026-10-17 6.4). Simplified 2026-10-18 on the user's word: the scale
 * follows Material 3's — a page lede at "title large" (22/28), section text at "body large" (16/24, +0.5px) —
 * in KOL's faces. The earlier comparison page is in _tmp/2026-10-17-dev-space/round11-before-simplify.jsx. */
export const meta = {
  round: 11,
  date: '2026-10-17',
  title: 'One header',
  status: 'answered',
}

const INK = 'color-mix(in srgb, var(--kol-surface-on-primary) 72%, transparent)'
const LEVELS = [
  {
    level: 'Page', eyebrow: 'BRAND GUIDELINES', title: 'Kolkrabbi Vinnustofa', size: 'display-01', as: 'h1',
    body: 'Client-facing identity guidelines — chapter-structured for handoff. Mirrors the shape of the deliverable PDF.',
    bodyStyle: { fontSize: 22, lineHeight: '28px', fontWeight: 300, letterSpacing: '0.01em', color: INK },
    spec: ['Eyebrow · JetBrains Mono 12/12 · Medium · +0.72px · caps', 'Title · Right Grotesk Tight 96/96 · Medium', 'Description · Right Grotesk 22/28 · Light · +0.22px · ink 72%'],
  },
  {
    level: 'Section', eyebrow: 'OVERVIEW', title: 'Chapters', size: 'display-03', as: 'h2',
    body: 'Each chapter is its own page. They read in order, but every one stands alone for handoff.',
    bodyStyle: { fontSize: 16, lineHeight: '24px', fontWeight: 300, letterSpacing: '0.5px', color: INK },
    spec: ['Eyebrow · JetBrains Mono 12/12 · Medium · +0.72px · caps', 'Title · Right Grotesk Tight (display-03) · Medium', 'Description · Right Grotesk 16/24 · Light · +0.5px · ink 72%'],
  },
]

export default function OpenQuestionsRound11() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Open questions · Round 11" title="One header" lede="Approved 2026-10-18 and shipped: PageHeader in the site register, the page level at xl and the section level. Sizes after Material 3's scale." />
      {LEVELS.map((l) => (
        <section key={l.level} className="flex flex-col gap-3">
          <div className="rounded border border-fg-08 p-10 bg-surface-primary">
            {/* SHIPPED (2026-10-18): the approved header IS PageHeader — register="site", page at xl, section at md */}
            <PageHeader register="site" level={l.level === 'Page' ? 'page' : 'section'} size={l.level === 'Page' ? 'xl' : 'md'} eyebrow={l.eyebrow} title={l.title} description={l.body} />
          </div>
          <ul className="kol-mono-12 text-meta flex flex-col gap-1">
            <li className="text-emphasis">{l.level}</li>
            {l.spec.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      ))}
    </div>
  )
}
