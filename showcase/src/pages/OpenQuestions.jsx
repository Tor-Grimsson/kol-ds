import { Link, useParams, Navigate } from 'react-router-dom'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'

/**
 * Open questions — visual calls the user picks by eye, in ROUNDS (user, 2026-09-30: *"put them in
 * a page, we dont need to remove it, just let it archive normally … when you have another set of
 * open questions another page gets added"*).
 *
 * One file per round in `src/open-questions/`, exporting `meta = { round, date, title, status }`
 * and the page. A round is never edited once answered — its answers are recorded on it and it
 * stays as the record. A new set of questions is a new file; nothing is removed.
 */
const MODULES = import.meta.glob('../open-questions/*.jsx', { eager: true })

export const ROUNDS = Object.entries(MODULES)
  .map(([path, mod]) => ({ slug: path.split('/').pop().replace('.jsx', ''), meta: mod.meta, Page: mod.default }))
  .sort((a, b) => b.meta.round - a.meta.round)

export const roundHref = (slug) => `/development/open-questions/${slug}`

const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export function OpenQuestionsRound() {
  const { round } = useParams()
  const r = ROUNDS.find((x) => x.slug === round)
  if (!r) return <Navigate to="/development/open-questions" replace />
  return <r.Page />
}

export default function OpenQuestions() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Development"
        title="Open questions"
        lede="Visual calls shown side by side and picked by eye, one round at a time. Answered rounds stay as the record."
      />
      <DocSection id="rounds" title="Rounds">
        <ul className="flex flex-col gap-2">
          {ROUNDS.map((r) => (
            <li key={r.slug} className="kol-doc-body">
              <Link className={linkCls} to={roundHref(r.slug)}>Round {r.meta.round} — {r.meta.title}</Link>
              <span className="text-subtle"> · {r.meta.date} · {r.meta.status}</span>
            </li>
          ))}
        </ul>
      </DocSection>
    </div>
  )
}
