#!/usr/bin/env node
/**
 * extract-figma-manifest.mjs — one list the Figma library is laid out from (pnpm figma:manifest).
 *
 * The Figma file mirrors the showcase (plan-2026-11-03-figma-mirrors-showcase W1): every row here
 * is a component the showcase lists, with the same tier, function, package, description, props,
 * used-by and nested text styles its component page shows. Nothing is authored here — it joins
 * the barrels (as validate:roster reads them), classification.js and the generated usage JSON.
 *
 * Out: showcase/src/usage/figma-manifest.json  { components: [...], modules, sets }
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'
import { TIERS, FUNCTIONS_BY_NAME, EXEMPT, DOCS_ONLY, DEPRECATED } from '../showcase/src/nav/classification.js'
import { MEMBER_OF } from '../showcase/src/lib/component-groups.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKGS = join(REPO, 'packages')
const USAGE = join(REPO, 'showcase/src/usage')
const json = (f) => JSON.parse(readFileSync(join(USAGE, f), 'utf8'))
const TIER_FOLDERS = new Set(['atoms', 'molecules', 'organisms', 'modules', 'utilities'])

const api = json('api-tables.json')
const descriptions = json('descriptions.json')
const styling = json('styling.json')
const sources = json('component-sources.json')
const compIndex = json('composition-index.json')
const composition = json('composition.json')

/* used-by: invert composition-index (file → what it nests) into name → who nests it */
const nameOfFile = Object.fromEntries(Object.entries(sources).map(([n, f]) => [f, n]))
const usedBy = {}
for (const [file, targets] of Object.entries(compIndex)) {
  const owner = nameOfFile[file]
  if (!owner) continue
  for (const { target } of targets) (usedBy[target] ||= new Set()).add(owner)
}

/* sets each component belongs to */
const setsOf = {}
for (const [key, entry] of Object.entries(composition.sets ?? {})) for (const n of entry?.kol ?? []) (setsOf[n] ||= []).push(key)

function barrels(pkgDir) {
  const src = join(PKGS, pkgDir, 'src')
  if (!existsSync(join(src, 'index.js'))) return null
  const files = {}
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory() && e.name !== 'node_modules') walk(full)
      else if (e.name === 'index.js') files[full.slice(src.length + 1)] = readFileSync(full, 'utf8')
    }
  }
  walk(src)
  return files
}

const rows = []
const seen = new Set()
for (const dir of readdirSync(PKGS).sort()) {
  const files = barrels(dir)
  if (!files) continue
  const pkg = JSON.parse(readFileSync(join(PKGS, dir, 'package.json'), 'utf8')).name
  for (const { name, src } of parseBarrelExports(files)) {
    if (!isComponentName(name) || seen.has(name)) continue
    if (EXEMPT[name] && !EXEMPT[name].startsWith('re-export')) continue
    if (EXEMPT[name]?.startsWith('re-export:') && EXEMPT[name].slice('re-export:'.length) !== pkg) continue
    if (DOCS_ONLY.includes(name) || DEPRECATED.includes(name) || MEMBER_OF[name]) continue
    const folder = folderOf(src)
    const tier = dir === 'component' ? (TIER_FOLDERS.has(folder) ? folder : null) : (TIER_FOLDERS.has(TIERS[name]) ? TIERS[name] : null)
    if (!tier) continue // hooks, graphics, loaders: not on the Components page
    seen.add(name)
    rows.push({
      name, pkg, tier,
      function: FUNCTIONS_BY_NAME[name] ?? null,
      description: descriptions[name] ?? '',
      props: api[name] ?? [],
      usedBy: [...(usedBy[name] ?? [])].sort(),
      textStyles: styling[name]?.type ?? [],
      sets: setsOf[name] ?? [],
    })
  }
}

const out = {
  generated: new Date().toISOString().slice(0, 10),
  counts: Object.fromEntries([...TIER_FOLDERS].map((t) => [t, rows.filter((r) => r.tier === t).length])),
  components: rows,
  examples: Object.keys(composition.blocks ?? {}).filter((k) => existsSync(join(REPO, 'showcase/src/blocks', `${k}.jsx`))),
  sets: Object.keys(composition.sets ?? {}),
}
writeFileSync(join(USAGE, 'figma-manifest.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`figma-manifest: ${rows.length} components`, out.counts)
