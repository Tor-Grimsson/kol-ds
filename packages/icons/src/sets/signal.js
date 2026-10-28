/* kol-icon-set-signal (2026-08-28) — the signal-flow set: waveforms, filters, logic gates, dither patterns, shapers,
 * transport, cables. Drawn for the instrument surfaces (kol-mirror's rack, kol-fxr's labs), which is why it is a SET
 * beside interface: a rack app fetches this chunk, a website never does (1.5, plan-2026-10-28-identity). */
const mods = import.meta.glob('../kol-icon-set-signal/**/*.svg', { eager: true, query: '?raw', import: 'default' })
const c = {}
for (const [path, svg] of Object.entries(mods)) c[(path.split('/').pop() || '').replace('.svg', '')] = svg
export default c
