import usageIndex from '../usage/usage-index.json'
import tokenIndex from '../usage/token-index.json'

/* THE REFERENCE GRAPH, SLICED (2026-10-17 — user: "wouldnt you want some sort of categorisation? unique pages
 * for categories, or all, or by token"). One page per kind, and per concern inside the token and class kinds,
 * so a slice is read on its own instead of filtered out of all 721. Counts come off the same two indexes the
 * graph is built from, so the rail and the pages cannot disagree. */
export const KIND_SLICES = [
  { kind: 'component', slug: 'components', label: 'Components' },
  { kind: 'token', slug: 'tokens', label: 'Tokens' },
  { kind: 'class', slug: 'classes', label: 'Classes' },
]
export const CONCERN_ORDER = ['color', 'type', 'layout', 'nav', 'chrome', 'component', 'breakpoint']
export const concernLabel = (c) => c.charAt(0).toUpperCase() + c.slice(1)
export const sliceHref = (slug, concern) => `/references/${slug}${concern ? `/${concern}` : ''}`

const live = [
  ...usageIndex.filter((e) => (e.weighted || 0) + (e.internal || 0) > 0).map((e) => ({ kind: 'component', concern: 'component' })),
  ...tokenIndex.filter((e) => (e.weighted || 0) > 0).map((e) => ({ kind: e.kind, concern: e.concern })),
]

/* concerns a kind has, in the house order, with counts — components are one slice, no concerns */
export const concernsOf = (kind) => kind === 'component' ? [] : CONCERN_ORDER
  .map((c) => ({ concern: c, count: live.filter((n) => n.kind === kind && n.concern === c).length }))
  .filter((c) => c.count > 0)
export const countOf = (kind, concern) => live.filter((n) => n.kind === kind && (!concern || n.concern === concern)).length

/* the rail's References group: kinds, and under tokens / classes their concerns */
export const REFERENCE_TREE = KIND_SLICES.map(({ kind, slug, label }) => ({
  id: `ref-${slug}`,
  label,
  path: sliceHref(slug),
  ...(concernsOf(kind).length ? { children: concernsOf(kind).map(({ concern }) => ({ id: `ref-${slug}-${concern}`, label: concernLabel(concern), path: sliceHref(slug, concern) })) } : null),
}))
