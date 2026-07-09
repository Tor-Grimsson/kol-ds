import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CodeBlock, Divider, DocsToc, Icon, Tag } from '@kolkrabbi/kol-component'
import { ShellTocContext } from '../shell'
import { useTagMode } from '../tags'
import { parseDocsMarkdown, isIndexFile, getTagColor } from '../engine'
import DocsHeader from './DocsHeader.jsx'
import DocsArticle from './DocsArticle.jsx'
import DocsFrontmatter from './DocsFrontmatter.jsx'
import { renderInlineTokens } from './render-tokens.jsx'

const SidebarSection = ({ sectionKey, label, collapsedSections, toggleSection, children }) => (
  <div>
    <button
      type="button"
      className="shell-sidebar-toggle shell-sidebar-label kol-helper-10 text-meta"
      onClick={() => toggleSection(sectionKey)}
    >
      {label}
    </button>
    {!collapsedSections[sectionKey] && children}
  </div>
)

const DocReaderSidebar = ({ toc, allTags, docId, docsIndexHref, componentsHref, docFilePath }) => {
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const [collapsedSections, setCollapsedSections] = useState({})
  const toggleSection = (key) => setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="space-y-6">
      <SidebarSection
        sectionKey="toc"
        label="On this page"
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      >
        <DocsToc toc={toc} />
      </SidebarSection>

      <SidebarSection
        sectionKey="actions"
        label="Quick actions"
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
      >
        <div className="space-y-1">
          <button
            type="button"
            className="shell-sidebar-action kol-mono-14 text-body"
            onClick={() => navigate(-1)}
          >
            <Icon name="arrow-left" size={14} />
            Back
          </button>
          <Link to={docsIndexHref} className="shell-sidebar-action kol-mono-14 text-body">
            <Icon name="book-open" size={14} />
            All documentation
          </Link>
          <Link to={componentsHref} className="shell-sidebar-action kol-mono-14 text-body">
            <Icon name="grid" size={14} />
            View components
          </Link>
          <button
            type="button"
            className="shell-sidebar-action kol-mono-14 text-body"
            onClick={() => navigator.clipboard.writeText(docFilePath(docId))}
            title="Copy file path to clipboard"
          >
            <Icon name="copy" size={14} />
            Copy path
          </button>
        </div>
      </SidebarSection>

      {allTags.length > 0 && (
        <SidebarSection
          sectionKey="tags"
          label="Tags"
          collapsedSections={collapsedSections}
          toggleSection={toggleSection}
        >
          <div className="flex flex-col gap-1.5 items-start min-w-0 w-full">
            {allTags.map((tag) => (
              <Tag
                key={tag}
                variant="naked"
                size="lg"
                color={getTagColor(tag)}
                onClick={() => openTagMode(tag)}
                className="max-w-full overflow-hidden text-ellipsis"
              >
                {tag}
              </Tag>
            ))}
          </div>
        </SidebarSection>
      )}
    </div>
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

  // Build a Set of known doc IDs for fast lookup
  const knownDocIds = useMemo(
    () => new Set(inventory.map((d) => d.id)),
    [inventory]
  )

  /**
   * Resolve a .md link URL to an app route, or null if not a known doc.
   * Extracts the doc ID from the filename portion of the URL.
   */
  const resolveDocLink = (url) => {
    if (!url || !url.includes('.md')) return null
    // Strip anchor fragment
    const [pathPart, anchor] = url.split('#')
    const basename = pathPart.split('/').pop().replace(/\.md$/, '')
    if (knownDocIds.has(basename)) {
      const route = docHref(basename)
      return anchor ? `${route}#${anchor}` : route
    }
    return null
  }

  // Bind the resolved link + tag helpers so call sites stay terse.
  const renderTokens = (tokens, tokenKey) =>
    renderInlineTokens(tokens, tokenKey, resolveDocLink, tagHref)

  const doc = useMemo(() => {
    return inventory.find((d) => d.id === docId)
  }, [inventory, docId])

  const rawMarkdown = useMemo(() => {
    if (!doc) return null
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

  useEffect(() => {
    setTocContent(
      <DocReaderSidebar
        key={docId}
        toc={toc}
        allTags={allTags}
        docId={docId}
        docsIndexHref={docsIndex}
        componentsHref={components}
        docFilePath={docFilePath}
      />
    )
    return () => setTocContent(null)
  }, [setTocContent, docId, toc, allTags, docsIndex, components, docFilePath])

  if (!doc) {
    return (
      <div className="max-w-[1400px] mx-auto px-10 py-16">
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
          <h1>{docTitle}</h1>
        )}
        {/* Render intro blocks (excluding H1 which is docTitle) */}
        {introBlocks.filter(b => b.type !== 'heading1').map((block, index) => {
          const blockKey = `intro-${block.type}-${index}`
          switch (block.type) {
            case 'paragraph':
              return (
                <p key={blockKey}>
                  {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
                </p>
              )
            case 'heading3':
              return (
                <h3 key={blockKey} id={block.id}>
                  {block.content}
                </h3>
              )
            case 'heading4':
              return (
                <h4 key={blockKey} id={block.id}>
                  {block.content}
                </h4>
              )
            case 'list':
              return block.items ? (
                <ul key={blockKey} className="docs-list tight">
                  {block.items.map((item, i) => (
                    <li key={i}>
                      {item.tokens ? renderTokens(item.tokens, `${blockKey}-item-${i}`) : item.content}
                    </li>
                  ))}
                </ul>
              ) : null
            case 'blockquote':
              return (
                <blockquote key={blockKey} className="docs-callout">
                  {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
                </blockquote>
              )
            case 'divider':
              return <Divider key={blockKey} className="docs-divider" opacity="12" />
            case 'code':
              return (
                <CodeBlock
                  key={blockKey}
                  code={block.lines.join('\n')}
                  language={block.lang}
                />
              )
            case 'table':
              return (
                <div key={blockKey} className="kol-table-wrapper kol-table--simple">
                  <table className="kol-table">
                    <thead className="kol-table-thead">
                      <tr>
                        {block.headers.map((header, headerIndex) => (
                          <th key={headerIndex} className="kol-table-cell-title">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="kol-table-row">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="kol-table-cell-text">
                              {cell.tokens ? renderTokens(cell.tokens, `${blockKey}-row-${rowIndex}-cell-${cellIndex}`) : cell.content}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            default:
              return null
          }
        })}

        {sections.map(({ heading, id, blocks }) => (
          <section key={id} id={id} className="space-y-6 scroll-mt-32">
            <h2>{heading}</h2>
            {blocks.map((block, index) => {
              const blockKey = `${id}-${block.type}-${index}`

              switch (block.type) {
                case 'heading3':
                  return (
                    <h3 key={blockKey} id={block.id}>
                      {block.content}
                    </h3>
                  )
                case 'heading4':
                  return (
                    <h4 key={blockKey} id={block.id}>
                      {block.content}
                    </h4>
                  )
                case 'paragraph':
                  return (
                    <p key={blockKey}>
                      {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
                    </p>
                  )
                case 'list': {
                  const listClass = block.ordered
                    ? 'docs-list docs-list--ordered tight'
                    : 'docs-list tight'
                  const ListComponent = block.ordered ? 'ol' : 'ul'
                  return (
                    <ListComponent key={blockKey} className={listClass}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.tokens ? renderTokens(item.tokens, `${blockKey}-item-${itemIndex}`) : item.content || item}
                        </li>
                      ))}
                    </ListComponent>
                  )
                }
                case 'code':
                  return (
                    <CodeBlock
                      key={blockKey}
                      code={block.lines.join('\n')}
                      language={block.lang}
                    />
                  )
                case 'blockquote':
                  return (
                    <blockquote key={blockKey} className="docs-callout">
                      {block.tokens ? renderTokens(block.tokens, blockKey) : block.content}
                    </blockquote>
                  )
                case 'divider':
                  return <Divider key={blockKey} className="docs-divider" opacity="12" />
                case 'table':
                  return (
                    <div key={blockKey} className="kol-table-wrapper kol-table--simple">
                      <table className="kol-table">
                        <thead className="kol-table-thead">
                          <tr>
                            {block.headers.map((header, headerIndex) => (
                              <th key={headerIndex} className="kol-table-cell-title">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="kol-table-row">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="kol-table-cell-text">
                                  {cell.tokens ? renderTokens(cell.tokens, `${blockKey}-row-${rowIndex}-cell-${cellIndex}`) : cell.content}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                default:
                  return null
              }
            })}
          </section>
        ))}
      </DocsArticle>
  )
}

export default DocumentationReader
