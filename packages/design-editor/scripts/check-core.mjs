// The seam's self-check (deconstruction T4, 2026-09-27): walk the core's static AND dynamic
// import graph and fail if it reaches a pack — loops/, kinetic/, filters/, src/packs/, the
// labs and mobile chromes, or a pack-owned inspector. `node scripts/check-core.mjs [root …]`
import { readFileSync, existsSync, statSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src')
const ARGS = process.argv.slice(2)
const ROOTS = (ARGS.length ? ARGS : ['core.jsx', 'editor/Editor.jsx']).map((f) => resolve(SRC, f)).filter(existsSync)
const PACK_OWNED = [
  /^loops\//, /^kinetic\//, /^filters\//, /^packs\//, /^editor\/labs\//,
  /^editor\/mobile\/(?!device\.js$)/,
  /^editor\/params\/TimelineDock\.jsx$/,
  /^editor\/compose\/inspectors\/(LoopFields|LoopPicker|KineticPanel|EffectsPanel|effectCategories|KeyframeEditor|CurveEditor|RulesEditor|ProfileEditor|ParatypeTools|CameraPoseSlots|SoftformsLayers)\.jsx?$/,
]
const EXT = ['', '.js', '.jsx', '/index.js', '/index.jsx']
const file = (base) => EXT.map((e) => base + e).find((p) => existsSync(p) && statSync(p).isFile())

const seen = new Map()   // file → the file that pulled it in
const bad = []
const walk = (f, from) => {
  if (seen.has(f)) return
  seen.set(f, from)
  const rel = relative(SRC, f)
  if (PACK_OWNED.some((re) => re.test(rel))) { bad.push(rel); return }
  const text = readFileSync(f, 'utf8')
  for (const [, spec] of text.matchAll(/(?:from\s+|import\s*\(\s*|^import\s+)['"](\.[^'"?]+)(?:\?[^'"]*)?['"]/gm)) {
    const next = file(resolve(dirname(f), spec))
    if (next && /\.(jsx?|mjs)$/.test(next)) walk(next, f)
  }
}
for (const r of ROOTS) walk(r, null)

const chain = (rel) => {
  const out = [rel]
  let f = seen.get(resolve(SRC, rel))
  while (f) { out.push(relative(SRC, f)); f = seen.get(f) }
  return out.reverse().join(' → ')
}
if (bad.length) {
  console.error(`core reaches ${bad.length} pack-owned file(s):`)
  for (const b of bad) console.error('  ' + chain(b))
  process.exit(1)
}
console.log(`core: ok — ${seen.size} modules from ${ROOTS.map((r) => relative(SRC, r)).join(', ')}, no pack reached`)
