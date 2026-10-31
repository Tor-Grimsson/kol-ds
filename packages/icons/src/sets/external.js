/* kol-icon-set-external (2026-10-31, IconSetExternal) — marks drawn by others: country flags and third-party brands
 * (browsers, OS, socials, services). COLOUR, NEVER RECOLOURED: flags and colour brand marks keep their own fills; only
 * the solid brands (apple · github · openai · windows) ink `currentColor`. Every glyph sits on the 24 keyline (round 20,
 * square 18). Groups `flags` · `brands`. Its own chunk (1.5): fetched only when an external name renders. */
const mods = import.meta.glob('../kol-icon-set-external/**/*.svg', { eager: true, query: '?raw', import: 'default' })
const c = {}
for (const [path, svg] of Object.entries(mods)) c[(path.split('/').pop() || '').replace('.svg', '')] = svg
export default c
