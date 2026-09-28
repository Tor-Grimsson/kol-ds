/* The fixture corpus as data — pure: it takes the raw-markdown module map, so a Vite app passes
 * its glob and a Node test passes a map it read from disk. */
import { buildInventory, fileLabel } from '@kolkrabbi/kol-markdown'
import { COMPONENTS, BLOCKS, SETS } from './components.js'

/* The shell's spaces as they are TODAY in the showcase (nav/shell-nav.js ALL_ROUTES), so
 * apps/workshop reproduces the current structure before the plan changes it. */
export const SPACES = [
  { id: 'components', label: 'Components', icon: 'component-01', path: '/components' },
  { id: 'blocks', label: 'Blocks', icon: 'layout', path: '/blocks' },
  { id: 'sets', label: 'Sets', icon: 'view-list', path: '/sets' },
  { id: 'docs', label: 'Docs', icon: 'book-open', path: '/documentation' },
  { id: 'references', label: 'References', icon: 'library', path: '/references' },
  { id: 'search', label: 'Search', icon: 'search', path: '/search' },
  { id: 'apps', label: 'Apps', icon: 'grid', path: '/apps' },
  { id: 'quarantine', label: 'Quarantine', icon: 'lock', path: '/quarantine' },
]

export const docHref = (id) => `/documentation/${id}`
export const componentHref = (slug) => `/components/${slug}`

const relPath = (file) => file.replace(/^.*?docs\//, '')
const labelFromSlug = (s = '') => s.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())

export function buildCorpus(modules) {
  const inventory = buildInventory(modules)

  /* category (documentation · operations · development) → chapter → pages, the vault tree shape */
  const tree = (() => {
    const groups = new Map()
    for (const d of inventory) {
      const [category, chapter] = relPath(d.file).split('/')
      const key = `${category}/${chapter}`
      if (!groups.has(key)) groups.set(key, { category, chapter, docs: [] })
      groups.get(key).docs.push(d)
    }
    return [...groups.values()]
      .sort((a, b) => `${a.category}/${a.chapter}`.localeCompare(`${b.category}/${b.chapter}`))
      .map(({ category, chapter, docs }) => {
        const index = docs.find((d) => /\/index\.md$/i.test(d.file))
        return {
          id: `vault-${category}-${chapter}`,
          category,
          label: labelFromSlug(chapter),
          ...(index ? { path: docHref(index.id) } : {}),
          children: [
            ...(index ? [{ id: `vd-${index.id}`, label: 'About', path: docHref(index.id) }] : []),
            ...docs
              .filter((d) => d !== index)
              .sort((a, b) => a.file.localeCompare(b.file))
              .map((d) => ({ id: `vd-${d.id}`, label: fileLabel(d.file), path: docHref(d.id) })),
          ],
        }
      })
  })()

  /* The component tree, grouped by tier — ShellSidebar's `routes` shape */
  const tiers = ['Atoms', 'Molecules', 'Organisms', 'Utilities']
  const componentTree = tiers.map((tier) => ({
    id: `tier-${tier.toLowerCase()}`,
    label: tier,
    children: COMPONENTS.filter((c) => c.category === tier).map((c) => ({ id: `cmp-${c.slug}`, label: c.name, path: componentHref(c.slug) })),
  }))

  /* kol-search items — one shape for every kind of thing the corpus holds */
  const searchItems = [
    ...inventory.map((d) => {
      const category = relPath(d.file).split('/')[0]
      return {
        id: `doc-${d.id}`,
        title: d.title,
        kind: d.metadata.type === 'index' ? 'index' : 'doc',
        space: category === 'development' ? 'development' : 'docs',
        category: labelFromSlug(category),
        tags: d.metadata.tags || [],
        headings: d.headings,
        description: d.metadata.description || '',
        date: d.metadata.updated,
        status: d.metadata.status,
        href: docHref(d.id),
      }
    }),
    ...COMPONENTS.map((c) => ({
      id: `cmp-${c.slug}`,
      title: c.name,
      kind: 'component',
      space: 'components',
      category: c.category,
      tags: c.tags,
      keywords: [c.fn, c.pkg],
      description: c.description,
      href: componentHref(c.slug),
    })),
    ...BLOCKS.map((b) => ({ id: `block-${b.key}`, title: b.title, kind: 'block', space: 'blocks', category: 'Blocks', keywords: b.uses, description: b.description, href: `/blocks/${b.key}` })),
    ...SETS.map((s) => ({ id: `set-${s.key}`, title: s.title, kind: 'set', space: 'sets', category: 'Sets', keywords: s.members, description: s.description, href: `/sets/${s.key}` })),
  ]

  /* the palette's CURRENT row shape (kol-workshop's matchSearchItems) — what the shell searches today */
  const shellSearchItems = searchItems.map((i) => ({
    id: i.id,
    label: i.title,
    href: i.href,
    sectionLabel: i.category,
    tags: i.tags ?? [],
    headings: i.headings ?? [],
    keywords: [i.description, ...(i.keywords ?? [])].filter(Boolean),
  }))

  return { inventory, tree, componentTree, searchItems, shellSearchItems }
}
