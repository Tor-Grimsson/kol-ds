/**
 * iconData — the raw SVG map behind <Icon>: kol-icon-set-v1, the ONE set.
 *
 * The SVGs are eager-inlined here as raw strings, but this module is only
 * ever reached via the dynamic `import()` in Icon.jsx — so the bundler splits
 * it into its own async chunk instead of folding the SVG text into the
 * consumer's entry chunk.
 *
 * Legacy sets (stroke/solid/svg/svg-web) were removed 2026-07-28 (0.8.0) —
 * v1-only by user ruling. Consumers needing a dead name registerIcons() their
 * own SVG or promote a glyph into v1 here.
 */
const v1Modules = import.meta.glob('./kol-icon-set-v1/**/*.svg', { eager: true, query: '?raw', import: 'default' })

const byName = (mods) => {
  const c = {}
  for (const [path, svg] of Object.entries(mods)) {
    c[(path.split('/').pop() || '').replace('.svg', '')] = svg
  }
  return c
}

export const V1 = byName(v1Modules)
