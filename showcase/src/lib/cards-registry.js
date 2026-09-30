/**
 * Cards — WEBSITE CARDS: the sections a marketing site is built from (2026-09-30, the user:
 * *"a space where website cards can be viewed — heros, ctas, signup cards, text left image right
 * and center, etc"*). Heroes, text-and-image splits, CTAs, signup, feature cards, FAQ, content
 * cards. The same one-file mechanics as blocks and sets: each card in ../cards/<name>.jsx renders
 * live AND ships its own ?raw source, and exports `meta = { title, description, category,
 * featured? }` and optionally `stage`.
 *
 * WHY NOT BLOCKS: a block is a composition of shells and tools and how it breakpoints (a sidenav,
 * a toolbar, a panel); a set is a package family. These are page SECTIONS — the Section* family
 * and the content cards — looked at as a catalogue of what a page can be made of.
 */
import COMPOSITION from '../usage/composition.json'

const modules = import.meta.glob('../cards/*.jsx', { eager: true })
const sources = import.meta.glob('../cards/*.jsx', { eager: true, query: '?raw', import: 'default' })

const keyOf = (path) => (path.split('/').pop() || '').replace('.jsx', '')

export const CARDS = Object.entries(modules)
  .map(([path, mod]) => ({
    key: keyOf(path),
    Component: mod.default,
    source: sources[path],
    stage: mod.stage || 'full',
    title: mod.meta?.title || keyOf(path),
    description: mod.meta?.description || '',
    category: mod.meta?.category || 'other',
    featured: mod.meta?.featured || false,
    meta: mod.meta ?? {},
    composition: COMPOSITION.cards?.[keyOf(path)] ?? null,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

export const CARD_LABELS = {
  hero: 'Heroes',
  split: 'Text & image',
  cta: 'Calls to action',
  signup: 'Signup',
  features: 'Features',
  content: 'Content cards',
  other: 'Other',
}

const ORDER = Object.keys(CARD_LABELS)
export const CARD_CATEGORIES = [...new Set(CARDS.map((c) => c.category))]
  .sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99))

export const FEATURED_CARDS = CARDS.filter((c) => c.featured)
export const getCard = (slug) => CARDS.find((c) => c.key === slug)
