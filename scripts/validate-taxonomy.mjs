#!/usr/bin/env node
/**
 * validate-taxonomy — enforces docs/documentation/03-components/02-placement.md.
 *
 * Tier is AUTHORED (real atomic design — judged by what a component is, not
 * what it imports; 2026-08-09 user ruling). The validator no longer derives
 * or second-guesses tiers; it enforces the two things that stay mechanical:
 *
 *   1. Closed folder set: every component source folder is one of
 *      atoms / molecules / organisms / graphics / hooks.
 *   2. Downward-only imports: atoms never import molecules/ or organisms/;
 *      molecules never import organisms/. Sideways (same-tier) imports are
 *      legal at every rung.
 *
 * Exit 1 with a list of violations; silent-ish green otherwise.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '../packages/component/src')
const CLOSED_SET = new Set(['atoms', 'molecules', 'organisms', 'graphics', 'hooks'])

const violations = []

// 1 — closed folder set (folders only; index.js is the lone root file)
for (const entry of readdirSync(SRC, { withFileTypes: true })) {
  if (entry.isDirectory() && !CLOSED_SET.has(entry.name)) {
    violations.push(`closed-set: src/${entry.name}/ is not a taxonomy folder (${[...CLOSED_SET].join('/')})`)
  }
}

const relImports = (txt) =>
  [...txt.matchAll(/import[^'"]+from\s+['"](\.[^'"]+)['"]/g)]
    .map((m) => m[1])
    .filter((p) => !p.endsWith('.css'))

const files = (dir) => {
  try { return readdirSync(join(SRC, dir)).filter((f) => f.endsWith('.jsx')) } catch { return [] }
}

// 2 — downward-only imports
const UPWARD = { atoms: ['molecules/', 'organisms/'], molecules: ['organisms/'] }
for (const [tier, banned] of Object.entries(UPWARD)) {
  for (const f of files(tier)) {
    const txt = readFileSync(join(SRC, tier, f), 'utf8')
    for (const imp of relImports(txt)) {
      const hit = banned.find((b) => imp.includes(b))
      if (hit) violations.push(`hierarchy: ${tier}/${f} imports ${imp} — ${tier} never import upward`)
    }
  }
}

if (violations.length) {
  console.error(`taxonomy: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error('  ✗ ' + v)
  process.exit(1)
}
console.log('taxonomy: clean')
