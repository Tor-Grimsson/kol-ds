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
    /* the kol-docs contract, carried through so set/block pages render THE
     * frontmatter panel the vault and MDX pages render (2026-07-30 converge —
     * these modules were the third of three unrelated metadata dialects) */
    meta: mod.meta ?? {},
    /* Scanner-derived manifest (scripts/extract-composition.mjs → pnpm extract:docs) */
    composition: COMPOSITION.sets?.[keyOf(path)] ?? null,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

// Human labels for the category tab strip; unlisted keys fall back to the key.
export const SET_CATEGORY_LABELS = {
  game: 'Games',
  dashboard: 'Dashboards',
  editorial: 'Editorial / CMS',
  portfolio: 'Portfolio',
  store: 'Store',
  foundry: 'Foundry',
  editor: 'Editors',
  app: 'App shell',
  other: 'Other',
}

const CATEGORY_ORDER = Object.keys(SET_CATEGORY_LABELS)
export const SET_CATEGORIES = [...new Set(SETS.map((s) => s.category))]
  .sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99))

export const FEATURED_SETS = SETS.filter((s) => s.featured)

export const getSet = (slug) => SETS.find((s) => s.key === slug)

/* THE SET IS A PACKAGE FAMILY (user ruling on the names audit, 2026-09-30): every component a
 * package ships, shown together, then the apparatus composed from them. Each composed set above
 * belongs to the family that owns its parts — the key is the set file, the value the package dir.
 * A composed set built from kol-component's own parts lives under `component`. */
export const SET_FAMILY = {
  'app-shell': 'shell',
  'chess-apparatus': 'chess',
  'content-filters': 'component',
  'content-set-reference': 'content',
  'design-editor': 'component',
  'foundry-specimen': 'foundry',
  'kind-preview': 'component',
  'media-library': 'component',
  'metrics-dashboard': 'dashboards',
  'prints-store': 'store',
  'record-manager-cms': 'component',
  'section-set': 'component',
  'stack-blog': 'content',
  styleguide: 'styleguide',
  'work-portfolio': 'content',
}
export const setsOfFamily = (dir) => SETS.filter((s) => (SET_FAMILY[s.key] ?? 'component') === dir)
export const familyHref = (dir) => `/sets/family/${dir}`
