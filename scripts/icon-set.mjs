/**
 * icon-set.mjs — the icon set as the loader sees it, for the scripts (W19, 2026-11-20).
 *
 * `drawings()` → Map name → { name, set, group, path, svg }: every SVG file in the four sets (identity: the file named
 * like its folder). One flat drawing file per icon (W21.1, 2026-11-21: bases live in the Figma workshop, never in code).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ICONS_SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'icons', 'src')
const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e)
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.svg') ? [p] : []
})
export function drawings(src = ICONS_SRC) {
  const out = new Map()
  for (const set of ['interface', 'editor', 'signal', 'identity', 'external']) {
    for (const path of walk(join(src, `kol-icon-set-${set}`))) {
      const parts = relative(join(src, `kol-icon-set-${set}`), path).split('/')
      const name = parts.at(-1).slice(0, -4)
      if (set === 'identity' && name !== parts.at(-2)) continue
      if (!out.has(name)) out.set(name, { name, set, group: parts.length > 1 ? parts.at(-2) : 'misc', path, svg: readFileSync(path, 'utf8') })
    }
  }
  return out
}

const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline'])
const SKIP = new Set(['defs', 'clipPath', 'mask', 'symbol', 'pattern', 'linearGradient', 'radialGradient'])

/* the filled shapes of one svg (validate-icon-fills, validate-icon-duplicates): a tag walk with the inherited fill on a
 * stack; SVG's default fill is black, so a shape with no fill anywhere above it counts. Masks, clip paths, defs skipped. */
export function filledShapes(svg) {
  const stack = [{ fill: 'black', skip: false }]
  const hits = []
  for (const m of svg.matchAll(/<(\/?)([A-Za-z][\w:-]*)\b([^>]*?)(\/?)>/g)) {
    const [, close, tag, attrs, selfClose] = m
    if (close) { if (stack.length > 1) stack.pop(); continue }
    const top = stack.at(-1)
    const own = attrs.match(/(?:^|\s)fill="([^"]*)"/)?.[1] ?? attrs.match(/style="[^"]*fill:\s*([^;"]+)/)?.[1]?.trim()
    const node = { fill: own ?? top.fill, skip: top.skip || SKIP.has(tag) }
    if (SHAPES.has(tag) && !node.skip && !/^(none|transparent)$/i.test(node.fill)) hits.push(tag)
    if (!selfClose) stack.push(node)
  }
  return hits
}
