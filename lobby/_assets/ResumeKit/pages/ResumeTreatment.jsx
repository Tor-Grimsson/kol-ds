import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import KitPreview from './KitPreview'
import ResumeMarginalia from './ResumeMarginalia'
import ResumeRail from './ResumeRail'
import ResumeGrid from './ResumeGrid'
import ExportButtons from '../components/ExportButtons'
import KitOptions from '../components/KitOptions'
import { TREATMENTS } from '../lib/treatments'
import { readKitOptions } from '../lib/kitOptions'
import { readLang } from '../lib/i18n'

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
      <ExportButtons treatment={t} lang={lang} options={readKitOptions(params)} />
      <KitOptions kit={isKit} />
      {isKit ? <KitPreview mode={t.mode} lang={lang} /> : <Layout lang={lang} />}
    </>
  )
}
