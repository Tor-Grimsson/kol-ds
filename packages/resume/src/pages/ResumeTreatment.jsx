import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import KitPreview from './KitPreview.jsx'
import ResumeMarginalia from './ResumeMarginalia.jsx'
import ResumeRail from './ResumeRail.jsx'
import ResumeGrid from './ResumeGrid.jsx'
import ExportButtons from '../components/ExportButtons.jsx'
import KitOptions from '../components/KitOptions.jsx'
import { TREATMENTS } from '../lib/treatments.js'
import { readKitOptions } from '../lib/kitOptions.js'
import { readLang } from '../lib/i18n.js'

const LAYOUTS = { marginalia: ResumeMarginalia, rail: ResumeRail, grid: ResumeGrid }

/* One route for every treatment of the source — /resume/t/:slug. The slug
 * picks the renderer (lib/treatments.js); ?lang, ?pages, ?role, ?company ride
 * the URL so the headless export (scripts/export-kit.sh) reproduces exactly
 * what the preview shows. The route owns the overlays; the renderers below
 * are pure data → sheet. */
export default function ResumeTreatment() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const t = TREATMENTS.find((x) => x.slug === slug)
  if (!t) return <Navigate to="/resume/library" replace />

  const lang = readLang(params)
  const isKit = t.kind === 'kit'
  const Layout = LAYOUTS[t.slug]

  return (
    <>
      {/* THE TOOLBAR, in flow at the treatment's top (LayoutsAppPages, 2026-10-29): record pinned the two controls over the
        * page's top-right corner, where a host's own controls live (they sat on the variants control). Sticky, so it stays
        * at hand as the sheet scrolls; out of the print. */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-fg-08 bg-surface-primary px-6 py-3 print:hidden">
        <KitOptions kit={isKit} />
        <ExportButtons treatment={t} lang={lang} options={readKitOptions(params)} />
      </div>
      {/* a sheet is print-sized: on a phone it scrolls sideways in its own box, never the whole page */}
      <div className="overflow-x-auto">{isKit ? <KitPreview mode={t.mode} lang={lang} /> : <Layout lang={lang} />}</div>
    </>
  )
}
