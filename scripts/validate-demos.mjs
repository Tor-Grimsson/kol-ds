#!/usr/bin/env node
/**
 * validate-demos.mjs — the demo coverage gate (pnpm validate:demos).
 *
 * Sibling of validate-roster.mjs. Roster proves a component is REGISTERED;
 * this proves it is RENDERED. Registration without a demo is how the showcase
 * drifted: 26 classified components had no page anyone could look at, all of
 * kol-shell and the exhibit system among them (2026-08-15).
 *
 * THE invariant: every barrel export that the roster gate holds to a tier +
 * function must also have showcase/src/demos/<Name>.jsx — demos-registry.js
 * globs that folder, so the filename IS the registration — or appear on the
 * written NO_DEMO exemption with a reason. Demo files matching no live export
 * fail too: rot is caught in both directions, as in roster.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'
import { EXEMPT, DOCS_ONLY, DEPRECATED, NO_DEMO } from '../showcase/src/nav/classification.js'
import { MEMBER_OF } from '../showcase/src/lib/component-groups.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKGS = join(REPO, 'packages')
const DEMOS = join(REPO, 'showcase/src/demos')

/* same barrel walk as validate-roster.mjs */
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

const demoFiles = new Set(
  readdirSync(DEMOS).filter((f) => f.endsWith('.jsx')).map((f) => f.replace('.jsx', ''))
)

const errors = []
const liveNames = new Set()
let gated = 0

for (const dir of readdirSync(PKGS)) {
  const files = collectBarrels(dir)
  if (!files) continue
  for (const { name, src } of parseBarrelExports(files)) {
    if (!isComponentName(name) && !/^use[A-Z]/.test(name)) continue
    liveNames.add(name)
    if (EXEMPT[name] || DOCS_ONLY.includes(name) || DEPRECATED.includes(name) || MEMBER_OF[name]) continue
    /* graphics are drawings, not components — roster tiers them, but a demo
     * page for one glyph is noise; the icon galleries render the whole set. */
    if (dir === 'component' && folderOf(src) === 'graphics') continue
    /* Hooks render nothing — a demo is welcome (useModal has one) but can't be
     * required, so they are exempt by shape rather than by 18 listed names. */
    if (/^use[A-Z]/.test(name)) continue
    if (NO_DEMO[name]) continue

    gated++
    if (!demoFiles.has(name))
      errors.push(`NO DEMO      ${dir.padEnd(14)} ${name}  (add showcase/src/demos/${name}.jsx, or a NO_DEMO reason)`)
  }
}

/* No dead-demo check: the folder legitimately holds EXTRA demos per component
 * (BadgeSizes, BadgeWithIcon, ButtonPressed), so "filename isn't an export" is
 * not evidence of rot. A genuinely deleted component fails roster's DEAD KEY
 * check anyway, and its leftover demo file renders on no page. */

/* reverse rot: a NO_DEMO reason for a component that now HAS a demo, or is gone */
for (const name of Object.keys(NO_DEMO)) {
  if (!liveNames.has(name)) errors.push(`DEAD KEY     ${'NO_DEMO'.padEnd(14)} ${name}  (no barrel exports it)`)
  else if (demoFiles.has(name)) errors.push(`STALE EXEMPT ${'NO_DEMO'.padEnd(14)} ${name}  (it has a demo now — drop the exemption)`)
}

if (errors.length) {
  console.error(`demos: ${errors.length} violation(s)\n`)
  for (const e of errors.sort()) console.error('  ' + e)
  process.exit(1)
}
console.log(`demos: clean (${gated} components rendered, ${Object.keys(NO_DEMO).length} exempt)`)
