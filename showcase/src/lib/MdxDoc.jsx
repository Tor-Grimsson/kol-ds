import { MDXProvider } from '@mdx-js/react'
import { DocHeader, DocsFrontmatter } from '@kolkrabbi/kol-workshop'
import { mdxComponents } from './mdx-components.jsx'
import { buildProvenance, Pager } from './component-page-parts.jsx'
import { CATEGORY_LABELS } from '../nav/registry.js'
import { useFrontmatter } from './frontmatter.jsx'

/**
 * MdxDoc — renders one `.mdx` page: its `meta` export becomes the DocHeader,
 * its body renders through the shared component map (Preview / Api / heading
 * anchors) with no per-file imports.
 *
 * Doc identity (2026-07-30 ruling): `meta.id` is the STABLE handle — a number,
 * never reused, never renumbered; `meta.slug` is the URL and may change with
 * the title. Cross-links resolve through the id so a rename can't break them.
 *
 * `component` (optional) is the registry entry when this doc IS a component
 * page. It brings the furniture the generated page renders — source-mined meta
 * rows and the A→Z pager — so converting a component to MDX can't quietly drop
 * them. Deliberate order change vs the generated page: meta rows sit under the
 * header rather than under the main preview, because an MDX author places the
 * preview and the position can't be inferred.
 */
/* ONE FRAME FOR EVERY COMPONENT PAGE (2026-10-01 — user: "how can 2 pages that use the same
 * component to render the page have different spacing settings?"). They did not use the same
 * one: an authored page rendered inside this article and its rhythm (gap-10 between the page's
 * parts, gap-6 inside the body), the generated page rendered as loose siblings with DocSection's
 * own rule + padding — so Action Button's lede sat on its preview and Button's did not. Both
 * paths render through this now. The code block's own 1.5rem block margin is zeroed here: inside
 * a gapped column it stacked on the gap, so "Usage → code" read twice as far as "API → table". */
export function DocArticle({ frontmatter, header, pager, children }) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-10">
      {frontmatter}
      {header}
      <div className="flex w-full min-w-0 flex-col gap-6 [&_.kol-codeblock-wrapper]:my-0">
        {children}
      </div>
      {pager}
    </article>
  )
}

export default function MdxDoc({ module: mod, component }) {
  const { default: Body, meta = {} } = mod

  /* Header falls back to the registry, so a component doc hand-types nothing
   * that already exists as data — eyebrow, title and lede stay identical to
   * the generated page across 70+ conversions instead of drifting one typo at
   * a time. `meta` overrides only where the author has something better. */
  const eyebrow = meta.eyebrow
    ?? (component ? `Components / ${CATEGORY_LABELS[component.category] ?? component.category}` : undefined)
  const title = component ? component.displayName : meta.title
  const lede = meta.lede ?? component?.description

  /* THE frontmatter panel — the same component the vault reader uses, not a
   * second one. This file carried its own hand-rolled table with the opposite
   * strategy (a denylist over `meta`) while the reader used an allowlist, so
   * the two surfaces disagreed about what metadata even is. A doc's metadata
   * is content and the renderer is one thing.
   *
   * `lede`/`eyebrow` are header inputs rather than metadata, so they stay out;
   * everything else meta carries is printed. */
  const { title: _t, lede: _l, eyebrow: _e, ...fmMeta } = meta

  /* ONE metadata panel (user ruling 2026-08-01). MetaRows printed SOURCE /
   * TYPE STYLES / CLASSES / TOKENS / COMPOSES in its own grammar directly
   * under a frontmatter panel that was already printing the same class of
   * information — two blocks, two looks, one job. Its fields are folded in
   * here as ordinary frontmatter entries, so they get the icon column, the
   * label column and the chip treatment for free. */
  const provenance = component ? buildProvenance(component) : {}
  const showFrontmatter = useFrontmatter('page')

  return (
    <DocArticle
      frontmatter={showFrontmatter && <DocsFrontmatter metadata={{ ...fmMeta, ...(title ? { title } : {}), ...provenance }} />}
      header={(title || eyebrow) && <DocHeader eyebrow={eyebrow} title={title} lede={lede} />}
      pager={component && <Pager slug={component.slug} />}
    >
      {/* NOT .kol-prose (2026-07-30, user-surfaced bug): the blog container's
        * 720px cap caged previews and tables too. Markdown elements are typed
        * per-tag by the mdx map through the kol-doc-* roles — running text
        * self-caps at --kol-content-measure, furniture runs the full column
        * (the one-frame law: width is content, not page identity). */}
      <MDXProvider components={mdxComponents}>
        <Body />
      </MDXProvider>
    </DocArticle>
  )
}
