/**
 * Icons Index
 *
 * Export Icon component and icon registry.
 * Usage: <Icon name="arrow-up" size={16} />
 */

export { default as Icon } from './Icon.jsx';

/* Raw SVG entries — the glob done inside the package (relative to ./svg) so
 * consumers (icon-gallery pages) can enumerate every icon without their own
 * cross-package glob. Each entry: { id: 'folder/name', name, folder, svg }. */
const svgModules = import.meta.glob('./svg/**/*.svg', { eager: true, query: '?raw', import: 'default' })
export const SVG_ENTRIES = Object.entries(svgModules).map(([path, svg]) => {
  const parts = path.split('/')
  const folder = parts[parts.length - 2]
  const name = (parts[parts.length - 1] || '').replace(/\.svg$/, '')
  return { id: `${folder}/${name}`, name, folder, svg }
})

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
