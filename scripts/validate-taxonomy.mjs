#!/usr/bin/env node
/**
 * validate-taxonomy — enforces docs/taxonomy/01-component-placement.md.
 *
 *   1. Closed folder set: every component source folder is one of
 *      atoms / molecules / organisms / graphics / hooks.
 *   2. Downward-only imports: atoms never import molecules/ or organisms/.
 *   3. Molecule test: every molecules/*.jsx nests at least one KOL component
 *      (a relative import of another component file), or carries a
 *      `taxonomy-ok:` comment naming why (e.g. same-file nesting).
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

// 2 — atoms import downward only
for (const f of files('atoms')) {
  const txt = readFileSync(join(SRC, 'atoms', f), 'utf8')
  for (const imp of relImports(txt)) {
    if (imp.includes('molecules/') || imp.includes('organisms/')) {
      violations.push(`hierarchy: atoms/${f} imports ${imp} — atoms never import upward`)
    }
  }
}

// 3 — molecules must nest a KOL component (or carry taxonomy-ok:)
for (const f of files('molecules')) {
  const txt = readFileSync(join(SRC, 'molecules', f), 'utf8')
  const nests = relImports(txt).some((p) => /(^\.\.\/(atoms|molecules)\/)|(^\.\/)/.test(p))
  if (!nests && !txt.includes('taxonomy-ok:')) {
    violations.push(`molecule-test: molecules/${f} nests no KOL component and has no taxonomy-ok: exemption — likely an atom`)
  }
}

if (violations.length) {
  console.error(`taxonomy: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error('  ✗ ' + v)
  process.exit(1)
}
console.log('taxonomy: clean')
