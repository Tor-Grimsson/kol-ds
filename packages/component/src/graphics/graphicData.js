/**
 * graphicData — the raw SVG map behind <Graphic>.
 *
 * ~4.8 MB of illustration SVGs (some wrap embedded raster images) eager-inline
 * here, but this module is only reached via the dynamic `import()` in
 * Graphic.jsx — the bundler splits it into its own async chunk instead of
 * folding it into the consumer's entry chunk. Same pattern as kol-loader's
 * iconData.js (kol-labs-single 2026-06-19 entry-chunk fix).
 */
const svgModules = import.meta.glob('./svg/**/*.svg', { eager: true, query: '?raw', import: 'default' })

// category → name → raw SVG string.
export const GRAPHIC_RAW = Object.entries(svgModules).reduce((acc, [path, svg]) => {
  const [category, file] = path.replace('./svg/', '').split('/')
  const name = file.replace('.svg', '')
  if (!acc[category]) acc[category] = {}
  acc[category][name] = svg
  return acc
}, {})
