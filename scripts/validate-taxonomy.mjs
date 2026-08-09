#!/usr/bin/env node
/**
 * validate-taxonomy — enforces docs/documentation/03-components/02-placement.md.
 *
 * Tier is AUTHORED (real atomic design — judged by what a component is, not
 * what it imports; 2026-08-09 user ruling). The validator no longer derives
 * or second-guesses tiers; it enforces the two things that stay mechanical:
 *
 *   1. Closed folder set: every component source folder is one of
 *      atoms / molecules / organisms / utilities / graphics / hooks.
 *   2. Downward-only imports: atoms never import molecules/ or organisms/;
 *      molecules never import organisms/. Sideways (same-tier) imports are
 *      legal at every rung.
 *   3. Utilities sit OUTSIDE the ladder (2026-08-09 "atoms paint" ruling):
 *      purpose-without-a-face files — layout wrappers, mechanisms worn by
 *      other components, guards, fallback states. Any tier may import
 *      utilities/; utilities/ may import atoms/hooks/graphics but never
 *      molecules/ or organisms/ — a mechanism stays primitive.
 *   4. An atom PAINTS: every atoms/ file must render at least one visible
 *      mark of its own (an element with a border/background/text class, an
 *      svg shape, an img/video, or a text node) — not only {children} in a
 *      bare layout div. Heuristic on the source text; a file that fails it
 *      belongs in utilities/ (or higher).
 *
 * Exit 1 with a list of violations; silent-ish green otherwise.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '../packages/component/src')
const CLOSED_SET = new Set(['atoms', 'molecules', 'organisms', 'utilities', 'graphics', 'hooks'])

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

// 2 — downward-only imports (utilities outside the ladder: importable by all,
//     may reach atoms/hooks/graphics, never molecules/organisms)
const UPWARD = {
  atoms: ['molecules/', 'organisms/'],
  molecules: ['organisms/'],
  utilities: ['molecules/', 'organisms/'],
}
for (const [tier, banned] of Object.entries(UPWARD)) {
  for (const f of files(tier)) {
    const txt = readFileSync(join(SRC, tier, f), 'utf8')
    for (const imp of relImports(txt)) {
      const hit = banned.find((b) => imp.includes(b))
      if (hit) violations.push(`hierarchy: ${tier}/${f} imports ${imp} — ${tier} never import upward`)
    }
  }
}

// 4 — an atom PAINTS (the 2026-08-09 law). Source-text heuristic: at least one
//     own visible mark — svg shape, media element, a text node in JSX, or a
//     paint-bearing class (border/bg/text/kol-*). Layout-only utilities like
//     `flex`/`grid` don't count as paint.
const PAINT = /<(svg|path|line|circle|rect|img|video|canvas|figcaption)\b|border|bg-|background|<Icon\b|kol-(mono|helper|sans|doc|asset|image|exit|embla|btn|tag|badge)|>[A-Za-z0-9]|dangerouslySetInnerHTML/
for (const f of files('atoms')) {
  const txt = readFileSync(join(SRC, 'atoms', f), 'utf8')
  if (!PAINT.test(txt)) {
    violations.push(`paints: atoms/${f} renders no visible mark of its own — an atom paints; move it to utilities/ (or up)`)
  }
}

if (violations.length) {
  console.error(`taxonomy: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error('  ✗ ' + v)
  process.exit(1)
}
console.log('taxonomy: clean')
