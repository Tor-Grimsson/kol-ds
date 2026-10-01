import { Link, useParams, Navigate } from 'react-router-dom'
import { DocSection, DocsFrontmatter } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import { useFrontmatter } from '../lib/frontmatter.jsx'

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
  const showFrontmatter = useFrontmatter('page')
  const r = ROUNDS.find((x) => x.slug === round)
  if (!r) return <Navigate to="/development/open-questions" replace />
  /* EVERY ROUND CARRIES FRONTMATTER (2026-10-01 — user: "open questions dont have frontmatter, only
   * open questions home has, not the actual entries"), from the `meta` the round already exports */
  return (
    <>
      {showFrontmatter && (
        <div className="mb-10">
          <DocsFrontmatter metadata={{ title: `Round ${r.meta.round} — ${r.meta.title}`, type: 'decision', status: r.meta.status, created: r.meta.date, tags: ['domain/workflow', 'audience/agency-internal'] }} />
        </div>
      )}
      <r.Page />
    </>
  )
}

export default function OpenQuestions() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="open-questions" />
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
