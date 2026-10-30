import { useSearchParams } from 'react-router-dom'
import { A4Pages as A4Page } from '@kolkrabbi/kol-styleguide'
import { kitSections } from '../lib/kitSections.jsx'
import { KIT_PAGES, readKitOptions } from '../lib/kitOptions.js'

/**
 * Whole-kit preview — stacks the application kit (Cover → Resume → Cover Letter
 * → Portfolio → Let's talk) in the plain ink-on-white look the PDF export
 * produces (`scripts/export-kit.sh --v2`). The section components are reused
 * verbatim — data drives them — so this preview never drifts from the source.
 *
 * Two modes, the two `kit` treatments (/resume/t/kit-continuous, /resume/t/kit-a4):
 *   - 'continuous': each section on an A4-width sheet that grows for its content.
 *   - 'a4':         each section standardized to a true A4 sheet (1:√2), content
 *                   scaled to fit one page.
 *
 * Which sections are included, and the Role/Company the letter is addressed to,
 * come from the URL query (lib/kitOptions.js) so the headless export inherits
 * them by loading the same URL. The treatment route owns the overlays
 * (ExportButtons + KitOptions) that edit them.
 *
 * The light theme is scoped to the preview container (data-theme), so opening it
 * does NOT flip the surrounding app chrome from dark to light.
 */

export default function KitPreview({ mode = 'continuous', lang = 'en' }) {
  const [params] = useSearchParams()
  const options = readKitOptions(params)
  const { role, company } = options

  const nodes = kitSections(lang, { preview: true, role, company })
  const pages = KIT_PAGES.filter((p) => options.pages.includes(p.id))

  return (
    <div className="kol-kit-preview" data-theme="light" data-kit-mode={mode} lang={lang}>
      {pages.map(({ id, label }) =>
        mode === 'a4' ? (
          <A4Page key={id} label={label}>{nodes[id]}</A4Page>
        ) : (
          <section key={id} className="kol-kit-page" aria-label={label}>
            {nodes[id]}
          </section>
        ),
      )}
    </div>
  )
}
