import { Link } from 'react-router-dom'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { DEV_TOOLS } from '../nav/shell-nav.js'

/**
 * Development — what the repo measures about itself (showcase refinement 2026-09-28, user:
 * "references, and quarantine as main navigation spaces I question? these feel like development
 * datapoints … I would fold these into one space and there could also be future audits or
 * reports"). References and Quarantine left the header and live here; audits and reports join
 * this page when they are published into the site.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export default function Development() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Development"
        title="Development"
        lede="Generated from the repo itself — who depends on what, and what the sidebar admits. Not the design system; the instruments around it."
      />
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
      <DocSection id="records" title="Audits and reports">
        <p className="kol-doc-body">None published yet. A dated audit or a generated report lands here, beside the tools that produce them.</p>
      </DocSection>
    </div>
  )
}
