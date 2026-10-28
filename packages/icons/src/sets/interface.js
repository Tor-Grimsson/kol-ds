/* kol-icon-set-interface — the general set: app chrome, navigation, files, media. Eager-inlined raw SVG, but this
 * module is only reached through the dynamic `import()` in Icon.jsx, so it is its own async chunk (1.5,
 * plan-2026-10-28-identity — user: "I cant believe you have to take every icon we ship if you only need one").
 * A page that renders only interface names fetches this chunk and neither of the other two. */
const mods = import.meta.glob('../kol-icon-set-interface/**/*.svg', { eager: true, query: '?raw', import: 'default' })
const c = {}
for (const [path, svg] of Object.entries(mods)) c[(path.split('/').pop() || '').replace('.svg', '')] = svg
export default c
