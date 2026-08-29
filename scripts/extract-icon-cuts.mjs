#!/usr/bin/env node
/**
 * extract-icon-cuts.mjs — every glyph's CUT (stroke | solid), derived from the
 * SVGs (pnpm extract:icons · gate `icon-cuts` in --check mode).
 *
 * IconSetCut (kol-website 2026-08-27): brand's /icons gallery filters the set by
 * TYPE — Stroke | Solid — and had to glob the package's SVG folder to learn a
 * fact the package already knows. The rule is brand's, verbatim: a glyph whose
 * markup carries `fill="currentColor"` is SOLID, every other one is STROKE.
 * Measured on the shipped set: `chevron-down` → stroke; `caret-down`,
 * `star-solid`, `pause` → solid.
 *
 * Writes packages/icons/src/cuts.json — `{ name: 'stroke' | 'solid' }`, sorted
 * — which index.js folds into KOL_ICON_SET_V1_META next to the folder group. A
 * new SVG classifies itself on the next run; `--check` fails when the JSON is
 * stale, so it can never drift from the drawings.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ICONS_SRC = join(HERE, '..', 'packages', 'icons', 'src')
/* both sets — a glyph classifies itself wherever it lives (2026-08-28) */
const SETS = ['kol-icon-set-v1', 'kol-icon-set-signal'].map((s) => join(ICONS_SRC, s))
const OUT = join(HERE, '..', 'packages', 'icons', 'src', 'cuts.json')
const CHECK = process.argv.includes('--check')

const walk = (dir) => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e)
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.svg') ? [p] : []
})
const cut = (svg) => (/fill="currentColor"/.test(svg) ? 'solid' : 'stroke')

const next = {}
for (const set of SETS) for (const p of walk(set)) next[p.split('/').pop().replace('.svg', '')] = cut(readFileSync(p, 'utf8'))
const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]))
const json = JSON.stringify(sorted, null, 2) + '\n'

if (CHECK) {
  let current = ''
  try { current = readFileSync(OUT, 'utf8') } catch { /* missing = stale */ }
  if (current === json) { console.log(`icon-cuts: clean (${Object.keys(sorted).length} glyphs)`); process.exit(0) }
  const cur = current ? JSON.parse(current) : {}
  const diff = Object.keys({ ...cur, ...sorted }).filter((k) => cur[k] !== sorted[k])
  console.error(`icon-cuts: ${diff.length || 1} violation(s) — packages/icons/src/cuts.json is stale; run pnpm extract:icons`)
  for (const k of diff) console.error(`  ${k}: ${cur[k] ?? '—'} → ${sorted[k] ?? '—'}`)
  process.exit(1)
}
writeFileSync(OUT, json)
const solid = Object.values(sorted).filter((c) => c === 'solid').length
console.log(`icon-cuts: ${Object.keys(sorted).length} glyphs — ${solid} solid · ${Object.keys(sorted).length - solid} stroke → packages/icons/src/cuts.json`)
