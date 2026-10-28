import { splitFrontmatter } from '@kolkrabbi/kol-markdown'

/* DOCUMENT TABS — a folder of markdown files as page rows (plan-2026-10-28-document W5.2; kol-website's MarkdownPage
 * ticket: *"a folder of .md files rendered as pages"*). The consumer globs its folder and hands the modules over:
 *
 *   documentTabs(import.meta.glob('./brand/foundation/**\/*.md', { query: '?raw', import: 'default', eager: true }))
 *   → [{ id, title, group, file, source }]   in the glob's (path) order
 *
 *   id      the file's stem without a `NN-` prefix (`01-strategy.md` → `strategy`)
 *   title   the frontmatter `title`, else the first `# heading`, else the stem
 *   group   the file's parent folder, titlecased and unprefixed (`02-identity/` → `Identity`); '' at the root
 *   file    the path as globbed; source the markdown
 *
 * A row is what `MarkdownPage` takes (`source`) and what a rail row or a `DocumentIndex` card is made from; `numbered`,
 * `notes` and the rest are the consumer's to add per row, as kol-atlas's tab table does. */
const unprefix = (s) => s.replace(/^\d+[-_.]\s*/, '')
const titleCase = (s) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export default function documentTabs(modules = {}, { root = '' } = {}) {
  return Object.entries(modules).map(([file, source]) => {
    const rel = root && file.startsWith(root) ? file.slice(root.length) : file
    const parts = rel.replace(/^\.?\//, '').split('/')
    const stem = parts.pop().replace(/\.md$/i, '')
    const { fields, body } = splitFrontmatter(typeof source === 'string' ? source : '')
    const fm = Object.fromEntries(fields)
    const h1 = /^#\s+(.+)$/m.exec(body)?.[1]?.trim()
    return { id: unprefix(stem), title: fm.title || h1 || titleCase(unprefix(stem)), group: parts.length ? titleCase(unprefix(parts[parts.length - 1])) : '', file, source: typeof source === 'string' ? source : '' }
  })
}
