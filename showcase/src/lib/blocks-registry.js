/**
 * Blocks — composed, copy-pasteable KOL sections (the shadcn "blocks" model:
 * between raw components and full pages). Same one-file mechanics as demos:
 * each block in ../blocks/<Name>.jsx is rendered live AND shown as its own
 * ?raw source. Blocks export `meta = { title, description }` and optionally
 * `stage`.
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
  }))
  .sort((a, b) => a.title.localeCompare(b.title))
