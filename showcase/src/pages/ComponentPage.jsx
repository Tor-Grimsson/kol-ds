import { useParams, Navigate } from 'react-router-dom'
import { DocHeader, DocsFrontmatter, usePageMeta } from '@kolkrabbi/kol-workshop'
import PreviewCard from '../lib/PreviewCard.jsx'
import { PREVIEWS } from '../lib/previews-registry.js'
import { getComponentBySlug, CATEGORY_LABELS, slugify, TOP_LEVEL } from '../nav/registry.js'
import { MDX_DOCS } from '../nav/vault.js'
import { MEMBERSHIP_FLAGS, SHOWN_IN } from '../nav/classification.js'
import { labelFromSlug } from '../nav/labels.js'
import MdxDoc, { DocArticle } from '../lib/MdxDoc.jsx'
import { mdxComponents, Api } from '../lib/mdx-components.jsx'
import { useFrontmatter } from '../lib/frontmatter.jsx'
import API_GEN from '../usage/api-tables.json'

/* the generated page's headings are the authored page's headings — same class, same anchor rule */
const H2 = mdxComponents.h2
import { buildProvenance, Pager, CodeLine, InstallBlock, Nested } from '../lib/component-page-parts.jsx'

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
  const showFrontmatter = useFrontmatter('page')
  /* THE PAGE TELLS THE RIGHT RAIL WHAT IT IS ABOUT (2026-09-28): its tags, and its siblings in
   * the same tier as related pages (members have no page of their own). The rail used to be
   * handed empty lists. */
  usePageMeta(c ? {
    tags: MDX_DOCS.find((d) => d.href === `/components/${c.slug}`)?.metadata?.tags ?? [`domain/components/${c.category}`, ...(c.function ? [`pattern/${c.function}`] : [])],
    related: [
      ...TOP_LEVEL.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 6).map((x) => ({ to: `/components/${x.slug}`, label: x.displayName })),
    ],
  } : null)
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

  const hasApi = (API_GEN[c.name] || []).length > 0
  const members = c.members || []

  /* FRONTMATTER FIRST, THE SAME AS AN MDX PAGE (2026-09-30, the names audit: *"nothing should
   * be before frontmatter"*). The generated page carries what an MDX page's frontmatter carries,
   * derived from the registry, then the provenance fold — in the SAME frame (DocArticle). */
  return (
    <>
      {flagNotice}
      <DocArticle
        frontmatter={showFrontmatter && (
          <DocsFrontmatter
            metadata={{
              title: c.displayName,
              type: 'reference',
              status: 'active',
              tags: [`domain/components/${c.category}`, ...(c.function ? [`pattern/${c.function}`] : [])],
              description: c.description,
              ...buildProvenance(c),
            }}
          />
        )}
        header={(
          <DocHeader
            eyebrow={`Components / ${CATEGORY_LABELS[c.category] ?? c.category}`}
            title={c.displayName}
            lede={c.description}
          />
        )}
        pager={<Pager slug={c.slug} />}
      >
        {PREVIEWS[c.name] && <PreviewCard entry={PREVIEWS[c.name]} />}
        {/* no preview of its own, by ruling: it lives inside a host — show the host (SHOWN_IN) */}
        {!PREVIEWS[c.name] && PREVIEWS[SHOWN_IN[c.name]] && (
          <>
            <p className="kol-doc-body">{`${c.displayName} is shown inside the ${labelFromSlug(SHOWN_IN[c.name])} preview.`}</p>
            <PreviewCard entry={PREVIEWS[SHOWN_IN[c.name]]} />
          </>
        )}

        <H2>Installation</H2>
        <InstallBlock pkg={c.pkg} />

        <H2>Usage</H2>
        <CodeLine text={`import { ${[c.name, ...members.map((m) => m.name)].join(', ')} } from '${c.pkg}'`} />

        {members.length > 0 && (
          <>
            <H2>Parts</H2>
            <p className="kol-doc-body">{`${c.displayName} composes from these parts — import them from the same package.`}</p>
            {members.map((m) => (
              <div key={m.name} className="flex flex-col gap-3">
                <h3 id={slugify(m.name)} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{m.displayName}</h3>
                {m.description && <p className="kol-sans-body-02 text-body">{m.description}</p>}
                {PREVIEWS[m.name] && <PreviewCard entry={PREVIEWS[m.name]} />}
              </div>
            ))}
          </>
        )}

        {hasApi && (
          <>
            <H2>API Reference</H2>
            <Api name={c.name} />
          </>
        )}
        <Nested component={c} Heading={H2} />
      </DocArticle>
    </>
  )
}
