/**
 * Blocks — composed, copy-pasteable KOL UI sections (the shadcn "blocks" model:
 * between raw components and full pages). Same one-file mechanics as demos:
 * each block in ../blocks/<Name>.jsx renders live AND ships its own ?raw source.
 * Blocks export `meta = { title, description, category, featured? }` and
 * optionally `stage`. Full-apparatus compositions (chess, metrics) are *sets*,
 * not blocks — see sets-registry.js.
 */

const modules = import.meta.glob('../blocks/*.jsx', { eager: true })
const sources = import.meta.glob('../blocks/*.jsx', { eager: true, query: '?raw', import: 'default' })

const keyOf = (path) => (path.split('/').pop() || '').replace('.jsx', '')

export const BLOCKS = Object.entries(modules)
  .map(([path, mod]) => ({
    key: keyOf(path),
    Component: mod.default,
    source: sources[path],
    stage: mod.stage || 'full',
    title: mod.meta?.title || keyOf(path),
    description: mod.meta?.description || '',
    category: mod.meta?.category || 'other',
    featured: mod.meta?.featured || false,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

// Human labels for the category tab strip; unlisted keys fall back to the key.
export const CATEGORY_LABELS = {
  sidenav: 'Sidenav',
  panel: 'Panels',
  form: 'Forms',
  toolbar: 'Toolbars',
  other: 'Other',
}

// Category display order for the tab strip: labelled categories first (in the
// order above), then any stragglers, then whatever's left.
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)
export const BLOCK_CATEGORIES = [...new Set(BLOCKS.map((b) => b.category))]
  .sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99))

export const FEATURED_BLOCKS = BLOCKS.filter((b) => b.featured)

export const getBlock = (slug) => BLOCKS.find((b) => b.key === slug)
