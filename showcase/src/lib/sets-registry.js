/**
 * Sets — full-apparatus KOL compositions (chess, metrics dashboards…): bigger
 * than a block, an app-like thing you'd drop in whole. Same one-file mechanics
 * as blocks/demos: each set in ../sets/<Name>.jsx renders live AND ships its own
 * ?raw source. Sets export `meta = { title, description }` and optionally `stage`.
 */

const modules = import.meta.glob('../sets/*.jsx', { eager: true })
const sources = import.meta.glob('../sets/*.jsx', { eager: true, query: '?raw', import: 'default' })

const keyOf = (path) => (path.split('/').pop() || '').replace('.jsx', '')

export const SETS = Object.entries(modules)
  .map(([path, mod]) => ({
    key: keyOf(path),
    Component: mod.default,
    source: sources[path],
    stage: mod.stage || 'full',
    title: mod.meta?.title || keyOf(path),
    description: mod.meta?.description || '',
  }))
  .sort((a, b) => a.title.localeCompare(b.title))
