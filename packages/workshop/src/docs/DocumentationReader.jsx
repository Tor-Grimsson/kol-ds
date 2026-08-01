import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CodeBlock, Divider, DocsToc, Icon, Table, Tag } from '@kolkrabbi/kol-component'
import { ShellTocContext, RailSection, RailRow } from '../shell'
import { useTagMode } from '../tags'
import { parseDocsMarkdown, isIndexFile } from '../engine'
import DocsHeader from './DocsHeader.jsx'
import DocsArticle from './DocsArticle.jsx'
import DocsFrontmatter from './DocsFrontmatter.jsx'
import { DocSection } from './DocKit.jsx'
import { renderInlineTokens } from './render-tokens.jsx'

/**
 * A rail section header. Same anatomy as the LEFT tree's group header — a
 * rotating chevron, the label, and the item count pushed right — because the
 * two rails are one system and a reader shouldn't have to learn each side
 * separately.
 *
 * These were bare text with no count and no hover. They carry both now, and
 * the whole row is the toggle — with no chevron drawn at L1 (user ruling
 * 2026-08-01): the section collapses and expands, the affordance just isn't an
 * icon.
 *
 * It is a thin wrapper over RailSection, which owns the rung: the class, the
 * box, and WHERE THE COUNT SITS. This header used to hand-write all three and
 * borrowed `.shell-nav-group-header` + `.shell-sidebar-label` to do it, which
 * is how the two rails ended up printing their counts on different rows.
 */
const SidebarSection = ({ sectionKey, label, count, collapsedSections, toggleSection, children }) => (
  <RailSection
    level={2}
    label={label}
    count={count > 0 ? count : undefined}
    collapsed={!!collapsedSections[sectionKey]}
    onToggle={() => toggleSection(sectionKey)}
    icon={Icon}
  >
    {children}
  </RailSection>
)

const DocReaderSidebar = ({ toc, allTags, related, docId, docsIndexHref, componentsHref, docFilePath }) => {
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const [collapsedSections, setCollapsedSections] = useState({})
  const toggleSection = (key) => setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    /* THE SAME LADDER AS THE LEFT RAIL (user ruling 2026-08-01). One L1 eyebrow
     * naming the body, then L2 groups that collapse and carry a chevron + a
     * count. These four sections used to be four bare L1 eyebrows stacked with
     * no parent and no chevron — the left rail's shape stated differently on
     * the other side of the page. */
    <RailSection level={1} label="This page">
      <div className="space-y-6">
      <SidebarSection
        sectionKey="toc"
        label="Contents"
        count={toc?.length}
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      >
        <DocsToc toc={toc} root="#main" />
      </SidebarSection>

      {related.length > 0 && (
        <SidebarSection
          sectionKey="related"
          label="Related"
          count={related.length}
          collapsedSections={collapsedSections}
          toggleSection={toggleSection}
        >
          {/* ONE rail voice (user law): rows = the shell-nav-item idiom. */}
          <nav className="flex flex-col">
            {related.map((r) => (
              <RailRow key={r.id} to={r.href}>{r.label}</RailRow>
            ))}
          </nav>
        </SidebarSection>
      )}

      <SidebarSection
        sectionKey="actions"
        label="Quick actions"
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      >
        {/* Quick actions wear the SAME row as On-this-page and Related. They
          * were `.shell-sidebar-action`, a third geometry with no left indent,
          * so this rail carried three different row idioms — under the
          * "ONE rail voice" comment above. */}
        <div>
          <RailRow onClick={() => navigate(-1)} icon={<Icon name="arrow-left" size={14} />}>Back</RailRow>
          <RailRow to={docsIndexHref} icon={<Icon name="book-open" size={14} />}>All documentation</RailRow>
          <RailRow to={componentsHref} icon={<Icon name="grid" size={14} />}>View components</RailRow>
          <RailRow onClick={() => navigator.clipboard.writeText(docFilePath(docId))} icon={<Icon name="copy" size={14} />}>Copy path</RailRow>
          <RailRow onClick={() => openTagMode(null, { view: 'graph' })} icon={<Icon name="polygon" size={14} />}>Graph view</RailRow>
        </div>
      </SidebarSection>

      {/* TAGS IS A CATEGORY (user ruling 2026-08-01) — not a bare tag dump.
        * It holds the two ENTRY POINTS into the tag system plus this page's
        * own tags. The graph view was reachable only through an unlabelled hex
        * glyph floating at the corner of the overlay: a feature nobody could
        * find unless they already knew it existed. Both entries are rail rows
        * now, in the one row idiom. */}
      <SidebarSection
        sectionKey="tags"
        count={allTags?.length}
        label="Tags"
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      >
        {/* NO Search row (user ruling 2026-08-01) — the nav search icon already
          * opens the one modal, and a second door to it is the duplication we
          * just spent an arc deleting. Graph view moved to Quick actions: it
          * is an ACTION on the tag system, not one of this page's tags. */}
        {allTags.length > 0 && (
          /* No `color`, no `size` — see DocsFrontmatter. `sm` is the default
           * and the only size; a colour would cost the hover state. */
          <div className="flex flex-wrap gap-1.5 items-start min-w-0 w-full mt-2">
            {allTags.map((tag) => (
              <Tag
                key={tag}
                onClick={() => openTagMode(tag)}
                className="max-w-full overflow-hidden text-ellipsis"
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </SidebarSection>
      </div>
    </RailSection>
  )
}

/**
 * DocumentationReader — the docs render surface, decoupled from Vite.
 *
 * The monorepo original re-declared its own `import.meta.glob('@docs/…')` and
 * hardcoded `/workshop/*` routes. Both are lifted OUT here: the raw markdown
 * modules + the inventory arrive as props, and every route is derived from
 * `docHref` / `routes`, so this package stays bundler- and route-agnostic.
 *
 * @param {Object}   props
 * @param {Array}    props.inventory  Doc inventory (was `documentationInventory`).
 * @param {Object}   props.modules    Map of `path -> raw markdown string` (was the
 *                                    `import.meta.glob` result). The consuming app
 *                                    supplies its own glob.
 * @param {Function} props.docHref    (id) => route for a single doc. Default
 *                                    `(id) => \`/docs/${id}\``.
 * @param {Object}   props.routes     Config for the remaining routes/paths:
 *   @param {string}   routes.docsIndex   "all documentation" link (default `/docs`).
 *   @param {string}   routes.components  "view components" link (default `/components`).
 *   @param {Function} routes.tagHref     (tag) => href for hashtag pills
 *                                        (default `/docs?tag=…`).
 *   @param {Function} routes.docFilePath (id) => on-disk path copied to clipboard
 *                                        (default `docs/documentation/${id}.md`).
 */
const DocumentationReader = ({
  inventory = [],
  modules = {},
  docHref = (id) => `/docs/${id}`,
  routes = {}
}) => {
  const {
    docsIndex = '/docs',
    components = '/components',
    tagHref = (tag) => `/docs?tag=${encodeURIComponent(tag)}`,
    docFilePath = (id) => `docs/documentation/${id}.md`
  } = routes

  const { docId } = useParams()
  const setTocContent = useContext(ShellTocContext)
  const { openTagMode } = useTagMode()

  // Build a Set of known doc IDs for fast lookup
  const knownDocIds = useMemo(
    () => new Set(inventory.map((d) => d.id)),
    [inventory]
  )

  /**
   * Resolve a .md link URL to an app route, or null if not a known doc.
   * Extracts the doc ID from the filename portion of the URL. Bare basenames
   * miss two inventory id dialects (wave-4): index files (`00-overview/INDEX`
   * → id `00-overview-INDEX`) and collision-prefixed ids (`03-components/
   * 01-inventory` → `03-components-01-inventory`) — both gain the parent
   * folder, so try `${parentDir}-${basename}` as the fallback.
   */
  const resolveDocLink = (url) => {
    if (!url || !url.includes('.md')) return null
    // Strip anchor fragment
    const [pathPart, anchor] = url.split('#')
    const segs = pathPart.split('/')
    const basename = segs.pop().replace(/\.md$/, '')
    const parentDir = segs.filter((s) => s && s !== '.' && s !== '..').pop()
    const id = knownDocIds.has(basename)
      ? basename
      : parentDir && knownDocIds.has(`${parentDir}-${basename}`)
        ? `${parentDir}-${basename}`
        : null
    if (!id) return null
    const route = docHref(id)
    return anchor ? `${route}#${anchor}` : route
  }

  // Bind the resolved link + tag helpers so call sites stay terse. Hashtag
  // pills open TAG MODE (wave-4 parity) — the tagHref Link was a dead route
  // in any consumer without a ?tag= index page.
  const renderTokens = (tokens, tokenKey) =>
    renderInlineTokens(tokens, tokenKey, resolveDocLink, tagHref, openTagMode)

  /* ONE block renderer for intro + section content (wave-4 retype, 2026-07-30
   * — the two switches had already drifted). Every element is typed through
   * the kol-doc-* dialect of showcase mdx-components.jsx: doc-body running
   * text (self-caps at the measure), heading-05 h3/h4 (h4 = weight 400, the
   * prose-h4 precedent), panel-capped furniture (width law: tables/code cap
   * at --kol-content-panel), markdown tables through THE kol-component Table
   * as a dynamic-column DocTable sibling (no parallel table markup). */
  const renderBlock = (block, blockKey) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={blockKey} className="kol-doc-body">
            {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
          </p>
        )
      case 'heading3':
        return (
          <h3 key={blockKey} id={block.id} className="kol-sans-heading-05 text-emphasis scroll-mt-20 mt-2">
            {block.content}
          </h3>
        )
      case 'heading4':
        return (
          <h4 key={blockKey} id={block.id} className="kol-sans-heading-05 font-normal text-emphasis scroll-mt-20">
            {block.content}
          </h4>
        )
      case 'list': {
        const ListComponent = block.ordered ? 'ol' : 'ul'
        const listClass = `flex ${block.ordered ? 'list-decimal' : 'list-disc'} flex-col gap-2 pl-5 kol-doc-body`
        return block.items ? (
          <ListComponent key={blockKey} className={listClass}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                {item.tokens ? renderTokens(item.tokens, `${blockKey}-item-${itemIndex}`) : item.content || item}
              </li>
            ))}
          </ListComponent>
        ) : null
      }
      case 'blockquote':
        return (
          <blockquote key={blockKey} className="docs-callout kol-doc-body">
            {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
          </blockquote>
        )
      case 'divider':
        return <Divider key={blockKey} className="docs-divider" opacity="12" />
      case 'code':
        return (
          <div key={blockKey} className="max-w-[var(--kol-content-panel)]">
            <CodeBlock code={block.lines.join('\n')} language={block.lang} />
          </div>
        )
      case 'table':
        return (
          <div key={blockKey} className="max-w-[var(--kol-content-panel)]">
            <Table
              variant="simple"
              columns={block.headers.map((header, i) => ({ accessor: `c${i}`, header }))}
              rows={block.rows.map((row, rowIndex) => ({
                id: rowIndex,
                ...Object.fromEntries(row.map((cell, cellIndex) => [
                  `c${cellIndex}`,
                  cell.tokens ? renderTokens(cell.tokens, `${blockKey}-row-${rowIndex}-cell-${cellIndex}`) : cell.content,
                ])),
              }))}
              className="kol-doc-table"
            />
          </div>
        )
      default:
        return null
    }
  }

  const doc = useMemo(() => {
    return inventory.find((d) => d.id === docId)
  }, [inventory, docId])

  const rawMarkdown = useMemo(() => {
    if (!doc) return null
    /* Primary resolution (2026-07-30): through the doc's own file path — exact
     * and collision-proof (the endsWith(docId) heuristic below grabbed the
     * FIRST basename match, so duplicate filenames across folders rendered the
     * wrong doc). The heuristic stays as a fallback for hand-built inventories
     * whose `file` doesn't mirror the module keys. */
    const byFile = doc.file && Object.keys(modules).find((p) => p.endsWith(doc.file))
    if (byFile) return modules[byFile]
    // For index files, the docId is like "00-metadata-index" but the file is "index.md"
    // For regular files, docId matches the filename (e.g., "0.0.1-writing-guidelines")
    const path = Object.keys(modules).find((p) => {
      if (isIndexFile(docId)) {
        // Match index.md files by checking if the path ends with /index.md
        // and the parent folder matches the docId prefix
        const folderMatch = docId.match(/^(\d+-[a-z-]+)-index$/)
        const nestedMatch = docId.match(/^([a-z]+)-index$/)
        if (folderMatch) {
          // e.g., "00-metadata-index" → look for "00-metadata/index.md"
          return p.includes(`/${folderMatch[1]}/index.md`)
        } else if (nestedMatch) {
          // e.g., "foundry-index" → look for "foundry/index.md"
          return p.includes(`/${nestedMatch[1]}/index.md`)
        }
      }
      return p.endsWith(`${docId}.md`)
    })
    return path ? modules[path] : null
  }, [doc, docId, modules])

  const { sections, toc, introBlocks, inlineTags } = useMemo(() => {
    if (!rawMarkdown) return { sections: [], toc: [], introBlocks: [], inlineTags: [] }
    const parsed = parseDocsMarkdown(rawMarkdown)
    return { sections: parsed.sections, toc: parsed.toc, introBlocks: parsed.introBlocks, inlineTags: parsed.inlineTags }
  }, [rawMarkdown])

  // Combine frontmatter tags with inline hashtags
  const allTags = useMemo(() => {
    const frontmatterTags = doc?.metadata?.tags || []
    return [...new Set([...frontmatterTags, ...inlineTags])]
  }, [doc, inlineTags])

  // Extract H1 title from introBlocks
  const docTitle = useMemo(() => {
    const h1Block = introBlocks.find((block) => block.type === 'heading1')
    return h1Block?.content || null
  }, [introBlocks])

  /* Cross-references (wave-4 parity): frontmatter `related:` entries are
   * wikilinks — `[[target|display]]`, target relative to the doc's own
   * folder. Resolved against the inventory by full path first (handles
   * `../INDEX`-style hops), then by bare basename id as the fallback for
   * hand-typed targets. Unresolvable entries are dropped, not rendered dead. */
  const related = useMemo(() => {
    const entries = doc?.metadata?.related
    if (!Array.isArray(entries) || !doc?.file) return []
    return entries
      .map((entry) => {
        const m = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/.exec(String(entry))
        const target = (m ? m[1] : String(entry)).trim()
        const display = (m?.[2] || target.split('/').pop().replace(/\.md$/, '')).trim()
        const segs = doc.file.split('/').slice(0, -1)
        for (const seg of target.replace(/\.md$/, '').split('/')) {
          if (seg === '..') segs.pop()
          else if (seg && seg !== '.') segs.push(seg)
        }
        const full = segs.join('/')
        const basename = target.split('/').pop().replace(/\.md$/, '')
        const hit =
          inventory.find((d) => d.file.replace(/\.md$/, '') === full) ??
          inventory.find((d) => d.file.replace(/\.md$/, '').toLowerCase() === `${full}/index`.toLowerCase()) ??
          inventory.find((d) => d.id === basename)
        return hit ? { id: hit.id, href: docHref(hit.id), label: display } : null
      })
      .filter(Boolean)
  }, [doc, inventory, docHref])

  /* The reader is usable OUTSIDE a ShellLayout (a plain page, a lobby route):
   * ShellTocContext then defaults to null, so calling it unguarded threw.
   * No shell → no right rail, and the reader just renders its article. */
  useEffect(() => {
    if (!setTocContent) return undefined
    setTocContent(
      <DocReaderSidebar
        key={docId}
        toc={toc}
        allTags={allTags}
        related={related}
        docId={docId}
        docsIndexHref={docsIndex}
        componentsHref={components}
        docFilePath={docFilePath}
      />
    )
    return () => setTocContent(null)
  }, [setTocContent, docId, toc, allTags, related, docsIndex, components, docFilePath])

  if (!doc) {
    return (
      /* framed to a tier that was removed from the scale at theme 0.11.22 and
       * left behind here — a width nothing else still uses; now on the panel
       * token. Left-anchored, not centred (2026-08-01): the frame centres in
       * the viewport, the content does not centre in the frame. */
      <div className="max-w-[var(--kol-content-panel)] py-16">
        <DocsHeader title="Document Not Found" subtitle={`Could not find document: ${docId}`} />
        <p className="kol-mono-12 mt-6">
          <Link to={docsIndex} className="text-accent-primary">
            ← Back to documentation
          </Link>
        </p>
      </div>
    )
  }

  return (
    <DocsArticle>
        <DocsFrontmatter metadata={doc.metadata} docId={docId} />
        {docTitle && (
          <h1 className="kol-doc-heading">{docTitle}</h1>
        )}
        {/* Render intro blocks (excluding H1 which is docTitle) */}
        {introBlocks.filter(b => b.type !== 'heading1').map((block, index) =>
          renderBlock(block, `intro-${block.type}-${index}`)
        )}

        {/* Sections through the packaged DocSection — the same anchored
          * rule + h2 contract MDX pages compose with. */}
        {sections.map(({ heading, id, blocks }) => (
          <DocSection key={id} id={id} title={heading}>
            {blocks.map((block, index) => renderBlock(block, `${id}-${block.type}-${index}`))}
          </DocSection>
        ))}
      </DocsArticle>
  )
}

export default DocumentationReader
