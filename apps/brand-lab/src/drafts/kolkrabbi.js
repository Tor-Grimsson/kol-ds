/* THE KOLKRABBI REVAMP — the lab's first draft (2026-10-20).
 *
 * A draft, not the brand: `@kolkrabbi/kol-brand` stays the live Kolkrabbi brand and nothing here
 * reaches it. The draft starts from the labs' own defaults, not from the old brand or KOL's palette,
 * so the revamp is decided in the lab. Export (in the app) prints the current values — paste them
 * back here to keep them.
 *
 *   color   ColorLab's value (base, harmony, the neutral bases, slot and composition picks)
 *   type    TypeScaleLab's value (base size, ratio id)
 *   faces   the faces the type is set in — literal families, so the guide can wear them
 *   lockup  the parent name, the mark (raw SVG; none yet → the placeholder) and the naming levels
 *   book    the brand book's copy, by section key (kol-styleguide BOOK_SECTIONS / ASSET_SECTIONS) */
export default {
  name: 'Kolkrabbi',
  color: {},
  type: { base: 16, ratio: 'P4' },
  faces: {
    display: { family: "'Right Grotesk Narrow', 'Right Grotesk', sans-serif", label: 'Right Grotesk Narrow', weight: 500 },
    heading: { family: "'Right Grotesk Compact', 'Right Grotesk', sans-serif", label: 'Right Grotesk Compact', weight: 500 },
    text: { family: "'Right Grotesk', sans-serif", label: 'Right Grotesk', weight: 400 },
  },
  lockup: {
    parent: 'Kolkrabbi',
    mark: null,
    presets: {
      Products: ['Labs', 'Foundry', 'Atlas'],
      Tools: ['Monitor', 'Mirror', 'Media'],
    },
  },
  book: {},
}
