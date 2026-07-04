#!/usr/bin/env node
/**
 * validate-groups — keeps the showcase sub-part overlay honest.
 *
 * The overlay (showcase/src/lib/component-groups.js) collapses a component's
 * compositional members into one roster row (docs → 00-taxonomy). This checks
 * the overlay doesn't rot: every parent AND every member it names must be a
 * real export of @kolkrabbi/kol-component.
 *
 * ponytail: integrity check only. Deciding *whether* a new export SHOULD be a
 * member is a judgment call (taxonomy "one page per component") left to review
 * — a lint can't read intent. This just catches a renamed/removed export the
 * overlay still points at.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPONENT_GROUPS } from '../showcase/src/lib/component-groups.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const barrel = readFileSync(join(ROOT, 'packages/component/src/index.js'), 'utf8')

/* Collect exported identifiers from `export { … } from …` blocks:
 * `default as Foo` / `Bar as Baz` resolve to the exported name (Foo / Baz). */
const exported = new Set()
for (const block of barrel.matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const spec of block[1].split(',')) {
    const name = spec.trim().split(/\s+as\s+/).pop().trim()
    if (name) exported.add(name)
  }
}

const violations = []
for (const [parent, members] of Object.entries(COMPONENT_GROUPS)) {
  if (!exported.has(parent)) violations.push(`parent "${parent}" is not exported from kol-component`)
  for (const m of members) {
    if (!exported.has(m)) violations.push(`member "${m}" (of ${parent}) is not exported from kol-component`)
  }
}

if (violations.length) {
  console.error(`groups: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error('  ✗ ' + v)
  process.exit(1)
}
console.log('groups: clean')
