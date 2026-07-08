/**
 * Icons Index
 *
 * Export Icon component and icon registry.
 * Usage: <Icon name="arrow-up" size={16} />
 */

export { default as Icon, registerIcons } from './Icon.jsx';

/* kol-icon-set-v1 — the curated set, grouped by folder (keys-only, no SVG
 * content): `{ group: names[] }`. KOL_ICON_SET_V1_NAMES is the flat sorted list
 * (used by consumers/audits to tell curated names from legacy ones). */
export const KOL_ICON_SET_V1 = (() => {
  const idx = {}
  for (const p of Object.keys(import.meta.glob('./kol-icon-set-v1/**/*.svg'))) {
    const parts = p.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const group = parts.pop() || 'misc'
    ;(idx[group] ||= []).push(name)
  }
  for (const g of Object.values(idx)) g.sort()
  return idx
})()

export const KOL_ICON_SET_V1_NAMES = Object.values(KOL_ICON_SET_V1).flat().sort()

/* Real, complete inventory — derived from the canonical stroke set on disk
 * (880 files / 862 unique across 21 folders). ICONS is now an alias of this
 * (was a hand-maintained 341-name list that drifted). Keys-only glob: paths
 * resolve at build time without loading any SVG content. */
export const ICON_ENTRIES = Object.keys(import.meta.glob('./stroke/**/*.svg'))
  .map((p) => {
    const parts = p.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const folder = parts.pop() || 'misc'
    return { name, folder }
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

/* Solid-cut inventory (keys-only, no SVG content) — lets gallery pages diff
 * the two cuts (mirror gaps: stroke-only / solid-only) without loading bytes. */
export const SOLID_ICON_ENTRIES = Object.keys(import.meta.glob('./solid/**/*.svg'))
  .map((p) => {
    const parts = p.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const folder = parts.pop() || 'misc'
    return { name, folder }
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

export const ICON_INDEX = ICON_ENTRIES.reduce((map, e) => {
  ;(map[e.folder] ||= []).push(e.name)
  return map
}, {})

/* ICONS — canonical grouped registry, now DERIVED from the on-disk stroke set
 * via ICON_INDEX (was a hand-maintained 341-name list that drifted). */
export const ICONS = ICON_INDEX;
// Flat array of all icon names
export const ALL_ICONS = Object.values(ICONS).flat();

// Helper to check if an icon exists
export const hasIcon = (name) => ALL_ICONS.includes(name);

// Get category for an icon
export const getCategory = (name) => {
  for (const [category, icons] of Object.entries(ICONS)) {
    if (icons.includes(name)) {
      return category;
    }
  }
  return null;
};
