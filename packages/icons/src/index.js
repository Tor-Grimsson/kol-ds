/**
 * Icons Index
 *
 * Export Icon component and icon registry.
 * Usage: <Icon name="arrow-up" size={16} />
 *
 * v1-only since 0.8.0 (2026-07-28): kol-icon-set-v1 is THE set. The legacy
 * stroke/solid/svg/svg-web trees were removed — consumers register their own
 * SVGs via registerIcons() or promote glyphs into v1.
 */

export { default as Icon, registerIcons } from './Icon.jsx';

/* kol-icon-set-v1 — the curated set, grouped by folder (keys-only, no SVG
 * content): `{ group: names[] }`. KOL_ICON_SET_V1_NAMES is the flat sorted list. */
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

/* Canonical grouped registry — alias of the v1 index (legacy inventories
 * ICON_ENTRIES / SOLID_ICON_ENTRIES / ICON_INDEX died with the legacy sets). */
export const ICONS = KOL_ICON_SET_V1;
// Flat array of all icon names
export const ALL_ICONS = KOL_ICON_SET_V1_NAMES;

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
