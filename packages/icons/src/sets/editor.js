/* kol-icon-set-editor (2026-11-22) — the design-tool set: pen and bezier tools, corners, align, transforms, color modes
 * and type: the editor and folio surfaces, split out of interface so a website never fetches them. Like signal it is a SET
 * beside interface, its own chunk. */
const mods = import.meta.glob('../kol-icon-set-editor/**/*.svg', { eager: true, query: '?raw', import: 'default' })
const c = {}
for (const [path, svg] of Object.entries(mods)) c[(path.split('/').pop() || '').replace('.svg', '')] = svg
export default c
