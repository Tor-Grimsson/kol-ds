/**
 * Icons Index
 *
 * Export Icon component and icon registry.
 * Usage: <Icon name="arrow-up" size={16} />
 *
 * TWO SETS (2026-08-28). `kol-icon-set-interface` (named `kol-icon-set-v1` until 2026-09-30 — user:
 * "icons v1 is a terrible icon set name") is the general set — app chrome,
 * navigation, files, media. `kol-icon-set-signal` is the signal-flow set:
 * waveforms, filters, logic gates, dither patterns, shapers, ramps, transport,
 * cables, color harmony — drawn for instrument surfaces (kol-mirror's rack,
 * kol-fxr's labs) rather than for chrome. Two sets rather than 101 more glyphs
 * in v1: a rack app takes both, a website takes v1 and carries none of it.
 *
 * The NAME MAP IS FLAT across both — one name, one glyph — so a set cannot
 * redraw a name another set already ships. Twelve rack drawings collided with
 * v1 (`chevron-*`, `nav-*`, `dith-flow`, `ptrn-checker`, `ptrn-dot`) and were
 * left out rather than shipped to win silently.
 *
 * The legacy stroke/solid/svg/svg-web trees were removed 0.8.0 (2026-07-28) —
 * consumers register their own SVGs via registerIcons() or promote a glyph.
 */

export { default as Icon, registerIcons } from './Icon.jsx';
import CUTS from './cuts.json';

/* kol-icon-set-interface — the curated set, grouped by folder (keys-only, no SVG
 * content): `{ group: names[] }`. KOL_ICON_SET_INTERFACE_NAMES is the flat sorted list. */
export const KOL_ICON_SET_INTERFACE = (() => {
  const idx = {}
  for (const p of Object.keys(import.meta.glob('./kol-icon-set-interface/**/*.svg'))) {
    const parts = p.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const group = parts.pop() || 'misc'
    ;(idx[group] ||= []).push(name)
  }
  for (const g of Object.values(idx)) g.sort()
  return idx
})()

export const KOL_ICON_SET_INTERFACE_NAMES = Object.values(KOL_ICON_SET_INTERFACE).flat().sort()

/* kol-icon-set-signal — same shape, same rules, its own folder. */
export const KOL_ICON_SET_SIGNAL = (() => {
  const idx = {}
  for (const p of Object.keys(import.meta.glob('./kol-icon-set-signal/**/*.svg'))) {
    const parts = p.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const group = parts.pop() || 'misc'
    ;(idx[group] ||= []).push(name)
  }
  for (const g of Object.values(idx)) g.sort()
  return idx
})()

export const KOL_ICON_SET_SIGNAL_NAMES = Object.values(KOL_ICON_SET_SIGNAL).flat().sort()

/* Per-glyph META — `{ name: { group, cut } }` (IconSetCut, kol-website 2026-08-27):
 * the set carries how each glyph is DRAWN — `cut: 'stroke' | 'solid'` — so a
 * gallery filters by type without globbing the package's SVGs. The cut is
 * derived from the markup at build (scripts/extract-icon-cuts.mjs → cuts.json,
 * a gate keeps it fresh): `fill="currentColor"` anywhere = solid, else stroke. */
const metaOf = (index, set) => Object.fromEntries(
  Object.entries(index).flatMap(([group, names]) => names.map((name) => [name, { group, set, cut: CUTS[name] ?? 'stroke' }])),
)
export const KOL_ICON_SET_INTERFACE_META = metaOf(KOL_ICON_SET_INTERFACE, 'interface')
export const KOL_ICON_SET_SIGNAL_META = metaOf(KOL_ICON_SET_SIGNAL, 'signal')
/* every glyph the package ships, either set — `{ name: { group, set, cut } }` */
export const KOL_ICON_META = { ...KOL_ICON_SET_SIGNAL_META, ...KOL_ICON_SET_INTERFACE_META }
export const getCut = (name) => KOL_ICON_META[name]?.cut ?? null
export const getSet = (name) => KOL_ICON_META[name]?.set ?? null

/* Canonical grouped registry — alias of the interface index (legacy inventories
 * ICON_ENTRIES / SOLID_ICON_ENTRIES / ICON_INDEX died with the legacy sets). */
export const ICONS = KOL_ICON_SET_INTERFACE;
// Flat array of all icon names — BOTH sets, since <Icon> resolves either.
export const ALL_ICONS = [...new Set([...KOL_ICON_SET_INTERFACE_NAMES, ...KOL_ICON_SET_SIGNAL_NAMES])].sort();

/** @deprecated 2026-09-30 → KOL_ICON_SET_INTERFACE — the set was renamed; the icon names did not change */
export const KOL_ICON_SET_V1 = KOL_ICON_SET_INTERFACE
/** @deprecated 2026-09-30 → KOL_ICON_SET_INTERFACE_NAMES */
export const KOL_ICON_SET_V1_NAMES = KOL_ICON_SET_INTERFACE_NAMES
/** @deprecated 2026-09-30 → KOL_ICON_SET_INTERFACE_META */
export const KOL_ICON_SET_V1_META = KOL_ICON_SET_INTERFACE_META

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
