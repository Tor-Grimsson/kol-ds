import { useParams, Navigate } from 'react-router-dom'
import { DocHeader, DocSection, DocsFrontmatter } from '@kolkrabbi/kol-workshop'
import PreviewCard from '../lib/PreviewCard.jsx'
import { DocTable } from '@kolkrabbi/kol-workshop'
import { DEMOS } from '../lib/demos-registry.js'
import { getComponentBySlug, CATEGORY_LABELS, slugify } from '../nav/registry.js'
import { MEMBERSHIP_FLAGS } from '../nav/classification.js'
import MdxDoc from '../lib/MdxDoc.jsx'
import API_GEN from '../usage/api-tables.json'
import { mergeApi, buildProvenance, Pager, CodeLine, InstallBlock } from '../lib/component-page-parts.jsx'

/* MDX seam (2026-07-30): a component with `src/docs/components/<Name>.mdx`
 * renders that document — the shadcn model, where a component page IS a
 * document with live previews embedded. Every DOC_DATA entry converted
 * 2026-07-30 (component-docs.js is gone); the generated fallback below now
 * serves only components with no .mdx yet — header + install + import line +
 * extracted API — so a new export gets a page the day it lands. */
const COMPONENT_DOCS = import.meta.glob('../docs/components/*.mdx', { eager: true })
const mdxFor = (name) => COMPONENT_DOCS[`../docs/components/${name}.mdx`] ?? null

export default function ComponentPage() {
  const { slug } = useParams()
  const c = getComponentBySlug(slug)
  if (!c) return <Navigate to="/components" replace />

  /* R1 membership flag (classification.js MEMBERSHIP_FLAGS) — rendered above
   * BOTH document branches: "flagged, not silently blessed, and its page says
   * so" (02-placement.md § Membership). */
  const flag = MEMBERSHIP_FLAGS[c.name]
  const flagNotice = flag ? (
    <p className="kol-helper-12 text-emphasis border border-fg-32 rounded px-4 py-3 mb-6">
      Membership — {flag}
    </p>
  ) : null

  const mdx = mdxFor(c.name)
  if (mdx) return <>{flagNotice}<MdxDoc module={mdx} component={c} /></>

  const api = mergeApi([], API_GEN[c.name] || [])
  const members = c.members || []

  return (
    <>
      {flagNotice}
      <DocHeader
        eyebrow={`Components / ${CATEGORY_LABELS[c.category] ?? c.category}`}
        title={c.name}
        lede={c.description}
      />

      {DEMOS[c.name] && <PreviewCard entry={DEMOS[c.name]} />}

      {/* one panel — the same fold as MdxDoc; see buildProvenance */}
      <DocsFrontmatter metadata={buildProvenance(c)} />

      <DocSection id="installation" title="Installation">
        <InstallBlock pkg={c.pkg} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeLine text={`import { ${[c.name, ...members.map((m) => m.name)].join(', ')} } from '${c.pkg}'`} />
      </DocSection>

      {members.length > 0 && (
        <DocSection id="parts" title="Parts" lede={`${c.name} composes from these parts — import them from the same package.`}>
          {members.map((m) => (
            <div key={m.name} className="flex flex-col gap-3">
              <h3 id={slugify(m.name)} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{m.name}</h3>
              {m.description && <p className="kol-sans-body-02 text-body">{m.description}</p>}
              {DEMOS[m.name] && <PreviewCard entry={DEMOS[m.name]} />}
            </div>
          ))}
        </DocSection>
      )}

      {api.length > 0 && (
        <DocSection id="api" title="API Reference">
          <DocTable rows={api} />
        </DocSection>
      )}

      <Pager slug={c.slug} />
    </>
  )
}
