import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'

/* Round 2 — the one call Round 1 left open. Q3 was drawn wrong there (x padding on a row with no
 * wash); the user named the two valid pairs, drawn here as they are. */
export const meta = {
  round: 2,
  date: '2026-09-30',
  title: 'Search rows, redrawn',
  status: 'answered',
}

const card = 'flex min-w-0 flex-col gap-3 rounded border border-fg-08 p-4'
const ROW = { title: 'App anatomy', meta: 'doc · Documentation · docs · 2026-09-29', desc: 'An app’s six layers, engine to fixture' }
const ROWS = [
  { label: 'Wash', note: 'x padding, background wash on hover', link: 'flex flex-col gap-1 px-3 py-3 hover:bg-fg-04', title: 'kol-doc-body text-emphasis' },
  { label: 'Underline', note: 'no x padding, no wash; the title underlines and the row inks up', link: 'group flex flex-col gap-1 py-3 opacity-80 hover:opacity-100', title: 'kol-doc-body text-emphasis group-hover:underline underline-offset-4' },
]

export default function OpenQuestionsRound2() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 2 · 2026-09-30"
        title="Search rows, redrawn"
        lede="One call left open by Round 1. Hover each."
      />
      <DocSection id="q1" title="Search rows">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ROWS.map((r) => (
            <div key={r.label} className={card}>
              <span className="kol-doc-body text-emphasis">{r.label}</span>
              <a href="#q1" onClick={(e) => e.preventDefault()} className={`${r.link} border-t border-b border-fg-08`}>
                <span className={r.title}>{ROW.title}</span>
                <span className="kol-helper-12 text-subtle">{ROW.meta}</span>
                <span className="kol-doc-body">{ROW.desc}</span>
              </a>
              <span className="kol-mono-12 text-subtle">{r.note}</span>
            </div>
          ))}
        </div>
        <p className="kol-doc-body rounded border border-fg-16 px-4 py-3">
          <span className="text-emphasis">Answered 2026-09-30 — </span>
          <strong>Both, as variants.</strong> The row becomes a component with <code>variant="underline" | "wash"</code>; underline is the default.
        </p>
      </DocSection>
    </div>
  )
}
