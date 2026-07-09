import { parseFrontmatter } from './frontmatter.js'

/**
 * The doc inventory + counts, DECOUPLED from Vite.
 *
 * The monorepo original ran `import.meta.glob('@docs/...')` at module load,
 * hard-binding it to Vite and the monorepo `/docs` path. Here the consumer
 * supplies the raw-markdown module map instead — this is the content-injection
 * seam that lets the set drop into any repo:
 *
 *   const modules = import.meta.glob('/docs/ ** /*.md',
 *     { eager: true, query: '?raw', import: 'default' })
 *   const inventory = buildInventory(modules)
 *
 * @param {Record<string,string>} modules  path → raw markdown string
 */
export function buildInventory(modules) {
  const inventory = Object.entries(modules).map(([path, raw]) => {
    const normalisedPath = path.replace(/^.*\/docs\/documentation\//, 'docs/documentation/')
    const lines = raw.split(/\r?\n/)
    const headingLine = lines.find((line) => line.startsWith('# ')) ?? ''
    const title = headingLine.replace(/^#\s+/, '').trim()
    const metadata = parseFrontmatter(raw)
    const filename = normalisedPath.split('/').pop() ?? ''
    const parentFolder = normalisedPath.split('/').slice(-2, -1)[0] ?? ''
    const baseId = filename.replace(/\.md$/, '')

    // Make index.md IDs unique by prefixing with parent folder
    const id = baseId === 'index' ? `${parentFolder}-index` : baseId

    const rawTitle = title || metadata.title || id
    const cleanTitle = rawTitle
      .replace(/^Design System\s*[-–—:]\s*/i, '')
      .replace(/\bCheat Sheet\b/i, 'Quicklook')

    return { id, file: normalisedPath, title: cleanTitle, metadata }
  })

  inventory.sort((a, b) => a.file.localeCompare(b.file))
  return inventory
}

/** Tally status / category / content-type across an inventory. */
export function buildInventoryCounts(inventory) {
  return inventory.reduce(
    (acc, doc) => {
      acc.total += 1
      const { metadata } = doc
      if (metadata.status) {
        acc.statuses[metadata.status] = (acc.statuses[metadata.status] ?? 0) + 1
      }
      if (metadata.category) {
        acc.categories[metadata.category] = (acc.categories[metadata.category] ?? 0) + 1
      }
      if (metadata['content-type']) {
        acc.contentTypes[metadata['content-type']] = (acc.contentTypes[metadata['content-type']] ?? 0) + 1
      }
      return acc
    },
    { total: 0, statuses: {}, categories: {}, contentTypes: {} }
  )
}
