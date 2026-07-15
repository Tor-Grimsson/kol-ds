#!/usr/bin/env node
/**
 * validate-roster.mjs — the roster completeness gate (pnpm validate:roster).
 *
 * THE invariant (showcase deep audit 2026-07-15, .kol/llm-context/backlog/):
 * every component exported from any packages/*\/src/index.js barrel must
 *   (a) resolve a Tier — component-package folder, framework, or an explicit
 *       classification.js TIERS entry — AND have a FUNCTIONS_BY_NAME entry, or
 *   (b) appear on a written exemption: EXEMPT / DOCS_ONLY / DEPRECATED /
 *       MEMBER_OF (component-groups overlay).
 * Anything else fails the build. Classification keys that match no live
 * export fail too — rot is caught in both directions.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'
import { TIERS, FUNCTIONS_BY_NAME, EXEMPT, DOCS_ONLY, DEPRECATED } from '../showcase/src/lib/classification.js'
import { MEMBER_OF } from '../showcase/src/lib/component-groups.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKGS = join(REPO, 'packages')
const TIER_FOLDERS = new Set(['atoms', 'molecules', 'organisms', 'hooks'])
const VALID_TIERS = new Set(['atom', 'molecule', 'organism', 'hook', ...TIER_FOLDERS])
const VALID_FUNCTIONS = new Set(['action', 'input', 'display', 'feedback', 'navigation', 'wayfinding', 'overlay', 'media', 'structure', 'utility'])

/* collect every index.js under a package's src tree, keyed relative to src/ */
function collectBarrels(pkgDir) {
  const src = join(PKGS, pkgDir, 'src')
  if (!existsSync(join(src, 'index.js'))) return null
  const files = {}
  const walk = (dir) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, name.name)
      if (name.isDirectory() && name.name !== 'node_modules') walk(full)
      else if (name.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
    }
  }
  walk(src)
  return files
}

const errors = []
const liveNames = new Set()
const owners = {} // name → [pkgDir, ...] for collision detection

for (const dir of readdirSync(PKGS)) {
  const files = collectBarrels(dir)
  if (!files) continue
  for (const { name, src } of parseBarrelExports(files)) {
    if (!isComponentName(name) && !/^use[A-Z]/.test(name)) continue
    liveNames.add(name)
    ;(owners[name] ||= []).push(dir)
    if (EXEMPT[name] || DOCS_ONLY.includes(name) || DEPRECATED.includes(name) || MEMBER_OF[name]) continue

    const folder = folderOf(src)
    const tierOk =
      dir === 'component' ? TIER_FOLDERS.has(folder) || folder === 'graphics'
      : dir === 'framework' ? true
      : /^use[A-Z]/.test(name) ? true
      : VALID_TIERS.has(TIERS[name])
    if (!tierOk) errors.push(`NO TIER      ${dir.padEnd(14)} ${name}  (add to classification.js TIERS or EXEMPT)`)

    if (!VALID_FUNCTIONS.has(FUNCTIONS_BY_NAME[name]))
      errors.push(`NO FUNCTION  ${dir.padEnd(14)} ${name}  (add to classification.js FUNCTIONS_BY_NAME)`)
  }
}

/* collisions: same name exported by >1 package with no EXEMPT ruling */
for (const [name, dirs] of Object.entries(owners)) {
  if (dirs.length > 1 && !EXEMPT[name])
    errors.push(`COLLISION    ${dirs.join('+').padEnd(14)} ${name}  (mark the re-export in EXEMPT)`)
}

/* reverse rot: classification keys that match no live export.
 * Only component/hook-shaped names — lowercase util keys never enter liveNames. */
const shaped = (n) => isComponentName(n) || /^use[A-Z]/.test(n)
for (const name of [...Object.keys(TIERS), ...Object.keys(EXEMPT)]) {
  if (shaped(name) && !liveNames.has(name))
    errors.push(`DEAD KEY     ${'classification'.padEnd(14)} ${name}  (no barrel exports it)`)
}
for (const name of Object.keys(FUNCTIONS_BY_NAME)) {
  if (shaped(name) && !liveNames.has(name))
    errors.push(`DEAD KEY     ${'functions'.padEnd(14)} ${name}  (no barrel exports it)`)
}

if (errors.length) {
  console.error(`roster: ${errors.length} violation(s)\n`)
  for (const e of errors.sort()) console.error('  ' + e)
  process.exit(1)
}
console.log(`roster: clean (${liveNames.size} exports gated)`)
