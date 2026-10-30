/* THE KOLKRABBI REVAMP — the lab's first draft (2026-10-20).
 *
 * A draft, not the brand: `@kolkrabbi/kol-brand` stays the live Kolkrabbi brand and nothing here
 * reaches it. The draft starts from the labs' own defaults, not from the old brand or KOL's palette,
 * so the revamp is decided in the lab. Export (in the app) prints the current values — paste them
 * back here to keep them.
 *
 *   color   ColorLab's value (base, relation, count, seed, the colours once edited, the locked ones)
 *   type    TypeLab's value (base size, ratio id, line-height factors, role overrides)
 *   combo   ComboLab's value (layout, mark slot, any part reassigned) — it combines the colour above
 *   faces   the faces the type is set in — literal families, so the guide can wear them
 *   lockup  LockupLab's value (type, shape, the parts' text and ratios), the mark (raw SVG; none yet → a shape) and the naming levels
 *   book    the brand book's copy, by section key (kol-styleguide BOOK_SECTIONS / ASSET_SECTIONS) */
export default {
  name: 'Kolkrabbi',
  color: { base: '#3D7FF0', relation: 'analogous', count: 5, seed: 1, colors: null, locked: [] },
  type: { base: 16, ratio: 'P4', leading: {}, roles: {} },
  combo: { layout: 'applied-card', logo: false, assign: {} },
  faces: {
    display: { family: "'Right Grotesk Narrow', 'Right Grotesk', sans-serif", label: 'Right Grotesk Narrow', weight: 500 },
    heading: { family: "'Right Grotesk Compact', 'Right Grotesk', sans-serif", label: 'Right Grotesk Compact', weight: 500 },
    text: { family: "'Right Grotesk', sans-serif", label: 'Right Grotesk', weight: 400 },
    mono: { family: "'JetBrains Mono', monospace", label: 'JetBrains Mono', weight: 400 },
  },
  lockup: {
    value: { parent: 'Kolkrabbi', product: 'Labs', sub: 'Studio' },
    mark: null,
    presets: {
      Products: ['Labs', 'Foundry', 'Atlas'],
      Tools: ['Monitor', 'Mirror', 'Media'],
    },
  },
  book: {},
}
