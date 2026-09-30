import { Link } from 'react-router-dom'
import HomeDoc from '../lib/HomeDoc.jsx'
import { DOCS_GUIDES } from '../nav/shell-nav.js'

/** Guides — the Styles chapter's home (2026-09-30): its markdown, then every guide. */
export default function GuidesHome() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="guides" />
      <ul className="flex flex-col gap-2">
        {DOCS_GUIDES.map((g) => (
          <li key={g.id} className="kol-doc-body">
            <Link className="underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64" to={g.path}>{g.label}</Link>
            {g.description && <span className="text-subtle"> — {g.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
