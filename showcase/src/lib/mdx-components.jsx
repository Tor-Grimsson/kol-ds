import { Link } from 'react-router-dom'
import { DocSection, DocTable } from '@kolkrabbi/kol-workshop'
import { CodeBlock } from '@kolkrabbi/kol-component'
import PreviewCard from './PreviewCard.jsx'
import { DEMOS } from './demos-registry.js'
import API_GEN from '../usage/api-tables.json'
import { mergeApi, InstallBlock } from './component-page-parts.jsx'
import { getComponentBySlug, slugify } from './registry.js'

/**
 * The MDX component map — what a `.mdx` doc can use without importing anything.
 *
 * This is the shadcn model: pages are documents, and the live parts are
 * components embedded in the prose. `component-docs.js` (a 43-entry JS object
 * of hand-typed usage strings + API tables) exists only because there was no
 * document format to hold them; with MDX there is nothing left to hand-type —
 * <Preview> reads the demos registry, <Api> reads the react-docgen extraction.
 *
 * Headings get ids so the shell's auto-TOC can anchor them (ShellChrome walks
 * the rendered headings; a heading with no id is skipped).
 */

const slug = (children) =>
  String(Array.isArray(children) ? children.join('') : children ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** <Preview name="Button" /> — the live demo from the registry, preview/code tabs. */
export function Preview({ name, minH }) {
  const entry = DEMOS[name]
  if (!entry) {
    return (
      <div className="kol-doc-figure p-6">
        <p className="kol-mono-12 text-meta">No demo registered for “{name}”.</p>
      </div>
    )
  }
  return <PreviewCard entry={entry} {...(minH ? { minH } : {})} />
}

/**
 * <Api name="Button" /> — props from the extracted react-docgen tables.
 *
 * `rows` is the in-document authored layer, merged the same way the generated
 * page merges DOC_DATA's api arrays: authored descriptions win, extraction
 * fills defaults and appends whatever the author missed. It exists because
 * react-docgen resolves no definition at all for render-null utilities, class
 * components and aliased re-exports — those docs carry their table inline, in
 * the document, which is the whole point of the MDX model. Extraction-covered
 * components pass `name` alone and stay drift-free.
 */
export function Api({ name, rows: authored }) {
  const rows = mergeApi(authored ?? [], API_GEN?.[name] ?? [])
  if (!rows.length) {
    return <p className="kol-mono-12 text-meta">No extracted props for “{name}”.</p>
  }
  /* panel cap — furniture law (2026-07-30): tables/code cap at
   * --kol-content-panel; only previews (stages) run the full column. */
  return <div className="max-w-[var(--kol-content-panel)]"><DocTable rows={rows} /></div>
}

/**
 * <Install name="Button" /> — the pm-switcher install block, package resolved
 * from the registry (the barrel truth) so a doc can't name the wrong package.
 */
export function Install({ name }) {
  const c = getComponentBySlug(slugify(name))
  if (!c) return null
  return <InstallBlock pkg={c.pkg} />
}

/**
 * <Parts name="Accordion" /> — the member components a compound composes from,
 * each with its own live demo. Mirrors the generated page's "Parts" section so
 * a compound component doesn't lose its sub-parts on conversion.
 */
export function Parts({ name }) {
  const c = getComponentBySlug(slugify(name))
  const members = c?.members || []
  if (!members.length) return null
  return (
    <>
      {members.map((m) => (
        <div key={m.name} className="flex flex-col gap-3">
          <h3 id={slug(m.name)} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{m.name}</h3>
          {m.description && <p className="kol-sans-body-02 text-body">{m.description}</p>}
          {DEMOS[m.name] && <PreviewCard entry={DEMOS[m.name]} />}
        </div>
      ))}
    </>
  )
}

export const mdxComponents = {
  Preview,
  Api,
  Install,
  Parts,
  DocSection,
  DocTable,
  /* Section rhythm: a heading opens a section, so it carries extra AIR ABOVE
   * (gap-6 alone made heading-to-previous-block equal heading-to-own-content —
   * the cramped read, user 2026-07-30). first:mt-0 keeps the page top tight. */
  h2: ({ children, ...p }) => (
    <h2 id={slug(children)} className="kol-doc-section-title scroll-mt-20 mt-6 first:mt-0" {...p}>{children}</h2>
  ),
  h3: ({ children, ...p }) => (
    <h3 id={slug(children)} className="kol-sans-heading-05 text-emphasis scroll-mt-20 mt-2 first:mt-0" {...p}>{children}</h3>
  ),
  /* Body tags typed through the doc roles (NOT .kol-prose — the blog system).
   * kol-doc-body self-caps at --kol-content-measure, so text keeps its
   * reading measure while Preview/Api/Install run the full column. List and
   * link treatments mirror the generated pages (DocsMenus / MetaRows). */
  p: (props) => <p className="kol-doc-body" {...props} />,
  ul: (props) => <ul className="flex list-disc flex-col gap-2 pl-5 kol-doc-body" {...props} />,
  ol: (props) => <ol className="flex list-decimal flex-col gap-2 pl-5 kol-doc-body" {...props} />,
  code: (props) => <code className="kol-doc-code-inline" {...props} />,
  /* Fences render through THE CodeBlock (user ruling 2026-07-30: one code
   * idiom — the component we built for exactly this, not a bespoke pre). */
  pre: ({ children }) => {
    const child = children?.props ?? {}
    const lang = /language-([\w-]+)/.exec(child.className || '')?.[1] ?? 'text'
    const code = String(child.children ?? '').replace(/\n$/, '')
    return (
      <div className="max-w-[var(--kol-content-panel)]">
        <CodeBlock code={code} language={lang} />
      </div>
    )
  },
  /* Internal links stay SPA-routed; external ones stay plain anchors. */
  a: ({ href, children, ...p }) => {
    const cls = 'text-emphasis underline decoration-fg-16 underline-offset-2 hover:decoration-current'
    return href?.startsWith('/')
      ? <Link to={href} className={cls} {...p}>{children}</Link>
      : <a href={href} className={cls} {...p}>{children}</a>
  },
}
