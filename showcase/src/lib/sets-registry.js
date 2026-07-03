/**
 * Sets — full-apparatus KOL compositions (chess, metrics dashboards…): bigger
 * than a block, an app-like thing you'd drop in whole. Same one-file mechanics
 * as blocks: each set in ../sets/<Name>.jsx renders live AND ships its own
 * ?raw source. Sets export `meta = { title, description, category, featured? }`
 * and optionally `stage`. UI compositions are *blocks* — see blocks-registry.js.
 */

import COMPOSITION from '../usage/composition.json'

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
    category: mod.meta?.category || 'other',
    featured: mod.meta?.featured || false,
    /* Scanner-derived manifest (scripts/extract-composition.mjs → pnpm extract:docs) */
    composition: COMPOSITION.sets?.[keyOf(path)] ?? null,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

// Human labels for the category tab strip; unlisted keys fall back to the key.
export const SET_CATEGORY_LABELS = {
  game: 'Games',
  dashboard: 'Dashboards',
  other: 'Other',
}

const CATEGORY_ORDER = Object.keys(SET_CATEGORY_LABELS)
export const SET_CATEGORIES = [...new Set(SETS.map((s) => s.category))]
  .sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99))

export const FEATURED_SETS = SETS.filter((s) => s.featured)

export const getSet = (slug) => SETS.find((s) => s.key === slug)
