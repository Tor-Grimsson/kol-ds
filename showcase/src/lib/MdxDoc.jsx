import { MDXProvider } from '@mdx-js/react'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import { mdxComponents } from './mdx-components.jsx'
import { MetaRows, Pager } from './component-page-parts.jsx'
import { CATEGORY_LABELS } from './registry.js'

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
export default function MdxDoc({ module: mod, component }) {
  const { default: Body, meta = {} } = mod

  /* Header falls back to the registry, so a component doc hand-types nothing
   * that already exists as data — eyebrow, title and lede stay identical to
   * the generated page across 70+ conversions instead of drifting one typo at
   * a time. `meta` overrides only where the author has something better. */
  const eyebrow = meta.eyebrow
    ?? (component ? `Components / ${CATEGORY_LABELS[component.category] ?? component.category}` : undefined)
  const title = meta.title ?? component?.name
  const lede = meta.lede ?? component?.description

  return (
    <article className="flex w-full min-w-0 flex-col gap-10">
      {(title || eyebrow) && (
        <DocHeader eyebrow={eyebrow} title={title} lede={lede} />
      )}
      {component && <MetaRows meta={component.meta} />}
      {/* NOT .kol-prose (2026-07-30, user-surfaced bug): the blog container's
        * 720px cap caged previews and tables too. Markdown elements are typed
        * per-tag by the mdx map through the kol-doc-* roles — running text
        * self-caps at --kol-content-measure, furniture runs the full column
        * (the one-frame law: width is content, not page identity). */}
      <MDXProvider components={mdxComponents}>
        <div className="flex w-full min-w-0 flex-col gap-6">
          <Body />
        </div>
      </MDXProvider>
      {component && <Pager slug={component.slug} />}
    </article>
  )
}
