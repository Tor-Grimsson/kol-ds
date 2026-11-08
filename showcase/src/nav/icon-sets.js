/* THE ICON-SET REGISTRY (2026-11-05) — one source for every surface that lists the sets: the gallery, the rail
 * (ShellChrome), the Styles index and ⌘K (shell-nav). It lived in pages/IconsGallery.jsx, and ⌘K hard-coded
 * interface + signal beside it, so identity and external never indexed. A new set is added HERE and nowhere else. */
import { KOL_ICON_SET_INTERFACE, KOL_ICON_SET_SIGNAL, KOL_ICON_SET_IDENTITY, KOL_ICON_SET_EXTERNAL } from '@kolkrabbi/kol-icons'
import { ICON_CATEGORIES } from './icon-categories.js'

/* Icon-set registry — the shipped sets: interface is app chrome (kol-icons ≥0.25.0), signal is the instrument
 * vocabulary, identity the marks (≥0.49.0, 2026-10-28 — user: "identity should be separate from signal and interface"). The route's `:set` segment
 * names one; a route that carries none falls back to interface.
 *
 * The group index comes FROM the package (`KOL_ICON_SET_INTERFACE`, built by
 * import.meta.glob over the SVG folder) — never a hand-transcribed name list.
 * A transcription drifts the moment an icon is added; this cannot. */
export const ICON_SETS = {
  'kol-icon-set-interface': {
    label: 'kol-icon-set-interface',
    title: 'Interface',
    groups: KOL_ICON_SET_INTERFACE,
  },
  'kol-icon-set-signal': {
    label: 'kol-icon-set-signal',
    title: 'Signal',
    groups: KOL_ICON_SET_SIGNAL,
  },
  'kol-icon-set-identity': {
    label: 'kol-icon-set-identity',
    title: 'Identity',
    groups: KOL_ICON_SET_IDENTITY,
  },
  /* external (2026-10-31, IconSetExternal): flags and brands drawn by others, colour, never recoloured */
  'kol-icon-set-external': {
    label: 'kol-icon-set-external',
    title: 'External',
    groups: KOL_ICON_SET_EXTERNAL,
  },
}

/* The gallery's own group order and display names — folder slugs are the data,
 * these are what a reader sees on the filter chips. */
const ORDER = ['direction', 'actions', 'navigation', 'status', 'layout', 'files', 'charts', 'flow', 'design', 'shapes',
  'typography', 'media', 'devices', 'code', 'people', 'games', 'communication', 'commerce', 'places', 'planning']
const LABELS = {}
export const label = (f) => LABELS[f] ?? f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
export const byOrder = (a, b) => {
  const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
}
/* a set's groups in gallery order — the rail's rows and the group pages (W3, 2026-09-30: every
 * group gets a page) */
export const iconGroups = (setKey) => Object.keys(ICON_SETS[setKey]?.groups ?? {}).sort(byOrder).map((folder) => ({ folder, label: label(folder), count: ICON_SETS[setKey].groups[folder].length }))
/* a set's categories, each with its groups in gallery order (Round 15, 2026-10-20); a group no category
 * claims rides after them as a bare group, so nothing drops out of the rail */
export const iconCategories = (setKey) => {
  const groups = iconGroups(setKey)
  const cats = (ICON_CATEGORIES[setKey] ?? []).map((c) => ({ ...c, groups: groups.filter((g) => c.groups.includes(g.folder)) }))
  const placed = new Set(cats.flatMap((c) => c.groups.map((g) => g.folder)))
  return [...cats, ...groups.filter((g) => !placed.has(g.folder))]
}

