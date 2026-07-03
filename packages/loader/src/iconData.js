/**
 * iconData — the raw SVG maps behind <Icon>.
 *
 * ~2,000+ SVGs are eager-inlined here as raw strings, but this module is only
 * ever reached via the dynamic `import()` in Icon.jsx — so the bundler splits
 * all of it into its own async chunk instead of folding ~1.2 MB of SVG text
 * into the consumer's entry chunk. (Ported from kol-labs-single's 2026-06-19
 * entry-chunk fix: entry 509 kB → 204 kB gzip.)
 */
const strokeModules = import.meta.glob('./stroke/**/*.svg',  { eager: true, query: '?raw', import: 'default' })
const solidModules  = import.meta.glob('./solid/**/*.svg',   { eager: true, query: '?raw', import: 'default' })
const legacyModules = import.meta.glob('./svg/**/*.svg',     { eager: true, query: '?raw', import: 'default' })
const kolLegacy     = import.meta.glob('./svg/00-kol/*.svg', { eager: true, query: '?raw', import: 'default' })
const webModules    = import.meta.glob('./svg-web/**/*.svg', { eager: true, query: '?raw', import: 'default' })

const byName = (mods) => {
  const c = {}
  for (const [path, svg] of Object.entries(mods)) {
    c[(path.split('/').pop() || '').replace('.svg', '')] = svg
  }
  return c
}

export const STROKE = byName(strokeModules)
export const SOLID  = byName(solidModules)
export const WEB    = byName(webModules)
export const LEGACY = (() => { const c = byName(legacyModules); Object.assign(c, byName(kolLegacy)); return c })()
