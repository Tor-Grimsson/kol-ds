import { Link } from 'react-router-dom'
import { DocSection } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import { DEV_TOOLS, DEV_RECORDS } from '../nav/shell-nav.js'

/**
 * Development — what the repo measures about itself (showcase refinement 2026-09-28, user:
 * "references, and quarantine as main navigation spaces I question? these feel like development
 * datapoints … I would fold these into one space and there could also be future audits or
 * reports"). References and Quarantine left the header and live here; audits and reports join
 * this page when they are published into the site.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export default function Development() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="development" />
      <DocSection id="tools" title="Tools">
        <ul className="flex flex-col gap-2">
          {DEV_TOOLS.map((t) => (
            <li key={t.id} className="kol-doc-body">
              <Link className={linkCls} to={t.path}>{t.label}</Link>
              <span className="text-subtle"> — {t.description}</span>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection id="records" title="Records">
        <ul className="flex flex-col gap-2">
          {DEV_RECORDS.map((t) => (
            <li key={t.id} className="kol-doc-body">
              <Link className={linkCls} to={t.path}>{t.label}</Link>
              <span className="text-subtle"> — {t.description}</span>
            </li>
          ))}
        </ul>
      </DocSection>
    </div>
  )
}
